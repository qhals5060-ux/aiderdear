# v169 installed-app colour correction

The seven v167 palette definitions are retained exactly; no font, geometry, wheel hitbox, route, photograph, or layout redesign is made by this change.

## Cause and correction

- The Activity uses a fixed Material theme. Android WebView's `prefers-color-scheme` follows the Activity's `isLightTheme`, not necessarily the current phone setting. The existing native JavaScript bridge now reads `Resources.Configuration.uiMode` and exposes `getSystemScheme()`.
- Startup, resume and `onConfigurationChanged` refresh one derived `data-system-scheme` attribute. No additional saved preference is created. Explicit `system` dark colours no longer depend on a potentially mismatched WebView media query; the other five palettes keep their light reading surfaces.
- API 29+ WebView automatic `Force Dark` is disabled so it cannot invert the authored colours or user media. Older API devices remain guarded.
- Early HTML startup previously rejected every new palette ID and briefly replaced the saved selection with `system`. It now accepts the current six IDs and every already-supported legacy alias, before deferred scripts execute.
- Header colour updates now use the actual app canvas/space palette rather than retired `--cosmos-base` values. Existing observers are reused, with idempotent attribute updates to avoid observer loops.
- DayLog's actual nested `.personal-title .page-title` receives the canvas/space text role; it previously remained pale on a light background. Existing decorative constellation and planet aliases receive the selected palette.

## Verification

- 50 isolated JavaScript/native-smali/widget contract tests passed: canonical and legacy startup IDs, both native schemes, independent background/font selection, idempotent repeated resume, Shadow DOM refresh on scheme change, widget contrast and honest recovery status.
- CUA browser verification of the actual bundled HTML: 14 theme/background combinations at 390×844, exact palette tokens, readable primary button foregrounds, header logo and wheel colour changes, and no whole-app/body filter.
- Additional actual browser views: Archive, Archive editor, Routine, DayLog, My and Language Shadow DOM. The late-rendered Language course uses charcoal surface and primary button colours correctly.
- DayLog's first screenshot exposed its pale title on the light canvas. After the targeted selector fix, a final CUA DOM check confirmed the title `rgb(35, 51, 62)`, matching the slate `#23333E` role. The earlier screenshot/report records the finding, not the final title colour.
- Reports and screenshots: `C:/AiderLogBuild/qa-app-theme-v169/` (outside the APK and Git payload).
- Native source/smali validation is not a claim of a physical Galaxy or actual installed-WebView test. APK assembly/signature verification belongs to the release step; a device is still unavailable.

Reference: https://developer.android.com/develop/ui/views/layout/webapps/dark-theme

## Bounded native widget review

Midnight agenda time now uses the same light foreground as its dark card; selected date, add button and routine stage labels instead use dark ink because their individual surfaces stay pale. Tested text/surface contrasts exceed 4.5:1. This changes colours only, not widget dimensions or saved appearance settings. A genuine native update clears its previous error marker; the explicit recovery widget returns failure rather than being recorded as a successful designed render. The collection pending-intent template already uses `FLAG_MUTABLE` on Android 12+ and was not changed.
