# v170 — website navigation hotfix

Scope: website only. Android remains v169; no APK, Android source, Firebase rules,
authentication, record schema, or stored user data changes.

## Fixed

- Modern header layout no longer removes and reinserts every subpage menu on
  each layout frame. It places the groups in stable reverse-anchor order.
  This removes the MutationObserver → requestAnimationFrame feedback loop and
  keeps a pressed button connected until release.
- Editorial restoration is idempotent. A move whose reference is itself is a
  no-op, preserving the original elements and their existing click listeners.
- This Month lists only today/future events in the selected month, including
  ongoing date ranges. Local calendar dates are used, not UTC day boundaries.
  Historic calendar cells and records remain unchanged; no records are deleted.
- Website shell cache and PC Modern/Editorial downloads advance to v170.
  Existing v169 PC download URLs redirect to v170. APK downloads remain v169.

## Verification

- Agenda regression tests: 11/11 (past/today/future, ongoing ranges, past/future
  months, midnight, Seoul/Los Angeles, immutable source data).
- Layout stability tests: 7/7. Negative control against Git 3134bde performs
  500 menu reattachments per 100 refreshes; v170 performs zero.
- Previous navigation/cache checks: 11/11; typography checks: 9/9.
- Browser, isolated local fixture: Modern PC calendar/insights 12 alternating
  clicks, Personal overview, Routine/language, Consult/admissions, Event
  Archive/Travel, mobile 390px selector and Editorial navigation all pass.
- Live-layout observer: v169 accumulates thousands of idle menu reattachments;
  v170 stays at zero. Actual edition switches move menus once each, then settle.
- No browser console errors in the fixture. User's physical Chrome mouse timing
  is not directly controllable here; this is not a physical-device certification.
- PC ZIPs contain 78 browser source files each, with source-content hashes and
  archive/reference checks. No API credentials or APKs are bundled inside them.

## Technical reference

Reparenting an element between down/up can suppress a native click even when its
final visual position is unchanged. This is distinct from a programmatic click:
[W3C UI Events issue discussion](https://lists.w3.org/Archives/Public/public-webapps-github/2022Sep/0598.html).

## Recovery

Previous code remains in Git at 3134bde. Retired v169 PC ZIPs are kept outside the
deployment directory under C:/AiderLogBuild/v170-retired-public. Data rollback is
unnecessary because this release does not migrate or delete records.
