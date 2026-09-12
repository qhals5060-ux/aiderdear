const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const repo = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repo, 'insight-range-v175.js'), 'utf8');
const now = Date.parse('2026-09-12T06:00:00Z');
const plain = value => JSON.parse(JSON.stringify(value));

function fixture(pref) {
  const storage = new Map(pref === undefined ? [] : [['aiderlog-insight-days-v175', pref]]), events = [];
  const root = {
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    dispatchEvent: event => events.push(event)
  };
  vm.runInNewContext(source, { window: root });
  return { api: root.AiderLogInsightRangeV175, storage, events };
}
test('supports only 7,15,30 days and keeps preference without storing records', () => {
  const { api, storage, events } = fixture('15');
  assert.equal(api.days(), 15);
  assert.equal(api.setDays(7), true);
  assert.equal(api.setDays(7), false);
  assert.equal(api.setDays(90), false);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'aiderlog-insight-range-change');
  assert.deepEqual(plain(events[0].detail), { days: 7 });
  assert.deepEqual([...storage], [['aiderlog-insight-days-v175', '7']]);
  assert.equal(fixture('broken').api.days(), 30);
});
test('Korean today and inclusive range boundaries are independent of local timezone', () => {
  const { api } = fixture();
  assert.equal(api.dateKey('2026-09-11T14:59:59Z'), '2026-09-11');
  assert.equal(api.dateKey('2026-09-11T15:00:00Z'), '2026-09-12');
  assert.deepEqual(plain(api.bounds(7, now)), { days: 7, from: '2026-09-06', to: '2026-09-12' });
  assert.deepEqual(plain(api.bounds(15, now)), { days: 15, from: '2026-08-29', to: '2026-09-12' });
  assert.deepEqual(plain(api.bounds(30, now)), { days: 30, from: '2026-08-14', to: '2026-09-12' });
});
test('invalid, missing, future and outside dates are excluded without mutation', () => {
  const { api } = fixture();
  const rows = [{ id:'old',date:'2026-09-05' },{ id:'first',date:'2026-09-06' },{ id:'today',date:'2026-09-12' },{ id:'future',date:'2026-09-13' },{ date:'2026-02-31' },{},null];
  const before = JSON.stringify(rows);
  assert.deepEqual(plain(api.filterRows(rows, 7, now)).map(row => row.id), ['first','today']);
  assert.equal(JSON.stringify(rows), before);
  assert.deepEqual(plain(api.filterRows(rows, 7, 'invalid')), []);
  assert.equal(api.rowDate({createdDate:'2026-09-10'}), '2026-09-10');
  assert.equal(api.rowDate({day:'2026-09-10'}), '2026-09-10');
});
test('range affects mood, activity, after-activity, context, averages and daily counts together', () => {
  const { api } = fixture();
  const rows = [
    {date:'2026-09-12',mood:'행복',intensity:2,currentActivities:['산책'],afterActivities:['휴식'],location:'공원',companion:'친구',time:'12:15'},
    {date:'2026-09-01',mood:'불안',intensity:4,currentActivities:['업무'],afterActivities:['대화'],location:'회사',companion:'동료',time:'20:10'},
    {date:'2026-08-15',mood:'슬픔',intensity:3,currentActivities:['공부'],location:'도서관'},
    {date:'2026-07-01',mood:'외로움',intensity:5,currentActivities:['이전 기록']}
  ];
  for (const [days, expected] of [[7,1],[15,2],[30,3]]) {
    const data = api.summarize(rows, days, now);
    assert.equal(data.basis.length, expected);
    assert.equal(data.moodRank.length, expected);
    assert.equal(data.current.length, expected);
    assert.equal(data.places.length, expected);
    assert.equal(data.daily.length, days);
    assert.equal(data.daily.reduce((sum, day) => sum + day.count, 0), expected);
    assert.equal(data.moodRank.some(item => item[0] === '외로움'), false);
  }
  const short = api.summarize(rows, 7, now);
  assert.deepEqual(plain(short.after), [['휴식',1]]);
  assert.deepEqual(plain(short.people), [['친구',1]]);
  assert.deepEqual(plain(short.times), [['오후 12–18시',1]]);
  assert.equal(short.average, 2);
  assert.equal(api.summarize(rows, 15, now).average, 3);
});
test('empty range never falls back to all-time records or invented defaults', () => {
  const { api } = fixture();
  api.setDays(7);
  const old = [{date:'2025-01-01',mood:'예전 감정',intensity:5,currentActivities:['옛날활동']}];
  assert.equal(api.summarize(old, 7, now).basis.length, 0);
  const html = api.mobileMarkup(old, now);
  assert.match(html, /선택한 기간에 기록이 없습니다/);
  assert.doesNotMatch(html, /예전 감정|옛날활동|저녁 산책|20분 추천|긴장이 낮아지는|C70 36/);
  assert.match(html, />—<\/strong>/);
  assert.equal(api.summarize([{date:'2026-09-12'}],7,now).average, null);
});
test('mobile renders actual daily bars and accessible expanded records, not decorative fake graph', () => {
  const { api } = fixture();
  api.setDays(7);
  const html = api.mobileMarkup([{date:'2026-09-12',mood:'감사',intensity:3}],now);
  assert.match(html, /2026-09-06 – 2026-09-12 · 1회 기록/);
  assert.match(html, /최근 7일 자주 느낀 감정/);
  assert.match(html, /title="2026-09-12 · 1회"/);
  assert.match(html, /날짜별 기록 확인/);
  assert.doesNotMatch(html, /<svg|<path/);
  assert.equal((html.match(/data-insight-days-v175=/g) || []).length, 3);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
});
test('user labels are escaped in summaries and charts', () => {
  const { api } = fixture();
  const html = api.mobileMarkup([{date:'2026-09-12',mood:'<img src=x onerror=alert(1)>',location:'<script>bad</script>'}],now);
  assert.doesNotMatch(html, /<img|<script/);
  assert.match(html, /&lt;img/);
});
test('browser buttons dispatch real range changes and site placeholder receives the selector', () => {
  const clicks = [], ready = [], events = [], group = {innerHTML:'', querySelector:()=>null};
  const root = {CustomEvent:class {constructor(type,init){this.type=type;this.detail=init.detail}},dispatchEvent:event=>events.push(event),document:{
    readyState:'loading',documentElement:{classList:{add(){}}},querySelector:()=>group,querySelectorAll:()=>[],
    addEventListener:(name,handler)=>{(name==='click'?clicks:ready).push(handler)}
  }};
  vm.runInNewContext(source,{window:root});
  ready[0]();
  assert.match(group.innerHTML,/인사이트 기간/);
  let prevented=0,stopped=0;
  clicks[0]({target:{closest:()=>({dataset:{insightDaysV175:'15'}})},preventDefault(){prevented++},stopPropagation(){stopped++}});
  assert.equal(root.AiderLogInsightRangeV175.days(),15);
  assert.equal(prevented,1);assert.equal(stopped,1);assert.equal(events.length,1);
});
test('Android and site share byte-identical range implementation and Android uses it', () => {
  for(const name of ['insight-range-v175.js','insight-range-v175.css']){
    assert.equal(fs.readFileSync(path.join(repo,name),'utf8').replace(/\r/g,''),fs.readFileSync(path.join(repo,'android-src/assets',name),'utf8').replace(/\r/g,''));
  }
  const android=fs.readFileSync(path.join(repo,'android-src/assets/experience-v143.js'),'utf8');
  assert.match(android,/host\.innerHTML=api\.mobileMarkup\(insightRows\(\)\)/);
  assert.match(android,/addEventListener\('aiderlog-insight-range-change',renderInsightsV143\)/);
  assert.doesNotMatch(android,/recent\.length\?recent:all|M10 145 C70 36/);
});
