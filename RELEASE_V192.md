# AiderLog v192 · National R&D administration

CONSULT now includes Bio Administration immediately below Admissions. Shared app/site screens manage national R&D agreements, government/own-cash/in-kind budgets, funding receipts, spending, unpaid amounts, evidence and settlement status. General business costs can be entered without a project. Existing Consult customers can be linked to manually configured programs, purchases, receipts, refunds and payouts. Tax amounts are entered manually, without assumed statutory rates or filing functionality.

WORK entry points, scripts and caches are removed from the site and app. The separate site investment template is retired; Personal finance and workflow remain. Old WORK/investment API requests return 410 before authentication or Firestore access. Historical stored records are not deleted.

The new owner-scoped server document uses the existing account gate, revision checks, retry IDs and lossless quarterly archive codec. Reads happen on demand; successful writes return state without another read. No background polling or Firestore rules expansion was added. Conflicting drafts remain available for explicit reconciliation.

## Validation

- 127 domain, client, retirement, retention, quota, calendar and app-workspace regression tests; 22 existing Consult checks passed.
- Browser functional checks cover project/budget/expenditure, settlements, programs/purchases/receipts/refunds, retry recovery, field/budget conflicts, common costs, CSV filters and account isolation.
- Actual site at 1280/768 px and app at 384/768 px: no overflow, missing assets or script errors. Editing/navigation cause no additional administration reads. Five app themes and compact dialogs checked.
- Existing preview navigation, four sizes, five themes and 130 filled/empty widget images checked.
- APK v192 / 1.9.82: existing signing certificate, alignment, compiled manifest, 225 bundled asset comparisons, 58 widget resources, 27 picker images and 388 offline cache entries verified.

## Artifacts

- APK: 48,201,535 bytes, SHA-256 `ba54dc8da70cfec42d04ab702000a4bc4f368e0daa21a343d77c59fb5f90c75b`.
- Site ZIP: 1,379,413 bytes, SHA-256 `b3e451bc3ffa55d533b1d04b78461d6e062f41322b2762635d9a48528ad1fbcb`.

Release artifacts are hosted in GitHub Releases rather than Git history/Vercel. Keep the v191 APK as the immediate rollback after verifying v192 production. Firebase remains on the existing free configuration.
