'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'dday-display-v176.js'),'utf8'),context={window:{}};
vm.runInNewContext(source,context);const display=context.window.AiderDdayDisplayV176;
const now=Date.parse('2026-09-11T15:00:00Z'),row=(id,date='2026-09-12',scope='user:u1',extra={})=>({id,title:id,date,sourceScope:scope,mode:'countdown',...extra});
const ids=value=>Array.from(value,item=>item.id);
test('D-day display retains Seoul midnight boundaries and date-only arithmetic',()=>{
 assert.equal(display.today(Date.parse('2026-09-11T14:59:59Z')),'2026-09-11');assert.equal(display.today(now),'2026-09-12');
 assert.equal(display.count(row('today'),now),'D-DAY');assert.equal(display.count(row('next','2026-09-13'),now),'D-1');assert.equal(display.count(row('past','2026-09-11'),now),'D+1');
});
test('D-day display preserves inclusive together-day counts without inventing annual recurrence',()=>{
 assert.equal(display.count(row('since','2026-09-12','user:u1',{mode:'since'}),now),'D+1');
 assert.equal(display.count(row('since','2026-09-11','user:u1',{mode:'since'}),now),'D+2');
 assert.equal(display.count(row('old','2025-09-12'),now),'D+365');
});
test('D-day date-only calculations handle leap dates and reject impossible dates',()=>{
 assert.equal(display.difference(row('leap','2024-02-29'),Date.parse('2024-02-28T15:00:00Z')),0);
 assert.equal(display.count(row('bad','2026-02-30'),now),'—');assert.equal(display.difference(row('bad','2026-9-12'),now),null);
});
test('saved representative stays large even when another date is closer',()=>{
 const items=[row('near'),row('chosen','2027-01-01'),row('next','2026-09-13')],data={items,activeId:'chosen',activeScope:'user:u1'};
 const projection=display.presentation(data,now);assert.equal(projection.featured.id,'chosen');assert.deepEqual(ids(projection.remaining),['near','next']);
});
test('remaining dates retain past entries and sort by absolute distance, future before past ties',()=>{
 const items=[row('chosen','2027-01-01'),row('old','2025-01-01'),row('past2','2026-09-10'),row('future2','2026-09-14'),row('past1','2026-09-11'),row('future1','2026-09-13'),row('today'),row('same','2026-09-12')];
 const data={items,activeId:'chosen',activeScope:'user:u1'},before=JSON.stringify(data),projection=display.presentation(data,now);
 assert.deepEqual(ids(projection.remaining),['today','same','future1','past1','future2','past2','old']);assert.equal(JSON.stringify(data),before);
});
test('matching ID in personal and pair scopes stays distinct in the compact list',()=>{
 const items=[row('same'),row('same','2026-09-13','pair:p1')],p=display.presentation({items,activeId:'same',activeScope:'pair:p1'},now);
 assert.equal(p.featured.sourceScope,'pair:p1');assert.equal(p.remaining.length,1);assert.equal(p.remaining[0].sourceScope,'user:u1');
});
test('deleted or inaccessible representative uses established fallback without rewriting preference',()=>{
 const data={items:[row('first','2027-01-01'),row('near')],activeId:'former',activeScope:'pair:old'},before=JSON.stringify(data);
 assert.equal(display.presentation(data,now).featured.id,'first');assert.equal(JSON.stringify(data),before);
 assert.equal(display.presentation(null,now).featured,null);assert.equal(display.presentation(null,now).remaining.length,0);
});
test('D-day display is presentation-only with no persistence, auth changes or data deletion',()=>{
 assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\(|mutateDday\(|deleteDoc\(|signOut\(/);
 const css=fs.readFileSync(path.join(root,'dday-display-v176.css'),'utf8');assert.match(css,/overscroll-behavior:contain/);assert.match(css,/touch-action:pan-y/);assert.match(css,/\.dday-secondary-v176\[hidden\]/);
});
