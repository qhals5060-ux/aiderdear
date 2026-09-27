# AiderLog v194

The four retained modules and v193 data-preservation/quota safeguards remain. v194 restores the original Android launch animation and calendar geometry, revises navigation, and combines native widgets.

The website shows year/month and Today above D-day. Today restores the calendar from Finance/Workflow and resets its month. The separate Calendar button is removed. Full calendar dimensions are preserved.

The Android planet opens Schedule. The first wheel destination opens Finance/Workflow and uses its own icon. No Finance/Workflow or Weekly button is inserted into the calendar, and Finance/Workflow has no return-to-Schedule button. A deliberate rightward calendar swipe opens the existing weekly view. Original launch animation and duration are restored.

Native CalendarAgenda is retired. CalendarSplit shows calendar above TODO and MEMO. CalendarFortnight includes upcoming schedules, TODO and MEMO beneath the two-week calendar. The three Routine widgets use a simpler, compact layout. Existing surviving provider IDs and record selections remain stable.

## Original media

The original launch GIF is 16,848,406 bytes. To avoid duplicating this binary in Git, it is ignored under `android-src/assets` and packaged in the APK release. Restore it from the supplied original v192 APK before a fresh-checkout Android build or app UI test:

```powershell
pwsh scripts/restore-android-launch-v194.ps1 -ApkPath 'path/to/AiderLog-v192.apk'
```

The script accepts only the original animation SHA-256 `a9936a466a395f644def8c8e5dd612a0598e9752e7f2a2d708835c160dc9e52b` and does not download files. The original package is also available in the GitHub v192 release. No signing keys or installable archives are committed.

Validation uses isolated browser fixtures, pure widget contracts, and APK signature/manifest/asset verification. Physical Android installation and launcher RemoteViews rendering are not asserted by desktop tests.
