# AiderLog v162 design preservation record

## Scope

The v162 modern layer changes only the public website presentation. It does not change the Android WebView presentation, persisted record shapes, authentication, permissions, routing, calculations, CRUD handlers, Firebase paths, or cross-device synchronization.

The Android guard is added before the site-only stylesheet. When `window.AiderLogNative` is present, the document receives `aiderlog-android`; every modern selector excludes that class.

## Preserved functional areas

- Schedule calendar, event creation/editing, holiday and shared-record display
- Routine tracking, language learning, review queues and completion history
- Event Record, Archive and Travel flows
- Daylog/Personal forms and statistics
- Paper, Consult and Work account restrictions, storage and synchronization
- Private Universe navigation and account controls
- Firebase authentication, Firestore rules and Google integrations
- Existing data migration and local-storage compatibility paths

## Website visual layer

- `site-modern-v162.css`: scoped presentation-only overrides
- `site-modern-v162.js`: download-edition selector only
- `widget-sync-v162.js`: no-op on normal browsers; sends an existing-data snapshot only when the native bridge exposes `syncWidgets`

## Download editions

- Modern: current website with the v162 visual layer
- Editorial: preserved v161 website source ZIP

## Release checks

- JavaScript syntax checked for all three v162 scripts and the service worker
- Vercel configuration parsed successfully
- Narrow mobile viewport inspected for logo visibility, tab wrapping, calendar fit and horizontal overflow
- APK rebuilt, aligned and verified with Android signature schemes v2/v3
- All release artifacts checked below GitHub's 100MB per-file limit
