const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'android-src/assets/app-calendar-v179.js'),'utf8');
const css=fs.readFileSync(path.join(root,'android-src/assets/app-calendar-v179.css'),'utf8');
function harness(){
  let home=null;const wide={matches:false,addEventListener(){}};
  const context={Date,matchMedia:()=>wide,requestAnimationFrame:()=>1,MutationObserver:class{observe(){}},document:{querySelector:()=>home,getElementById:()=>({})},window:{}};
  vm.runInNewContext(source,context);return {api:context.window.AiderCalendarLayoutV179,wide,setHome:value=>home=value,context};
}
const keys=(first,count=42)=>Array.from({length:count},(_,i)=>{const date=new Date(first+'T12:00:00');date.setDate(date.getDate()+i);return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');});
test('todo strip follows the currently shown current-week row, not a fixed second week',()=>{
  const {todoPosition}=harness().api,dates=keys('2026-08-30');
  for(const [today,last] of [['2026-09-01',6],['2026-09-06',13],['2026-09-19',20],['2026-09-30',34],['2026-10-10',41]]){
    const result=todoPosition(dates,today);assert.equal(result.last,last);assert.equal(result.weeks,6);
    assert.equal(result.rows.split('78px').length,2);assert.equal((result.rows.match(/minmax/g)||[]).length,6);
  }
  assert.equal(todoPosition(dates,'2025-01-01').last,6);assert.equal(todoPosition(dates,'2027-01-01').last,41);
  assert.equal(todoPosition([]),null);
});
test('opening and closing Fold moves the same todo host without losing its contents',()=>{
  const h=harness(),today=new Date(),first=new Date(today.getFullYear(),today.getMonth(),1);first.setDate(first.getDate()-first.getDay());
  const dates=keys([first.getFullYear(),String(first.getMonth()+1).padStart(2,'0'),String(first.getDate()).padStart(2,'0')].join('-'));
  const days={children:[],style:{values:{},setProperty(key,value){this.values[key]=value}},querySelectorAll(){return this.children.filter(n=>n.dataset)}};
  const side={children:[],append(node){move(node,this,this.children.length)}};
  function move(node,parent,index){if(node.parentNode){const prev=node.parentNode.children,i=prev.indexOf(node);prev.splice(i,1);if(parent===node.parentNode&&i<index)index--;}parent.children.splice(index,0,node);node.parentNode=parent;}
  for(const date of dates){const node={dataset:{scheduleDateV125:date},parentNode:days,after(next){move(next,days,days.children.indexOf(this)+1)},get nextElementSibling(){return days.children[days.children.indexOf(this)+1]}};days.children.push(node);}
  const todo={children:[{text:'unchanged incomplete record'}],parentNode:null};move(todo,days,14);
  h.setHome({querySelector(selector){return selector.includes('data-todo-inline')?todo:selector.includes('schedule-days')?days:side}});
  h.api.refresh();const end=h.api.todoPosition(dates).last;assert.equal(days.children.indexOf(todo),end+1);
  h.wide.matches=true;h.api.refresh();assert.equal(todo.parentNode,side);assert.equal(side.children.length,1);
  h.wide.matches=false;h.api.refresh();assert.equal(todo.parentNode,days);assert.equal(days.children.indexOf(todo),end+1);
  assert.equal(todo.children[0].text,'unchanged incomplete record');assert.equal(days.children.filter(n=>n===todo).length,1);
});
test('D-day title shares its value row and compact calendar controls follow text width',()=>{
  assert.match(css,/\.dday-main-v179>strong \{grid-column:1;grid-row:1/);
  assert.match(css,/\.dday-main-v179>b \{grid-column:2;grid-row:1/);
  assert.match(css,/\.dday-others-v179 \{[^}]*height:40px;max-height:40px/);
  assert.match(css,/\.schedule-calctl-v119 button \{width:24px!important;[^}]*height:25px!important/);
  assert.match(css,/\.schedule-today-v119 \{width:auto!important;min-width:0!important;padding-inline:7px!important/);
});
test('empty todo strip retains three-row space and Fold keeps the side column',()=>{
  assert.match(css,/\.calendar-todos-v179 \{[^}]*min-height:78px;max-height:78px/);
  assert.match(css,/\.calendar-todos-v179 \.todo-inline-grid-v179 \{grid-auto-rows:24px!important;min-height:72px!important;max-height:none!important;overflow:visible!important/);
  assert.match(css,/min-width:600px/);assert.match(css,/grid-template-columns:minmax\(0,1\.65fr\) minmax\(210px,1fr\)/);
  const todo=fs.readFileSync(path.join(root,'android-src/assets/app-todo-v179.js'),'utf8');
  assert.match(todo,/element\.hidden=false/);assert.doesNotMatch(todo,/element\.hidden=!incomplete\(\)\.length/);
});
test('app calendar changes are mirrored without adding app CSS to the website',()=>{
  for(const file of ['app-calendar-v179.css','app-calendar-v179.js'])assert.equal(fs.readFileSync(path.join(root,'android-src/assets',file),'utf8'),fs.readFileSync(path.join(root,'../AiderLog-v145-decoded/assets',file),'utf8'));
  assert.doesNotMatch(fs.readFileSync(path.join(root,'index.html'),'utf8'),/app-calendar-v179\.css/);
});
