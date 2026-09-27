# Native widgets in v194

Package `com.aiderlog.v22app`, version code 194 / version name 1.9.84. The original signing certificate and surviving provider component names are preserved.

The launcher registers seven widgets: CalendarMonth, CalendarCombined, CalendarSplit, CalendarFortnight, RoutineAll, RoutineCards and RoutineStats. CalendarAgenda (일정과 투두) is retired; its schedule list is now below CalendarFortnight's two-week calendar. CalendarSplit keeps its month calendar with TODO and MEMO columns below. Both lower collections scroll independently. Legacy native pin requests for Agenda select Fortnight. Stored selections, themes, fonts, opacity and navigation preferences for surviving IDs remain valid.

MEMO projects current `private/main.memos` and legacy memo checklists from the already verified account snapshot. Rows are sorted by update time, deduplicated by source and ID, and capped at 40, with 180-character titles and 240-character previews. Source-qualified stable row IDs distinguish equal IDs from the two stores. A tap opens the existing notebook editor, preserving source and ID; it does not mutate data. No Firebase subscription or collection was added. The adapter checks current UID before opening and again after notebook refresh. Native collections reject stale or empty owners.

Routine uses a single title/progress row and four fixed-height MINI/MORE/MAX/SKIP actions. Single-routine selection and existing level timestamps are preserved. Stats uses text and a progress bar with seven daily counts; theme-specific progress resources match the selected palette. Configuration previews only add complete rows that fit the available height and selected font size. Installed ListViews retain scrolling.

## Reproducible source overlay

Compile editable production `widgets/*.java` (excluding contract tests) with the existing Android 35 stub and JSON library using ECJ, then D8 with min API 26. Overlay `widgets/smali` into the baseline package path and `widgets/res` into decoded `res`. In the baseline `MainActivity$NativeBridge.smali`, replace the CalendarAgenda pin component string with CalendarFortnight. The archived general bridge source predates the verified v192 APK; preserve the baseline implementation rather than replacing the whole bridge with that archived file. Use the verified v193/v192 native baseline, preserve resource IDs, remove CalendarAgenda provider/picker XML, PNG and class, and remove their retired entries from `res/values/public.xml`. App assets are integrated separately and must match the release archive byte for byte.

Build via Apktool through an ASCII-only Windows path, with `--no-crunch` to preserve the picker PNGs. Use the original existing signing key explicitly; do not commit keys, build tools, classes, APKs or helper archives. Certificate SHA-256: `1e08a903aef9c3a721510b64ec764d01d3d094eb954161b62544ea8f187b5953`.

## Checks and visual evidence

`test-widget-core-v194.cjs` builds an actual projection fixture; `WidgetCoreContractV194.java` consumes it for native row, owner, selection, stable-ID and preview-size contracts. `test-widget-routing-v194.cjs` tests mutation compatibility, retired commands, memo editor source/ID, and account switches. `test-widget-resources-v194.cjs` walks active resources and checks API-26-compatible RemoteViews classes plus collection/action/theme IDs. Existing `WidgetNativeContractTest.java` keeps the retained legacy model assertions. The app UI browser suite additionally exercises the production shell → widget adapter → notebook editor route.

Picker artwork is produced by filling the actual shipped XML with fixture values corresponding to native RemoteViews bindings. `render-picker-xml-v176.cjs` rasterizes these fixtures with the installed local dependencies. These are deterministic XML-derived examples, **not Android launcher screenshots**. Desktop compilation/contracts cannot prove device-specific widget inflation, launcher resizing or touch behavior; no emulator or physical-device run was available.
