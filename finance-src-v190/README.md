# AiderLog PERSONAL / 재테크

This is the curated React source from the supplied Finance-Personal-v190 reference. The existing 금융 category remains separate. Only components reachable from `app/dashboard.tsx` are included.

Production assets in the site root are `finance-v190.html`, `finance-ui-v190.js`, and `finance-ui-v190.css`. `site-investment-v190.js` mounts the same-origin iframe as an independent PERSONAL category after 금융. It leaves the original four categories and their record handlers intact. The iframe owns no authentication token and performs no direct API calls: `app/asset-transport.ts` delegates to the parent's authenticated `AiderAssetsBridgeV184`.

Build with the pinned package lock: `npm ci`, `npm run typecheck`, `npm run build`. Copy `dist/index.html` to the site root as `finance-v190.html`, and copy the two `finance-ui-v190` assets beside it. Do not deploy `node_modules` or a duplicate `dist` tree. The top-level repository keeps the editable source; only the three generated files are served for this page.

All product lists, search/filter/sort controls, custom product forms, notes, watch lists, comparison charts, target conditions, holdings, and property visit records use the original implementation. Example product prices are clearly marked as examples; no live market feed is claimed. There is no preview memory transport in the production bundle.

History is permanently retained by the server. The initial response includes the newest 30 entries plus `historyCount`; the history dialog loads older entries in pages without truncating stored records or long values. `integration/management-core.js` is kept identical to the root `finance-management-v190.js`. Account changes remove the iframe and all previous account content, while ordinary category changes retain the same account's open page/draft and pause automatic polling while hidden.
