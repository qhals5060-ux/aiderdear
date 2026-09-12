# v176 native widget colour layers

The installed RemoteViews renderer now selects semantic surfaces in
`WidgetDesignV165.surface`: near-white outer default, lavender note/stat/quote
panels, white bordered routine/challenge/workflow/day cards, transparent plain
rows. Selected dates/checks are violet with white text. Per-widget background
colour, opacity, font settings and action targets remain unchanged.

Rebuild from the repository root (use the configured Node executable):

1. `node android-src/widgets/generate-components-v176.cjs ../AiderLog-v145-decoded/res`
2. Set `WIDGET_V169_QA` to the workspace `outputs/widget-v176` directory, then run
   `node android-src/widgets/generate-picker-v169.cjs ../AiderLog-v145-decoded/res --xml-only`.
3. `node android-src/widgets/render-picker-xml-v176.cjs` creates all 30 portrait
   launcher PNGs and 29 wide comparison PNGs from those exact XML/drawable trees.
   The local SVG/Pango measurement adapter is not an Android screenshot. It does
   not approximate colours by resource names or introduce production demo data.
4. `./android-src/widgets/build-native-v176.ps1` builds the Java/D8 helper and
   mirrors its smali into both canonical decoded sources and this directory.
   For another build use a fresh workspace `-OutputRoot`; old helpers are kept.
5. Run `widget-surfaces-v176.test.cjs`, the native/size/action/privacy regression
   gates and `run-native-model-test-v169.ps1` with a fresh workspace OutputPath.

Do not finish a rebuild with the historical v169 component generator: its v168
predecessor paints every content surface the same light violet. Always finish
with v176, then regenerate picker layouts/PNGs. Settings preview calls the same
native renderer as installation. Physical Flip/Fold launcher, resize and touch
verification remains a separate device gate.

## Historical v168 architecture (v13 designs)

The notes below retain historical architecture details. For v168 use
`generate-components-v168.cjs` and then `generate-picker-v168.cjs` against the
decoded `res` directory. Both intentionally reuse the v165 generators and stable
resource IDs; do not delete those dependencies. v168 adds the 1×1 TaskClientLink
provider (30 total picker choices), four-token default palette and typography,
560dp/font-aware split layouts, and read-only bullet journal actions.

Native settings and installed rendering share the same production components.
Consult/Work calendar projection is owner guarded. Goal-linked routine actions
open the existing app flow, never bypassing linked goals. Full current test and
physical-device limitations are in `../../WORK_V168_OPERATIONS.md`.

## Retained implementation details (v165 foundation)

This is a reproducible patch for the retained decoded Android application, not a
standalone Gradle project. Preserve the package/provider names and existing public
resource IDs. The former v164 source snapshot is backed up outside Git at
work/widget-v164-backup-20260906-222354/widgets.

## Actual launcher implementation

- Calendar uses native month cells (4–6 actual weeks) or fourteen fortnight cells.
  Five retained provider IDs cover month, selected-day agenda, combined calendar
  and agenda, large month with one/two event labels and +N, and fortnight+agenda.
  Compact cells reserve room for the date and holiday rather than drawing over
  other labels. Large-month default/minimum height is 440dp.
- Notes/todos, routines, English/Japanese learning, health, reading and bullet
  journal use purpose-specific native RemoteViews cards, not flat text lists.
  Progress bars are real ProgressBar views. Seven learning stars, routine and
  challenge nodes, and actual-value statistics are drawn into native graph images.
- Meals have exactly four photo/time/rating slots; no imaginary food or nutrition.
  Book covers use actual private media and preserve the full cover aspect ratio.
  Missing media keeps a plain placeholder; missing measurements stay unavailable.
- Native scrolling collections retain all rows. Content-heavy cards use
  RemoteViewsService on all supported versions to avoid a large image-heavy
  Binder transaction; short calendar agendas may use API31 RemoteCollectionItems.
