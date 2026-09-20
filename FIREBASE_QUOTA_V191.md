# Firebase usage changes · v191

The site investment page is an inactive template. Its examples, filters and comparison layout remain available, but it does not initialize Firebase, request account records, subscribe, poll or save. `/api/assets` serves a static health response and rejects data operations with HTTP 423 before authentication or database initialization. Existing records are retained. The established personal finance page remains active.

## Active app and site

- Replace periodic whole-document reads and state-notification refetches with the app/private snapshot payloads. Reuse the calendar subscription for a stable account and pair.
- Share concurrent reads of the same document, without retaining an application-level stale read cache across accounts.
- Remove unchanged profile writes and private-data writes on ordinary loads. Keep first-document creation and necessary migrations.
- Adopt private merge baselines only when the UI adopts the corresponding payload. Buffer remote updates while editing or saving, preserve failed drafts, and reconcile the rare conflicting acknowledgement with one scoped read.
- Keep authoritative calendar data when a delayed legacy app document arrives. Widgets reuse confirmed app/private/calendar data rather than refetching on unrelated state events, forms or visibility changes.
- Use a ten-minute foreground site fallback only when an app/private listener is unhealthy. Pause quota-error retries for thirty minutes and resume listeners only while visible and online. Permission failures do not loop.
- Preserve Google Calendar synchronization. Automatic Notion sync follows the existing five-minute freshness window; explicit refresh still requests a refresh.

No retention policy, access rules or paid plan was changed. No existing records were deleted. Browser clients retain the default Firebase cache configuration. Old APKs must be updated to receive these changes.

## Verification

Behavior tests cover repeated state events, subscription reuse, account changes, buffered editing, failed saves, transaction merge results, listener recovery, cached missing snapshots, API template isolation and permanent record retention. Local browser checks cover app views, five themes, fold sizes and the thirteen native-widget previews. Production probes check static versions, API health, blocked investment operations and release downloads without writing account data.

These changes reduce avoidable operations; they cannot guarantee a fixed daily total. Actual billable usage still depends on active devices, record changes, queries and reconnects. A session whose initial sign-in document reads failed due to quota exhaustion may need a page reload after quota recovery.
