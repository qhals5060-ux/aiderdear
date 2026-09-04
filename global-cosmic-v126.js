(function(){
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const PAGE_CONFIG={
    home:{b:[78,-8,4,89],o:[[78,5,158,64,-20],[1,73,128,51,19],[60,88,145,56,-8]],s:[[92,10,3,'a'],[83,23,1.5,''],[6,17,2.5,'b'],[12,57,2,''],[94,69,3,'c'],[5,90,2,''],[72,94,1.5,''],[52,5,2,''],[31,88,1.5,''],[88,48,2,'']],p:[[96,42],[7,78]],c:[5,64]},
    insights:{b:[76,-6,2,82],o:[[77,3,164,67,-26],[0,80,134,54,12],[63,91,150,57,-12]],s:[[91,8,3,'a'],[82,31,1.5,''],[5,12,2,'b'],[12,55,3,''],[94,75,2,'c'],[7,90,2.5,''],[62,6,1.5,''],[26,84,2,''],[72,49,1.5,''],[87,91,2,'']],p:[[96,51],[5,68]],c:[70,74]},
    event:{b:[79,-4,1,86],o:[[80,7,158,61,-22],[2,71,121,47,23],[59,90,151,58,-10]],s:[[94,15,2.5,'a'],[84,33,1.5,''],[5,9,3,'b'],[9,48,2,''],[95,63,2.5,'c'],[7,88,1.5,''],[72,95,2,''],[35,6,1.5,''],[45,82,2,''],[88,44,1.5,'']],p:[[97,43],[4,66]],c:[7,71]},
    routine:{b:[74,-8,4,87],o:[[76,3,168,69,-28],[1,77,132,50,15],[61,89,148,57,-9]],s:[[91,10,3,'a'],[87,28,1.5,''],[6,16,2.5,'b'],[4,52,1.5,''],[96,70,2.5,'c'],[8,92,3,''],[65,4,1.5,''],[30,87,2,''],[77,52,1.5,''],[91,88,2,'']],p:[[96,38],[4,73]],c:[68,69]},
    personal:{b:[81,-6,1,83],o:[[82,4,156,63,-17],[0,69,131,53,25],[57,90,153,59,-11]],s:[[94,8,3,'a'],[79,27,1.5,''],[4,21,2.5,'b'],[10,58,1.5,''],[96,79,2.5,'c'],[3,92,2,''],[69,5,1.5,''],[37,86,2,''],[84,50,1.5,''],[15,34,2,'']],p:[[97,47],[6,67]],c:[6,72]},
    language:{b:[77,-5,3,85],o:[[79,5,161,62,-24],[3,79,127,49,17],[60,89,151,58,-12]],s:[[92,13,3,'a'],[86,35,1.5,''],[5,11,2.5,'b'],[8,51,2,''],[95,73,3,'c'],[6,91,2,''],[70,4,1.5,''],[32,86,2,''],[82,48,1.5,''],[19,30,2,'']],p:[[97,43],[4,63]],c:[69,72]},
    fifth:{b:[80,-8,2,86],o:[[81,2,165,67,-21],[1,74,131,52,24],[59,90,150,57,-10]],s:[[93,9,3,'a'],[83,30,1.5,''],[4,18,2.5,'b'],[9,54,1.5,''],[96,67,3,'c'],[5,90,2,''],[61,5,1.5,''],[31,87,2,''],[78,47,1.5,''],[18,35,2,'']],p:[[97,40],[5,71]],c:[7,70]}
  };
  const fallback=PAGE_CONFIG.home;
  function atmosphereMarkup(config){
    const [x1,y1,x2,y2]=config.b;
    const blooms=`<i class="global-bloom-v126" style="left:${x1}%;top:${y1}%"></i><i class="global-bloom-v126 secondary" style="left:${x2}%;top:${y2}%"></i>`;
    const orbits=config.o.map(([left,top,width,height,tilt])=>`<i class="global-orbit-v126" style="left:${left}%;top:${top}%;width:${width}px;height:${height}px;--orbit-tilt:${tilt}deg"></i>`).join('');
    const stars=config.s.map(([left,top,size,motion],index)=>`<i class="global-star-v126${motion?` twinkle-${motion}`:''}" style="left:${left}%;top:${top}%;--star-size:${size}px;--star-alpha:${.34+(index%4)*.12}"></i>`).join('');
    const sparkles=config.p.map(([left,top])=>`<i class="global-sparkle-v126" style="left:${left}%;top:${top}%"></i>`).join('');
    const constellation=`<svg class="global-constellation-v126" style="left:${config.c[0]}%;top:${config.c[1]}%" viewBox="0 0 118 66" aria-hidden="true"><path d="M5 51 29 31 54 42 77 16 110 7"/><circle cx="5" cy="51" r="2"/><circle cx="29" cy="31" r="1.5"/><circle cx="54" cy="42" r="2.4"/><circle cx="77" cy="16" r="1.6"/><circle cx="110" cy="7" r="2.2"/></svg>`;
    return blooms+orbits+stars+sparkles+constellation;
  }
  function ensureAtmospheres(){
    Object.keys(PAGE_CONFIG).forEach(id=>{const page=document.getElementById(id);if(!page)return;page.classList.add('global-cosmic-page-v126');if(page.querySelector(':scope > .global-cosmic-atmosphere-v126'))return;const layer=document.createElement('div');layer.className='global-cosmic-atmosphere-v126';layer.setAttribute('aria-hidden','true');layer.innerHTML=atmosphereMarkup(PAGE_CONFIG[id]||fallback);page.append(layer)});
  }
  function fixWheel(){
    const wheel=$('#wheel');if(!wheel)return;wheel.dataset.globalV126='1';
    const order=[['fifth','My','my'],['language','Language','language'],['personal','Personal','profile'],['routine','Routine','routine'],['event','Event','event']];
    $$('.global-wheel-item-v126',wheel).forEach((button,index)=>{const [page,label,iconName]=order[index],expectedClass=`global-wheel-item-v126 slot-${index}`;if(button.dataset.page===page&&button.dataset.index===String(index)&&button.className===expectedClass&&!button.querySelector('b')&&button.querySelector('.global-svg-icon-v126'))return;button.dataset.page=page;button.dataset.index=String(index);button.className=expectedClass;button.setAttribute('aria-label',label);button.title=label;const svg=window.AiderLogIconsV126?.icon(iconName)||'';button.innerHTML=`<i>${svg}</i>`});
  }
  function sparkleBurst(core){
    core.classList.remove('bursting');void core.offsetWidth;core.classList.add('bursting');
    const points=[[-23,-17,4,'dot'],[-15,-34,6,'spark'],[15,-30,3,'dot'],[31,-12,5,'spark'],[25,18,3,'dot']];
    points.forEach(([x,y,size,kind],index)=>{const node=document.createElement('span');node.className=`wheel-burst-v126 ${kind}`;node.style.setProperty('--burst-x',`${x}px`);node.style.setProperty('--burst-y',`${y}px`);node.style.setProperty('--burst-size',`${size}px`);node.style.setProperty('--burst-duration',`${420+index*34}ms`);core.append(node);setTimeout(()=>node.remove(),650)});
    setTimeout(()=>core.classList.remove('bursting'),520);
  }
  function bindWheel(){
    const core=$('#wheelCore');if(!core||core.dataset.globalBoundV126==='1')return;core.dataset.globalBoundV126='1';core.addEventListener('pointerdown',()=>sparkleBurst(core),{passive:true});
    const params=new URLSearchParams(location.search);if(params.get('wheel')==='open')$('#wheel')?.classList.add('open');if(params.get('wheel')==='pressed'){core.classList.add('pressing');sparkleBurst(core)}
  }
  function decorate(){ensureAtmospheres();fixWheel();bindWheel()}
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',queue,{once:true}):queue();
})();
