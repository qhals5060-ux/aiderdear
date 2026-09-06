# Android native release patches

## v165 Routine / DayLog / widgets

App-only presentation changes are documented in `ROUTINE_V165.md` and
`DAYLOG_V165.md`. `widget-ui-v165.js` reconciles a single successful widget
transaction into the active app without uploading or replacing the full document.
`widgets/widget-model-test-v165.cjs`, `widget-transaction-test-v165.cjs`,
`widget-ui-test-v165.cjs` and the retained privacy suite cover the data boundary.
The website's Modern layout files must not be copied into the Android UI.

## v164 permission setup

`PermissionFlow.java` replaces the unconditional `onCreate` runtime prompt with
one optional first-run explanation. The "필요 권한 함께 설정" button requests
microphone and camera together; Android still requires its own permission choices.
"나중에" and dialog cancellation leave the app usable. Existing SAF file attachment
does not request gallery-wide or storage permissions. `permissions-v164.js` waits
until splash and tutorial are closed before invoking the native explanation.

Web media requests now check the trusted HTTPS origin, allow only microphone and
camera resources, wait for Android permission results, and grant only permissions
actually allowed by the user. Cancelled requests are cleared. Denied permissions
can be requested contextually when the user later starts the feature. Notifications
are not bundled into this media explanation, and no new permissions were added.

App index integration: load `permissions-v164.js` once near the end of the bundled
HTML after the existing startup/tutorial scripts; add it to the app service-worker
cache. Integration smali is included in this directory. Compile Java 8 / D8 min API
26 and merge generated `PermissionFlow*.smali` with the decoded app.

## v163 file transfers

This directory is the release patch source, not a complete Gradle project.
The complete base is the retained decoded AiderLog app. Unchanged widget, training,
authentication, routing, and data code are not duplicated here.

- `FileTransfer.java`: chunked local export into an Android `ACTION_CREATE_DOCUMENT`
  destination. At most 256 MiB per export, private temporary cache, cancellable save.
- `FileDownloads.java`: response downloads preserve filename, extension, MIME,
  session cookie and user-agent. Blob/data responses use the local export bridge.
- `smali/`: edited MainActivity / ChromeClient / DownloadListener integration.
- `assets/`: Android-only JavaScript and CSS introduced in this release.
- `apktool.yml`: current release versionCode 165, versionName 1.9.55.

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
