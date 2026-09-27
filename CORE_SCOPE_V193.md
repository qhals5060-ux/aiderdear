# AiderLog v193

The website and Android app expose SCHEDULE, ROUTINE, EVENT, and PAPER. Finance and Workflow keep their original `personalItems` records and editors as Schedule subviews.

- Website: Finance/Workflow buttons beside the previous month / Today / next month controls.
- Android: the original wheelbar, central planet, and rotation gestures remain, ordered SCHEDULE → ROUTINE → EVENT → PAPER. A rightward Schedule swipe or the Finance/Workflow button opens the tools; back or a leftward tools swipe returns to Schedule. Forms retain their gestures.
- Android widgets: the existing five Calendar and three Routine provider IDs remain. All other picker providers, resources, classes, and stale action routes are removed or rejected. Calendar TODO support remains within Schedule widgets.
- Retired features have no visible launcher, eager data subscription, or active server API. Historical data is retained. Existing PAPER account restrictions remain.
- Website service worker caches one copy of each retained static asset and rejects retired routes. API, auth callback, token-bearing URLs and downloads are excluded. The Android worker uses current-cache-only canonical keys and safe navigation fallbacks.
- APK/ZIP binaries are release assets, excluded from Git and Vercel. No new paid service or background job was introduced. See `FREE_TIER_V193.md` for the measured usage audit.

## Validation

`npm run test:core` runs the retained sync/calendar/storage-scope/cache regressions and native widget JS adapter tests. `npm run test:ui` runs isolated browser fixtures (Playwright required, Edge or Chromium). Browser fixtures never write production records.

The Android release is rebuilt from supplied v192 and the native overlay with version code 193, version name 1.9.83, package `com.aiderlog.v22app`, and the original certificate. APK archive/manifest/signature verification is automated. Actual installation on the user's physical phone is not part of the local checks.
