/* One color vocabulary for Google imports, the website, app and widget publisher.
 * Pure display/assignment functions: no storage, network, or authentication effects.
 * Node's calendar endpoint imports this classic browser module for the same rules. */
(function(root){
  'use strict';
  const palette=Object.freeze([
    ['#7864AD','라벤더'],['#4D7FAA','블루'],['#508276','세이지'],['#966B4B','브라운'],
    ['#B77686','로즈'],['#A88A49','머스터드'],['#417D88','틸'],['#B46D50','테라코타'],
    ['#765545','코코아'],['#A88A68','모카'],['#C2A578','베이지'],['#8A6F92','모브'],
    ['#687FAC','페리윙클'],['#6B8C50','올리브'],['#B56766','코랄'],['#8D709F','라일락'],
    ['#57758C','슬레이트'],['#A47D32','오커'],['#837666','토프'],['#678D91','더스티 민트']
  ].map(([color,label])=>Object.freeze({color,label})));
  const sanitize=value=>/^#[0-9a-f]{6}$/i.test(String(value||''))?String(value).toUpperCase():'';
  const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj||{},key)?obj[key]:undefined;
  const lexical=(a,b)=>a<b?-1:a>b?1:0;
  function googleId(row){
    if(!row||row.isHoliday||row.isBirthday||row.isAiderDear||row.projectionSource)return '';
    const provider=String(row.externalSource||''),id=String(row.calendarId||'').trim();
    if(!id||provider&&provider!=='google'||/^(?:firebase|notion|work|consult|estate)(?:[:_-]|$)/i.test(id))return '';
    if(id.startsWith('google:'))return id.slice(7);
    if(provider==='google')return id;
    // Older direct Google imports used raw email-like calendar IDs.
    return row.googleEventId&&(id==='primary'||id.includes('@'))?id:'';
  }
  function hash(value){let n=2166136261;for(let i=0;i<value.length;i++){n^=value.charCodeAt(i);n=Math.imul(n,16777619);}return n>>>0;}
  function extraColor(index){
    const h=(index*137.507764)%360,s=.48,l=.42+(index%3)*.07,c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
    const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
    return '#'+rgb.map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('').toUpperCase();
  }
  function allocate(rawIds,{overrides={},automatic={}}={}){
    const ids=[...new Set((Array.isArray(rawIds)?rawIds:[]).map(id=>String(id||'').trim()).filter(Boolean))].sort(lexical);
    const colors=Object.create(null),next=Object.create(null),used=new Set();
    // Explicit selections are authoritative, including intentional repeated colors.
    for(const id of ids){const color=sanitize(own(overrides,id));if(color){colors[id]=color;used.add(color);}}
    for(const id of ids){if(colors[id])continue;const color=sanitize(own(automatic,id));if(color&&!used.has(color)){colors[id]=color;next[id]=color;used.add(color);}}
    for(const id of ids){if(colors[id])continue;const start=hash(id)%palette.length;let color='';for(let step=0;step<palette.length;step++){const candidate=palette[(start+step)%palette.length].color;if(!used.has(candidate)){color=candidate;break;}}
      if(!color){let step=hash(id)%360;do{color=extraColor(step++);}while(used.has(color));}
      colors[id]=color;next[id]=color;used.add(color);
    }
    return {colors,automatic:next};
  }
  function forRows(rows){
    const groups=new Map();
    for(const row of Array.isArray(rows)?rows:[]){const id=googleId(row);if(!id)continue;if(!groups.has(id))groups.set(id,new Map());const color=Number(row.sourceColorVersion)>=198?sanitize(row.sourceColor):'';if(color){const counts=groups.get(id);counts.set(color,(counts.get(color)||0)+1);}}
    const overrides=Object.create(null);
    // Valid versioned imports already carry the account's saved assignment.
    // Resolve inconsistent historical rows deterministically, independent of ordering.
    for(const [id,counts]of groups)if(counts.size)overrides[id]=[...counts].sort((a,b)=>b[1]-a[1]||lexical(a[0],b[0]))[0][0];
    return allocate([...groups.keys()],{overrides}).colors;
  }
  function color(row,map,fallback=''){
    const id=googleId(row);if(id)return sanitize(own(map,id))||(Number(row.sourceColorVersion)>=198?sanitize(row.sourceColor):'')||allocate([id]).colors[id];
    return sanitize(fallback)||sanitize(row?.sourceColor)||sanitize(row?.color)||'#7864AD';
  }
  const api=Object.freeze({version:198,palette,sanitize,googleId,allocate,forRows,color});
  root.AiderCalendarColorsV198=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
