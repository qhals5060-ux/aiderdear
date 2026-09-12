const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../android-src/assets');
const css=fs.readFileSync(path.join(base,'app-system-surfaces-v176.css'),'utf8');
const clean=css.replace(/\/\*[\s\S]*?\*\//g,'');
const rules=[...clean.matchAll(/([^{}]+)\{([^{}]+)\}/g)].map(([,selector,body])=>({selector:selector.trim(),values:Object.fromEntries([...body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map(([,name,value])=>[name,value.trim()]))}));
const light=rules[0].values,dark={...light,...rules[1].values};
const luma=value=>{const parts=value.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return parts[0]*.2126+parts[1]*.7152+parts[2]*.0722};
const contrast=(a,b)=>(Math.max(luma(a),luma(b))+.05)/(Math.min(luma(a),luma(b))+.05);
const value=(palette,name)=>palette['--system-content-'+name];
test('both system schemes have visibly bright and distinct information/card/control/input surfaces',()=>{
  for(const palette of [light,dark]){
    const surfaces=['surface','card','control','input'].map(name=>value(palette,name));assert.equal(new Set(surfaces).size,4);assert(surfaces.every(hex=>luma(hex)>.62));
    assert(Math.abs(luma(value(palette,'control'))-luma(value(palette,'surface')))>.1);
  }
  assert(luma(value(dark,'card'))>luma(value(dark,'surface')));assert(contrast(value(dark,'surface'),'#1D1928')>12);
});
test('body, small labels, active buttons and focus indicators keep readable contrast on both schemes',()=>{
  for(const palette of [light,dark])for(const surface of ['surface','card','control','input']){
    for(const ink of ['text','body','muted'])assert(contrast(value(palette,ink),value(palette,surface))>=4.5,`${ink} on ${surface}`);
    assert(contrast(value(palette,'focus'),value(palette,surface))>=3,`focus on ${surface}`);
  }
  assert(contrast(value(light,'on-primary'),value(light,'primary'))>=4.5);
});
test('surface overrides are system-content only and cannot recolour planet art, navigation, or widgets',()=>{
  assert.equal(rules.length,3);for(const rule of rules)assert(rule.selector.includes('[data-app-palette="system"]'));
  assert(rules[2].selector.includes('body > :not(#wheel)'));
  for(const name of ['--app-canvas','--app-space-base','--app-space-glow','--app-on-space','--app-navigation-primary','--app-wheel-tint','--app-wheel-shade','--theme-primary'])assert(!Object.keys(rules[2].values).includes(name),name);
  const nav=fs.readFileSync(path.join(base,'app-theme-primary-v176.css'),'utf8');assert.match(nav,/:root\[data-theme="system"\]\{--app-navigation-primary:#6255E8\}/);
  assert.equal(value(light,'primary'),'#6255E8');assert(!clean.includes('widget'));
});
test('only colour aliases change; no layout, font, gesture, opacity or stored theme state changes',()=>{
  for(const {values}of rules)for(const name of Object.keys(values))assert(name.startsWith('--')||name==='color-scheme',name);
  assert.equal(rules[2].values['color-scheme'],'light');assert.equal(rules[2].values['--app-input'],'var(--system-content-input)');
  for(const name of ['--app-editor','--app-editor-head','--app-editor-foot','--app-ink','--app-muted','--app-progress-track'])assert(name in rules[2].values,name);
  assert.doesNotMatch(clean,/!important|@media|font-size|transform|opacity|transition|url\(/);
});
test('canonical and Android build mirror receive exactly the same system surface stylesheet',()=>{
  assert.equal(css,fs.readFileSync(path.resolve(base,'../../../AiderLog-v145-decoded/assets/app-system-surfaces-v176.css'),'utf8'));
});
