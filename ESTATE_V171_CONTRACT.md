# ESTATE v171 implementation contract (site only)

Existing stack: vanilla HTML/JS, Firebase Auth ID token, Vercel functions using
server/firebase-admin.mjs. No OAuth or existing Google-calendar changes. New
records are owner-only, server-authorized, outside Consult/private/pair payloads.
All authenticated ordinary users can use ESTATE; Work employee identities do not
gain access. No multi-user assignment in this release. No fake/demo production rows.

## Data / server

Owner root `estateWorkspaces/{verifiedUid}`. Collections: properties, customers,
consultations, visits, deals, tasks, receipts, proposals, shareLinks, requests.
Every row: id, createdAt, updatedAt, revision, ownerUid. UUID or validated safe ID.
Input workspace/owner UID must never choose the data path. Optimistic revisions
and requestId receipts make repeated writes safe; stale updates reject with 409.
All dates local YYYY-MM-DD, times HH:mm; monetary numbers KRW, null = unknown.

- properties: title, number (server-generated immutable), address, detailAddress,
  region, building, buildingUnit, unit, propertyType (apartment/officetel/house/
  commercial/land/other), dealType (sale/jeonse/rent), area, supplyArea, floor,
  totalFloors, rooms, bathrooms, direction, parking (yes/no/unknown), elevator
  (yes/no/unknown), approvalDate, price, deposit, rent, managementFee,
  managementIncludes, negotiable, availableDate, availableNegotiable,
  occupancy, pets (yes/no/negotiable/unknown), conditions, viewingTimes, keyMemo,
  ownerCustomerId, receivedDate, confirmedDate, nextCheckDate,
  status (active/negotiating/closed/hold/ended), coBroker, coBrokerInfo,
  internalMemo, publicDescription, advantages, disadvantages, premium,
  recommendedBusiness, facilities, landCategory, zoning, road,
  photos [{mediaId,thumbId,name}], mediaIds [documents], history (server-managed).
- customers: name, phone, email, roles [seller/landlord/buyer/tenant], source,
  contactMethod, contactTime, firstContactDate, lastContactDate, nextContactDate,
  memo, regions [], excludedRegions [], dealTypes [], propertyTypes [],
  priceMax, depositMax, rentMax, monthlyCostMax, areaMin, roomsMin,
  moveInFrom, moveInTo, parking, elevator, pets, required [] (criterion keys),
  flexible [], excludedConditions.
- consultations: customerId, propertyId?, dealId?, date, time, method, content,
  nextAction, dueDate?, dueTime?, priority (high/normal/low). A due nextAction
  atomically upserts tasks/consultation-{id}; clearing it cancels that generated task.
- visits: customerIds [], propertyId, dealId?, date, time, endTime, status
  (scheduled/done/cancelled), reaction, positives, exclusionReason,
  followUpDate, followUpAction. A dated followup atomically updates tasks/visit-{id}.
- deals: title, propertyId, sellerIds [], buyerIds [], stage
  (inquiry/consultation/proposal/visit/negotiation/preparation/contract/settled/hold/stopped),
  reason, agreedPrice, agreedDeposit, agreedRent, conditions, contractDate,
  interimDate, balanceDate, handoverDate, nextAction, dueDate, priority,
  checklist [{id,text,done}], mediaIds [], internalMemo, expectedFee,
  confirmedFee, coBrokerAmount, feeDueDate. Source changes produce stable
  projected calendar IDs, not persisted personal schedules. Hold/stopped reason required.
- tasks: title, customerId?, propertyId?, dealId?, date, time, priority,
  status (open/done/cancelled), kind (contact/followup/documents/payment/handover/
  property-check/other), notes, sourceKind?, sourceId?.
- receipts: dealId, amount (>0), date, method, notes (individual partial payments).
- proposals: customerId, propertyId, date, status (suggested/interested/declined), notes.
- requests: shareId, propertyIds [], name, phone, preferredDate, preferredTime,
  message, status (pending/confirmed/rejected). Confirmation creates one stable
  visit after broker selects an existing customer and a property; not automatic.

`api/estate.mjs` POST JSON. Auth via Bearer Firebase ID token. Same-origin check,
no-store, body caps, no secret in errors. Admin SDK only. No direct client Firestore
access; existing unmatched-path deny rules cover new roots, optional explicit denies.
No 90-day deletion; retain all active/closed records. No paid product provisioning.

Actions / expected response:
- context -> {uid}
- list {collection,cursor?,limit?} -> {rows,cursor}; max 50 per page.
- get {collection,id} -> {row}
- search {q,cursor?} -> {results:[{collection,id,label,subtitle}],cursor?}; never
  silently present partial scans as complete; either indexed search or bounded
  continuation metadata. No reading all other users.
- save {collection,id,row,expectedRevision,requestId} -> {row,warnings?}
- archive {collection,id,expectedRevision,requestId} -> {row}; reject deletion of
  referenced records or offer status ended; preserve history and relationships.
