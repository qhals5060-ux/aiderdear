# Calendar colors in v198

Native version code198 / name1.9.88 retains the existing package, signing identity, five widget providers and the v197 MAX/whole-pane add corrections.

The shared site/app calendar-colors-v198.js helper resolves calendar identity and manual preference into a final #RRGGBB value. The existing widget publisher supplies that value as scheduleItems[].color. Native rendering does not create a separate calendar palette, alter the data or subscribe to Firebase.

Full month calendar chips keep the exact hue with a translucent background; upcoming/fortnight rows keep the exact solid marker. Combined mini-calendar dots now use the event colors rather than the widget accent. Their existing two-dot footprint is unchanged and prefers two distinct colors when available. When dots cannot fit, a non-today date marker uses the first event color. The native date sheet now uses a light tint and a1dp border in that event color; text stays in the selected widget theme's readable foreground. Existing holiday labels, dates, layout and click targets are unchanged.

Brown regression values: #966B4B (brown), #765545 (cocoa), #A88A68 (mocha), #C2A578 (beige). Native parsing accepts only six-digit hexadecimal colors and keeps the existing deterministic fallback for malformed legacy values.

Run run-color-contract-v198.ps1 with JavaPath, CompilerJar, AndroidJar, JsonJar and a fresh OutputPath. It checks47 pure color/projection assertions,35 production RemoteViews color-binding assertions across five themes and61 retained click/receiver/factory assertions. The recording boundary preserves CharSequence spans and colors for inspection; it does not emulate Android span parceling or inflate a Samsung launcher. The unchanged queue/routine/calendar/model contracts add506 assertions.

[RemoteViews.setTextViewText](https://developer.android.com/reference/android/widget/RemoteViews#setTextViewText(int,java.lang.CharSequence)) accepts the styled CharSequence used by mini markers. [ForegroundColorSpan](https://developer.android.com/reference/android/text/style/ForegroundColorSpan) gives each dot its event hue.

No physical Galaxy Flip or emulator was available. Final APK checks cover source/stage/packaged asset identity, original startup GIF, five providers, private native activities/receiver, signing certificate and new color helper linkage.
