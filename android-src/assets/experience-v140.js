(() => {
  'use strict';
  let queued=false;
  function installWheelArtwork(){
    const core=document.querySelector('#wheelCore');
    if(!core||core.querySelector('.wheel-art-v140'))return;
    const image=document.createElement('img');
    image.className='wheel-art-v140';
    image.src='./wheel-planet-v140.png';
    image.alt='';
    image.setAttribute('aria-hidden','true');
    image.draggable=false;
    core.prepend(image);
  }
  function refresh(){queued=false;installWheelArtwork()}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(refresh)}
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
