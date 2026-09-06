package com.aiderlog.v22app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import java.lang.reflect.Method;
import java.util.ArrayList;

/** Optional first-run setup plus contextual WebView media permission handling. */
public final class PermissionFlow {
    public static final int REQUEST = 902;
    private static final String CAMERA = "android.permission.CAMERA";
    private static final String AUDIO = "android.permission.RECORD_AUDIO";
    private static final String WEB_CAMERA = "android.webkit.resource.VIDEO_CAPTURE";
    private static final String WEB_AUDIO = "android.webkit.resource.AUDIO_CAPTURE";
    private final Activity activity;
    private final SharedPreferences preferences;
    private boolean explaining;
    private boolean requesting;
    private Object pendingMedia;

    public PermissionFlow(Activity activity) {
        this.activity = activity;
        preferences = activity.getSharedPreferences("aiderlog.permissions.v164", 0);
    }

    @JavascriptInterface public void showFirstRun() {
        activity.runOnUiThread(new Runnable() { public void run() {
            if (activity.isFinishing() || explaining || requesting || preferences.getBoolean("explained", false)) return;
            explaining = true;
            new AlertDialog.Builder(activity)
                .setTitle("필요한 권한, 한 번에 준비하기")
                .setMessage("마이크 · 음성 메모와 스피치 녹음\n카메라 · 앱 안에서 사진 촬영\n\n사진·동영상·문서는 첨부할 때 직접 선택한 파일만 사용하며, 전체 보관함 접근 권한은 요청하지 않습니다.\n\n아래 버튼 한 번으로 마이크와 카메라의 권한 요청을 함께 시작합니다. Android의 권한별 확인창에서는 직접 허용해야 합니다. 동의하지 않아도 기록과 파일 첨부를 사용할 수 있습니다.")
                .setPositiveButton("필요 권한 함께 설정", new DialogInterface.OnClickListener() { public void onClick(DialogInterface dialog, int which) {
                    rememberChoice();
                    ArrayList<String> missing = new ArrayList<String>();
                    if (!granted(AUDIO)) missing.add(AUDIO);
                    if (!granted(CAMERA)) missing.add(CAMERA);
                    request(missing);
                }})
                .setNegativeButton("나중에", new DialogInterface.OnClickListener() { public void onClick(DialogInterface dialog, int which) { rememberChoice(); }})
                .setOnCancelListener(new DialogInterface.OnCancelListener() { public void onCancel(DialogInterface dialog) { rememberChoice(); }})
                .show();
        }});
    }

    private void rememberChoice() {
        explaining = false;
        preferences.edit().putBoolean("explained", true).apply();
    }

    private boolean granted(String permission) {
        try {
            Method check = Activity.class.getMethod("checkSelfPermission", String.class);
            return ((Integer) check.invoke(activity, permission)).intValue() == 0;
        } catch (Exception error) { return false; }
    }

    private void request(ArrayList<String> missing) {
        if (missing.isEmpty()) { finishMedia(); return; }
        if (requesting) return;
        requesting = true;
        try {
            Activity.class.getMethod("requestPermissions", String[].class, Integer.TYPE)
                .invoke(activity, missing.toArray(new String[missing.size()]), Integer.valueOf(REQUEST));
        } catch (Exception error) {
            requesting = false;
            finishMedia();
            Toast.makeText(activity, "권한 설정을 열지 못했습니다. 텍스트 입력이나 파일 첨부로 계속할 수 있습니다.", Toast.LENGTH_LONG).show();
        }
    }

    // PermissionRequest is reflected to keep this small helper buildable against
    // the retained base SDK jar; calls execute on API 26+ (the app's minimum).
    private Object webCall(Object request, String method) throws Exception {
        return Class.forName("android.webkit.PermissionRequest").getMethod(method).invoke(request);
    }

    private boolean trusted(Object request) {
        try {
            Uri origin = (Uri) webCall(request, "getOrigin");
            return "https".equals(origin.getScheme()) && "aiderdear1.vercel.app".equalsIgnoreCase(origin.getHost())
                && (origin.getPort() == -1 || origin.getPort() == 443);
        } catch (Exception error) { return false; }
    }

    public void requestMedia(final Object media) {
        activity.runOnUiThread(new Runnable() { public void run() {
            if (!trusted(media) || activity.isFinishing()) { deny(media); return; }
            if (pendingMedia != null && pendingMedia != media) { deny(media); return; }
            pendingMedia = media;
            ArrayList<String> missing = new ArrayList<String>();
            try {
                for (String resource : (String[]) webCall(media, "getResources")) {
                    String permission = WEB_AUDIO.equals(resource) ? AUDIO : WEB_CAMERA.equals(resource) ? CAMERA : null;
                    if (permission != null && !granted(permission) && !missing.contains(permission)) missing.add(permission);
                }
            } catch (Exception error) { cancelMedia(media); return; }
            // A first-run request already in progress will complete this request
            // from onResult. Never show overlapping permission dialogs.
            if (!requesting) request(missing);
        }});
    }

    public void onResult() {
        requesting = false;
        finishMedia();
    }

    private void finishMedia() {
        Object media = pendingMedia;
        pendingMedia = null;
        if (media == null) return;
        ArrayList<String> allowed = new ArrayList<String>();
        try {
            if (!trusted(media)) { deny(media); return; }
            for (String resource : (String[]) webCall(media, "getResources")) {
                if ((WEB_AUDIO.equals(resource) && granted(AUDIO)) || (WEB_CAMERA.equals(resource) && granted(CAMERA))) allowed.add(resource);
            }
            if (allowed.isEmpty()) { deny(media); return; }
            Class.forName("android.webkit.PermissionRequest").getMethod("grant", String[].class)
                .invoke(media, (Object) allowed.toArray(new String[allowed.size()]));
        } catch (Exception error) { deny(media); }
    }

    private void deny(Object media) {
        if (media == null) return;
        try { webCall(media, "deny"); } catch (Exception ignored) { }
    }

    public void cancelMedia(Object media) {
        if (pendingMedia == media) pendingMedia = null;
        deny(media);
    }
}
