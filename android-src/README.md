# Android v163 file-transfer changes

This directory is the release patch source, not a complete Gradle project.
The complete base is the retained decoded AiderLog app. Unchanged widget, training,
authentication, routing, and data code are not duplicated here.

- `FileTransfer.java`: chunked local export into an Android `ACTION_CREATE_DOCUMENT`
  destination. At most 256 MiB per export, private temporary cache, cancellable save.
- `FileDownloads.java`: response downloads preserve filename, extension, MIME,
  session cookie and user-agent. Blob/data responses use the local export bridge.
- `smali/`: edited MainActivity / ChromeClient / DownloadListener integration.
- `assets/`: Android-only JavaScript and CSS introduced in this release.
- `apktool.yml`: release versionCode 163, versionName 1.9.53.

Build: compile the Java sources for Android (Java 8, min API 26), dex the generated
`com.aiderlog.v22app` classes, disassemble and copy their generated smali into the
decoded application's matching package. Apply the included integration smali and
assets. The app index loads `file-transfer-v163.js` before its other JavaScript and
`app-files-v163.css` after `app-polish-v161.css`. The app service worker includes
both new files. Rebuild with apktool 2.12.1 and align/sign with the existing key.

Do not include SDK jars, compiler jars, compile-only Android annotation stubs,
keystores, build caches or unsigned APKs in Git. The rebuilt APK uses the same
certificate as v162; signatures v2/v3 were checked.

`world-lab-year1.json` was removed only after verifying its parsed contents exactly
equal `AiderWorldLabYear1` in the active `world-lab-year1-data.js`. The active 192
study modules and 576 concepts remain bundled. No user localStorage or IndexedDB
records are removed or migrated by this release.
