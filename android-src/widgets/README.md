# v164 native widgets

These are release patches for the retained decoded AiderLog application, not a
standalone Gradle project. Keep the base package name and existing public resource
IDs. The source and small resource snapshots together are about 1.5 MiB.

## What changed

- `WidgetProvider.updateWidget` delegates to `WidgetNativeV164`; the calendar is
  real nested RemoteViews with 42 month cells or 14 fortnight cells, not a text
  block or a background screenshot. Small cells hide overflowing labels while
  their content description and selected-day agenda retain the information.
- The selected-day agenda is an actual native scrollable collection. API31+
  RemoteCollectionItems and API26–30 RemoteViewsService use the same model rows.
  If the newer API is unavailable, the service fallback is refreshed explicitly.
- Background opacity uses ImageView.setImageAlpha, which is remotely invocable;
  View.setAlpha cannot be used safely through RemoteViews on supported Android.
- Configuration retains launcher long-press Settings and per-widget preferences.
  Its preview uses the same RemoteViews renderer with unsaved appearance values.
- All 29 active picker entries use explicit `previewLayout` and `previewImage`.
  Example content occurs only in picker resources, never in installed snapshots.
  The 13 old preview names/IDs are retained with small updated image content.
- The app's active `widget-sync-v164.js` bridges canonical local app data, not
  text scraped from a rendered calendar. This script must be in the bundled index
  and its service-worker cache. `android-shell.js` is not the active sender.
  Its `accessState` distinguishes login/sync-required placeholders from a genuinely empty library.

## Integration

1. Compile the three production Java files (`WidgetNativeV164`, `WidgetNavV164`,
   `WidgetRowsV164`) with Java8 Android stubs and org.json. Dex with min API26,
   disassemble, and merge generated package smali into the decoded app.
2. Apply the included WidgetProvider/WidgetConfigActivity integration smali and
   overlay `res/`. Preserve existing public.xml resource IDs from the app base.
3. The application manifest must include an exported=false `.WidgetNavV164`
   receiver and exported=false `.WidgetRowsV164` service requiring
   `android.permission.BIND_REMOTEVIEWS`. Preserve existing purpose-labelled
   provider declarations and `configuration_optional|reconfigurable` metadata.
4. Keep the app-side localized hooks: `experience-v143.js` exports the existing
   holiday resolver as `AiderLogHolidayTitleV164`, and `feature-system-v125.js`
   exposes its existing `openScheduleV125` via `AiderLogCalendarV125.openSchedule`.
   Other agents' edits to these shared app files must not be overwritten.
5. Rebuild resources with apktool, then align/sign with the release key. No SDK
   jars, signing secrets, APKs, helper class/dex caches belong in this directory.

## Verification and limits

- Production Java was compiled and dexed; the package smali was integrated.
- `WidgetNativeContractTest` covers real event intervals/order and empty-state
  behavior. Compile it only into a separate test output; do not ship it in APK.
- All active picker/initial-layout references resolve to resources. Preview
  calendars were visually checked after applying runtime-equivalent small-cell
  visibility thresholds; combined preview no longer leaks dots/holiday text.
- `render-widget-previews-v164.cjs` renders static native preview XML through a
  build-time HTML adapter to produce fallback PNGs. Set WIDGET_PLAYWRIGHT_MODULE
  and optional WIDGET_CHROME_PATH, or install Playwright normally. These images
  are NOT Android screenshots and do not verify One UI rendering by themselves.
- No connected Samsung device or Android emulator was available. Final release
  still requires adding/resizing all five calendars on Flip/Fold launchers,
  scrolling the agenda, opening long-press Settings, saving dark/opacity/font
  choices, foreground/logout transitions, and checking launcher runtime logs.
- This patch repairs actual rendering and data delivery. It does not claim new
  direct-edit workout/routine graphs or all advanced v12 interactions are finished.
