const test=require('node:test'),assert=require('node:assert/strict');
const base=process.env.AIDERLOG_PREVIEW_URL;
test('app roles remain stable across font choices, full holidays fit and physical frame is symmetric',{skip:!base,timeout:60000},async()=>{
 const {chromium}=require(process.env.AIDERLOG_PLAYWRIGHT_MODULE||'playwright');
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{for(const width of [360,768]){
  const page=await browser.newPage({viewport:{width,height:840},deviceScaleFactor:3}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/app/index.html?android-preview=1&demo=1#home');await page.waitForFunction(()=>document.documentElement.dataset.previewFixtureV184==='true');await page.waitForTimeout(6500);
  for(const font of ['small','normal','large']){
   await page.evaluate(font=>window.AiderLogThemeV125.applyFontSize(font,false),font);
   const state=await page.evaluate(()=>{const css=e=>getComputedStyle(e),main=document.querySelector('.dday-main-v179 strong'),event=document.querySelector('.schedule-event-name-v119'),texts=event?.querySelectorAll('.schedule-event-title-v176,.schedule-event-time-v176');return {main:parseFloat(css(main).fontSize),event:event?css(event).fontSize:null,texts:[...texts||[]].map(e=>css(e).fontSize),owner:document.body.dataset.cssTypography,animation:css(document.querySelector('#home')).animationName,inline:document.querySelectorAll('[data-readable-role-v184]').length,overflow:document.documentElement.scrollWidth>innerWidth};});
   assert.equal(state.owner,'v185');assert.equal(state.inline,0);assert.equal(state.animation,'none');assert.equal(state.overflow,false);assert(state.main>=19);for(const size of state.texts)assert.equal(size,state.event);
  }
  // May 2026 includes the long, unabridged Buddha's Birthday substitute holiday.
  await page.evaluate(()=>{const now=new Date(),delta=(now.getFullYear()-2026)*12+now.getMonth()-4;for(let i=0;i<Math.abs(delta);i++)document.querySelector(`[data-calendar-shift-v125="${delta>0?-1:1}"]`).click();});
  const holidays=await page.locator('.schedule-holiday-v144').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent,title:e.title,ellipsis:s.textOverflow,white:s.whiteSpace,right:r.right,parentRight:p.right,bottom:r.bottom,parentBottom:p.bottom,scroll:e.scrollWidth,width:r.width};}));
  assert(holidays.some(row=>row.text==='부처님오신날 대체공휴일'));for(const row of holidays){assert.equal(row.text,row.title);assert.notEqual(row.ellipsis,'ellipsis');assert.equal(row.white,'normal');assert(row.right<=row.parentRight+1);assert(row.bottom<=row.parentBottom+1);assert(row.scroll<=Math.ceil(row.width)+1);}
  const frame=await page.evaluate(()=>{window.AiderLogNative={getFrameInsetPx:()=>5};window.AiderLogReadabilityV184.updateViewport();const rect=document.querySelector('#app').getBoundingClientRect();return {top:rect.top,bottom:innerHeight-rect.bottom,padding:parseFloat(getComputedStyle(document.body).paddingTop),dpr:devicePixelRatio};});
  assert(Math.abs(frame.padding*frame.dpr-5)<.05);assert(Math.abs(frame.top-frame.bottom)<.05);assert(Math.abs(frame.top-5/3)<.1);assert.deepEqual(errors,[]);await page.close();
 }}finally{await browser.close();}
});
