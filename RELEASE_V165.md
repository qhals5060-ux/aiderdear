# v165 · Routine, DayLog, Modern website and native widgets

## Scope and preservation

- The Android Routine and DayLog screens use scoped presentations, the existing data fields, save handlers and calculations. The wheel, Event, authentication, training data and permission flow remain separate.
- The website's Modern edition changes its structure, not its data model. The Editorial edition restores the original live controls and layout. Downloads offer both site editions independently of the APK.
- Native widgets use purpose-specific Android components, not HTML copied into a text label. Existing provider identities and post-install launcher Settings are retained.
- Widget data is read from verified, account-scoped documents. No merged legacy A/P cache is used as a widget data source. A UID or pair change clears the previous snapshot immediately.
- Todo and routine widget changes use row-scoped Firestore transactions, desired states and replay receipts. Offline commands wait in a UID-scoped queue. In-flight local app edits are not overwritten by the UI reconciliation.
- Checkbox/routine-level actions open the app to perform the authenticated write, then refresh related widgets; they are not a native background Firestore client. Language actions open the existing lesson and its completion gate.
- English and Japanese retain all 800 lessons, with identical site/app content (6.70 MB uncompressed). Chinese content is not packaged.

## Local verification

- DayLog: five viewport sizes, four categories, 60% entry/edit sheets, photos and private-media failure handling, book cover containment, workflow steps, finance checks, statistics and Pomodoro state.
- Routine: six viewport sizes, CRUD, MINI/MORE/MAX/SKIP, three independent goal/mandala drafts, 7/30/66-day boundary cases, and parity with the original statistics calculations.
- Shared app regressions: wheel touch/drag page selection, Event forms/layout, first-run permission timing, and profile theme/font choices.
- Widget tests: owner switches, late reads/photos, first-account empty documents, stable view models, transaction retries/concurrency, and row-only UI reconciliation.
- Site checks use isolated local fixtures; no real user's records are created or modified for UI tests.

## Verification limits

Browser viewport and touch-emulation tests are not a physical Samsung launcher test. No Galaxy Flip/Fold was connected for this release. Native compilation, XML/resource checks and APK packaging checks must be distinguished from on-device widget inflation and launcher-specific settings behavior.

## Distribution and repository hygiene

Current downloads are versioned v165 APK, Modern site ZIP and Editorial site ZIP. Only current publication files remain at the repository root. Superseded Modern v163 styles and the unreferenced root `styles.css` are removed after reference checks. Previous release artifacts are retained outside the repository in the local outputs folder; Git history is not rewritten.

Thirty-five unused APK-only assets (495,187 bytes) are excluded and listed with hashes in `android-src/retired-assets-v165.json`. Their local recoverable backup is `C:/AiderLogBuild/retired-assets-v165`. Active animation/art resources and site-side deployment rules are retained.

SDKs, compilers, keystores, build caches, unsigned APKs and screenshot test fixtures are not included in the release repository. See `release-v165.json` for final artifact hashes and byte sizes.
