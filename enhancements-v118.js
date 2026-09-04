(function () {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const SHORTS_KEY = 'aiderlog-language-shorts-v118';
  let queued = false;
  let activeUser = null;

  const emotions = {
    joy:{file:'joy.png',label:'기쁨'}, happiness:{file:'happiness.png',label:'행복'}, excitement:{file:'excitement.png',label:'설렘'},
    calm:{file:'calm.png',label:'편안함'}, gratitude:{file:'gratitude.png',label:'감사'}, tired:{file:'tired.png',label:'피곤함'},
    anxiety:{file:'anxiety.png',label:'불안'}, irritation:{file:'irritation.png',label:'짜증'}, loneliness:{file:'loneliness.png',label:'외로움'}, sadness:{file:'sadness.png',label:'슬픔'}
  };
  function emotionMeta(raw) {
    const mood = String(raw || '').trim();
    const rows = [
      [/기쁨|즐거|joy/i,'joy'],[/행복|happy/i,'happiness'],[/설렘|신남|excite|flutter/i,'excitement'],
      [/편안|평온|안정|calm|relax/i,'calm'],[/감사|grat/i,'gratitude'],[/피곤|지침|tired|sleep/i,'tired'],
      [/불안|초조|anx/i,'anxiety'],[/짜증|화남|irrit|annoy/i,'irritation'],[/외로|lonely/i,'loneliness'],[/슬픔|우울|sad/i,'sadness']
    ];
    const key = rows.find(([pattern]) => pattern.test(mood))?.[1] || 'calm';
    return {key, ...emotions[key], display:mood || emotions[key].label};
  }
  function recommendation(mood) {
    const rows = {
      joy:['좋았던 순간 저장하기','사진이나 한 문장으로 오늘의 좋은 장면을 남겨보세요.'],
      happiness:['좋아하는 사람과 공유','행복했던 이유를 짧게 말하거나 보내보세요.'],
      excitement:['다음 행동 1개 정하기','설렘이 흐려지기 전에 바로 할 행동을 적어보세요.'],
      calm:['집중 작업 15분','안정된 흐름으로 미뤄둔 작은 일을 시작해보세요.'],
      gratitude:['고마운 행동 돌려주기','감사의 대상을 떠올리고 작은 행동으로 연결해보세요.'],
      tired:['물 한 잔과 스트레칭','목과 어깨를 풀고 가장 작은 일 하나만 시작해보세요.'],
      anxiety:['10분 걷기','시선을 멀리 두고 일정한 속도로 걸어보세요.'],
      irritation:['5분 자리 이동','자극에서 잠시 떨어져 손과 턱의 힘을 풀어보세요.'],
      loneliness:['안부 한 줄 보내기','부담 없는 사람 한 명에게 짧은 메시지를 보내보세요.'],
      sadness:['햇빛 가까이 앉기','밝은 곳에서 감정을 밀어내지 말고 천천히 몸을 움직여보세요.']
    };
    return rows[mood] || rows.calm;
  }

  function decorateWheel() {
    const wheel = $('#wheel');
    if (!wheel || wheel.dataset.reverseV118 === '1') return;
    const label = $('#fifthLabel')?.textContent?.trim() || 'My';
    const rows = [
      ['.wheel-seg.e','fifth','☆',label,true],
      ['.wheel-seg.r','language','文','Language'],
      ['.wheel-seg.p','personal','◉','Personal'],
      ['.wheel-seg.l','routine','▤','Routine'],
      ['.wheel-seg.m','event','⌁','Event']
    ];
    rows.forEach(([selector,page,icon,text,keepId]) => {
      const button = $(selector,wheel); if (!button) return;
      button.dataset.page = page;
      button.innerHTML = `<i>${icon}</i><b${keepId?' id="fifthLabel"':''}>${esc(text)}</b>`;
    });
    wheel.dataset.reverseV118 = '1';
  }

  function decorateIntroMascot() {
    const host = $('#introMascot'), moodNode = $('#introMood');
    if (!host || !moodNode) return;
    const meta = emotionMeta(moodNode.textContent);
    if (host.dataset.emotionV118 === meta.key && host.querySelector('.al-intro-mascot-v118')) return;
    host.dataset.emotionV118 = meta.key;
    host.innerHTML = `<figure class="al-intro-mascot-v118 mood-${meta.key}" aria-label="${esc(meta.display)} 감정의 젤리빈 마스코트">
      <span class="al-intro-glow-v118"></span><img src="./mascots-v118/${meta.file}" alt="${esc(meta.display)} 감정 마스코트">
      <i class="al-intro-spark-v118 one"></i><i class="al-intro-spark-v118 two"></i><i class="al-intro-spark-v118 three"></i></figure>`;
  }

  function decorateInsights() {
    const root = $('#insights'), hero = root?.querySelector('.ins-hero');
    if (!root || !hero) return;
    if (root.dataset.insightSummaryMovedV132 === '1') return;
    root.querySelector('.ins-hero-recovery')?.remove();
    root.querySelector('.recovery')?.remove();
    if (hero.querySelector('.insight-today-v118')) return;
    const meta = emotionMeta($('#introMood')?.textContent || hero.querySelector('p b')?.textContent || '평온');
    const [activity, detail] = recommendation(meta.key);
    const hasRecords = !/기록하면|기록이 충분하지/.test($('#introText')?.textContent || '');
    const summary = hasRecords
      ? `${meta.display}의 흐름이 오늘 마음에서 가장 선명하게 나타났어요.`
      : '오늘의 감정을 기록하면 하루의 흐름을 한 문장으로 정리합니다.';
    const section = document.createElement('section');
    section.className = 'insight-today-v118';
    section.innerHTML = `<article><small>TODAY · ONE LINE</small><b>오늘의 한 줄 요약</b><p>${esc(summary)}</p></article>
      <article><small>TOP EMOTION</small><b>${esc(meta.display)}</b><p>오늘 가장 많이 느낀 감정</p></article>
      <article><small>ACTIVITY</small><b>${esc(activity)}</b><p>${esc(detail)}</p></article>`;
    hero.append(section);
  }

  const reviewFields = {
    movie:{icon:'🎬',intro:'영화의 장면과 대사를 오래 기억하세요',purpose:'영화에 맞춰 감독·출연진, 관람 정보, 기억할 장면과 대사를 남깁니다.',title:'영화 제목',creator:'감독 · 출연진',place:'관람 장소 · 방식',genre:'장르 · 러닝타임',companions:'함께 본 사람',highlight:'기억할 장면 · 대사',one:'한 줄 평',review:'영화 감상'},
    performance:{icon:'🎭',intro:'무대와 전시의 인상적인 순간을 남기세요',purpose:'공연·전시에 맞춰 출연진·작가, 장소·좌석, 프로그램과 인상적인 순간을 남깁니다.',title:'공연 · 전시 제목',creator:'출연진 · 작가',place:'공연장 · 전시장',genre:'공연 · 전시 유형',companions:'좌석 · 함께한 사람',highlight:'기억할 장면 · 작품',one:'인상 한 줄',review:'공연 · 전시 감상'},
    book:{icon:'📚',intro:'책의 문장과 생각을 오래 기억하세요',purpose:'책에 맞춰 저자·출판 정보, 읽은 범위, 기억할 문장과 감상을 남깁니다.',title:'책 제목',creator:'저자 · 출판사',place:'읽은 장소',genre:'분야 · 출판 정보',companions:'추천한 사람',highlight:'기억할 문장 · 페이지',one:'한 줄 서평',review:'독서 감상'},
    music:{icon:'♫',intro:'음악과 함께한 장면을 오래 기억하세요',purpose:'음악에 맞춰 아티스트·트랙, 들은 장소와 함께한 순간을 남깁니다.',title:'앨범 · 곡 제목',creator:'아티스트',place:'들은 장소',genre:'장르 · 앨범',companions:'함께 들은 사람',highlight:'기억할 트랙 · 가사',one:'한 줄 감상',review:'음악 감상'},
    place:{icon:'⌖',intro:'다시 찾고 싶은 장소의 정보를 남기세요',purpose:'장소에 맞춰 위치·운영 정보, 대표 메뉴나 볼거리, 방문 팁을 남깁니다.',title:'장소 이름',creator:'운영시간 · 문의',place:'주소 · 위치',genre:'장소 유형',companions:'함께 간 사람',highlight:'대표 메뉴 · 볼거리 · 팁',one:'다시 갈 이유',review:'장소 기록'},
    plan:{icon:'▣',intro:'여행의 일정과 준비를 한곳에 정리하세요',purpose:'여행 계획에 맞춰 목적지, 일정·동선, 예산과 준비물을 정리합니다.',title:'계획 이름',creator:'',place:'목적지',genre:'여행 테마',companions:'동행',highlight:'일정 · 동선 · 준비물',one:'이번 여행의 목표',review:'상세 계획'},
    travelPlace:{icon:'⌖',intro:'여행지의 위치와 방문 팁을 정리하세요',purpose:'여행 장소에 맞춰 위치, 운영시간, 이동 방법과 방문 팁을 정리합니다.',title:'장소 이름',creator:'',place:'주소 · 위치',genre:'장소 유형',companions:'함께 갈 사람',highlight:'운영시간 · 이동 · 방문 팁',one:'꼭 볼 것',review:'장소 상세'},
    food:{icon:'♨',intro:'메뉴와 맛의 기억을 여행지별로 남기세요',purpose:'여행 음식에 맞춰 메뉴·가격, 예약 정보와 맛의 기억을 정리합니다.',title:'식당 · 음식 이름',creator:'',place:'위치',genre:'음식 종류',companions:'함께 먹을 사람',highlight:'메뉴 · 가격 · 예약 팁',one:'맛 한 줄',review:'음식 상세'},
    activity:{icon:'☆',intro:'예약부터 준비물까지 체험 정보를 정리하세요',purpose:'여행 놀거리에 맞춰 예약·비용, 준비물과 체험 팁을 정리합니다.',title:'활동 이름',creator:'',place:'체험 장소',genre:'활동 유형',companions:'함께할 사람',highlight:'예약 · 비용 · 준비물',one:'체험 한 줄',review:'활동 상세'}
  };
  function setField(form, name, title, placeholder='') {
    const input = form.elements[name]; if (!input) return;
    const label = input.closest('label');
    if (label) {
      const caption = label.querySelector(':scope > span');
      const text = Array.from(label.childNodes).find(node => node.nodeType === 3);
      if (caption) caption.textContent = title;
      else if (text) text.nodeValue = title;
    }
    if (placeholder) input.placeholder = placeholder;
  }
  function decorateEventForm() {
    const form = $('#eventEditorFormV111'); if (!form) return;
    if (form.dataset.kind === 'record') {
      const emoji = form.elements.emoji;
      if (emoji && emoji.dataset.iconsV118 !== '1') {
        const current = emoji.value;
        const icons = [['✎','메모'],['▧','사진'],['☀','하루'],['☕','카페'],['♬','음악'],['♡','사람'],['⚑','목표'],['✦','기억']];
        emoji.innerHTML = icons.map(([value,label]) => `<option value="${value}">${value} ${label}</option>`).join('');
        emoji.value = icons.some(([value]) => value === current) ? current : '✎';
        emoji.dataset.iconsV118 = '1';
      }
      if (form.dataset.id && !$('.event-uploader-v118')) {
        try {
          const appData = JSON.parse(localStorage.getItem('aiderlog-app-v20') || '{}');
          const row = (appData.records || []).find(item => String(item.id) === String(form.dataset.id));
          const author = row?.authorName || row?.authorEmail;
          if (author) {
            const note = document.createElement('p'); note.className = 'event-uploader-v118'; note.textContent = `업로드 · ${author}`;
            $('.event-editor-head-v111>div')?.append(note);
          }
        } catch (_) {}
      }
      return;
    }
    const category = form.elements.category?.value || 'movie';
    const travelType = form.elements.travelType?.value || 'plan';
    const config = category === 'travel' ? reviewFields[travelType === 'place' ? 'travelPlace' : travelType] : reviewFields[category];
    if (!config) return;
    let tip = $('.event-purpose-v118',form);
    if (!tip) { tip = document.createElement('p'); tip.className='event-purpose-v118'; form.prepend(tip); }
    tip.textContent = config.purpose;
    setField(form,'title',config.title); setField(form,'creator',config.creator || '만든 사람'); setField(form,'place',config.place);
    setField(form,'genre',config.genre); setField(form,'companions',config.companions); setField(form,'highlight',config.highlight);
    setField(form,'detailA',config.highlight); setField(form,'detailB',config.companions); setField(form,'oneLine',config.one); setField(form,'review',config.review);
    const intro=form.querySelector('.event-form-intro-v113');
    if(intro){const icon=intro.querySelector('i'),title=intro.querySelector('b');if(icon)icon.textContent=config.icon;if(title)title.textContent=config.intro;}
  }
  function decorateEvent() {
    const root = $('#event'); if (!root) return;
    const modeIcons = {record:['✎','Record'],archive:['▥','Archive'],travel:['✈','Travel']};
    $$('[data-event-mode]',root).forEach(button => { const row=modeIcons[button.dataset.eventMode]; if(row&&!button.dataset.eventIconV120){button.textContent=row[0];button.title=row[1];button.setAttribute('aria-label',row[1]);} });
    const travelIcons = {plan:'▣',place:'⌖',food:'♨',activity:'☆'};
    $$('[data-travel-create]',root).forEach(button => { const icon=button.querySelector('i'); if(icon&&!icon.dataset.travelIconV120) icon.textContent=travelIcons[button.dataset.travelCreate] || '✦'; });
    const recordHead = $('.record-head',root), toolbar = recordHead?.nextElementSibling;
    if (recordHead && toolbar?.classList.contains('event-toolbar-v111')) {
      const groups = $$('.event-tools-v111',toolbar);
      groups[0]?.remove();
      const controls = groups[1];
      if (controls) {
        let wrap = $('.event-title-tools-v118',recordHead);
        if (!wrap) { wrap=document.createElement('div');wrap.className='event-title-tools-v118';recordHead.append(wrap); }
        const album = $('[data-open-albums]',recordHead); if (album) wrap.append(album);
        wrap.append(controls); toolbar.remove();
      }
    }
    decorateEventForm();
  }

  function readJson(key,fallback) { try { return JSON.parse(localStorage.getItem(key) || '') || fallback; } catch (_) { return fallback; } }
  function writeJson(key,value) { localStorage.setItem(key,JSON.stringify(value)); }
  async function persistShorts(store) {
    const api=window.AiderDearFirebase; if(!activeUser||!api?.readPrivateData||!api?.writePrivateData)return;
    try { const current=await api.readPrivateData()||{};current.languageShortsV118=store;await api.writePrivateData(current); } catch(error){console.warn('Shorts sync skipped',error);}
  }
  function youtubeId(raw) {
    try { const url=new URL(String(raw||'').trim()); if(url.hostname==='youtu.be')return url.pathname.split('/').filter(Boolean)[0]||'';if(!/(^|\.)youtube\.com$/.test(url.hostname))return'';const p=url.pathname.split('/').filter(Boolean);return (p[0]==='shorts'||p[0]==='embed')?(p[1]||''):(url.searchParams.get('v')||''); } catch(_){return'';}
  }
  function shortsStore(){const value=readJson(SHORTS_KEY,{current:null,notes:[]});value.notes=Array.isArray(value.notes)?value.notes:[];return value;}
  function renderShorts(){
    const root=$('.al-shorts-v118');if(!root)return;const store=shortsStore(),frame=$('.al-shorts-frame-v118',root),list=$('.al-shorts-list-v118',root);
    frame.innerHTML=store.current?.id?`<iframe title="영어 학습용 YouTube Shorts" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(store.current.id)}?playsinline=1&rel=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`:'<div class="al-shorts-empty-v118"><div><b>SHORTS → ENGLISH</b><br>영화·방송의 짧은 표현 영상을 붙여넣고<br>표현 · 뜻 · 나만의 문장을 저장하세요.</div></div>';
    list.innerHTML=store.notes.length?store.notes.slice(0,12).map(note=>`<article class="al-shorts-row-v118"><div><b>${esc(note.phrase)}</b><small>${esc(note.meaning||'뜻 미입력')}</small><em>${esc(note.example||'나만의 문장 미입력')}</em></div><button type="button" data-short-delete="${esc(note.id)}" aria-label="표현 삭제">×</button></article>`).join(''):'<div class="al-shorts-empty-v118"><div>저장한 영어 표현이 없습니다.</div></div>';
  }
  function setLanguageMode(mode){
    const page=$('#language .language-page-v25'),lab=page?.querySelector('aiderlog-language-lab'),shorts=page?.querySelector('.al-shorts-v118');if(!page||!lab||!shorts)return;
    const next=mode==='shorts'?'shorts':'course';lab.hidden=next!=='course';shorts.hidden=next!=='shorts';$$('[data-language-mode-v118]',page).forEach(b=>b.classList.toggle('active',b.dataset.languageModeV118===next));localStorage.setItem('aiderlog-language-mode-v118',next);if(next==='shorts')renderShorts();
  }
  function decorateLanguage(){
    const page=$('#language .language-page-v25'),lab=page?.querySelector('aiderlog-language-lab'),head=page?.querySelector('.language-edu-head');if(!page||!lab||!head)return;
    if (page.querySelector('.al-language-modes-v118')) return;
    const oldBadges=head.querySelector('.edu-badges'); if(oldBadges)oldBadges.remove();
    const nav=document.createElement('nav');nav.className='al-language-modes-v118';nav.innerHTML='<button type="button" class="active" data-language-mode-v118="course">COURSE</button><button type="button" data-language-mode-v118="shorts">YOUTUBE SHORTS · EN</button>';head.append(nav);
    const shorts=document.createElement('section');shorts.className='al-shorts-v118';shorts.hidden=true;shorts.innerHTML=`<section class="al-shorts-video-v118"><div class="al-shorts-frame-v118"></div><form class="al-shorts-link-v118"><input type="url" required placeholder="YouTube Shorts 링크 붙여넣기" aria-label="YouTube Shorts 링크"><button type="submit">영상 열기</button></form></section><section class="al-shorts-work-v118"><header><b>짧은 영어 표현 노트</b><span>영어 전용 · 영상은 YouTube에서 재생</span></header><form class="al-shorts-note-v118"><label>표현<input name="phrase" required maxlength="140" placeholder="That makes sense."></label><label>뜻<input name="meaning" maxlength="180" placeholder="그 말이 이해돼."></label><label>나만의 문장<input name="example" maxlength="220" placeholder="That makes sense to me now."></label><button type="submit">표현 저장</button></form><div class="al-shorts-list-v118"></div></section>`;page.append(shorts);
    nav.addEventListener('click',event=>{const b=event.target.closest('[data-language-mode-v118]');if(b)setLanguageMode(b.dataset.languageModeV118)});
    $('.al-shorts-link-v118',shorts).addEventListener('submit',event=>{event.preventDefault();const input=event.currentTarget.querySelector('input'),id=youtubeId(input.value);if(!id||!/^[-\w]{6,20}$/.test(id)){input.setCustomValidity('올바른 YouTube Shorts 링크를 입력해주세요.');input.reportValidity();return;}input.setCustomValidity('');const store=shortsStore();store.current={id,url:input.value.trim(),updatedAt:Date.now()};writeJson(SHORTS_KEY,store);persistShorts(store);renderShorts();});
    $('.al-shorts-note-v118',shorts).addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),store=shortsStore();store.notes.unshift({id:`short-${Date.now()}`,videoId:store.current?.id||'',phrase:String(data.get('phrase')||'').trim(),meaning:String(data.get('meaning')||'').trim(),example:String(data.get('example')||'').trim(),createdAt:Date.now()});store.notes=store.notes.slice(0,80);writeJson(SHORTS_KEY,store);persistShorts(store);event.currentTarget.reset();renderShorts();});
    shorts.addEventListener('click',event=>{const b=event.target.closest('[data-short-delete]');if(!b)return;const store=shortsStore();store.notes=store.notes.filter(n=>n.id!==b.dataset.shortDelete);writeJson(SHORTS_KEY,store);persistShorts(store);renderShorts();});
    renderShorts();setLanguageMode(localStorage.getItem('aiderlog-language-mode-v118')||'course');
  }

  function decoratePomodoro(){
    const page=$('.pomo-page'),timer=page?.querySelector('.pomo');if(!page||!timer||page.querySelector('.pomo-history-v118'))return;
    const data=readJson('aiderlog-private-v20',{}),rows=Array.isArray(data.pomodoroSessions)?data.pomodoroSessions.slice().reverse().slice(0,3):[];
    const section=document.createElement('section');section.className='pomo-history-v118';section.innerHTML=`<header><b>최근 집중 기록</b><span>${rows.length} SESSION</span></header>${rows.length?rows.map(row=>`<article><span>${esc(String(row.date||'').slice(5).replace('-','.'))}</span><b>${esc(row.task||'집중 세션')}</b><small>${Number(row.minutes)||25}분</small></article>`).join(''):'<article><span>—</span><b>타이머를 완료하면 여기에 기록됩니다.</b><small>0분</small></article>'}`;page.append(section);
  }

  function decorateAll(){queued=false;decorateWheel();decorateIntroMascot();decorateInsights();decorateEvent();decorateLanguage();decoratePomodoro();}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(decorateAll);}
  document.addEventListener('change',event=>{if(event.target.matches('#eventEditorFormV111 select[name="category"],#eventEditorFormV111 select[name="travelType"]'))setTimeout(decorateEventForm,0);});
  window.addEventListener('aiderdear-firebase-state',event=>{activeUser=event.detail?.user||null;});
  window.addEventListener('aiderdear-firebase-ready',()=>{const api=window.AiderDearFirebase;if(api?.subscribe)api.subscribe(async state=>{activeUser=state?.user||null;if(!activeUser||!api.readPrivateData)return;try{const current=await api.readPrivateData()||{};if(current.languageShortsV118&&!localStorage.getItem(SHORTS_KEY))writeJson(SHORTS_KEY,current.languageShortsV118);renderShorts();}catch(_){}});},{once:true});
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
  queue();
})();
