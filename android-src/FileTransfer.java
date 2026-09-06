package com.aiderlog.v22app;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.widget.Toast;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.UUID;

/** Chunked local exports through Android's document picker. No broad storage permission. */
public final class FileTransfer {
    public static final int SAVE_REQUEST = 903;
    private static final long LIMIT = 256L * 1024 * 1024;
    private final Activity activity;
    private final SharedPreferences pending;
    private File temporary;
    private FileOutputStream stream;
    private String transferId;
    private String filename;
    private String mime;
    private long bytes;

    public FileTransfer(Activity activity) {
        this.activity = activity;
        this.pending = activity.getSharedPreferences("aiderlog.file-export.v163", 0);
        // Restore only this app's own pending cache file after Activity recreation.
        String path = pending.getString("path", "");
        if (!path.isEmpty()) {
            File candidate = new File(path);
            if (activity.getCacheDir().equals(candidate.getParentFile()) && candidate.getName().startsWith("aiderlog-export-") && candidate.isFile()) {
                temporary = candidate;
            } else pending.edit().remove("path").commit();
        }
    }

    @JavascriptInterface public synchronized String beginFile(String name, String type) {
        if (stream != null || temporary != null) return "";
        try {
            filename = name == null ? "AiderLog-file" : name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
            if (filename.isEmpty()) filename = "AiderLog-file";
            if (filename.length() > 160) filename = filename.substring(0, 160);
            mime = type != null && type.contains("/") ? type.split(";")[0] : "application/octet-stream";
            String ext = MimeTypeMap.getSingleton().getExtensionFromMimeType(mime);
            if (!filename.contains(".") && ext != null) filename += "." + ext;
            temporary = File.createTempFile("aiderlog-export-", ".tmp", activity.getCacheDir());
            stream = new FileOutputStream(temporary);
            transferId = UUID.randomUUID().toString();
            bytes = 0;
            return transferId;
        } catch (Exception error) {
            clear();
            return "";
        }
    }

    @JavascriptInterface public synchronized boolean appendFile(String id, String base64) {
        if (stream == null || id == null || !id.equals(transferId) || base64 == null || base64.length() > 400000) return false;
        try {
            byte[] chunk = Base64.decode(base64, Base64.DEFAULT);
            if (bytes + chunk.length > LIMIT) { clear(); return false; }
            stream.write(chunk);
            bytes += chunk.length;
            return true;
        } catch (Exception error) { clear(); return false; }
    }

    @JavascriptInterface public synchronized boolean finishFile(String id) {
        if (stream == null || id == null || !id.equals(transferId)) return false;
        try {
            stream.close(); stream = null;
            pending.edit().putString("path", temporary.getAbsolutePath()).commit();
            activity.runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        Intent save = new Intent("android.intent.action.CREATE_DOCUMENT");
                        save.addCategory(Intent.CATEGORY_OPENABLE);
                        save.setType(mime);
                        save.putExtra(Intent.EXTRA_TITLE, filename);
                        activity.startActivityForResult(save, SAVE_REQUEST);
                    } catch (Exception error) {
                        clear();
                        message("저장 위치를 열지 못했습니다. 다시 시도해주세요.");
                    }
                }
            });
            return true;
        } catch (Exception error) { clear(); return false; }
    }

    @JavascriptInterface public synchronized void cancelFile(String id) {
        if (id != null && id.equals(transferId) && stream != null) clear();
    }

    public void onResult(int result, final Intent data) {
        if (result != Activity.RESULT_OK || data == null || data.getData() == null) { clear(); return; }
        final File source = temporary;
        final Uri destination = data.getData();
        new Thread(new Runnable() {
            @Override public void run() {
                boolean saved = false;
                try (FileInputStream input = new FileInputStream(source);
                     OutputStream output = activity.getContentResolver().openOutputStream(destination, "w")) {
                    if (output == null) throw new java.io.IOException("No output stream");
                    byte[] buffer = new byte[65536];
                    int read;
                    while ((read = input.read(buffer)) != -1) output.write(buffer, 0, read);
                    output.flush();
                    saved = true;
                } catch (Exception error) {
                    message("파일 저장에 실패했습니다. 저장 공간과 선택한 위치를 확인해주세요.");
                } finally { clear(); }
                if (saved) message("선택한 위치에 파일을 저장했습니다.");
            }
        }, "AiderLog-file-save").start();
    }

    private synchronized void clear() {
        try { if (stream != null) stream.close(); } catch (Exception ignored) {}
        stream = null;
        if (temporary != null) temporary.delete();
        temporary = null; transferId = null; bytes = 0;
        pending.edit().remove("path").commit();
    }

    private void message(final String text) {
        activity.runOnUiThread(new Runnable() {
            @Override public void run() { Toast.makeText(activity, text, Toast.LENGTH_LONG).show(); }
        });
    }
}
