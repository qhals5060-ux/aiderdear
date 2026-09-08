# Site typography v169

This change is presentation-only and is not included in Android assets. It applies to both website editions without replacing their colours, artwork or page composition.

## Scale

Reference: `site-work-v167.css`. Body text 14 px, controls 13 px, metadata 12 px, section headings 16 px, subheadings 14 px, page headings and key figures 20 px. The calendar month remains a deliberately prominent 24 px. Compact calendar actions are 12 px; the brand and graphical icon glyphs retain their original treatment.

Equivalent roles now use that scale across Schedule, Routine, Event, Personal, Paper, Consult, Work, Language and form dialogs. Selected buttons do not receive a different font size. Mobile web uses responsive layout rather than reducing ordinary body text. This change does not adjust app font preferences or Android themes.

## Installation

Load `site-typography-v169.css?v=169` and then `site-typography-v169.js?v=169` after the current website styles/scripts near the end of `index.html`. Include both in the website downloadable ZIPs and browser cache manifest. Do not copy them into the app.

Paper and Language use Shadow DOM. The presentation adapter mounts the same stylesheet in those two roots and restores it after component re-renders. It does not move the link repeatedly to the end: the existing Modern adapter owns that position. This avoids competing MutationObserver update loops. No storage or API is accessed.

## Verification

- CUA browser interactions used a local read-only fixture at `127.0.0.1:8782`; production Firebase and external connections were blocked. Work list/context responses were local fixtures; all API writes were rejected.
- At 1280 px, the original Event media counts measured 5.5 px; Paper badges 8 px and selected figures 27 px; Personal support text 10–10.5 px; Routine metadata 11 px. The corresponding content now uses the role scale above.
- All seven top-level tabs were opened through real browser clicks. Paper and Language were checked inside their actual Shadow DOMs. Paper table labels and badges are 12 px, navigation and toolbar actions 13 px, page heading 20 px. Toolbar buttons wrap as whole controls instead of splitting their labels into individual characters.
- At 390 px, Schedule, Routine, Event, Personal, Paper and Work had no document horizontal overflow. Consult retains its deliberately horizontally scrollable internal navigation strip; off-screen menu entries remain available by scrolling.
- At 1440 px, the customer dialog had bounds 60–1380 px, no internal horizontal overflow, 12 px question labels and 13 px inputs.
- Final 1440 px sweep: all seven top-level views had no document horizontal overflow and no visible non-zero text below 12 px (decorative pseudo-elements and logo glyphs are not body text). Editorial's 38 px brand was unchanged; its agenda line box was corrected from 13 px to 21 px so the new 14 px text is not vertically clipped.
- Screenshot evidence and DOM font reports: `C:/AiderLogBuild/qa-site-typography-v169/`.
- Regression test: `node tests/site-typography-v169.test.cjs` covers reference tokens, Android isolation, idempotence, style ordering, re-renders and no data/API side effects.

The screenshots are website browser captures, not Android or physical Galaxy captures. No production record was changed by these checks.
