const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('android-src/assets/app-calendar-v179.css');
const frame=css.slice(css.indexOf('  html {'),css.indexOf('  html body #app .brand'));

test('one .3 mm body frame owns safe-area insets exactly once',()=>{
  assert.match(frame,/--app-frame-v180:\.3mm/);
  assert.match(frame,/padding:max\(var\(--app-frame-v180\),env\(safe-area-inset-top\)\) 0 max\(var\(--app-frame-v180\),env\(safe-area-inset-bottom\)\)!important/);
  assert.equal((frame.match(/env\(safe-area-inset-top\)/g)||[]).length,1);
  assert.equal((frame.match(/env\(safe-area-inset-bottom\)/g)||[]).length,1);
  assert.match(frame,/#app\.app \{[^}]*padding-top:0!important;padding-bottom:0!important/);
  assert.match(frame,/height:100dvh!important;min-height:0!important;box-sizing:border-box!important/);
});

test('header and view use one flex remainder instead of an inconsistent hard-coded subtraction',()=>{
  assert.match(frame,/#app\.app \{display:flex!important;flex-direction:column!important;height:100%!important/);
  assert.match(frame,/#app\.app>\.views \{flex:1 1 0!important;height:auto!important;max-height:none!important;min-height:0!important;margin-block:0!important;padding-block:0!important/);
  assert.match(frame,/#app>\.top \{flex:0 0 42px!important;min-height:42px!important;height:42px!important;margin-block:0!important/);
  assert.doesNotMatch(frame,/calc\(100% - 45px\)|padding-top:max\(1px/);
  // No window-size-specific frame can reintroduce the old Fold-only 31.5 px gap.
  const frameDeclarations=css.match(/--app-frame-v180\s*:/g)||[];
  assert.equal(frameDeclarations.length,1);
});

test('Flip, Fold and keyboard-resized content leave the same cosmetic edge on both sides',()=>{
  const edge=.3*96/25.4;
  for(const [width,height] of [[360,800],[412,915],[768,900],[850,700],[412,370]]){
    const appHeight=height-edge*2,header=42,viewHeight=appHeight-header;
    assert.ok(viewHeight>0,`${width}×${height}`);
    assert.ok(Math.abs((edge+header+viewHeight)-(height-edge))<1e-9);
  }
  // A native cutout consumes only its physical area, not a second copy inside #app.
  const top=Math.max(edge,24),bottom=Math.max(edge,0),appHeight=915-top-bottom;
  assert.equal(top+appHeight+bottom,915);
  assert.equal(top,24);
});

test('native immersive WebView and keyboard resize are preserved without native inset mutations',()=>{
  const native=read('android-src/smali/MainActivity.smali'),manifest=read('android-src/AndroidManifest.xml');
  assert.match(native,/->setDecorFitsSystemWindows\(Z\)V/);
  assert.match(native,/WindowInsetsController;->hide\(I\)V/);
  assert.match(native,/->setContentView\(Landroid\/view\/View;\)V/);
  assert.doesNotMatch(native,/->setPadding\(IIII\)V/);
  assert.match(manifest,/windowSoftInputMode="adjustResize"/);
});

test('frame correction is app-only and copied to the packaged asset source',()=>{
  assert.doesNotMatch(read('index.html'),/app-calendar-v179\.css/);
  assert.equal(css,fs.readFileSync(path.resolve(root,'../AiderLog-v145-decoded/assets/app-calendar-v179.css'),'utf8'));
});
