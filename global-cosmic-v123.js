(function () {
  'use strict';

  const ICONS = {
    profile:'<circle cx="12" cy="7.3" r="3.5"/><path d="M5.3 20.2c.3-4 2.7-6.2 6.7-6.2s6.4 2.2 6.7 6.2"/><path class="cosmic-accent" d="m18.4 4 .4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1Z"/>',
    memo:'<path d="M6 3.5h10.5A1.5 1.5 0 0 1 18 5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z"/><path d="M8 8h6.7M8 12h7.5M8 16h4.8"/><path class="cosmic-accent" d="M18 7.3h1.5"/>',
    mail:'<rect x="3.5" y="5" width="17" height="14" rx="2.2"/><path d="m4.5 7 7.5 5.6L19.5 7"/><circle class="cosmic-accent" cx="19.5" cy="4.3" r=".8"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.1"/><path d="m15.4 15.4 4.4 4.4"/><path class="cosmic-accent" d="M7.5 6.3a6.2 6.2 0 0 1 5.6-.9"/>',
    insights:'<path d="M5 19V13M10 19V9M15 19V5"/><path d="M3 19.5h16"/><path class="cosmic-accent" d="m19.1 4 .45 1.15 1.15.45-1.15.45-.45 1.15-.45-1.15-1.15-.45 1.15-.45.45-1.15Z"/>',
    calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17"/><circle class="cosmic-accent" cx="12" cy="14.5" r="1"/>',
    event:'<path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v3a2.5 2.5 0 0 0 0 5v3a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17v-3a2.5 2.5 0 0 0 0-5V6A1.5 1.5 0 0 1 5 4.5Z"/><path d="M9 4.5v14"/><path class="cosmic-accent" d="m14 9 .5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2Z"/>',
    routine:'<path d="M9 6h10M9 12h10M9 18h10"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/><path class="cosmic-accent" d="M17.3 15.8a2.7 2.7 0 0 1 1.7.8"/>',
    archive:'<path d="M4 7.5h16v11A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-11Z"/><path d="M3.5 4h17v3.5h-17zM9 12h6"/><path class="cosmic-accent" d="M6 9.3h.1"/>',
    record:'<path d="M5 18.5V21h2.5L18.4 10.1l-2.5-2.5L5 18.5Z"/><path d="m14.7 8.8 2.5 2.5"/><path class="cosmic-accent" d="m18.4 3 .4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1Z"/>',
    travel:'<path d="m3.5 13.2 7.7-1.9 4.7-7.1c.6-.9 1.9-1 2.6-.2.5.5.6 1.2.2 1.9l-4.2 6.5 4.4 2.3 1.8-1.5 1 .5-1.2 3.1-3.3.7-.7-.9 1-1.5-4.8-1.1-3.2 4.9-1.6-.4 1.4-5.1-5.5.9-.3-1.1Z"/><path class="cosmic-accent" d="M4.2 9.4c2.2-1.5 4.4-2.2 6.7-2.2"/>',
    language:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5M12 3.5C9.8 5.9 8.7 8.7 8.7 12s1.1 6.1 3.3 8.5"/><circle class="cosmic-accent" cx="19.9" cy="7" r=".75"/>',
    my:'<circle cx="12" cy="9" r="3.4"/><path d="M5.6 20c.5-3.6 2.7-5.6 6.4-5.6s5.9 2 6.4 5.6"/><path class="cosmic-accent" d="m18.8 4 .45 1.15 1.15.45-1.15.45-.45 1.15-.45-1.15-1.15-.45 1.15-.45.45-1.15Z"/>',
    album:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.5"/><path d="m5.5 17 4.2-4 3.1 2.7 2.2-2 3.5 3.3"/><path class="cosmic-accent" d="m18.2 3 .35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    filter:'<path d="M4 5h16l-6.2 7.1v5.4l-3.6 1.8v-7.2L4 5Z"/><circle class="cosmic-accent" cx="18.5" cy="17.5" r=".7"/>',
    sort:'<path d="M8 5v14M5 16l3 3 3-3M16 19V5M13 8l3-3 3 3"/><circle class="cosmic-accent" cx="12" cy="12" r=".55"/>',
    add:'<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/><circle class="cosmic-accent" cx="19.8" cy="7.2" r=".65"/>',
    edit:'<path d="M5 18.5V21h2.5L18.8 9.7l-2.5-2.5L5 18.5Z"/><path d="m15.2 8.4 2.5 2.5"/><path class="cosmic-accent" d="m19 3 .4 1 .95.4-.95.4-.4 1-.4-1-.95-.4.95-.4.4-1Z"/>',
    delete:'<path d="M4.5 7h15M9 3.5h6l1 3.5H8l1-3.5ZM7 7l.8 13h8.4L17 7M10 10v6M14 10v6"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.2 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.4 1a8.2 8.2 0 0 0-2.6-1.5L14 2.5h-4l-.3 2.6a8.2 8.2 0 0 0-2.6 1.5l-2.4-1-2 3.4 2.1 1.5a7.6 7.6 0 0 0 0 3L2.7 15l2 3.4 2.4-1a8.2 8.2 0 0 0 2.6 1.5l.3 2.6h4l.3-2.6a8.2 8.2 0 0 0 2.6-1.5l2.4 1 2-3.4-2.1-1.5Z"/><circle class="cosmic-accent" cx="12" cy="12" r=".7"/>',
    notification:'<path d="M5.5 17h13l-1.5-2.1V10a5 5 0 0 0-10 0v4.9L5.5 17ZM10 20h4"/><circle class="cosmic-accent" cx="17.8" cy="5.2" r=".75"/>',
    heart:'<path d="M20.4 8.9c0 5-8.4 10.3-8.4 10.3S3.6 13.9 3.6 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.4 1.9Z"/><path class="cosmic-accent" d="m19.2 3 .35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    place:'<path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.1"/><circle class="cosmic-accent" cx="12" cy="10" r=".45"/>',
    food:'<path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10v11M9.5 3v4.5A2.5 2.5 0 0 1 7 10M16 21v-7M16 14c-2 0-3.5-1.7-3.5-4 0-3.9 2.1-7 4.5-7v18"/>',
    activity:'<circle cx="12.5" cy="5" r="2"/><path d="m9 21 1.1-5.5-3.5-2.8 2.2-4.1 3.7 2.3 2.3-2.1 3.2 3.3M10.1 15.5l4.2 1.4 2 4.1"/><path class="cosmic-accent" d="M4 17.2c1.7.7 3.2 1 4.6.9"/>',
    book:'<path d="M4 5.2c3-.8 5.7-.2 8 1.5v13c-2.3-1.7-5-2.3-8-1.5v-13ZM20 5.2c-3-.8-5.7-.2-8 1.5v13c2.3-1.7 5-2.3 8-1.5v-13Z"/><path class="cosmic-accent" d="m17.6 8 .3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3.3-.8Z"/>',
    movie:'<rect x="4" y="7" width="16" height="12" rx="2"/><path d="M4 10h16M5.5 7l2-3h3l-2 3M12 7l2-3h3l-2 3"/><path class="cosmic-accent" d="M17.5 13.5h.1"/>',
    music:'<path d="M9 18V7l9-2v11M9 18a2.5 2.5 0 1 1-2.5-2.5H9V18ZM18 16a2.5 2.5 0 1 1-2.5-2.5H18V16Z"/><circle class="cosmic-accent" cx="20" cy="8" r=".65"/>',
    photo:'<rect x="3.5" y="6" width="17" height="13" rx="2.5"/><path d="m8 6 1.2-2h5.6L16 6"/><circle cx="12" cy="12.5" r="3"/><circle class="cosmic-accent" cx="12" cy="12.5" r=".6"/>',
    dday:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17M9 13v4h1.4a2 2 0 0 0 0-4H9Z"/><path class="cosmic-accent" d="M17.2 13.3h.1"/>',
    statistics:'<path d="M12 3.5v8.5h8.5A8.5 8.5 0 1 1 12 3.5Z"/><path d="M15 3.9a8.5 8.5 0 0 1 5.1 5.1H15V3.9Z"/><circle class="cosmic-accent" cx="18.8" cy="14.7" r=".65"/>',
    emotion:'<path d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"/><path d="M8.3 10h.1M15.6 10h.1M8.5 14.2c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"/><path class="cosmic-accent" d="m18.5 5 .35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    timer:'<circle cx="12" cy="13" r="7.5"/><path d="M9 3h6M12 5.5V3M12 13l3-2"/><circle class="cosmic-accent" cx="19.3" cy="8" r=".65"/>',
    health:'<path d="M20.4 8.9c0 5-8.4 10.3-8.4 10.3S3.6 13.9 3.6 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.4 1.9Z"/><path d="M7.5 12h2l1-2.2 2.2 4.4 1.1-2.2h2.7"/>',
    workflow:'<path d="M5 4.5h14v15H5zM8 8l1 1 2-2M8 13l1 1 2-2M13 8h3M13 13h3"/><circle class="cosmic-accent" cx="17.7" cy="17" r=".6"/>',
    finance:'<rect x="3.5" y="5.5" width="17" height="13" rx="2.3"/><path d="M3.5 9.5h17M8.2 14h3.3"/><circle class="cosmic-accent" cx="17" cy="14" r=".7"/>',
    paper:'<path d="M6 3.5h9l3 3V20.5H6zM15 3.5v3h3M9 10h6M9 14h6M9 18h4"/><path class="cosmic-accent" d="m19.2 11 .35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 10 2 2 5-5M8 16h8"/><circle class="cosmic-accent" cx="18.5" cy="12.5" r=".55"/>',
    brain:'<path d="M9.2 4.2A3.2 3.2 0 0 0 6 7.4v.4A3.5 3.5 0 0 0 4 11v.6a3.3 3.3 0 0 0 2.2 3.1v.2A3.1 3.1 0 0 0 9.3 18H12V6.6a2.7 2.7 0 0 0-2.8-2.4ZM14.8 4.2A3.2 3.2 0 0 1 18 7.4v.4a3.5 3.5 0 0 1 2 3.2v.6a3.3 3.3 0 0 1-2.2 3.1v.2a3.1 3.1 0 0 1-3.1 3.1H12V6.6a2.7 2.7 0 0 1 2.8-2.4Z"/><path d="M8 9.3c1 .1 1.7.6 2.1 1.4M16 9.3c-1 .1-1.7.6-2.1 1.4M8.2 14c.8-.5 1.6-.6 2.4-.3M15.8 14c-.8-.5-1.6-.6-2.4-.3"/><circle class="cosmic-accent" cx="12" cy="3.2" r=".55"/>',
    breakfast:'<path d="M4 15a8 8 0 0 1 16 0M3 18h18M12 3v2M5.6 7l1.3 1.3M18.4 7l-1.3 1.3"/>',
    lunch:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5Z"/>',
    dinner:'<path d="M18.2 15.8A7.7 7.7 0 0 1 8.2 5.2 8 8 0 1 0 18.2 15.8Z"/><circle class="cosmic-accent" cx="18.3" cy="6.1" r=".65"/>',
    snack:'<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/>',
    previous:'<path d="m15 6-6 6 6 6"/>',
    next:'<path d="m9 6 6 6-6 6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>'
  };

  function icon(name, className) {
    const body = ICONS[name] || ICONS.record;
    return `<svg class="cosmic-svg-icon-v123${className ? ` ${className}` : ''}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;
  }
  window.AiderLogCosmicIconsV123 = Object.freeze({ icon, names:Object.freeze(Object.keys(ICONS)) });

  const PAGE_ATMOSPHERES = {
    home:{orbits:[[83,7,145,61,-18],[2,74,122,48,18]],stars:[[92,12,2,'a'],[84,23,1.5,''],[6,18,2.5,'b'],[11,63,1.5,''],[94,69,3,'c'],[4,91,2,''],[75,92,1.5,''],[52,5,2,'']],sparkles:[[96,43],[8,80]],bloom:[76,-7]},
    insights:{orbits:[[78,4,154,64,-25],[0,81,130,52,11]],stars:[[90,9,2,'a'],[82,31,1.5,''],[5,13,2,'b'],[12,56,2.5,''],[94,76,1.5,'c'],[7,90,2,''],[62,6,1.5,'']],sparkles:[[96,53],[5,70]],bloom:[78,-6]},
    event:{orbits:[[80,8,150,58,-21],[3,72,116,45,22]],stars:[[94,16,2,'a'],[84,34,1.5,''],[5,9,2,'b'],[9,48,2.5,''],[95,63,2,'c'],[7,88,1.5,''],[72,95,2,'']],sparkles:[[97,45],[4,67]],bloom:[79,-4]},
    routine:{orbits:[[76,4,160,66,-27],[1,77,128,48,15]],stars:[[91,11,2.5,'a'],[87,28,1.5,''],[6,16,2,'b'],[4,52,1.5,''],[96,70,2,'c'],[8,92,2.5,''],[65,4,1.5,'']],sparkles:[[96,39],[4,74]],bloom:[74,-8]},
    personal:{orbits:[[82,5,148,60,-16],[0,70,126,51,25]],stars:[[94,8,2,'a'],[79,27,1.5,''],[4,21,2.5,'b'],[10,58,1.5,''],[96,79,2,'c'],[3,92,2,''],[69,5,1.5,'']],sparkles:[[97,48],[6,68]],bloom:[81,-6]},
    language:{orbits:[[79,6,152,59,-23],[3,79,122,47,17]],stars:[[92,14,2,'a'],[86,35,1.5,''],[5,11,2,'b'],[8,51,1.5,''],[95,73,2.5,'c'],[6,91,2,''],[70,4,1.5,'']],sparkles:[[97,44],[4,64]],bloom:[77,-5]},
    fifth:{orbits:[[81,3,156,63,-20],[1,75,126,49,23]],stars:[[93,10,2,'a'],[83,30,1.5,''],[4,18,2.5,'b'],[9,54,1.5,''],[96,67,2,'c'],[5,90,2,''],[61,5,1.5,'']],sparkles:[[97,41],[5,72]],bloom:[80,-8]}
  };

  function atmosphereMarkup(config) {
    const bloom = `<i class="cosmic-bloom-v123" style="left:${config.bloom[0]}%;top:${config.bloom[1]}%"></i>`;
    const orbits = config.orbits.map(([left,top,width,height,tilt]) => `<i class="cosmic-orbit-v123" style="left:${left}%;top:${top}%;width:${width}px;height:${height}px;--orbit-tilt:${tilt}deg"></i>`).join('');
    const stars = config.stars.map(([left,top,size,motion],index) => `<i class="cosmic-star-v123${motion ? ` twinkle-${motion}` : ''}" style="left:${left}%;top:${top}%;--star-size:${size}px;--star-alpha:${.23 + (index % 3) * .075}"></i>`).join('');
    const sparkles = config.sparkles.map(([left,top]) => `<i class="cosmic-sparkle-v123" style="left:${left}%;top:${top}%"></i>`).join('');
    return bloom + orbits + stars + sparkles;
  }

  function ensureAtmospheres() {
    Object.entries(PAGE_ATMOSPHERES).forEach(([id,config]) => {
      const page = document.getElementById(id);
      if (!page) return;
      page.classList.add('cosmic-page-v123');
      if (page.querySelector(':scope > .cosmic-atmosphere-v123')) return;
      const layer = document.createElement('div');
      layer.className = 'cosmic-atmosphere-v123';
      layer.setAttribute('aria-hidden','true');
      layer.innerHTML = atmosphereMarkup(config);
      page.appendChild(layer);
    });
  }

  function replaceButton(button,name,force) {
    if (!button || (!force && button.dataset.cosmicIconV123 === name)) return;
    button.dataset.cosmicIconV123 = name;
    button.innerHTML = icon(name);
  }
  function replaceSlot(slot,name) {
    if (!slot || slot.dataset.cosmicIconV123 === name) return;
    slot.dataset.cosmicIconV123 = name;
    slot.classList.add('cosmic-glyph-slot-v123');
    slot.innerHTML = icon(name);
  }

  function decorateHeader() {
    const map = [
      [document.getElementById('loginBtn'),'profile'],
      [document.querySelector('.top button[aria-label="memo"]'),'memo'],
      [document.querySelector('.top button[aria-label="mail"]'),'mail'],
      [document.getElementById('searchBtn'),'search']
    ];
    map.forEach(([button,name]) => { if (button) { button.classList.add('cosmic-icon-button-v123'); replaceButton(button,name); } });
  }

  function decorateSchedule() {
    document.querySelectorAll('[data-calendar-shift-v119]').forEach(button => replaceButton(button,Number(button.dataset.calendarShiftV119) < 0 ? 'previous' : 'next'));
    replaceButton(document.querySelector('[data-schedule-insights-v119]'),'insights');
    replaceButton(document.querySelector('[data-schedule-emotion-v119]'),'emotion');
    document.querySelectorAll('[data-schedule-close-v119]').forEach(button => { if (button.textContent.trim() === '×') replaceButton(button,'close'); });
  }

  function decorateEvent() {
    document.querySelectorAll('#event [data-event-mode]').forEach(button => replaceButton(button,button.dataset.eventMode));
    document.querySelectorAll('#event [data-travel-create]').forEach(button => replaceSlot(button.querySelector('i'),button.dataset.travelCreate));
    const album = document.querySelector('#event .album-btn');
    if (album && album.dataset.cosmicCompoundV123 !== '1') {
      album.dataset.cosmicCompoundV123 = '1';
      const label = album.querySelector('span')?.textContent?.trim() || 'Album';
      album.innerHTML = `${icon('album')}<span>${label}</span>`;
      album.classList.add('cosmic-inline-action-v123');
    }
  }

  function decorateRoutine() {
    document.querySelectorAll('#routine [data-routine-create-open]').forEach(button => {
      if (/^\s*[＋+]\s*$/.test(button.textContent)) replaceButton(button,'add');
    });
    document.querySelectorAll('#routine [data-routine-stats-open]').forEach(button => {
      if (button.dataset.cosmicCompoundV123 === '1') return;
      button.dataset.cosmicCompoundV123 = '1';
      const label = button.textContent.trim();
      button.innerHTML = `${icon('statistics')}<span>${label}</span>`;
      button.classList.add('cosmic-inline-action-v123');
    });
  }

  function decoratePersonal() {
    replaceSlot(document.querySelector('#personal [data-poverview] i'),'insights');
    replaceSlot(document.querySelector('#personal [data-ppomodoro] i'),'timer');
    const category = {health:'health',reading:'book',workflow:'workflow',finance:'finance'};
    document.querySelectorAll('#personal [data-pcat]').forEach(button => replaceSlot(button.querySelector('i'),category[button.dataset.pcat]));
    const meal = {breakfast:'breakfast',lunch:'lunch',dinner:'dinner',snack:'snack'};
    document.querySelectorAll('#personal [data-meal]').forEach(button => {
      const slot = button.querySelector('.meal-pic span');
      if (slot) replaceSlot(slot,meal[button.dataset.meal]);
    });
    document.querySelectorAll('#personal [data-padd]').forEach(button => {
      if (button.classList.contains('meal-slot')) return;
      if (button.dataset.cosmicCompoundV123 === '1') return;
      const label = button.textContent.replace(/^[＋+\s]+/,'').trim();
      button.dataset.cosmicCompoundV123 = '1';
      button.innerHTML = `${icon('add')}<span>${label || '추가'}</span>`;
      button.classList.add('cosmic-inline-action-v123');
    });
    const demoCover = document.querySelector('#personal .current-cover.demo');
    if (demoCover) replaceSlot(demoCover,'book');
  }

  function decorateMy() {
    const map = {paper:'paper',task:'task',brain:'brain'};
    Object.entries(map).forEach(([kind,name]) => replaceSlot(document.querySelector(`#fifth .my-tool-v115.${kind} .my-tool-icon-v115`),name));
  }

  function decorateWheel() {
    const map = {home:'calendar',event:'event',routine:'routine',personal:'profile',language:'language',fifth:'my'};
    document.querySelectorAll('#wheel .wheel-seg[data-page]').forEach(button => {
      const host = button.querySelector('i');
      if (host) replaceSlot(host,map[button.dataset.page] || 'calendar');
    });
    const wheel = document.getElementById('wheel');
    if (wheel) wheel.classList.add('cosmic-wheel-v123');
  }

  function decorateCloseButtons() {
    const selector = '.modal button[aria-label*="닫기"],.drawer button[aria-label*="닫기"],.intro button[aria-label*="닫기"],[role="dialog"] button[aria-label*="닫기"],.records-close';
    document.querySelectorAll(selector).forEach(button => { if (button.textContent.trim() === '×') replaceButton(button,'close'); });
  }

  function decorateSurfaces() {
    const selectors = [
      '.view .card','.view .personal-panel','.view .routine-card','.view .routine-goals-v111',
      '.view .event-archive-card-v111','.view .record-card','.view .dest','.view .ticket',
      '#fifth .my-summary-v115 article','#fifth .my-tool-v115'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(node => node.classList.add('cosmic-surface-v123'));
  }

  function decorateLanguageShadow() {
    document.querySelectorAll('aiderlog-language-lab').forEach(host => {
      const root = host.shadowRoot;
      if (!root || root.querySelector('style[data-cosmic-v123]')) return;
      const style = document.createElement('style');
      style.dataset.cosmicV123 = '1';
      style.textContent = `
        :host{--cosmic-bg:#F7F8FD;--cosmic-surface:#fff;--cosmic-primary:#625DF5;--cosmic-secondary:#765CF3;--cosmic-blue:#536CF4;--cosmic-ink:#11152C;--cosmic-muted:#8E93A6;--cosmic-border:#E6E8F1;--cosmic-lavender:#F0EFFF;background:transparent!important;color:var(--cosmic-ink)!important}
        .app-shell{background:transparent!important}
        .app-header{background:rgba(255,255,255,.92)!important;border-color:var(--cosmic-border)!important}
        .learning-section,.course-panel,.wordbook-section,.records-dialog,.review-panel,.weekly-record,.history-panel{border-color:rgba(80,90,130,.09)!important;box-shadow:0 6px 22px rgba(25,30,70,.045)!important}
        .category-tab.active,.scenario-tab.active,.records-button,.footer-primary{background-color:var(--cosmic-primary)!important}
        .streak-chip i{color:var(--cosmic-primary)!important;text-shadow:0 0 7px rgba(98,93,245,.2)}
      `;
      root.appendChild(style);
    });
  }

  function decorate() {
    ensureAtmospheres();
    decorateHeader();
    decorateSchedule();
    decorateEvent();
    decorateRoutine();
    decoratePersonal();
    decorateMy();
    decorateWheel();
    decorateCloseButtons();
    decorateSurfaces();
    decorateLanguageShadow();
  }

  let queued = false;
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; decorate(); });
  }
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',queue,{once:true});
  else queue();
})();
