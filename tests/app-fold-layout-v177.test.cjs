const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const css=read('android-src/assets/app-fold-layout-v177.css'),html=read('android-src/assets/index.html');
test('adaptive rules target available window width and height, not model identities',()=>{
  assert.match(css,/@media \(min-width:600px\) and \(min-height:480px\)/);
  assert.match(css,/@layer appColour164/);assert.doesNotMatch(css,/data-device-layout|SM-F|userAgent/);
  assert.equal((css.match(/@media/g)||[]).length,1);
  assert.doesNotMatch(css.slice(0,css.indexOf('@media')).replace(/\/\*[\s\S]*?\*\//g,''),/!important/);
});
test('calendar uses the actual common parent and stacks upcoming and D-day on the right',()=>{
  assert.match(css,/\.schedule-home-v119 \{\s*display:grid!important;grid-template-columns:minmax\(0,1\.6fr\) minmax\(220px,\.9fr\)!important/);
  assert.match(css,/\.schedule-homeside-v119 \{\s*display:grid!important;grid-template-columns:minmax\(0,1fr\)!important/);
  assert.match(css,/grid-template-rows:minmax\(0,1\.25fr\) minmax\(180px,\.85fr\)/);
  assert.match(css,/\.schedule-upcoming-v119[\s\S]*overflow-y:auto!important;overscroll-behavior:contain/);
});
test('wide editors keep real forms and full-width footer but use the right pane',()=>{
  assert.match(css,/#home\.schedule-feature-v125\.on \{display:block/);
  assert.match(css,/\.routine-editor-v111>\.routine-detail-sheet/);
  assert.match(css,/width:max\(340px,50%\)!important;max-width:620px/);
  assert.match(css,/margin:0 0 0 auto!important/);assert.match(css,/height:100%!important;max-height:100%/);
  assert.doesNotMatch(css,/font-size|font-family|--app-primary\s*:|display:none|pointer-events:none/);
});
test('new layout is mounted once in the app only',()=>{
  assert.equal((html.match(/href="\.\/app-fold-layout-v177\.css\?v=177"/g)||[]).length,1);
  assert.doesNotMatch(read('index.html'),/app-fold-(?:layout|daily|workspaces)-v177/);
  assert.match(read('android-src/assets/sw.js'),/'\.\/app-fold-layout-v177.css','\.\/app-fold-layout-v177.css\?v=177'/);
});
test('native app already allows resizing without forcing an orientation',()=>{
  const manifest=read('android-src/AndroidManifest.xml');
  assert.match(manifest,/resizeableActivity="true"/);assert.match(manifest,/screenOrientation="unspecified"/);
  assert.match(manifest,/configChanges="[^"]*screenSize[^"]*"/);
});
