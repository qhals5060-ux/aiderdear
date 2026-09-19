# v190 user-record preservation

Records and attachment references are no longer removed or shortened because of their age or collection length. This is a storage-policy change for the site and Android app, not a migration that reads or rewrites production account data.

## Removed destructive paths

- Direct letters: removed the seven-day read filter and cleanup worker, including the legacy site cleanup. Rules no longer permit a recipient to delete a letter merely because seven days passed. The sender can still explicitly delete a letter.
- Shared photos/videos: new metadata has no expiry. Existing records with old `expiresAt` metadata remain readable and visible; clients no longer schedule expiry removal or automatically delete old owned uploads. New rules reject creation of expiry-bearing metadata. Uploader deletion and removal of incomplete failed uploads remain available.
- Site normalization: removed count caps on personal/research records, folders/concept keys, pomodoro sessions, payment checks, exercise sets and steps, and history/goal lists. Removed text truncation of records and imports. Unknown record and nested metadata fields are retained. Existing schema checks still normalize supported fields.
- Shared album publishing: no longer silently limits album/record/attachment counts or record text. A missing attachment, failed copy, excessive recipient count, or oversized snapshot rejects publication before replacing the existing shared snapshot. Explicit unsharing still prunes obsolete shared copies after a successful complete publication.
- App: removed rolling limits on research capture/review histories and study-card history. Retired Language Lab UI stays retired, while its stored private/local records are retained. Private saves preserve fields omitted by an older client's payload.
- Speech: retained sessions, transcripts, analyses and audio keep the existing device-local storage design. The former auto-delete / omit-transcript settings are replaced with permanent retention. Sessions use localStorage; audio uses IndexedDB. This does not upload speech audio to Firebase or include audio bytes in the existing JSON export. Device data clearing/uninstall remains outside app retention control.
- App storage errors no longer report a successful app/private save after a failed cloud write. The complete in-memory/local draft is retained and the save rejects. Local training storage failure also raises a visible error without deleting old records.
- Calendar imports: removed the nearest-600 event cap and text truncation. Google refresh preserves stored rows outside the fetched calendars/date range, including the entire boundary days of partial-day queries. Notion follows pagination beyond the former 1,000-row cutoff; a missing continuation cursor or safety limit causes an error before replacing existing records. Switching a Notion database preserves rows from other previously imported databases.

## Intentionally retained

- Explicit delete/unshare/disconnect actions and provider deletions within a successfully fetched calendar coverage range. Historical Google source deletions outside the refresh window, and events on boundary days, may remain until a query covers them completely; absence from a partial query is not treated as deletion.
- Quarterly lossless archive compression. Tests compare the decompressed result to the full original payload including old records/history/attachment references. Historical 3/6-month retention constants and cleanup wording were removed; this compression is not record deletion.
- Display paging, graph sampling and bounded notification/dismissal caches. These do not replace source records. Estate's last-100 inline history is a display/index copy; full entries are written separately to its history subcollection. New finance history handling belongs to its separate v190 implementation.
- OAuth access/refresh and webhook expiry, invitation/security-token lifetimes, retry/idempotency caches, obsolete static asset cleanup and upload limits.
- Size/count/schema validation that rejects a request without shortening its contents or deleting previous records. Examples include Firestore document limits; shared-album publication preflight (800,000 JSON bytes, at most 30 viewers); the existing media upload limits; mail body (220 characters); nickname (24 characters); API validation for private calendars, work, estate and YouTube. YouTube keeps its bounded text-document design and rejects overflow; imported titles are now retained in full for editing instead of silently cut at 180 characters.
- Google/Notion import safety guards stop an incomplete import at 10,000 fetched rows when another page exists. A failed import keeps the existing stored records; it does not save only the first 10,000.

## Verification and operational limits

- `tests/record-retention-v190.test.mjs`: actual source-function execution with 1,201 personal records, 601 papers, 1,601 insights, 3,101 connections, 701 payment checks, 41 albums / 260 records / nine attachments, old mail/media, quota failures, archive round-trips, Google boundary coverage and 1,002 Notion pages.
- Targeted preservation/calendar/media/private-rule/retired-feature regression command: **73 tests passed**.
- Local Firestore emulator on `127.0.0.1:8899`: new permanent-record rule tests plus existing private-calendar adapter/rule tests: **10 tests passed**. Only isolated `demo-` projects and synthetic records were used.

```powershell
$env:FIRESTORE_EMULATOR_HOST='127.0.0.1:8899'
$env:RULES_TEST_MODULE_ROOT='C:/AiderLogBuild/work-security-v167'
node --test tests/record-retention-emulator-v190.test.mjs tests/private-calendar-emulator-v178.test.mjs
```

The release owner inspected the live Firestore `(default)` TTL console and found no policies. The console reported a daily quota limit; no production record reads/writes were used for these tests. The tested rules were published through the Firebase Console on 2026-09-20 at 06:41 KST after comparing the full existing rules with the Git baseline and the full edited rules with the tested source.

Older installed app clients retain their old code until updated. Rules block the former recipient mail cleanup, but cannot distinguish an older uploader's automatic deletion from that uploader's authorized explicit deletion. All active app installs should therefore be updated. Previously deleted/truncated records cannot be reconstructed by this release without an existing backup or original source.
