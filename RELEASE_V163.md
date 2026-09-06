# AiderLog v163 — Modern layout / Android local files

## Scope

Modern is a site-only layout edition. Existing controls, routes, storage keys,
authentication gates, API calls, calculation rules and data formats are preserved.
The main toolbar is moved (not cloned), and existing page-navigation controls
receive descriptive labels. Paper and Language keep their existing shadow-DOM
components with separate Modern styles. The Android page design is not switched
to Modern. The closed wheel position and the new attachment viewer are app-only.

## Function-preservation map

| Function | Original path / action | Modern path / action | Verification |
| --- | --- | --- | --- |
| Calendar, months, Today | Schedule, arrow / Today buttons | Same buttons; wide calendar with compact side column | 5 viewport sizes, month back/forward passed |
| Emotion insights | Schedule bottom page dots | Schedule top “감정 인사이트” | Open / return passed |
| Schedule and emotion creation | Existing calendar dates and add buttons | Same handlers; mobile actions on a separate row | Controls present; authenticated save not tested |
| Routine, Language | Routine bottom page dots | Top “루틴 / 어학” | Same control IDs and handlers; shadow style isolated |
| Record, Album, Archive, Travel | Event two page groups | Top named groups; feed / collection layout | Same forms, filters, sort controls and data |
| Health, Reading, Workflow, Finance | Personal category buttons | Named category tabs + compact Pomodoro | Same forms and computation code |
| Paper | Paper shadow workspace, import, reading, concepts, ideas, design | Same workspace with Modern sidebar / reading panels | Isolated visual fixture; 13 px navigation verified; authenticated writes not tested |
| Consult | Client journey, admission analysis, files, PDF | Same original journey tabs / forms | Business script unchanged |
| Work / lab notebooks | Work tabs, records and researcher links | Same tabs with matching dashboard cards | Business script unchanged |
| Account / memo / mail / search | Top tools | Header right-hand toolbar | Existing elements moved, not recreated; login opens |
| Site edition download | Personal page → Apps | Modern / Editorial selector | Two distinct ZIP URLs retained |
| Android attachment selection | Existing file inputs | System Open Document picker | Document MIME conversion, multiple selection, cancellation callback checked |
| Android generated exports | Blob/data anchors and file viewer | System Save As destination | UTF-8 byte equality, chunking, immediate URL revoke, data URI and failure cleanup passed with mocked native boundary |
| Android response downloads | DownloadListener | Filename/MIME-preserving DownloadManager | Native helper compiled; no connected-device download test |
| Wheel | Existing long-press/drag controller | Same controller; closed art shows the ring | Native touch event simulation: Event / Routine / My routes passed |

## Verified / not verified

- Local Chrome: 1920×1080, 1440×900, 1366×768, 390×844 and 360×800.
  No uncaught page errors or document-level horizontal overflow in the tested public flow.
- Page composition, unchanged IDs and business code reviewed. Signed APK rebuilt;
  zip alignment and v2/v3 signatures verified, same certificate as v162.
- Android system picker, storage providers, Samsung-specific device behavior and
  authenticated cloud CRUD/sync require an actual signed-in device/account test.
  Browser bridge mocks are **not** claimed as native end-to-end verification.

## Cleanup

- Replaced v162 Modern CSS/JS; no longer loaded copies removed.
- Replaced v162 APK and Modern ZIP in current Git tree, retained externally in outputs.
- Removed the byte-for-byte-equivalent Study JSON from APK assets (3,809,863 bytes
  uncompressed). Active JS curriculum retained. Its service-worker entry removed.
- Editorial v161 ZIP retained by request. Existing older-named scripts still used
  by current features retained. Git history was not rewritten.
- Build tools, signing material and caches excluded; each current distributable
  must remain below GitHub's 100 MB single-file threshold.
