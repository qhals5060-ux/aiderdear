# v167 verification

Portable pure tests (Node 20+, no network/user account):

```sh
node verification/consult-model.test.cjs
node verification/consult-sync.test.mjs
node --test android-src/widgets/widget-transaction-test-v165.cjs
```

The widget source-parity test expects the decoded Android folder beside this
repository, as documented in android-src/README.md. Other assertions use a local
optimistic transaction harness, not production Firebase.

The separate `AiderLog-v167-QA.zip` output contains the emulator/browser runners
and machine-readable reports. Those runners explicitly use local Windows runtime
paths and `demo-*` emulator projects; adjust only those dependency paths before
reuse. Never replace emulator project IDs with the production Firebase project.
Authentication/token issuance is a test double in browser/emulator integration;
actual Rules and Admin/client Firestore operations are tested separately together.

`WORK_V167_OPERATIONS.md` lists the remaining live authentication and release gates.
No test scripts, fixtures or screenshots are deployed by Vercel.
