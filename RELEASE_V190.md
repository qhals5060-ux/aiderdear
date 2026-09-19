# AiderLog v190 / Android 1.9.80

PERSONAL now has a separate **재테크** category immediately after 건강, 독서, 워크플로우 and 금융. Existing 금융 records and handlers are retained. The supplied interactive reference provides product search, watch lists, comparison, notes, holdings, target conditions and custom products. Prices are explicitly labeled examples; no paid feed, automatic investment service or background trading is added.

The same-origin React frame uses the parent's Firebase identity through `assets-client-v190.js`. It receives no credential and cannot write `private/main`. Authenticated `/api/assets` verifies the owner and keeps `users/{uid}/assetWorkspaceV184/{assetId}` compatible with the supplied reference. Revision transactions prevent stale edits, repeated request IDs prevent duplicate saves, and account generations prevent late responses from reviving another account's cache. Incremental reads use Firestore snapshot times and server commit timestamps, so delayed commits are not missed. The frame pauses polling while hidden.

Records are retained without age/count deletion. Finance history is stored completely with lossless compression; thirty-entry pages are display-only. Overflow rejects a write without replacing its prior record. Existing site/app data normalization, mail, photos, calendar imports, research and speech retention are updated as documented in `RECORD_RETENTION_V190.md`. Existing security-token expiration, explicit deletion and non-destructive archive compression remain.

Widgets keep their compact layouts, blank forms, resizing and 27 providers. The installed-widget settings expose the same five theme families as the app, including compatibility for old saved keys. Text, borders, selected states, calendar accents and progress visuals use the selected palette. Wide weekly indicators no longer stretch.

## Validation

- Finance: 16 behavior/regression tests; real local Firestore concurrent transactions, owner separation, compressed restore, preserved existing private records and delayed-commit incremental reads.
- Finance UI: production React/bridge at 1280, 390 and 320 pixels; forms, management, comparison, history paging, failures and account transitions. Existing 금융 DOM unchanged; no page errors or horizontal overflow.
- Retention: 73 targeted tests and 10 local Firestore rules/adapter tests, including old records and oversized fixtures. No production user records were modified for testing.
- Widgets: 90 Node tests, 298 JVM assertions, 19 Java/D8 helpers, 64 smali assemblies, aapt2/strict XML checks and 585 XML adapter renders. This is not physical Samsung device testing.
- APK: same certificate, signature/zip alignment, compiled manifest v190, 221 byte-identical app assets, 58 widget images and all 27 pickers verified.

The Firebase rules were published on 2026-09-20 at 06:41 KST. No Firestore TTL policy exists. The console reported a daily free-quota limit; production record writes were not used for verification, and no paid plan was enabled. Android installations must be updated to remove old client cleanup code. Already deleted records cannot be recovered without an original source or backup.

The release has one APK and one site ZIP. Editable React sources stay in Git but are excluded from Vercel deployments; dependency folders, build intermediates and old binaries are not deployed. Retain the immediately previous APK for rollback, and remove older release binaries only after the new production release is verified.
