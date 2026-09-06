package com.aiderlog.v22app;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.webkit.CookieManager;
import android.webkit.URLUtil;
import android.webkit.WebView;
import android.widget.Toast;
import org.json.JSONObject;

/** Fallback for server attachment responses; local blobs use the SAF bridge. */
public final class FileDownloads {
    public static void download(Activity activity, WebView view, String url, String userAgent, String disposition, String type) {
        if (url == null) return;
        if (url.startsWith("blob:") || url.startsWith("data:")) {
            view.loadUrl("javascript:window.AiderLogFileIO&&window.AiderLogFileIO.saveUrl(" + JSONObject.quote(url) + "," + JSONObject.quote(URLUtil.guessFileName(url, disposition, type)) + "," + JSONObject.quote(type == null ? "" : type) + ");void(0)");
            return;
        }
        if (!url.startsWith("https://") && !url.startsWith("http://")) return;
        try {
            String name = URLUtil.guessFileName(url, disposition, type).replaceAll("[\\\\/:*?\"<>|]", "_");
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            if (type != null && !type.isEmpty()) request.setMimeType(type);
            if (userAgent != null) request.addRequestHeader("User-Agent", userAgent);
            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null && !cookie.isEmpty()) request.addRequestHeader("Cookie", cookie);
            request.setTitle(name);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
            ((DownloadManager)activity.getSystemService(Activity.DOWNLOAD_SERVICE)).enqueue(request);
            Toast.makeText(activity, "다운로드를 시작했습니다. 알림에서 진행 상태를 확인해주세요.", Toast.LENGTH_LONG).show();
        } catch (Exception error) {
            // Older Android or provider restrictions: keep an explicit, usable fallback.
            try { activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
            catch (Exception unavailable) { Toast.makeText(activity, "파일을 열지 못했습니다. 연결과 저장 공간을 확인해주세요.", Toast.LENGTH_LONG).show(); }
        }
    }
}