- calendar {cursor?} -> {rows,cursor}; compact owner-only projections, stable IDs.
- mediaBegin {id?,entityCollection,entityId,name,type,size,requestId} -> {id,chunkBytes}
- mediaChunk {id,index,data(base64),requestId}; mediaFinish {id,requestId} -> {id,...}
- mediaInfo {id} -> {id,name,type,size,sha256,chunkBytes}
- mediaReadChunk {id,index} -> {data}; mediaDelete {id,requestId} -> {ok}; reject
  still-referenced attachments. Pending uploads must have bounded cleanup support.
- cleanup {cursor?,requestId} -> {removed,cursor?}; only unreferenced stale media.
- sharePreview {propertyIds (2..5),publicOptions:{showAddress,showUnit,photos:{[propertyId]:[mediaId]}}}
  -> {properties}; server allowlist, no internal memo/customer/contact leakage.
- shareCreate {propertyIds,publicOptions,expiresAt,requestId} -> {row,token}; store
  SHA-256 random 32-byte token, immutable public snapshot, expiry <=30 days.
- shareRevoke {id,requestId} -> {ok}; shareLinks list reveals saved link token to
  owner only if supported (never leak private reference data via public endpoint).
- requestConfirm {id,customerId,propertyId,date,time,requestId} -> {visit}; idempotent.
- publicGet {token} -> {properties,expiresAt}; no auth, strict allowlist snapshot.
- publicRequest {token,propertyIds,name,phone,preferredDate,preferredTime,message,
  consent:true,requestId} -> {ok}; bounded rate/size, pending only.
- publicMediaInfo/publicMediaReadChunk {token,id,index?}; only selected photo IDs
  in an active unexpired link; never generic owner media IDs.

## UI module API

Root owns estate-v171.js controller, estate-client-v171.js, estate-domain-v171.js,
estate-v171.css and index/calendar integration. Directory agent owns
estate-directory-v171.js/css. Workflow agent owns estate-workflow-v171.js/css,
estate-share.html and estate-public-v171.js/css.

Modules are ES modules (not React). Export installDirectory(app) / installWorkflow(app).
They register views and entity panels using the controller contract:

```
app.registerView(name, async ({container,signal})=>{})
app.registerEntity(collection, async ({container,row,isNew,signal})=>{})
app.api.call(action,payload) // creates requestId if absent; retries same request
app.api.upload(file,{entityCollection,entityId}) // compressed image supported
app.api.download(id) // {blob,name,type}; app.api.image(id) -> object URL
app.list(collection,{cursor?,limit?}) -> {rows,cursor}
app.options(collection) -> currently loaded rows (not a full data claim)
app.lookup(collection,id) -> row via get/cache
app.pickOptions(collection) -> first 50 via list/cache; show further search UI
app.save(collection,row,form?) -> committed row (uses revision); error never closes form
app.open(collection,id?) // one right panel/fullscreen mobile; UUID for new record
app.close() // preserves list/search/scroll
app.navigate(view)
app.notice(message,isError=false)
app.refresh() // refresh active view; preserve search/filter/scroll, not open draft
app.esc(value); app.money(value); app.today(); app.uid();
app.field(name,label,type,value,options?) -> HTML label/input (types text,textarea,
  number,date,time,select,checkbox), select options [{value,label}], optional attributes
app.form(container,html,onSave) -> binds submit, disables duplicate save, error area,
  sticky save/cancel; builds plain data via FormData, caller normalizes numbers/arrays
app.related(container,collection,predicate,render) // optional; paginate explicitly
```

All selectors/CSS scoped #estateStage/.estate-*; do not modify global button/input
rules or existing modules. Form owns draft DOM, never wholesale render on typing.
Single detail panel (switch panel with dirty warning); no modal stacks.

Views directory: properties, customers. Entities properties, customers, consultations,
proposals. Workflow: today, deals, settlement. Entities visits, deals, tasks, receipts,
requests. Root: matching and comparison share/create/revoke, integrations/calendar.
Sidebar: today / properties / customers / matching / deals / settlement.

## Domain exports owned by root

`matchProperty(customer,property)` -> {criteria:[{key,label,status,reason}],score,
coverage,eligible}; status fulfilled/unfulfilled/negotiable/unknown; required
unfulfilled excludes default recommendation, unknown never fulfilled.
`estateStatistics({deals,receipts,customers,properties,visits},{from,to})` ->
{contracts,received,outstanding,expected,byType,bySource,funnel,averageDays,
sampleSize,basis}; numbers only real rows; null for unavailable averages.
`calendarRows({tasks,visits,deals,customers,properties})` -> [{id,sourceKind,
sourceId,title,date,endDate,time,endTime,category:'estate',readOnly:true}].
`publicProperty(property,options)` -> explicit field allowlist public snapshot.
```
