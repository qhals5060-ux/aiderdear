# DayLog v165 presentation

The active application loads `daylog-ui-v165.js/css` after the existing DayLog
render chain and v164 theme. The website PERSONAL view does not load these files.

## Preserved paths

- `healthHTML` (including the v127 challenge/InBody wrapper): same date selection,
  record order, recent record limits, exercise/set/volume calculations and buttons.
  Existing history nodes are moved below exercise records, not copied.
- `readingHTMLV113`: same selected book, six-record shelf, three quotes and real
  progress/count formulas. Empty-account demonstration books and fallback numbers
  are no longer presented as user records.
- `workflowHTML` / v127 delegated handlers: same step IDs, completion map, state
  changes and existing editor. Existing editor form is moved into a scrolling body.
- `financeHTML`, `financeCheckKey`, `data-fcheck`: same totals, type groups, display
  limits and payment checks.
- `itemPhoto` / `hydratePersonalMedia`: same localImage and authenticated file-ID
  loading path. File IDs are never used as public image URLs. Only placeholders,
  alt text and presentation are changed. Photos are never uploaded by rendering.
- Existing personal form IDs, input constraints, upload/save/delete handlers remain.
- Existing single v127 tool popup and v113 statistics/Pomodoro engines remain.

## Layout

Four accessible tabs, a single body scroll, small challenge/InBody controls, actual
meal thumbnails, contain-fit book covers, vertical workflow cards, readable amounts.
Entry/edit sheets measure 60% of the visual viewport including header/footer. The
input body alone scrolls. Statistics and focus use central dialogs with at most 80%
height; dialog opening does not restart the timer. Shared app tokens preserve themes.
The v142 typography engine skips opt-in `data-css-typography` surfaces so hidden old
form font sizes are not frozen into new controls. Wheel code/layout is untouched.

## Local verification

Passed 360×800, 390×844, 412×915, 768×900 and 915×412 browser fixtures:
four category tabs, thumbnails, no horizontal overflow, form create/save, measured
60% sheets, no forced keyboard, workflow step and payment check, challenge/InBody
entry, statistics period, focus start/reset/reopen continuity and wheel geometry.

Additional tests: all six palettes and three font settings; private-media mock and
failure placeholder; contain-fit cover; workflow edit; empty account without demo
data; reduced visual viewport (keyboard-space simulation) and reachable save button.

Fixture images are simple test graphics, never installed as user records. This is
not a claim of real authenticated cloud sync, Samsung device or physical keyboard QA.
