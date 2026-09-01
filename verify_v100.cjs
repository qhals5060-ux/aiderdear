const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter(Boolean);

inlineScripts.forEach((script, index) => {
  new Function(script);
  console.log(`inline-script-${index + 1}: ok`);
});

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);
console.log(`ids: ${ids.length} unique`);

const referencedAssets = [...html.matchAll(/asset:'\.\/([^']+)'/g)].map((match) => match[1]);
for (const asset of referencedAssets) {
  if (!fs.existsSync(asset)) throw new Error(`Missing challenge asset: ${asset}`);
}
console.log(`challenge assets: ${referencedAssets.length} present`);

const expectedSnippets = [
  'id="storyMediaMinimize"',
  '<section class="couple-panel"',
  'class="calendar-connection-guide"',
  'id="calendarGoogleDisconnect"',
  'rememberGoogleCalendarSelection(selected.map(source=>source.id))',
  "filter(row=>row.externalSource!=='google')",
];
for (const snippet of expectedSnippets) {
  if (!html.includes(snippet)) throw new Error(`Missing v100 feature marker: ${snippet}`);
}
const guide = html.match(/<section class="calendar-connection-guide"[\s\S]*?<\/section>/)?.[0] || '';
if ((guide.match(/<li>/g) || []).length !== 5) throw new Error('Calendar guide must contain five steps.');
console.log('v100 feature structure: ok');

const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missingShellAssets = shellAssets.filter((asset) => !fs.existsSync(asset));
if (!shellAssets.length || missingShellAssets.length) {
  throw new Error(`Missing service worker assets: ${missingShellAssets.join(', ')}`);
}
console.log(`service worker assets: ${shellAssets.length} present`);
