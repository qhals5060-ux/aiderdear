# Consult v167 integration and verification

## Active files

- `consult-model-v167.js`: pure lossless compatibility model, source-derived schedule, delivery allowlist.
- `consult-v167.js`: five real menus and six selected-customer detail panels. Replaces only `#taskPage0` contents; `#taskPage1` admissions remains available through the bridge.
- `consult-v167.css`: frame-scoped responsive layout and native modal dialog styling.

Load model before UI. Stop loading the old `consult-v159.js/css` after switching the active renderer. The index renderer must early-return `AiderConsultV167.render()`; the Modern layout's old `arrangeConsult` must not rearrange the new root. Do not run the old renderer underneath the new view.

## Bridge contract

`window.AiderConsultBridge` supplies:

- `identity(): {uid,email}` and `canAccess(): boolean`. There is no production preview or role-switch bypass in the new UI.
- `snapshot()` returns existing private/restricted data with the four original Consult arrays.
- `commit({collection,id,expectedRevision,expectedUpdatedAt,row,requestId})` is the authoritative per-record atomic mutation. It returns `{payload}` or updates `snapshot()` before resolving. Reject stale versions, unauthorized callers, reused request IDs with differing payloads, duplicate document versions, and duplicate task source keys. Do not implement as a blind whole-private-document overwrite.
- `refresh()`, `notify(message)`, `openIntake()`, `openAdmissions()`, and `legacyAnalysis(clientId)` reuse existing account/intake/admissions flows.

Auth transitions close the editor, clear the selected customer and local navigation state. Late uploads/commit responses verify UID again. The UI does not create a private localStorage cache or issue an automatic cross-space/employee share.

## Data preservation and boundaries

The original `consultingClients`, `consultingTasks`, `consultingSessions`, `consultingFiles` arrays remain. Existing IDs, unknown fields, intake submission IDs, source dates, `fileId`, `storageScope`, `ownerEmail` remain. No fixed record-count truncation is applied in the new model, including orphaned file records.

Customers gain `consult167`: independent `stage` and `status`, legacy-stage review state, stable-ID support `targets`, private `internalNotes`, immutable `deliveries`. Ambiguous old stages are not converted into a fabricated percentage or silently marked complete.

Tasks use waiting/active/done, a separate client/consultant assignee, original dueDate/done compatibility fields, and optional session/document references. Explicit follow-up creation records a source key. Original references remain after editing; no automatic task generation on ordinary save.

Sessions preserve originalDate and append prior revision snapshots before edits. Customer feedback and private notes are separate fields. Old summary remains preserved and is not automatically treated as customer-approved delivery content.

Each document version is a separate original `consultingFiles` row with documentId/version. Actual files continue through existing protected media methods; text-only documents are also valid. Existing-version text is read-only; a new version creates a new row. Feedback changes append prior feedback/status; file references are not replaced. Server validation must enforce this boundary as well.

The normalizer in index must spread unknown fields before applying compatibility fixes, preserve nested fields, allow text-only document rows without fileId, and remove old `.slice` caps. App/backup/restore writers must preserve version167 extensions and avoid stale blind overwrites.

Schedule is derived, not duplicated. Existing task source IDs stay `consulting:{taskId}`; sessions and targets use `consulting-session:{sessionId}` and `consulting-target:{targetId}`. Legacy client.nextSession is included only when there is no exact matching session date. No new automatic Google Calendar or couple sharing is introduced.

## Delivery safety

The exact user-previewed selection is saved as a new snapshot, not recomputed silently on confirmation. Default selection is support goals only. Explicitly selectable target, open-task, completed-session customer feedback, and latest-document customer feedback are allowlisted. Internal notes, legacy freeform summaries, unknown original fields and physical file permissions are not included.

Saved delivery source references record ID/revision/version. TXT and print/PDF derive from the same snapshot. Creation/download is never labelled sent or read. Backend must reject mutations/removal of existing delivery IDs and validate allowed snapshot fields.

## Verified locally

`tools/consult-model-test-v167.cjs`: 15 passing tests: no source mutation; unknown/profile fields; ambiguous stage; idempotence; 1601-task retention; orphan/file references; real task ratios including0/0; legacy statuses; stable and deduplicated calendar sources; document version grouping; delivery allowlist, selection, immutability and TXT consistency.

`tools/consult-ui-test-v167.cjs`: isolated local bridge fixtures at1440,1280,390,360px. Five menus/six details, task completion/undo, session dates/history, text documentv1→v2, immutable delivery after customer edit, calendar/list view, zero JS errors and no horizontal root overflow. Screenshots/report: `C:/AiderLogBuild/qa-v167/consult`.

The fixture bridge is a test-only harness and is not loaded in production. It is not proof of live Firebase authorization or transaction correctness.

## Still requiring integration/runtime checks

- Actual index/Modern renderer and bridge integration, authenticated transaction→readback, cross-account rejection and stale-commit tests.
- Real protected file upload/download and image compression, including failure recovery and previous-file access.
- Existing intake duplicate-import guard and old shared/app writer compatibility after normalization changes.
- Actual popup PDF print pagination and final in-frame checks with full site CSS, browser/service-worker update.
- No deployment, live customer mutations, account invitations or APK build were performed by this module task.
