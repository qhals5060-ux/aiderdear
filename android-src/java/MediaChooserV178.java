package com.aiderlog.v22app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.MimeTypeMap;
import android.widget.Toast;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.WeakHashMap;

/** Scoped user-selected URIs only. No media-library permission or filesystem path access. */
public final class MediaChooserV178 {
    private static final WeakHashMap<Activity, Pending> pending = new WeakHashMap<>();
    private static int nextRequest = 12000;
    private static final class Pending {
        final ValueCallback<Uri[]> callback;
        final String[] types;
        final boolean multiple;
        final int request;
        AlertDialog dialog;
        Pending(ValueCallback<Uri[]> callback, WebChromeClient.FileChooserParams params) {
            this.callback = callback;
            this.multiple = params.getMode() == WebChromeClient.FileChooserParams.MODE_OPEN_MULTIPLE;
            LinkedHashSet<String> accepted = new LinkedHashSet<>();
            for (String group : params.getAcceptTypes()) {
                if (group == null) continue;
                for (String raw : group.split(",")) {
                    String type = raw.trim().toLowerCase(Locale.ROOT);
                    if (type.startsWith(".")) type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(type.substring(1));
                    if (type != null && type.contains("/")) accepted.add(type);
                }
            }
            if (accepted.isEmpty()) accepted.add("*/*");
            this.types = accepted.toArray(new String[0]);
            this.request = nextRequest++;
            if (nextRequest > 60000) nextRequest = 12000;
        }
        boolean mediaOnly() {
            for (String type : types) if (!type.startsWith("image/") && !type.startsWith("video/")) return false;
            return true;
        }
    }
    public static boolean show(Activity activity, ValueCallback<Uri[]> callback, WebChromeClient.FileChooserParams params) {
        cancel(activity);
        if (activity.isFinishing() || activity.isDestroyed()) { callback.onReceiveValue(null); return true; }
        final Pending selection = new Pending(callback, params);
        pending.put(activity, selection);
        if (selection.mediaOnly()) {
            selection.dialog = new AlertDialog.Builder(activity).setTitle("첨부할 곳 선택")
                .setItems(new String[]{"앨범", "내 파일"}, (dialog, which) -> launch(activity, selection, which == 0))
                .setNegativeButton("취소", (dialog, which) -> finish(activity, selection, null))
                .setOnCancelListener(dialog -> finish(activity, selection, null)).create();
            selection.dialog.show();
        } else launch(activity, selection, false);
        return true;
    }
    private static Intent files(Pending selection, boolean gallery) {
        Intent intent = new Intent(gallery ? Intent.ACTION_GET_CONTENT : Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setType(selection.types.length == 1 ? selection.types[0] : "*/*");
        if (selection.types.length > 1) intent.putExtra(Intent.EXTRA_MIME_TYPES, selection.types);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, selection.multiple);
        return intent;
    }
    private static void launch(Activity activity, Pending selection, boolean gallery) {
        if (pending.get(activity) != selection) return;
        try {
            if (gallery && Build.VERSION.SDK_INT >= 33) {
                Intent intent = new Intent(MediaStore.ACTION_PICK_IMAGES);
                if (selection.types.length == 1) intent.setType(selection.types[0]);
                if (selection.multiple) intent.putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, Math.min(12, MediaStore.getPickImagesMaxLimit()));
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                try { activity.startActivityForResult(intent, selection.request); return; }
                catch (android.content.ActivityNotFoundException unavailable) { /* older OEM picker: use media provider */ }
            }
            activity.startActivityForResult(Intent.createChooser(files(selection, gallery), gallery ? "앨범에서 선택" : "내 파일에서 선택"), selection.request);
        } catch (Exception error) {
            finish(activity, selection, null);
            Toast.makeText(activity, "선택기를 열지 못했습니다. 다시 눌러 내 파일을 선택해주세요.", Toast.LENGTH_LONG).show();
        }
    }
    public static boolean consume(Activity activity, int request, int result, Intent data) {
        if (request < 12000 || request > 60000) return false;
        Pending selection = pending.get(activity);
        // Ignore a late result from a closed/replaced editor. It must never complete a new callback.
        if (selection == null || selection.request != request) return true;
        ArrayList<Uri> uris = new ArrayList<>();
        boolean rejected = false;
        if (result == Activity.RESULT_OK && data != null) {
            ClipData clips = data.getClipData();
            int count = clips == null ? (data.getData() == null ? 0 : 1) : clips.getItemCount();
            for (int i = 0; i < count; i++) {
                Uri uri = clips == null ? data.getData() : clips.getItemAt(i).getUri();
                if (uri == null || !"content".equals(uri.getScheme())) { rejected = true; continue; }
                try {
                    // A picker result is untrusted. Only pass granted readable content, never app-private file:// paths.
                    String type = activity.getContentResolver().getType(uri);
                    if (type != null && !accepted(selection.types, type)) { rejected = true; continue; }
                    try (android.content.res.AssetFileDescriptor descriptor = activity.getContentResolver().openAssetFileDescriptor(uri, "r")) {
                        if (descriptor == null) { rejected = true; continue; }
                    }
                    if (!uris.contains(uri)) uris.add(uri);
                } catch (Exception unreadable) { rejected = true; }
                if (!selection.multiple && !uris.isEmpty()) break;
            }
        }
        finish(activity, selection, uris.isEmpty() ? null : uris.toArray(new Uri[0]));
        if (rejected) Toast.makeText(activity, "읽을 수 없거나 지원하지 않는 파일은 제외했습니다.", Toast.LENGTH_LONG).show();
        return true;
    }
    private static boolean accepted(String[] types, String actual) {
        for (String type : types) if ("*/*".equals(type) || type.equalsIgnoreCase(actual) ||
            (type.endsWith("/*") && actual.toLowerCase(Locale.ROOT).startsWith(type.substring(0, type.length() - 1)))) return true;
        return false;
    }
    private static void finish(Activity activity, Pending selection, Uri[] result) {
        if (pending.get(activity) != selection) return;
        pending.remove(activity);
        if (selection.dialog != null) selection.dialog.dismiss();
        selection.callback.onReceiveValue(result);
    }
    public static void cancel(Activity activity) {
        Pending selection = pending.get(activity);
        if (selection != null) finish(activity, selection, null);
    }
}