- Fold-width layouts use paired panels, four book/photo columns and seven bullet
  days. Narrow seven-day bullet widgets page through three visible days; 3-day
  widgets stack vertically. Emotion records are excluded structurally, not by
  matching words in unrelated titles.

## Appearance, previews and actions

- Long-press launcher Settings, optional default installation, per-widget theme,
  opacity and five font sizes are retained. Theme changes the outer background
  and light/dark text; content cards keep the v12 neutral white/purple palette.
- Settings renders the same native cards with temporary preferences. Cancel does
  not save the changed range/content/appearance. Selected content uses stable
  real record IDs rather than example names.
- The 29 launcher previewLayout/previewImage pairs reuse production component XML.
  Eleven tiny graph images contain DEMO data only for the launcher picker.
  Thirteen older preview resource names retain updated small image bytes for
  compatibility. No DEMO records enter installed widget snapshots.
- Todo and routine controls OPEN THE APP, then execute the same-account Firestore
  transaction. They are not headless/background Firebase writes. Successful
  transactions refresh the widget snapshot and dispatch a guarded one-row UI
  update. Duplicate keys are idempotent; stale edits are rejected.
- Offline actions remain in a UID-scoped queue. Permanent validation failures
  leave that active queue and preserve their input in UID-scoped failed drafts.
  Quick-add accepts up to 180 characters and stores ordinary checklist/memo rows.
- Language “오늘 기록” opens the existing learning page and selected language.
  The widget never bypasses the lesson completion gate or invents learning time.

## Ownership and integration

widget-models-v165.js must load before widget-sync-v164.js in the app index and
service-worker cache. The adapter reads only scoped Firebase app/private/schedule
responses and owner-tagged caches, never legacy global A/P data as a widget source.
Account/pair/logout changes immediately clear content; late image/read callbacks
cannot republish an earlier owner. Empty native lists are hidden before refresh,
and every photo/cover explicitly clears any previously applied bitmap.

Compile WidgetNativeV164, WidgetDesignV165, WidgetRowsV164 and WidgetNavV164 using
Java8 Android stubs plus org.json; dex with min API26 and merge the package smali.
Apply retained WidgetProvider/WidgetConfigActivity smali and the res overlay.
Keep the private WidgetNavV164 receiver and BIND_REMOTEVIEWS WidgetRowsV164 service.
MainActivity.NativeBridge.syncWidgets accepts up to 4 MiB in-process; no external
server receives a widget snapshot. firebase-app.js exposes applyWidgetActionV165
in both site and app builds; its transaction receipts use the existing owner-only
private collection rules.

## Rebuild preview assets

Run generate-components-v165.cjs against the decoded res directory, then
generate-picker-v165.cjs against the same directory. Set WIDGET_PLAYWRIGHT_MODULE
to the installed Playwright module and optionally WIDGET_CHROME_PATH.
The latter generates native XML and PNG fallbacks from those XML trees. They are
HTML-measurement-adapter renders, NOT Android screenshots. Copy final small
picker images to the thirteen retained legacy aliases when regenerating them.

## Verification and remaining device gate

- Java compile and D8 min26 completed; seven helper smali files integrated.
- 15 Java model assertions, 26 JavaScript model tests, 24 transaction tests,
  11 native layout/RemoteViews contract checks pass (including AAPT integer progress).
- Existing ownership/privacy suite and new action routing tests pass, including
  stale reads/images, replay, offline owner changes and permanent-error handling.
- All 29 picker XML files parsed/rendered. Calendar, learning, routine, meal,
  reading and bullet previews were visually inspected after the final pass.
- No connected Samsung device or emulator was available. One UI add/resize,
  native ListView scrolling, settings Save/Cancel, physical touch actions, and
  foreground/account transitions still need an actual Flip/Fold device test.
  Browser/PNG checks do not prove Android RemoteViews inflation or host behavior.
