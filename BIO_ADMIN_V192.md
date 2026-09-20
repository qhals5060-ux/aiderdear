# Consult · 바이오 행정 v192

The shared domain is `AiderBioAdminDomainV192` in `bio-admin-domain-v192.js`.
The UI and API use the same integer KRW validation and summary arithmetic.
There are no prefilled consulting programs, prices, tax rates or project budgets.

## Storage and access

- `POST /api/bio-admin` verifies a Firebase token with revocation checking. The existing Consult verified-email owner allowlist and employee-identity exclusion apply.
- `expectedOwnerKey` must equal the verified token UID. No request selects another owner or workspace.
- One server-only document: `users/{uid}/bioAdmin/main`. Existing Firestore rules give clients no direct read or write access to this collection. No permission rule was expanded.
- Opening/refreshing reads the identity marker and this document. Mutations use a transaction over those two documents and write only the administration document. Saving an order additionally reads the existing private main document to validate the selected customer.
- There is no listener, automatic refresh, scheduled task, auto-expiry, background polling or external paid service. A save returns the latest state so no follow-up read is necessary.
- State is revision-protected. Recent request fingerprints prevent response-loss retries from repeating a change. A retry beyond the 32-request replay window fails revision checking instead of inserting duplicate rows.
- Explicit confirmed deletion keeps a tombstone and original values. A linked purchase/project cannot be deleted while it has active transactions. A refund cannot be left without sufficient receipts.
- Older records use the existing lossless quarterly archive codec. All records are restored for the UI and totals; an unchanged raw-state document remains readable. A save above 700 KB after compression or 16 MB before compression is rejected atomically, leaving all stored records intact. No rows or old records are trimmed to meet a limit.

## API

`{action:"read", expectedOwnerKey:uid}` returns `{state, summary, ownerKey}`.

`{action:"save", expectedOwnerKey:uid, expectedRevision:state.revision, requestId, collection, row}` returns `{state, summary, ownerKey, row}`. Collections are `programs`, `orders`, `projects`, `entries`.

`{action:"delete", expectedOwnerKey:uid, expectedRevision, requestId, collection, id, confirmed:true}` returns the same envelope. HTTP 409 means the caller must retain its draft and explicitly refresh. A quota response is HTTP 503 with `code:"resource-exhausted"` and `Retry-After:1800`; it never triggers server retries.

`GET /api/bio-admin?action=health` is a metadata-only probe and does not initialize Firebase Admin.

## Financial meaning

- All entered `amount` values are gross totals **including** the separately entered `taxAmount`. The included tax is informational and never deducted from cash a second time. No statutory liability or tax return is calculated.
- Consulting `receipt` and `refund` records are actual cash movements linked to a customer's purchase. Contracts, net receipts, outstanding amounts and overpayments remain separate. A cancelled contract keeps historical cash receipts/refunds visible.
- `expense`, consulting `settlement` (an actual payout) and `tax` (actual tax remittance) use `amount` for committed total and `paidAmount` for cash paid. A settlement payout should not also be entered as an expense. Tax-remittance entries have zero included-tax amount to prevent double counting.
- Consulting net cash = receipts − refunds − expense payments − settlement payments − tax remittances. It is not labelled taxable income or accounting profit.
- Bio `funding` is project funding received, not consulting revenue. Government and own-cash funding are separate sources. In-kind amounts are never added to cash funding, payments or cash balance.
- Bio expenditure records hold both payment and `settlementStatus`. Updating an expenditure to settled changes its review status without creating another cash outflow. `amount` tracks commitments and `paidAmount` tracks execution; for in-kind records these mean committed/recognized noncash value.
- Project cash remaining = government plus own-cash agreement budget − cash commitments. Actual cash balance = funding received − cash paid. These are intentionally different.
- Spending above budget remains recordable and produces a negative remaining value. User-entered budget lines must fit their funding-source agreement amount; removing a referenced line or changing its source is rejected.
- `evidenceStatus` tracks missing, ready or not required; `evidenceRef` is a local reference/name/URL field and does not upload a document or fetch its contents.

Project categories are user-entered because applicable agreement and funding rules differ. General Korean R&D vocabulary was checked against the official [IRIS R&D FAQ](https://www.iris.go.kr/contents/retrieveRndSysInqrFaqListView.do), including research facilities/equipment, materials and activities. No statutory category percentage, allowed-cost decision, government cash ratio or tax rate is built into the application.

## Validation

`node --test tests/bio-admin-v192.test.mjs` covers access separation, quota-sensitive read/write counts, preserved existing records, request replay/concurrency, integer money/date errors, receipt/refund limits, included-tax and partial-payment arithmetic, project cash versus in-kind spending, evidence/settlement counts, referenced-record protection and atomic capacity failure.
