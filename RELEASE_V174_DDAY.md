# Site v174 — persistent D-day

## Change

- Store D-day entries and the chosen header entry independently from legacy whole-app writes.
- Preserve accessible legacy entries additively in their original user or pair scope. Do not modify or delete the original `app/main` documents, or automatically share private entries with a partner.
- Retain the last confirmed display and entered form values on failure; support explicit retry and idempotent submission.
- Keep deletion tombstones, scope-aware selection, account-change guards, and Seoul-date rollover.
- Firebase rules, Google OAuth and calendar connection configuration are unchanged.

## Verification

- 23 test files: 217 passed, zero failed or skipped; 37 D-day domain, adapter and UI tests included.
- Isolated browser fixture: legacy selection restored, failed save retained inputs, retry created one entry, reload retained the selection, and legacy whole-app overwrite did not remove dedicated entries.
- No production test records were created. Availability of a user's previously lost record must be checked separately on the authenticated production screen.
- PC ZIPs: 102 entries each, packaged application sources verified against the final working tree.

## Packages

- Modern: 1,856,967 bytes; SHA256 `236cc8e20dde59412d5676ac4fc7103be1bdc51fdb3fd1ebe00a0bb4bb760e1b`
- Editorial: 1,856,963 bytes; SHA256 `4ce23eb972b8d520693cdd3a9b949c482fc9566bd413cf10ed064959902dfadf`
- Superseded v173 PC ZIPs were backed up and hash-verified at `C:/AiderLogBuild/backup-pc-v173-before-v174-20260909` before removal from the current repository.
- This is a website/PC release. APK v169 is unchanged and does not yet read the new dedicated D-day documents.
