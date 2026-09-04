const renderEventBeforeV112=renderEvent;
renderEvent=function(){
  renderEventBeforeV112();
  if(eventMode!=='travel')return;
  const travel=event.querySelector('.travel-v111'),header=travel?.querySelector('header'),route=travel?.querySelector('.ticket-route-v111');
  header?.querySelector('p')?.remove();
  if(!route)return;
  const originalStops=Array.from(route.children).filter(node=>node.tagName==='DIV'),destination=originalStops.at(-1)?.querySelector('small')?.textContent?.trim()||'YOUR CITY';
  route.classList.add('ticket-route-v112');
  route.innerHTML=`<div class="ticket-airport-v112"><small>DEPARTURE</small><b>SEL</b><em>SEOUL · KR</em></div><div class="ticket-flight-v112"><small>BOARDING PASS</small><span><i></i><b>✈</b><i></i></span><em>ONE WAY · FLEX</em></div><div class="ticket-airport-v112 arrival"><small>DESTINATION</small><b>NEXT</b><em>${esc(destination)}</em></div><div class="ticket-stub-v112"><small>GATE</small><b>--</b><i aria-hidden="true"></i></div>`;
};
if(location.hash==='#event')renderEvent();
