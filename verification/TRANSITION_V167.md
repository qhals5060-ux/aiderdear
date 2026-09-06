# v167 temporary Rules bridge

The new client reads its own `workIdentities/{uid}` before profile bootstrap.
The previously published v165 Rules deny that lookup. Conversely, publishing
the final v167 Rules first blocks Consult writes from still-installed v165 apps.

`transition-rules-v167.mjs` makes a single insertion into an exact, hash-pinned
copy of the currently published Rules. It preserves every byte outside the
original simple `signedIn()` function. The insertion adds employee exclusion to
that function, self-only identity `get`, and explicit direct-client denials for
the new Work collections. It does not change legacy Consult write conditions.

This bridge is **not the final immutable Consult protection**. Do not issue
employee invitations or treat it as completion of the operating transition.
Publish final v167 Rules after the new API, web, compatible Android APK and PC
downloads are ready and authenticated checks pass. Existing installed clients
must update before writing Consult after that final switch.

## Verified source

- The full published editor matched `git show f3d9cba:firestore.rules`, normalized LF.
- Length: 29,784 characters; FNV-1a64: `5209f47e19fc3ec9`.
- Source SHA-256: `cd4e061cafc13d7869a3a7ef3b83ff2a8416d37c95510710abae97734e9934ae`.
- Bridge SHA-256: `0522592a912df4402c3642515f5f4c185b85d0f3c8e4d99470c9491bdd51d222`.
- Local backups/candidate/report are in the parent workspace `outputs` directory.

Six fail-closed generator tests and 13 actual Rules checks passed in the local
`demo-aiderlog-rollout-transition167` Firestore emulator at `127.0.0.1:8897`.
Checks include missing self-identity bootstrap, other-user/anonymous/list denial,
employee general-data exclusion, old Consult full-save compatibility, owner
isolation, and direct Work/draft/invitation write denials. No production data,
service-account credentials, or live Rules writes were used in these tests.

## Non-mutating runtime readiness

The existing Calendar `health` action only reports configuration-name presence;
`ok: true` there does not prove Firestore access or a valid Admin credential.

After deploying the new API, a same-origin authenticated `POST /api/work` with
`{"action":"identity"}` verifies a genuine Firebase ID token (including revocation)
and reads only that authenticated user's Work identity marker. For an ordinary
owner, success with `employee: false` verifies the Admin read without creating a
workspace or loading Work/Consult records. Display only success/error status;
never log the bearer token, credential, returned workspace ID, or user records.
An authenticated `context` returning the expected uninitialized-workspace 403 is
not a credential failure, but `identity` gives a clearer readiness result.

Public app origin must be exactly `https://aiderdear1.vercel.app`. Firebase token
issuer/audience and Admin project must correspond to `aiderdear-1bbca`, not a
different Google Cloud console project. Existing Calendar OAuth settings do not
need changes for Work/Consult rollout.
