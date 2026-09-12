/* Deterministic build-only native XML -> SVG/PNG measurement adapter.
 * No browser automation, network or design-by-resource-name shortcuts.
 * Native drawable solid/stroke/corners and layout measurements are interpreted.
 * This produces launcher fallback artwork, NOT Android inflation/device proof.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const deps='C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const sharp=require(deps+'sharp'),xml=require(deps+'xml-js');
const qa=path.resolve(process.argv[2]||path.join(__dirname,'../../../../outputs/widget-v176'));
const bundle=JSON.parse(fs.readFileSync(path.join(qa,'fixtures.json'),'utf8'));
const scale=1,cache=new Map();let serial=0;
const escape=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const parse=s=>xml.xml2js(s,{compact:false}).elements.find(x=>x.type==='element');
const get=(el,k)=>el.attributes?.['android:'+k]||'';
const children=el=>(el.elements||[]).filter(x=>x.type==='element');
const px=x=>Number.parseFloat(x)||0;
const color=s=>/^#[0-9a-f]{8}$/i.test(s)?'#'+s.slice(3)+s.slice(1,3):s;
const edge=(el,type)=>({l:px(get(el,type+'Left')||get(el,type+'Start')||get(el,type)),r:px(get(el,type+'Right')||get(el,type+'End')||get(el,type)),t:px(get(el,type+'Top')||get(el,type)),b:px(get(el,type+'Bottom')||get(el,type))});
function find(el,name){if(el.name===name)return el;for(const child of children(el)){const found=find(child,name);if(found)return found;}}
async function textImage(el,width){
  const text=get(el,'text');if(!text)return {width:0,height:0,data:''};
  const size=px(get(el,'textSize')||'14sp'),spacing=Math.round(size*(px(get(el,'lineSpacingMultiplier'))||1.3)-size+px(get(el,'lineSpacingExtra')));
  const ink=color(get(el,'textColor')||'#171A3A'),font=`Malgun Gothic${get(el,'textStyle')==='bold'?' Bold':''} ${size}`;
  const key=JSON.stringify([text,width,spacing,ink,font]);if(cache.has(key))return cache.get(key);
  const image=await sharp({text:{text:`<span foreground="${ink}">${escape(text)}</span>`,font,width:Math.max(1,Math.floor(width)),dpi:72,rgba:true,wrap:'word-char',spacing}}).png().toBuffer({resolveWithObject:true});
  const result={width:image.info.width,height:image.info.height,data:'data:image/png;base64,'+image.data.toString('base64')};cache.set(key,result);return result;
}
async function layout(el,availableW,availableH,forcedW){
  const a=el.attributes||{},m=edge(el,'layout_margin'),p=edge(el,'padding'),weight=px(get(el,'layout_weight'));
  if(get(el,'visibility')==='gone')return {el,m,p,w:0,h:0,hidden:true,kids:[]};
  const lw=get(el,'layout_width'),lh=get(el,'layout_height');
  let w=forcedW??(lw==='match_parent'||lw==='wrap_content'||!lw?Math.max(0,availableW-m.l-m.r):px(lw));
  if(get(el,'maxWidth'))w=Math.min(w,px(get(el,'maxWidth')));
  let fixedH=lh==='match_parent'?availableH===undefined?undefined:Math.max(0,availableH-m.t-m.b):/^\d/.test(lh)?px(lh):undefined;
  const box={el,m,p,w,h:fixedH,kids:[],weight};const cw=Math.max(1,w-p.l-p.r);
  if(el.name==='TextView'){
    box.image=await textImage(el,cw);box.font=px(get(el,'textSize')||'14sp');
    if(lw==='wrap_content'&&forcedW===undefined)box.w=Math.min(w,box.image.width+p.l+p.r+1);
    box.naturalH=box.image.height?box.image.height+Math.ceil(box.font*.25)+p.t+p.b:0;
    box.h=fixedH??Math.max(px(get(el,'minHeight')),box.naturalH);return box;
  }
  if(el.name==='ImageView'||el.name==='ProgressBar'){box.h=fixedH??px(get(el,'minHeight'));return box;}
  const nodes=children(el),horizontal=get(el,'orientation')==='horizontal';
  if(el.name==='FrameLayout'){
    const content=nodes.filter(n=>!(n.name==='ImageView'&&get(n,'layout_height')==='match_parent'));
    for(const n of content)box.kids.push(await layout(n,cw,fixedH===undefined?undefined:Math.max(0,fixedH-p.t-p.b)));
    box.h=fixedH??Math.max(px(get(el,'minHeight')),p.t+p.b,...box.kids.map(x=>x.h+x.m.t+x.m.b+p.t+p.b));
    // Restore XML draw order: backgrounds first, content in its original position.
    const measured=box.kids;box.kids=[];
    for(const n of nodes)box.kids.push(measured.find(x=>x.el===n)||await layout(n,cw,Math.max(0,box.h-p.t-p.b)));
  }else if(horizontal){
    let remaining=cw,totalWeight=0;const pre=new Map();
    for(const n of nodes){const margin=edge(n,'layout_margin');if(px(get(n,'layout_weight'))){totalWeight+=px(get(n,'layout_weight'));remaining-=margin.l+margin.r;}else{const child=await layout(n,cw,undefined);pre.set(n,child);remaining-=child.w+child.m.l+child.m.r;}}
    for(const n of nodes)box.kids.push(pre.get(n)||await layout(n,cw,undefined,Math.max(0,remaining)*px(get(n,'layout_weight'))/Math.max(1,totalWeight)));
    box.h=fixedH??Math.max(px(get(el,'minHeight')),p.t+p.b,...box.kids.map(x=>x.h+x.m.t+x.m.b+p.t+p.b));
  }else{
    let remaining=fixedH===undefined?undefined:fixedH-p.t-p.b,totalWeight=0;const pre=new Map();
    for(const n of nodes){const margin=edge(n,'layout_margin');if(px(get(n,'layout_weight'))&&remaining!==undefined){totalWeight+=px(get(n,'layout_weight'));remaining-=margin.t+margin.b;}else{const child=await layout(n,cw,undefined);pre.set(n,child);if(remaining!==undefined)remaining-=child.h+child.m.t+child.m.b;}}
    for(const n of nodes){if(pre.has(n))box.kids.push(pre.get(n));else{const nheight=Math.max(0,remaining)*px(get(n,'layout_weight'))/Math.max(1,totalWeight),child=await layout(n,cw,nheight);child.h=nheight;box.kids.push(child);}}
    box.h=fixedH??Math.max(px(get(el,'minHeight')),box.kids.reduce((s,x)=>s+x.h+x.m.t+x.m.b,p.t+p.b));
  }
  let cursor=horizontal?p.l:p.t;
  for(const kid of box.kids){
    if(el.name==='FrameLayout'){kid.x=p.l+kid.m.l;kid.y=p.t+kid.m.t;if(get(kid.el,'layout_gravity')==='bottom')kid.y=box.h-p.b-kid.h-kid.m.b;}
    else if(horizontal){kid.x=cursor+kid.m.l;kid.y=p.t+kid.m.t;if(get(el,'gravity').includes('center_vertical'))kid.y=(box.h-kid.h)/2;cursor+=kid.w+kid.m.l+kid.m.r;}
    else{kid.x=p.l+kid.m.l;kid.y=cursor+kid.m.t;if(get(kid.el,'layout_gravity')==='center_horizontal')kid.x=(box.w-kid.w)/2;cursor+=kid.h+kid.m.t+kid.m.b;}
    if(get(kid.el,'layout_height')==='match_parent'&&el.name==='FrameLayout')kid.h=Math.max(0,box.h-p.t-p.b-kid.m.t-kid.m.b);
    if(get(kid.el,'layout_height')==='match_parent'&&horizontal)kid.h=Math.max(0,box.h-p.t-p.b-kid.m.t-kid.m.b);
  }
  return box;
}
function drawable(ref,x,y,w,h){
  if(!ref||w<=0||h<=0)return '';
  if(ref.startsWith('#'))return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color(ref)}"/>`;
  const key=ref.replace('@drawable/','');
  if(bundle.images[key])return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${bundle.images[key]}" preserveAspectRatio="xMidYMid meet"/>`;
  const source=bundle.drawables[key];if(!source)return '';
  const el=parse(source),solid=find(el,'solid'),stroke=find(el,'stroke'),corners=find(el,'corners');
  const fill=solid?color(get(solid,'color')):'none',line=stroke?`stroke="${color(get(stroke,'color'))}" stroke-width="${px(get(stroke,'width'))}"`:'';
  if(get(el,'shape')==='oval')return `<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${Math.max(0,w/2-.5)}" ry="${Math.max(0,h/2-.5)}" fill="${fill}" ${line}/>`;
  return `<rect x="${x+.5}" y="${y+.5}" width="${Math.max(0,w-1)}" height="${Math.max(0,h-1)}" rx="${corners?px(get(corners,'radius')):0}" fill="${fill}" ${line}/>`;
}
function draw(box,x,y,report){
  if(box.hidden)return '';const {el,w,h,p}=box;let out=drawable(get(el,'background'),x,y,w,h);
  if(el.name==='ImageView')return out+drawable(get(el,'src'),x,y,w,h);
  if(el.name==='ProgressBar'){const value=Math.max(0,Math.min(100,px(get(el,'progress'))));return out+`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${get(el,'progressBackgroundTint')||'#DED9FF'}"/><rect x="${x}" y="${y}" width="${w*value/100}" height="${h}" rx="4" fill="${get(el,'progressTint')||'#6255E8'}"/>`;}
  if(el.name==='TextView'&&box.image.data){
    const i=box.image,gravity=get(el,'gravity'),tx=gravity.includes('right')?x+w-p.r-i.width:gravity==='center'?x+(w-i.width)/2:x+p.l;
    const ty=gravity.includes('center')?y+(h-i.height)/2:y+p.t+box.font*.12;
    const id='clip'+serial++;out+=`<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image x="${tx}" y="${ty}" width="${i.width}" height="${i.height}" href="${i.data}" clip-path="url(#${id})"/>`;
    if(y+h>report.height+1)report.outside.push(get(el,'text'));
  }
  for(const kid of box.kids)out+=draw(kid,x+(kid.x||0),y+(kid.y||0),report);return out;
}
async function main(){
  const reports=[];
  for(const spec of bundle.specs){
    const target=path.resolve(spec.destination),allowed=[path.resolve(bundle.manifest.res,'drawable-nodpi'),qa];assert(allowed.includes(path.dirname(target)),'Preview output stays in declared directories');
    const tree=await layout(parse(spec.xml),spec.width,spec.height,spec.width),report={name:spec.name,width:spec.width,height:spec.height,outside:[]};
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">${draw(tree,0,0,report)}</svg>`;
    await sharp(Buffer.from(svg)).resize(spec.width*scale,spec.height*scale).png().toFile(target);
    reports.push(report);
  }
  const record={renderer:'Deterministic native XML measurement adapter; not Android/device screenshots',count:reports.length,reports};
  fs.writeFileSync(path.join(qa,'raster-report.json'),JSON.stringify(record,null,2));
  for(const wide of [false,true]){
    const rows=bundle.specs.filter(s=>s.native!==wide),cellW=wide?500:260,cellH=wide?340:420,columns=wide?3:5,items=[];
    for(let i=0;i<rows.length;i++){const bytes=await sharp(rows[i].destination).resize({width:cellW-16,height:cellH-36,fit:'inside'}).png().toBuffer(),meta=await sharp(bytes).metadata();items.push({input:bytes,left:i%columns*cellW+8,top:Math.floor(i/columns)*cellH+28});const label=Buffer.from(`<svg width="${cellW}" height="24"><text x="8" y="17" font-family="Arial" font-size="11">${escape(rows[i].kind)}</text></svg>`);items.push({input:label,left:i%columns*cellW,top:Math.floor(i/columns)*cellH});}
    await sharp({create:{width:columns*cellW,height:cellH*Math.ceil(rows.length/columns),channels:4,background:'#e8e8ed'}}).composite(items).png().toFile(path.join(qa,'contact-'+(wide?'wide':'narrow')+'.png'));
  }
  console.log(JSON.stringify({count:reports.length,outside:reports.filter(r=>r.outside.length).map(r=>({name:r.name,count:r.outside.length})),report:path.join(qa,'raster-report.json')}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
