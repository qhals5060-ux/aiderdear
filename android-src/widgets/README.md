# Native widgets (v184)

The five existing calendar provider IDs now use the approved compact designs:

| Provider | Composition | Default cells |
| --- | --- | --- |
| CalendarCombined | Month on the left, upcoming dated events on the right | 4×3 |
| CalendarAgenda | Upcoming dated events above incomplete todos | 4×4 |
| CalendarFortnight | Two weeks with event titles inside each date | 4×3 |
| CalendarMonth | Full month with event titles inside each date | 4×5 |
| CalendarSplit | Full month with event titles, then incomplete todos | 4×6 |

All five are native RemoteViews, retain saved colour/opacity/font settings and
resize with actual launcher bounds. The 6dp outer padding and 30dp navigation
row leave the remaining area to calendar cells and scrolling records. Dates and
holidays have separate lines. Fortnight titles may use two lines when the host
has enough height. Month overflow opens the complete date in the app. Upcoming
lists include ongoing and future events and show date, time and title.
The todo checkbox retains the existing owner/revision-checked app transaction;
it opens the app to complete that transaction and does not bypass Firebase rules.

`generate-calendar-v184.cjs` is the production XML source. Run it before copying
the resource overlay to the isolated decoded stage. `generate-picker-v169.cjs`
now uses `calendar-preview-v184.cjs` to fill that same XML with explicit demo
records for launcher artwork. Capture the five 336px-wide picker fixtures and
preserve their recorded heights (255, 319, 269, 403, 484 respectively). These
browser measurements are not device screenshots. Do not copy sample records
into widget snapshots.

`build-native-v176.ps1` now mirrors generated smali only into the repository by
default. Pass `-CanonicalDecodedPath` explicitly to mirror to an isolated stage
within the current workspace. Existing tool dependencies are reused through
`-ToolWorkspace`; no full source copy or Android SDK installation is required.

Current gates: `WidgetNativeContractTest` (102 model assertions), the updated
compact/density/metadata suites and existing model/privacy/action/transaction
tests. Physical Samsung launcher behaviour still requires a device check.

## Historical v181 implementation

This is a reproducible source overlay for the existing decoded Android app,
not a standalone Gradle project. Preserve the application/provider names and
existing public resource IDs. There are 27 launcher choices. Learning widgets
were retired in v178; their source backup remains outside Git.

## Compact calendar widgets

`WidgetCompactCalendarV181` owns these two existing provider types:

- **CalendarAgenda**: 4×2, equal-width schedule and incomplete-todo collections.
  The schedule uses the current date, not an invisible saved historical date.
  Both sides use 26dp rows, fixed time/checkbox columns and aligned dividers.
  They are independently scrollable native ListViews, with no visible date,
  count, title or large add button.
- **CalendarFortnight**: 4×2, 60% fortnight calendar / 40% incomplete todos.
  Fourteen cells show a date and one representative single-line event. The
  bottom collection uses paired todo rows with no heading. An unpaired final
  item keeps its half-width rather than expanding. There is no date-range
  heading or previous/next button.

Both retain per-widget theme, opacity and font preferences. The default surface
is near-white lavender with quiet borders and navy text. Settings renders the
same native tree as installation; `WidgetPreviewFrameV181` gives its preview a
2:1 frame. Launcher picker artwork is generated separately from production XML
and labelled test fixtures. Example records never enter installed snapshots.

## Data, ownership and actions

`widget-models-v165.js` loads before `widget-sync-v164.js`. Only UID-scoped
Firebase responses and owner-tagged caches are widget sources. Valid schedule
responses replace the previous list, including when empty. Failed reads retain
the last verified snapshot for that owner only. Private projected business and
received friend schedules preserve their read-only metadata; widget sync does
not send received schedules to Google Calendar.

Incomplete todos include overdue, future and undated records, without a 40-row
data cap. Explicit memos and completed todos are excluded. Native collections
use API31 collection items for small payloads and the protected
RemoteViewsService fallback for older devices or larger lists. Both collection
IDs are refreshed. Stable record IDs are preserved.

Account changes clear snapshots and cached service rows. Late callbacks cannot
publish an earlier owner's content or rebind it to a new owner's action.
Todo actions open the app and use its same-account, revision-checked transaction
and idempotent receipt. Offline actions remain in UID-scoped queues; permanent
errors retain their input as failed drafts. These are not background Firebase
writes. A schedule action keeps the existing app detail/read-only route.

## Rebuild

Run from the repository root using the configured Node, Java and PowerShell
executables. Use new workspace output directories for each build.

1. If rebuilding shared component resources, run
   `node android-src/widgets/generate-components-v178.cjs ../AiderLog-v145-decoded/res`.
   Apply the current density migration with
   `node android-src/widgets/compact-resources-v183.cjs ../AiderLog-v145-decoded/res`.
   Then overlay **all** `android-src/widgets/res` files into the canonical
   decoded `res` directory, including the v181 compact layouts and metadata.
   Do not finish with the historical v169 component generator.
2. Set `WIDGET_V169_QA` to a fresh workspace output directory and run
   `node android-src/widgets/generate-picker-v169.cjs ../AiderLog-v145-decoded/res --xml-only`.
3. Run `node android-src/widgets/render-picker-xml-v176.cjs <QA directory>`.
   Inspect the compact 336×168 and wide 672×336 previews. This SVG/Pango XML
   measurement adapter is **not an Android screenshot**.
4. Run `android-src/widgets/build-native-v176.ps1 -OutputRoot <fresh directory>`.
   It compiles the explicit Java helper inventory, dexes at min API26 and
   mirrors helper smali into the canonical decoded source and repository.
5. Run `android-src/widgets/run-native-model-test-v169.ps1 -OutputPath <fresh directory>`
   and the full source/ownership/layout/action/metadata regression gate.
6. Build and sign the app using the existing package and signing certificate;
   verify source asset bytes and picker resources in the resulting APK.

An actual Flip/Fold is still required to verify One UI placement, native
ListView gestures, resize behavior and physical touch targets. XML previews,
Java model tests and APK compilation do not substitute for that device gate.

## v183 geometry correction

The shared native shell now uses 8dp outside padding, a 28dp header and 2dp
header spacing. A 168dp host therefore has 122dp for collection content,
compared with 70dp after the old shell and list padding. Standard todo rows
use a 30dp content minimum and 6dp vertical insets without shrinking text.
A retains six aligned 26dp rows and raises primary text to 12.5sp. B keeps
the original 60/40 split and three pairs of incomplete todos, with 11.5sp
todo labels and separate 8sp condensed time / 8.5sp title columns. The time
omits a leading zero and the one-line title has its own ellipsis. Month calendars use contiguous cells,
content-sized dates, and 1–3 visible events according to actual cell height.

Picker generation now embeds the production native shell and weighted calendar
rows. Its measurement adapter excludes GONE children from weight distribution.
These are resource measurement fixtures, not device screenshots.
