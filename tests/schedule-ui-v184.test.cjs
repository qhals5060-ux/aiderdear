const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../android-src/assets/schedule-ui-v184.js'),'utf8'),context={module:{exports:{}},Date};vm.runInNewContext(source,context);const model=context.module.exports,plain=value=>JSON.parse(JSON.stringify(value));
test('weekly range starts at today and crosses month, year and leap-day boundaries',()=>{
  assert.deepEqual(plain(model.dates('2026-09-20')),['2026-09-20','2026-09-21','2026-09-22','2026-09-23','2026-09-24','2026-09-25','2026-09-26']);
  assert.equal(model.dates('2026-12-29').at(-1),'2027-01-04');
  assert.equal(model.dates('2028-02-27').at(-1),'2028-03-04');
  assert.equal(model.dates('2026-09-28').at(-1),'2026-10-04');
});
test('weekly projection includes each day of a stored multi-day event without altering its record',()=>{
  const row={id:'trip',date:'2026-09-24',endDate:'2026-09-26',title:'여행'};
  assert.deepEqual(plain(model.dates('2026-09-20').filter(date=>model.occurs(row,date))),['2026-09-24','2026-09-25','2026-09-26']);
  assert.equal(model.occurs({},'2026-09-25'),false);assert.equal(row.endDate,'2026-09-26');
});
test('notes share canonical source and IDs, keep deadlines and separate memos stored in either legacy collection',()=>{
  const data={checklists:[{id:'t1',text:'할 일',date:'2026-09-24'},{id:'done',text:'완료',done:true},{id:'memo-old',type:'memo',title:'기존 메모'},{id:'demo',demo:true},{id:'emotion',category:'emotion'}],memos:[{id:'memo-new',text:'새 메모'},{id:'empty'},{id:'legacy-typed',kind:'todo',text:'기존 memos 레코드'}]};
  const before=JSON.stringify(data),rows=plain(model.notes(data));
  assert.deepEqual(rows.filter(row=>row.kind==='memo').map(row=>row.id).sort(),['empty','legacy-typed','memo-new','memo-old']);
  assert.equal(rows.find(row=>row.id==='memo-old').source,'checklists');assert.equal(rows.find(row=>row.id==='t1').date,'2026-09-24');
  assert.equal(rows.at(-1).id,'done');assert(!rows.some(row=>['demo','emotion'].includes(row.id)));assert.equal(JSON.stringify(data),before);
});
