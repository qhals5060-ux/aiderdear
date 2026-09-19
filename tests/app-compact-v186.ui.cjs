/* Actual Android assets, exclusively in the local, isolated RAM preview. */
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.AIDER_PLAYWRIGHT_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base=process.env.AIDER_PREVIEW_URL||'http://127.0.0.1:8844';
assert(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Only the local RAM preview may be tested');
const close=(actual,wanted,tolerance,label)=>assert(Math.abs(actual-wanted)<=tolerance,`${label}: ${actual} expected ${wanted} ± ${tolerance}`);
const rgb=text=>{const values=String(text).match(/[\d.]+/g)?.map(Number)||[];return values.slice(0,3);};
const luminance=values=>values.map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,i)=>sum+value*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const one=luminance(rgb(a)),two=luminance(rgb(b));return(Math.max(one,two)+.05)/(Math.min(one,two)+.05);};
const idleChanges=page=>page.evaluate(()=>new Promise(resolve=>{let changes=0;const observer=new MutationObserver(records=>{changes+=records.length;});observer.observe(document.querySelector('#app'),{childList:true,subtree:true,characterData:true,attributes:true});setTimeout(()=>{observer.disconnect();resolve(changes);},500);}));

(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 try{
  for(const width of [360,384,768,904]){
   const page=await browser.newPage({viewport:{width,height:width<600?840:900},colorScheme:'light'}),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
   await page.addInitScript(()=>{const RealDate=Date,now=new RealDate('2026-09-20T12:00:00+09:00').valueOf();window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}};});
   await page.goto(base+'/app/index.html?android-preview=1&demo=1#home');
   await page.waitForFunction(()=>document.documentElement.dataset.previewFixtureV184==='true'&&window.AiderCompactV186);
   await page.evaluate(()=>{document.querySelector('#intro')?.remove();window.AiderCompactV186.refresh();});
   await page.waitForTimeout(600);
   const month=await page.evaluate(()=>{
    const box=element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2};};
    const q=selector=>document.querySelector(selector),summary=q('.dday-summary-v179');
    const opaque=element=>{for(let e=element;e;e=e.parentElement){const color=getComputedStyle(e).backgroundColor;if(color!=='transparent'&&!color.endsWith(', 0)'))return color;}return 'rgb(255, 255, 255)';};
    return{
     frame:box(q('#home .schedule-dashboard-v179')),calendar:box(q('#home .schedule-calendar-v119')),pageWidth:document.documentElement.scrollWidth,
     dday:{box:box(summary),overflow:getComputedStyle(summary).overflowX,scrollWidth:summary.scrollWidth,clientWidth:summary.clientWidth,items:[...summary.querySelectorAll('.week-overview-open-v184,.dday-main-v179,.dday-small-v179')].map(element=>({box:box(element),whiteSpace:getComputedStyle(element).whiteSpace,parts:[...element.querySelectorAll('strong,b,time')].map(box)}))},
     icons:[...q('.top .tools').querySelectorAll(':scope>.iconbtn')].filter(element=>element.getBoundingClientRect().width>0).map(element=>({id:element.id,box:box(element),background:getComputedStyle(element).backgroundColor,border:getComputedStyle(element).borderWidth,shadow:getComputedStyle(element).boxShadow,stroke:getComputedStyle(element.querySelector('svg')).stroke,surface:opaque(element),nameVisible:!!element.querySelector('.account-name-v136')&&getComputedStyle(element.querySelector('.account-name-v136')).display!=='none'})),
     holidays:[...document.querySelectorAll('#home [data-schedule-date-v125]>.schedule-holiday-v144')].map(element=>{const cell=element.parentElement,date=cell.querySelector('.schedule-day-number-v119'),range=document.createRange();range.selectNodeContents(element);return{text:element.textContent,box:box(element),textBox:box(range),date:box(date),cell:box(cell),whiteSpace:getComputedStyle(element).whiteSpace,font:parseFloat(getComputedStyle(element).fontSize),ellipsis:getComputedStyle(element).textOverflow};})
    };
   });
   assert.equal(month.icons.length,4,`${width}: four header icons`);
   for(const icon of month.icons){assert.equal(icon.background,'rgba(0, 0, 0, 0)');assert.equal(icon.shadow,'none');assert.equal(icon.nameVisible,false);assert(contrast(icon.stroke,icon.surface)>=3,`${width}: ${icon.id} contrast ${contrast(icon.stroke,icon.surface)}`);}
   assert(month.dday.items.length>=4,'W, main and two secondary D-days are present');
   const ddayY=month.dday.items[0].box.cy;
   for(const item of month.dday.items){close(item.box.cy,ddayY,2,'D-day common center');for(const part of item.parts)close(part.cy,item.box.cy,2,'D-day text remains one line');}
   assert(['auto','scroll'].includes(month.dday.overflow),'overflow scrolls horizontally');
   if(width<600)assert(month.dday.scrollWidth>month.dday.clientWidth,'narrow D-day strip scrolls without wrapping');
   assert.equal(month.pageWidth,width,'page has no horizontal overflow');
   close(month.calendar.w,month.frame.w,2,'calendar fills dashboard width');
   assert(month.holidays.some(holiday=>holiday.text.replace(/\s/g,'')==='추석연휴'),'full holiday fixture exists: '+month.holidays.map(holiday=>holiday.text).join(', '));
   for(const holiday of month.holidays){close(holiday.box.cy,holiday.date.cy,1.5,'holiday and date share a line');assert.equal(holiday.whiteSpace,'nowrap');assert.notEqual(holiday.ellipsis,'ellipsis');assert(holiday.textBox.w<=holiday.box.w+1,`${width}: holiday ${holiday.text} fits`);assert(holiday.box.x>=holiday.date.x+holiday.date.w-1,`${width}: holiday does not cover date`);assert(holiday.box.x+holiday.box.w<=holiday.cell.x+holiday.cell.w+1);assert(holiday.font>0);}
   const monthIdleMutations=await idleChanges(page);assert.equal(monthIdleMutations,0,`${width}: idle month DOM settles`);
   await page.locator('#loginBtn').click();await page.locator('.profile-sheet-v137').waitFor({state:'visible'});
   await page.waitForFunction(()=>document.querySelector('.profile-foot-v137 [data-profile-calendar-v138]'));
   const profile=await page.evaluate(()=>{const box=element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,cy:r.y+r.height/2};},birth=document.querySelector('.profile-birth-v175>label'),footer=document.querySelector('.profile-foot-v137');return{label:box(birth.querySelector('span')),date:box(birth.querySelector('input')),calendar:box(footer.querySelector('[data-profile-calendar-v138]')),logout:box(footer.querySelector('[data-profile-logout-v137]'))};});
   close(profile.label.cy,profile.date.cy,1.5,'birthday label and date inline');assert(profile.date.x>=profile.label.x+profile.label.w);
   close(profile.calendar.cy,profile.logout.cy,1.5,'calendar and logout inline');assert(profile.logout.x>profile.calendar.x);
   await page.locator('[data-profile-close-v137]').click();
   await page.locator('[data-week-toggle-v184]').click();await page.waitForTimeout(150);
   const week=await page.evaluate(()=>{const measure=selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return{x:r.x,y:r.y,w:r.width,h:r.height,paddingY:parseFloat(s.paddingTop)+parseFloat(s.paddingBottom),borderY:parseFloat(s.borderTopWidth)+parseFloat(s.borderBottomWidth)};};return{rows:document.querySelectorAll('.weekly-days-v184 .week-day-v184').length,week:measure('.weekly-days-v184'),notes:measure('.weekly-notes-v184'),todo:measure('.weekly-notes-v184 .todo'),memo:measure('.weekly-notes-v184 .memo')};});
   assert.equal(week.rows,7);close(week.week.h/week.notes.h,2,.18,'weekly calendar/notes ratio');close(week.todo.w/week.memo.w,2,.12,'todo/memo ratio');
   await page.waitForTimeout(500);
   const idleMutations=await idleChanges(page);
   assert.equal(idleMutations,0,`${width}: idle app DOM settles`);assert.deepEqual(errors,[]);
   results.push({width,ddayItems:month.dday.items.length,holidayCount:month.holidays.length,iconContrast:month.icons.map(icon=>Number(contrast(icon.stroke,icon.surface).toFixed(2))),calendarWidth:month.calendar.w,weeklyRatio:week.week.h/week.notes.h,notesRatio:week.todo.w/week.memo.w,monthIdleMutations,idleMutations});
   await page.close();
  }
  console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
