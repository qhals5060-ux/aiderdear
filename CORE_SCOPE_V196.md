# Native private widget actions in v196

The website keeps the v195 feature surface. Only release metadata, download targets and cache version change. Existing app navigation, step routines, calendar day sheets, startup asset and calendar geometry remain.

Calendar widgets launch a native note/todo input sheet. New notes use the existing `checklists` collection with `kind: memo`; todos use `kind: todo`. Routine completion controls send explicit native broadcasts instead of opening MainActivity. A UID-bound native outbox overlays local changes on copies of verified snapshots, so routine rows and weekly totals update immediately while offline.

The app-only private bridge uses the existing `applyWidgetActionV165` transaction and its receipt-based retry behavior. Only the oldest native command is claimed at a time. A claimed command's key and contents are immutable. Unclaimed actions for the same record/day may coalesce; a successor is rebased only after a freshly applied predecessor and a verified acknowledgement. Replayed receipts do not authorize rebasing across external edits. Account changes and terminal conflicts never silently overwrite another account or newer records. Failed work stays locally bounded and reviewable.

Native pending state is acknowledged only after the authenticated transaction result is incorporated into the app/widget snapshot. No new listener, cloud function, external service or timer writes are introduced. Build and release use the original signing certificate; APKs stay in GitHub Release, not Git or Vercel storage.

An app-only serial gate coordinates widget transactions with existing full private saves. When they overlap, it preserves the app's explicit row edits and the widget's completion or additions through a three-way merge. A deferred editor retains its original comparison baseline until the coordinator replaces that owned data object. Existing note serialization receives the verified transaction baseline before a merged save. Account changes invalidate leases, and a normal save invalidates a cached widget response so a subsequent retry obtains the current receipt result instead of republishing an older document.
