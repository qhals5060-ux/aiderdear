# Native widget corrections in v197

Version code 197 / name 1.9.87 retains the same package, signing identity, five provider component names and v196 storage/bridge contracts.

Routine controls always display MINI / MORE / MAX / SKIP. MAX retains its selected background and toggles MAX to blank on a second press. A local action changes the durable owner-bound outbox, routine row, daily count and aggregate weekly chart before the next app launch. Cloud synchronization still occurs when the app runs. Existing owner, revision and goal-linked guards remain enforced.

API 31+ now sends up to 40 RoutineAll rows as inline RemoteCollectionItems, as calendars already did. Larger lists, older devices and an unavailable inline API fall back to RemoteViewsService. The service URI includes a v197 marker and SHA-256 of the full rendered row content, including owner, date and revision. Factory callbacks share one lock and refresh their rows from the current snapshot even when the host has not delivered onDataSetChanged. The receiver explicitly refreshes the clicked widget after both success and a rejected stale action.

A reproducible old service state was a same-owner snapshot changing revision while the existing factory still held old rows. The previous getViewAt rendered those stale actions until a dataset notification arrived. The regression checks preserve rejection of an already-delivered stale action and then accept its freshly rebound replacement. This establishes a stale-data failure path; it does not establish that it was the only cause on the user's Galaxy Flip.

Calendar TODO/MEMO header, empty area and row body open the native quick-add form directly. TODO checkbox fill-ins go to the same native Activity template, consume the completion command, and finish before creating a form. No broadcast-to-Activity trampoline or MainActivity is used. The direct template has no action/date extra that could overwrite a child operation. Calendar geometry and scrollable long lists are preserved.

## Validation

`run-transport-contract-v197.ps1` takes JavaPath, CompilerJar, AndroidJar, JsonJar and a fresh OutputPath. It compiles production Java against the supplied Android SDK, then runs it against the small recording boundaries in transport-v197. The 61 assertions cover production rendering and action payloads, Intent extras precedence, receiver dispatch, durable outbox, selected MAX appearance, immediate header/chart refresh, stale revisions, factory reuse, API 30 / API 31 inline fallback, large lists, 220/360 size variants, owner changes and calendar row-body versus checkbox routing. Its Android Intent.fillIn boundary follows the AOSP rule that existing base extras win over incoming extras.

Sources: [Android collection widgets](https://developer.android.com/develop/ui/views/appwidgets/collections), [Intent.fillIn](https://developer.android.com/reference/android/content/Intent#fillIn(android.content.Intent,int)), [AOSP RemoteViewsService](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/widget/RemoteViewsService.java).

These are production-code JVM contracts with recorded Android API calls. They do not inflate RemoteViews in One UI Home and do not substitute for a Galaxy Flip device test. No emulator or connected device was available. The recording classes are test-only and excluded from the production compiler input and APK.
