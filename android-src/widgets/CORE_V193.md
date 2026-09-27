# Native widget scope in v193

The installable app keeps package `com.aiderlog.v22app`, version code 193 and version name 1.9.83. Schedule, Routine, Event and Paper are the four app destinations. Finance and Workflow open within Schedule.

The launcher registers exactly eight widgets: CalendarMonth, CalendarCombined, CalendarSplit, CalendarFortnight, CalendarAgenda, RoutineAll, RoutineCards and RoutineStats. Existing names and per-widget selections remain compatible for those providers. All Personal and Task provider classes, manifest entries, provider XML and picker assets have been removed.

`WidgetProvider.supports` is the native allowlist. Update, navigation, rendering and collection entrypoints reject retired kinds. Secondary calendar lists retain their `@todos` suffix internally; `WidgetDesignV165.action` strips that suffix before sending a command. The app adapter independently validates the same eight names, checks the signed-in UID and accepts only routine/todo operations. Retired queued commands are kept locally under `:retired-v193` and never sent to Firebase.

## Source and packaging

The widget Java files are the editable sources. `widgets/smali` contains their Android assembly source, plus unchanged configuration classes. `widgets/res` contains resource overlays. The root manifest and apktool metadata carry the release identity. `android-src/assets` is integrated separately from the app web source. Signing keys, compiled Java classes, DEX helper archives and APK build outputs must remain outside this repository.

The attached v192 APK was verified as the native baseline. Its DEX matches the previous v192 build. Use that verified baseline when creating a decoded staging directory, overlay this source and its resources, and remove the retired resources listed by the v193 manifest scope. Deleted resource declarations also need removal from a decoded baseline's `res/values/public.xml`. Keep stable IDs for surviving resources.

Use the existing Java/ECJ → D8 → Apktool workflow for native compilation. Build APK resources through an ASCII-only workspace path on Windows and use Apktool `--no-crunch` to preserve picker images. The original signing certificate's SHA-256 is `1e08a903aef9c3a721510b64ec764d01d3d094eb954161b62544ea8f187b5953`. Explicitly select the matching existing key: a user's current Android debug keystore may differ. Verify the compiled manifest, all packaged assets, ZIP alignment and certificate before distributing an update.

## Verification

`test-widget-core-v193.cjs` builds a fixture from the actual app widget projection; pass an output fixture path as its first argument. Compile `WidgetCoreContractV193.java` together with the widget Java classes, then run it with that fixture path. The 64 assertions cover retained and retired providers, stored RoutineCards selection, routine completion statistics, calendar todos, multi-day/upcoming events and account isolation.

`test-widget-routing-v193.cjs` runs the app adapter with local stubs and no network. It checks retained mutations, retired pending-intent and queue rejection, UID validation and selected-date calendar links. The original pure-model `WidgetNativeContractTest` remains available with the retired workflow expectation updated.

These are desktop contract tests and compiled APK checks. They do not substitute for installation, RemoteViews inflation or launcher behavior on a physical Android device.
