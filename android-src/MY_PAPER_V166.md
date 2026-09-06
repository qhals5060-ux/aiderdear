# v166 My picker and mobile Paper

## Source and scope

- `assets/my-workspaces-v128.js`: only the My hub markup, real counts, and closing
  a Paper-owned dialog when the hub switches to another tool. The existing email
  checks, preview guard, modes, routes, data bridge and other tool renderers stay.
- `assets/mobile-paper-v159.js`: the active mobile four-tab renderer. It retains
  `aiderlog.mobile.paper.v159`, Paper/concept IDs, data selection, review values,
  capture schema and existing bridge calls. Existing attachment metadata is labeled
  "첨부 정보 있음", not proof that a PDF has been downloaded for offline access.
- `assets/my-paper-v166.css`: authoritative scoped My/Paper presentation using
  `--app-*` and `--app-font-scale`. No wheel selectors or global image filter.
  The old `mobile-paper-v159.css` is fully superseded and can leave the app include
  and package after integration. No website Paper styles belong in the app.

## Preserved functional correspondence

| Visible control | Existing behavior retained |
| --- | --- |
| My tool row | Original `data-my128-open` mode and permission function |
| Today | Last saved Paper ID, otherwise first paper; original note/evidence order |
| Read card | Original Paper ID; original first eight concepts / first 12 claims |
| Save reading position | +20 each click; 100 becomes 0 on next click |
| Review | `again`, `confused`, `understood`, `known`; max 500 responses; next index wraps |
| Concept dialog buttons | Close only; do not save a review response |
| Capture form | `type`, required trimmed `content`, original `paperId` |
| Capture save | Original local queue max 200, `AiderPaperBridge.saveCapture`, same success/failure handling |
| Outbox | Original reverse order, latest eight visible |
| Online event | Original queued retry and removal rules |

The memo form moved into a body-owned native `<dialog>`. Header and footer remain
inside its measured 60% total height; only its input body scrolls. `visualViewport`
resize affects this dialog only. A native dialog top layer blocks the page and
preserves the wheel's geometry, colour, handlers and stacking style. Concept
dialogs are centered, at most 80% tall. Close/Escape and the existing Android
shell Back delegate close this modal; outside it the prior Back handler is used.
Close restores focus without saving. Re-rendering Paper preserves active input,
in-memory scroll and disclosure state without adding a new storage schema.

## Verification

Isolated browser fixtures, with external HTTPS requests blocked; no live account
or Firestore writes. Playwright was used because agent-browser is not installed.

- `tools/my-paper-v166-qa.cjs`: 360×800, 390×844, 412×915, 768×1024,
  844×390; all four tabs, list/detail, two initially open reading sections,
  source locator display, concept close semantics, progress and review,
  capture options/paper link, success, failure queue and online retry.
- Memo total heights: 480, 506.39, 549, 614.39 and 234 CSS px respectively.
  All measure 60% of the available viewport; bottom matches the viewport bottom.
  Measurements are taken after the opening transition finishes.
- Old Paper CSS was removed from these browser sessions: the replacement alone
  passes. Header/title, list and modal colours inherit current palette variables.
- `tools/my-paper-v166-edge-qa.cjs`: real permission expressions yield 8 tools for
  qhals5060, 5 for aidway55 and 4 for ordinary/anonymous users, matching existing
  access behavior. All eight original route buttons can enter their renderers.
- Small/normal/large use .72/.84/1 multipliers supplied by the shared typography
  system; controls retain 44px targets. No horizontal overflow in the four tabs.
- Progress wrap, the 500-response bound, all six capture types, trimmed content,
  linked Paper IDs, cancel/native Back without saving, and dialog cleanup pass.
- Wheel rectangle and background image remain identical before and after flows.
- No JavaScript page errors observed in the five viewport runs.

Screenshots and reports: `C:/AiderLogBuild/qa-v166-my-paper/` (`my-*`, `today-*`,
`read-*`, `detail-*`, `review-*`, `capture-*`, `memo-*`, `concept-*`). These are
browser previews, not photographs or Android emulator captures.

## Pre-existing unconnected elements / device limits

The v159 "논문 찾기" action navigates to the saved list and focuses the first
card; it has no search text input. The four read filters are display-only in the
existing renderer. The design request explicitly forbids inventing new filter
logic, so these limitations are preserved and must not be reported as functioning
search/filter features.

Actual Samsung keyboard, launcher/native Back callbacks, real Firestore network
delivery and process recreation need device/account verification. Local mocked
success/failure checks do not establish real server synchronization completion.
