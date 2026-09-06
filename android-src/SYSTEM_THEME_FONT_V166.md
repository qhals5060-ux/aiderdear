# v166 typography — retained in v167

The colour section below records the superseded v166 design. The final v167
release instead follows `APP_COLOUR_V167.md`: system follows OS light/dark,
and the wheel/header logo are recoloured without geometry or touch changes.
Font remapping and text-measurement fixes described here remain active.

## Scope

App-only. Website styles remain separate. The wheel's DOM, handlers, images,
dimensions, hit targets, colour tokens and animations have not been changed.
Native widgets and their independent font settings also remain unchanged.

The saved `system` theme ID now means the specified Soft Purple app palette.
Its content colours are the same in OS light and dark modes. The five other
existing palette IDs/options remain in place. Only background pseudo-layers tint
the original wallpaper; no content photograph, brain stimulus or wheel image is
globally filtered. Body-content aliases deliberately exclude `#wheel`.

| Token | Default |
| --- | --- |
| Space | #352B48 |
| Surface / editor | #F5F2F8 |
| Input | #FCFAFE |
| Selected control | #E9E1F0 |
| Text / muted text | #302B39 / #665B73 |
| Border | #CEC2DA |
| Primary | #76529B |
| Progress / track | #9A7EB1 / #DFD4E8 |
| Text on space | #FAF7FC |

## Typography

Existing preference IDs and `aiderlogFontSize` storage are preserved:

- small: .72
- normal: .84 (previous small token)
- large: 1 (previous normal token)

`planet-system-v133.js`, `feature-system-v125.js` and `experience-v142.css`
now agree on these values. New My/Paper/training and existing compact profile
markup opt into CSS-owned typography, so the older DOM text scaler does not
overwrite their responsive sizes. Legacy pages measure authored unscaled sizes
only while visible, restore only inline values owned by the scaler, and complete
all reads before writes to avoid compounded inherited sizing. Hidden pages are
measured when entered, not against their pre-layout state. Device breakpoints,
touch targets and card layout do not change merely because font preference changes.

Text targets with `transition: all` or font-size transitions are temporarily
settled during this synchronous read/write pass, then their exact original
transition-property is restored. This fixes the Today button reading an
interpolated previous size and shrinking repeatedly toward the 7px minimum.

Old large-font-only calendar/card layout overrides were removed. Former Language
Shadow DOM presentation injectors skip the marked v166 host, retaining their
existing behavior for any unmarked fallback.

## Verification

`tools/app-type-theme-v166.cjs`: 360×800, 390×844, 412×915, 768×900 and
915×412. Repeated small/normal/large changes, stable computed font sizes,
horizontal overflow, profile persistence, all six palettes, exact Soft Purple
tokens in OS dark mode, and unchanged wheel size/background/filter are checked.
`tools/wheel-test-v163.cjs` replays real browser CDP touch press/drag/release into
Event, Routine and My. This is browser verification, not actual Samsung testing.

Independent comparison against the actual retained v165 APK confirms new large
equals old normal for 30 sampled text elements at 360 and 768px; both resting and
open wheels match. New normal matches old small on token-scaled pages. Older
Home small-font handling was inconsistent; Home now applies the selected scale.
After the transition fix, Today stays 9.68px in normal across repeated passes,
11.52px in large, with its original 0.16s effects restored.

The replaced mobile-paper-v159.css was removed after the My/Paper tests passed
without it. Recoverable local copy: C:/AiderLogBuild/retired-assets-v166/app/.
No user records, learning progress, private attachments or shared Git history
were removed by this cleanup.
