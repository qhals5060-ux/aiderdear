# AiderLog v164 — Event, native widgets, permissions and site editions

## Scope and preservation

- Android Event retains the existing delegated handlers, record IDs, owner filters,
  albums, permissions and cloud/local storage. Its three tabs, feeds and editors
  are restyled. Record's bottom sheet occupies 60% of the visible viewport; only
  its fields scroll. Archive and Travel retain their full question sets.
- The app profile is compact, with six theme choices. Existing stored theme IDs,
  font size and background choices remain readable. User photographs are not tinted.
  The wheel's geometry, gesture controller and artwork are unchanged.
- The website keeps both layout editions with the same functionality. The account
  page contains a site-theme selector and separate Modern / Editorial downloads.
  Public download controls are also available before login; private account content
  is not copied into that guest area.
- Website Event questions use the app's canonical fields. Existing extra fields and
  earlier travel details are retained when a record is edited.
- The first-run permission explanation follows splash/tutorial. One optional button
  starts camera and microphone setup. Android still presents its own decisions;
  they cannot be silently approved. Photos, videos and documents use the existing
  system document picker, without gallery-wide or broad storage access.

## Native widgets

The active app now sends a data snapshot to the existing native bridge. The previous
snapshot sender lived in an inactive shell, leaving installed widgets without updates.
Calendars are now native RemoteViews rows and date cells, not a text calendar.
Widget picker preview layouts/images are packaged in the APK for each purpose.
Installed widgets retain launcher long-press Settings / reconfiguration and default
installation. The settings preview uses the same native RemoteViews renderer.

Rendering avoids unsupported remote `View.setAlpha` calls. Image backgrounds use
`ImageView.setImageAlpha`; list widgets use RemoteCollectionItems on supported Android
versions and a RemoteViewsService fallback. Calendar date/month actions remain native.

## Verification

- Event checked at 360×800, 390×844, 412×915, 768×900 and 915×412: no document
  horizontal overflow or page errors; Record sheet width, exact 60% height, stationary
  footer, internal scrolling and no forced input focus passed.
- Isolated local Event fixtures: Record, Archive, Place, Food, Activity and Plan
  create/edit/delete/reload passed; a selected image and long text were retained.
- Six app themes checked; 30 Event editor contrast cases passed (minimum 5.03:1).
  Profile checked at 360/390/412/720px; six 44px touch targets fit in one row.
  Legacy `mars` remains stored and maps to Terracotta; theme survives reload.
- Existing wheel touch regression passed for Event, Routine and My.
- Website Modern/Editorial switching, persistence, original button/node identity,
  calendar month action and public downloads checked at 1440/390/360px.
- JavaScript parsing, direct local asset references and permission timing tests passed.
- Native permission/widget Java sources compile for min API 26. APK packaging and
  signature results are recorded with the generated release artifacts.

No connected Samsung device was available. Browser tests and native compilation are
not a claim of One UI launcher or Android permission-dialog end-to-end verification.
Authenticated production CRUD was not used to create test data or modify user records.

## Cleanup and size policy

- Previous published v163 APK/Modern ZIP and v161 Editorial ZIP were removed from
  the current Git tree after external backup/hash checks. Git history is retained.
- Removed the replaced site-edition adapter, superseded Event layout overrides,
  unused lesson constant and three unreferenced Android shell/catalog assets.
- Replaced 13 obsolete large widget preview PNGs while retaining their resource IDs:
  16,667,276 → 278,566 bytes, a reduction of 16,388,710 uncompressed bytes.
- Active older-named feature files remain. No user localStorage, IndexedDB or cloud
  record was deleted for this cleanup. SDK/compiler jars, signing files, caches and
  unsigned APKs are not published in Git.
- Both site ZIPs contain the current site functions; only their initial edition differs.
  APKs and nested release ZIPs are excluded from site ZIPs.

## First-install phone checks

1. Install the v164 APK downloaded from the live site's Android card.
2. Complete or dismiss tutorial, choose permission setup or Later, and verify optional
   denial does not prevent normal navigation.
3. Add a calendar from the launcher picker, confirm visible cells, resize it, select
   a date and switch months. Check the selected day's real schedule, not sample data.
4. Long-press the widget → Settings; save theme, opacity and font size, then confirm
   the installed widget matches its settings preview.
5. Create a local Event record/photo and navigate by the unchanged wheel. Return from
   another app and confirm the current page remains available.
