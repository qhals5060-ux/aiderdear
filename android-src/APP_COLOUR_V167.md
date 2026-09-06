# v167 app-only colour mapping

Scope: colour declarations in `assets/app-theme-v164.css` and six swatch values plus the existing OS refresh callback in `assets/feature-system-v125.js`. No new theme key, DOM, listener, observer, route, wheel controller, geometry or font logic.

The existing `aiderlogTheme` and `aiderlog-background-mode-v143` selections remain independent. Legacy IDs keep their stored values and resolve to the same canonical palette for content, wheel and logo. The six choices remain unchanged; system-dark is media-query-only.

The earlier app colour layer takes precedence over old unlayered colour patches. The profile layout/type block remains byte-equivalent to v166. The actual wheel PNG gets a colour-only filter; its already tinted mask deliberately does not receive a second hue rotation. Existing pressed/open brightness and saturation, alpha, masks, shadows, transform, timing, hit areas, and navigation are unchanged. Body/app and user media receive no filter. The wallpaper-only layer preserves the same image and crop with luminosity tint and the required 68%→40% space overlay.

| palette | canvas | space-base | space-glow | surface | card | control | text | body | text-muted | border | control-border | primary | on-primary | active-on-space | focus | rating |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| system | #EEEAF4 | #231E35 | #76618F | #FBF9FD | #F7F3FB | #E4DCEB | #2D2538 | #3E3549 | #62566E | #C1B4CC | #847294 | #6E4A8E | #FFFFFF | #E2D0F5 | #6E4A8E | #795715 |
| terracotta | #F5ECE7 | #30211D | #966E5D | #FFFAF6 | #F9EDE5 | #F0DCD0 | #372822 | #49362E | #73574B | #D5B9AA | #9B7866 | #99472F | #FFFFFF | #F6C5AE | #99472F | #7D571F |
| apricot | #F7EFE5 | #33281E | #9E7D5B | #FFFCF7 | #FAF0E3 | #F6E0C5 | #362A1F | #483829 | #735C42 | #D9C3A7 | #967755 | #E8A168 | #322317 | #FFDBB6 | #835028 | #81551B |
| peach | #F5EEE9 | #2F2524 | #9F8073 | #FFFBF8 | #F9ECE3 | #F3E0D2 | #372C28 | #4B3C34 | #745F52 | #D5BDAE | #947663 | #F0CEB4 | #493021 | #F9DECC | #835E45 | #7D5923 |
| slate | #EAF0F3 | #1F2B33 | #5A8194 | #F9FCFD | #EDF4F7 | #D9E6ED | #23333E | #374B57 | #536B79 | #B5C8D2 | #668291 | #416579 | #FFFFFF | #C9E7F5 | #416579 | #7B5B20 |
| charcoal | #ECEFF0 | #1C252B | #536872 | #FCFDFD | #F1F4F5 | #DBE2E5 | #242E35 | #394952 | #596A74 | #BBC7CD | #6D818D | #2D3E48 | #FFFFFF | #E2EDF2 | #2D3E48 | #76571D |
| system-dark | #292433 | #1D1928 | #695584 | #332C3F | #3D344A | #463B54 | #F7F1FC | #EBE2F3 | #CABED7 | #6B5B7C | #A08DB3 | #C4A6DF | #281E33 | #E2CDF6 | #E2CDF6 | #EDCB83 |

Derived roles: input/editor=surface (system-dark input=#282232); editor-head=card; editor-foot=control. On-canvas tabs use focus/body; on-space tabs use onSpace/#E6E0EA and page titles #FCF9FF. The existing logo gradient stays 145deg, primary→sRGB(primary92%+text8%), symbol=onPrimary. Apricot/peach primary borders use focus.

QA scripts are in the workspace tools folder, not the shipped app. Captures/reports are outside Git/APK at C:/AiderLogBuild/qa-v167-colour/.

- app-colour-static-v167-qa.cjs: profile layout/font block unchanged; bounded colour-only JS diff; no added listeners/storage/font logic.
- app-colour-v167-qa.cjs: 14 actual Chromium combinations (390×844), all 5 non-system palettes invariant under OS dark, Home/Archive/profile/exact60%editor/open-wheel coordinate/font/opacity/transition comparison against retained v166 CSS/JS.
- app-colour-state-v167-qa.cjs: existing UI persistence through navigation/reload, live OS change while profile open, six swatches, legacy aurora ID preserved, live open-wheel theme changes without DOM replacement, all four actual wheel menu routes, and My/Paper/Routine/Daylog/Work/Consult/Shadow-DOM screens.

Only isolated local browser fixtures are used. No real account, cloud record, original media, or server authentication is changed by these tests. Browser results are not a Samsung launcher/WebView or physical-device test. Root release integration owns training component colour adapters and native build/signing verification.
