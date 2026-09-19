# AiderLog v189 / Android 1.9.79

Native widgets now retain useful forms even before the user has records. The app header mark is cleaner, Routine and Event receive small website refinements, and the website's unused Editorial alternative is retired. My gains a compact YouTube link library.

## App and widgets

- Retains the five app themes, compact sheets, Fold split view, wheel behavior and existing records.
- Restores missing details across the thirteen approved widget forms, including health measurements, reading/quotes, TODO/MEMO sections and routine progress.
- Empty forms show real blank slots, not invented records, photos or completion counts. Empty actions open the existing entry flow.
- Preserves all 27 Android provider identities so installed widgets remain compatible. The normal picker retains the thirteen approved forms and Consult.
- The header uses a compact rounded tile with a clear circle mark.

## YouTube library in My

- Signed-in users can save YouTube videos/Shorts, classify links as recipe, language or other, add notes, search the complete library and page through results.
- A valid pasted link attempts public metadata and caption retrieval. Available caption text is arranged as sentences with source timestamps. No translation or missing dialogue is invented.
- When public captions are absent or access is blocked, the link still saves. Pasted plain text, SRT or VTT can be arranged locally. Video or audio downloading, paid APIs and authentication/CAPTCHA bypass are not used.
- Link details are held in a separate owner document, `users/{uid}/private/youtube-library-v189`; existing `private/main` and calendar records are unchanged.
- Each request validates Firebase authentication and matches the captured owner with the verified token owner. Revisions and retry receipts prevent stale overwrites, duplicate retries and deleted-record resurrection.
- Storage is bounded to 500 links, 700,000 bytes of JSON and 900,000 bytes of estimated Firestore document size, whichever is reached first. Limits reject the new save without deleting existing data. Only link metadata, notes and text are stored, not media files.

## Website and deployment

- Small, scoped spacing/control/card refinements apply only to Event and Routine.
- Other website screens retain their design. Home comparisons at 384 and 1280 pixels produced no changed pixels.
- Editorial selection/runtime is retired. Old saved preferences resolve to the existing Modern design. Legacy PC download links resolve to one `AiderLog-v189-site-files.zip`.
- The PC ZIP contains public browser source and a shortcut to the live HTTPS site; it is not a local backend or Windows executable.
- Reuses the existing Vercel/Firebase configuration. No new paid service, Firebase rule or calendar backend change is required.

## Verification and limits

- Widget contract tests, JVM assertions and native XML renders cover empty, partial and populated states at narrow, standard and Fold widths.
- Website browser tests cover Event/Routine controls, former edition preferences and unchanged home rendering.
- YouTube tests cover text parsing, upstream response limits, safe URL handling, owner isolation, revision conflicts, retry behavior and both storage size limits. Browser checks cover compact mobile/Fold layouts and form behavior.
- A public YouTube sample returned metadata but blocked caption content during live verification. Automatic caption import is therefore best effort; manual text supplementation remains necessary for some videos.
- Browser and native rendering checks do not replace testing on physical Samsung launchers and WebViews. Existing Android signing identity and widget components are preserved.

Release binaries are excluded from Git and Vercel source uploads. Verified artifacts:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| AiderLog-v189.apk | 48,150,528 | `1e4891df655dc44eda6ee1582a802126b65432f0bb785fe8e9ec1b63dd86c1ac` |
| AiderLog-v189-site-files.zip | 1,394,482 | `542bb7cc41a2e58014cac58b7785f6bc73f3be232d9d53809da75fe59b1213e5` |
