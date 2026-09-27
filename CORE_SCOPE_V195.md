# Android routines and navigation in v195

This release preserves the v194 website feature surface. Website changes are release metadata, download URLs and service-worker versioning only. The ordered routine feature is loaded exclusively from Android assets.

## Routine data

Existing `private/main` routine rows may contain `steps: [{id, title, durationSeconds}]`. A routine can have at most 30 steps. Step titles are bounded at 80 characters; durations are integer seconds from 1 to 86,400. Missing/empty steps keep the existing MINI/MORE/MAX routine usable. Editors retain unknown routine fields, history and stable step IDs while reordering.

The runner uses wall-clock timestamps and one account-scoped local snapshot for resume. Pausing and changing steps do not write to Firebase. Timer expiry alone never marks an action done. An explicit completion or skip advances the sequence. Saving the final summary uses the existing private-data boundary, and maintains bounded date summaries in `stepHistory`. The start date determines the routine's recorded day. Completed steps upgrade existing daily levels; they never downgrade a stronger daily record.

## Native widget

Five launcher providers remain: CalendarMonth, CalendarCombined, CalendarSplit, CalendarFortnight and RoutineAll. Calendar provider identities remain unchanged. Below the RoutineAll title, weighted layout panels reserve two-thirds for daily routine rows and one-third for weekly records. The daily list scrolls; the weekly panel is a fixed seven-day aggregate chart. It summarizes practiced routine count, total occurrences and per-day counts across all routines in the current Monday–Sunday week, based on existing daily levels and completed dates, excluding explicit SKIP and future dates. It does not need step definitions or another Firebase listener.

The RoutineAll component name and existing preferences remain stable. RoutineCards and RoutineStats registrations and picker resources are retired. Legacy authorized commands normalize to RoutineAll.

Calendar holiday labels sit beside their date. A non-exported native dialog Activity shows all events for the tapped date and accepts a title, date and time/all-day quick-add without opening MainActivity. New events are stored in a bounded UID-specific native queue and overlaid on widget snapshots immediately. The app-only calendar bridge drains that queue when the authenticated app resumes, using an atomic append to the existing personal schedule document. IDs make retries idempotent; source rows and remote edits are preserved. No new listener or background network worker is introduced. Native drafts are acknowledged only after both a successful transaction and an owner-verified schedule snapshot containing their IDs. Quota failures pause retries for 30 minutes.

## Build and verification

The original launch GIF remains ignored by Git and is restored with `scripts/restore-android-launch-v194.ps1` from the verified original APK. See `CORE_SCOPE_V194.md` and the native widget overlay notes for the existing source/build baseline. Use the original signing certificate and do not commit signing material, build tooling or installable archives.

Verify actual touch navigation, wheel order, unchanged calendar geometry, step editor/runner interaction, persistence rejection and account switching, week boundaries and widget resource bindings. XML-derived picker examples are useful layout evidence, not Android launcher screenshots. No device/emulator run is implied by desktop tests.
