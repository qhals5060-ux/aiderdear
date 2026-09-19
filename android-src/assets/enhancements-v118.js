(function () {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let queued = false;


  function decorateWheel() {
    const wheel = $('#wheel');
    if (!wheel || wheel.dataset.reverseV118 === '1') return;
    const label = $('#fifthLabel')?.textContent?.trim() || 'My';
    const rows = [
      ['.wheel-seg.e','fifth','☆',label,true],
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
    $('.event-purpose-v118',form)?.remove();
    if (category === 'travel') return;
    setField(form,'title',config.title); setField(form,'creator',config.creator || '만든 사람'); setField(form,'place',config.place);
    setField(form,'genre',config.genre); setField(form,'companions',config.companions); setField(form,'highlight',config.highlight);
    setField(form,'detailA',config.highlight); setField(form,'detailB',config.companions); setField(form,'oneLine',config.one); setField(form,'review',config.review);
    const intro=form.querySelector('.event-form-intro-v113');
    if(intro){const icon=intro.querySelector('i'),title=intro.querySelector('b');if(icon)icon.textContent=config.icon;if(title)title.textContent=config.intro;}
  }
  function decorateEvent() {
    const root = $('#event'); if (!root) return;
    const modeIcons = {record:['✎','Record'],archive:['▥','Archive'],travel:['✈','Travel']};
    $$('[data-event-mode]',root).forEach(button => { if(button.closest('.event-word-tabs-v157'))return;const row=modeIcons[button.dataset.eventMode]; if(row&&!button.dataset.eventIconV120){button.textContent=row[0];button.title=row[1];button.setAttribute('aria-label',row[1]);} });
    const travelIcons = {plan:'▣',place:'⌖',food:'♨',activity:'☆'};
    $$('[data-travel-create]',root).forEach(button => { const icon=button.querySelector('i'); if(icon&&!icon.dataset.travelIconV120) icon.textContent=travelIcons[button.dataset.travelCreate] || '✦'; });
    const recordHead = $('.record-head',root), toolbar = recordHead?.nextElementSibling;
    if (!root.classList.contains('event-ui-v164') && recordHead && toolbar?.classList.contains('event-toolbar-v111')) {
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
  function decoratePomodoro(){
    const page=$('.pomo-page'),timer=page?.querySelector('.pomo');if(!page||!timer||page.querySelector('.pomo-history-v118'))return;
    const data=readJson('aiderlog-private-v20',{}),rows=Array.isArray(data.pomodoroSessions)?data.pomodoroSessions.slice().reverse().slice(0,3):[];
    const section=document.createElement('section');section.className='pomo-history-v118';section.innerHTML=`<header><b>최근 집중 기록</b><span>${rows.length} SESSION</span></header>${rows.length?rows.map(row=>`<article><span>${esc(String(row.date||'').slice(5).replace('-','.'))}</span><b>${esc(row.task||'집중 세션')}</b><small>${Number(row.minutes)||25}분</small></article>`).join(''):'<article><span>—</span><b>타이머를 완료하면 여기에 기록됩니다.</b><small>0분</small></article>'}`;page.append(section);
  }

  function decorateAll(){queued=false;decorateWheel();decorateEvent();decoratePomodoro();}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(decorateAll);}
  document.addEventListener('change',event=>{if(event.target.matches('#eventEditorFormV111 select[name="category"],#eventEditorFormV111 select[name="travelType"]'))setTimeout(decorateEventForm,0);});
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
  queue();
})();
