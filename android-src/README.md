# Android native release patches

## v184 current release

Version code 184 / version name 1.9.74 retains the package and signing certificate.
The five calendar providers keep their IDs and now use the approved compact
month/upcoming, agenda/todo, fortnight, month, and month/todo layouts. The existing
27 picker entries remain. App editors use 60% of the usable viewport, with 0.3mm
CSS spacing above and below the app. Weekly and W overview views use the existing
account-scoped schedule, D-day, and note stores.

Google Calendar uses the existing server OAuth refresh/webhook infrastructure.
Legacy browser-only or expired connections need one reconnection in settings.
No new Firestore collection or paid service is required. Release binaries are
GitHub Release assets; Git and Vercel exclude APK/ZIP duplicates. Keep old download
URLs redirected, and preserve a rollback before retiring an old deployment.

## v178 current release

Version code 178 / version name 1.9.68 retains package `com.aiderlog.v22app` and
the existing signing certificate. This sparse directory overlays the retained
full decoded app; it is not a standalone Gradle project.

Language Lab, its bundled courses, caption bridge and three language widget
providers are retired. The 27 remaining widget picker entries preserve their
native IDs. Consult language-qualification fields and other user records remain.
`retired-features-v178.js` clears only dedicated learning caches/fields.

`java/MediaChooserV178.java` and the matching smali provide Album/My Files choices;
the app uses its reviewed ESM `firebase-app.js` (not the historical bundle).
Shared Firebase/photo modules must be byte-identical in site, app overlay and
canonical assets. Android-only layout/entrypoint files must never be replaced
with the website versions. Fold styles retain their v177 filenames and now use
the v178 cache query.

Build with apktool 2.12.1 `--no-crunch`, then align/sign with the existing key.
Verify the final decoded package/version, every asset and widget PNG byte,
27 picker images, new native media/widget classes, offline precache and absence
of retired language providers. Source regression checks and APK validation do
not constitute physical Galaxy picker, login or touch verification.

## v168 native release

Consult/Work mobile composition, v13 native widgets, 1×1 intake link, and shared
lossless-storage adapters are included. See `../WORK_V168_OPERATIONS.md` for the
verified gates and unavailable physical Galaxy checks. Compile the widget Java
helpers with Java8 stubs, D8 min26, then merge `widgets/smali` and `widgets/res`
into the retained full decoded application. The full decoded tree is in the
separate source archive, not duplicated in Git.

## v167 historical source changes

The latest colour-only specification supersedes the v166 default-palette notes
below. See `APP_COLOUR_V167.md`. My/Paper/training presentation and the .72/.84/1.0
font mapping remain. `permissions-v164.js` is removed, so startup no longer opens
the app consent selector; contextual Android microphone/camera permission checks
remain. `firebase-app.js` + `consult-sync-v167.js` preserve server Consult versions
when the app syncs. They require the matching API/rules rollout described in
`../WORK_V167_OPERATIONS.md`. No new APK is included in this source candidate.

## v166 Soft Purple / My / mobile Paper / training

The default `system` choice is now the app's Soft Purple palette, not an OS
light/dark switch. The other five palette IDs and saved preferences are unchanged.
Global text choices are small .72, normal .84 and large 1.0. See
`SYSTEM_THEME_FONT_V166.md` and `MY_PAPER_V166.md` for scope and verification.
The existing widget rendering and wheel navigation are not redesigned in v166.

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
- `apktool.yml`: current release versionCode 166, versionName 1.9.56.

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
