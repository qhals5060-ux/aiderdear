(function () {
  'use strict';

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEK = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const CATEGORY = {
    work:{label:'업무',color:'#625df5'}, personal:{label:'개인',color:'#ff89aa'},
    health:{label:'건강',color:'#4fc4b1'}, study:{label:'학습',color:'#5295f5'},
    event:{label:'약속',color:'#f2a34a'}, other:{label:'기타',color:'#9a91b9'}
  };
  const MOODS = [
    ['기쁨','☀'],['행복','♡'],['설렘','✦'],['편안함','◌'],['감사','☆'],
    ['피곤함','☾'],['불안','≈'],['짜증','!'],['외로움','·'],['슬픔','◇']
  ];
  const EMOTION_FILES_V126 = {기쁨:'joy',행복:'happiness',설렘:'excitement',편안함:'calm',감사:'gratitude',피곤함:'tired',불안:'anxiety',짜증:'irritation',외로움:'loneliness',슬픔:'sadness'};
  const EMOTION_CONTEXTS_V126 = ['일이 몰리거나 시간에 쫓김','실수하거나 문제가 생김','갈등하거나 서운한 말을 들음','계획이 틀어지거나 갑자기 바뀜','중요한 선택·결정을 앞둠','바라던 결과를 얻음','칭찬·인정을 받음','반가운 연락·만남이 있었음','도움·배려를 받음','새로운 기회·계획이 생김','기타'];
  const EMOTION_CURRENT_V126 = ['업무·작업','회의·발표','공부·자기계발','대화·통화·메신저','이동·운전','약속·모임','개인 용무 처리','취미·창작','SNS·커뮤니티 보기','기타'];
  const EMOTION_AFTER_V126 = ['하던 일을 계속함','해야 할 일을 미룸','문제를 바로 해결하려 함','누군가에게 말·연락함','대화를 멈추고 거리를 둠','혼자 있는 곳으로 이동함','밖으로 나가 걷거나 장소를 바꿈','음악·영상·SNS로 주의를 돌림','메모·일기로 감정을 적음','호흡하며 감정을 가라앉힘','기타'];
  const EMOTION_WANTS_V126 = ['쉬기','산책','운동','대화','혼자 있기','먹기','잠자기','쇼핑','여행','취미','기타'];
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localDate = date => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const now = new Date();
  let cursor = new Date(now.getFullYear(), now.getMonth(), 1);
  let selectedDate = localDate(now);
  let scheduleSyncBound = false;

  function eventColor(row) {
    return CATEGORY[row?.category]?.color || CATEGORY.other.color;
  }
  function eventRows() {
    A.scheduleEvents = Array.isArray(A.scheduleEvents) ? A.scheduleEvents : [];
    return A.scheduleEvents;
  }
  function mergeRows() {
    const map = new Map();
    Array.from(arguments).flat().filter(Boolean).forEach(row => {
      const id = String(row.id || `${row.date || ''}:${row.time || ''}:${row.title || ''}`);
      const previous = map.get(id);
      if (!previous || Number(row.updatedAt || row.createdAt || 0) >= Number(previous.updatedAt || previous.createdAt || 0)) map.set(id,row);
    });
    return Array.from(map.values());
  }
  function icon(name) {
    if (name === 'insights') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6a6.7 6.7 0 1 0 6.7 6.7c0-.8-.14-1.55-.4-2.25"/><path d="M12 1.8v3.1M20.2 4l-2.1 2.1M21 11h-3.1"/><circle cx="12" cy="10.3" r="2.3"/></svg>';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.2-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.8-7 10-7 10Z"/><path d="M8.2 12h2l1.1-2.2 1.6 4.4 1.1-2.2h2"/></svg>';
  }

  function calendarCells(year,month) {
    const first = new Date(year,month,1);
    const gridStart = new Date(year,month,1-first.getDay());
    return Array.from({length:42},(_,index) => {
      const date = new Date(gridStart.getFullYear(),gridStart.getMonth(),gridStart.getDate()+index);
      const key = localDate(date);
      const rows = eventRows().filter(row => row.date === key).sort((a,b) => String(a.time || '').localeCompare(String(b.time || '')));
      const outside = date.getMonth() !== month;
      const dots = rows.slice(0,3).map(row => `<i style="--event-color:${eventColor(row)}"></i>`).join('');
      const preview = rows[0] ? `<small class="schedule-event-name-v119">${safe(rows[0].time || '')} ${safe(rows[0].title || '일정')}</small>` : '';
      return `<button type="button" class="day schedule-day-v119${outside?' outside':''}${key===selectedDate?' selected':''}${key===localDate(now)?' today':''}" data-schedule-date-v119="${key}" aria-label="${key} 일정 추가">
        <span class="schedule-day-number-v119">${date.getDate()}</span>${preview}<span class="schedule-event-dots-v119">${dots}</span>
      </button>`;
    }).join('');
  }
  function ddayMarkup() {
    const dd = Array.isArray(A.ddays) ? A.ddays[0] : null;
    let count = '—';
    if (dd?.date) {
      const target = new Date(`${dd.date}T00:00:00`);
      const base = new Date(); base.setHours(0,0,0,0);
      const gap = Math.ceil((target-base)/86400000);
      count = gap >= 0 ? `D-${gap}` : `D+${Math.abs(gap)}`;
    }
    return `<section class="dday schedule-dday-v119"><span class="schedule-constellation-v119" aria-hidden="true"></span><small>NEXT D-DAY</small><h2>${safe(dd?.title || 'D-Day')}</h2><strong>${count}</strong><span>${safe(dd?.date || '사이트와 동기화됩니다.')}</span></section>`;
  }
  function upcomingMarkup() {
    const todayKey = localDate(new Date());
    const rows = eventRows().filter(row => row.date && row.date >= todayKey)
      .sort((a,b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`)).slice(0,4);
    return `<section class="upcoming card schedule-upcoming-v119"><header><h3>예정된 일정</h3><small>${rows.length ? `${rows.length} UPCOMING` : 'SYNC READY'}</small></header>${rows.length ? rows.map(row => `<div class="uprow"><i style="--event-color:${eventColor(row)}"><span></span>${safe((row.date || '').slice(5).replace('-','.'))}</i><b>${safe(row.title || '일정')}</b><time>${safe(row.time || '')}</time></div>`).join('') : '<div class="schedule-empty-v119"><span aria-hidden="true"><i></i></span><p>예정 일정이 없습니다.</p><small>날짜를 눌러 첫 일정을 추가하세요.</small></div>'}</section>`;
  }

  function renderScheduleV119() {
    const year = cursor.getFullYear(), month = cursor.getMonth();
    home.classList.add('schedule-cosmic-v119');
    home.innerHTML = `<div class="home schedule-home-v119">
      <article class="calendar card schedule-calendar-v119">
        <div class="calhead schedule-calhead-v119">
          <h1>${MONTHS[month]} <small>${year}</small></h1>
          <div class="calctl schedule-calctl-v119" aria-label="캘린더 조작">
            <button type="button" data-calendar-shift-v119="-1" aria-label="이전 달">‹</button>
            <button type="button" class="schedule-today-v119" data-calendar-today-v119>Today</button>
            <button type="button" data-calendar-shift-v119="1" aria-label="다음 달">›</button>
            <button type="button" class="schedule-icon-v119 insights" data-schedule-insights-v119 aria-label="인사이트" title="인사이트">${icon('insights')}</button>
            <button type="button" class="schedule-icon-v119 emotion" data-schedule-emotion-v119 aria-label="감정 기록" title="감정 기록">${icon('emotion')}</button>
          </div>
        </div>
        <div class="week schedule-week-v119">${WEEK.map(day => `<span>${day}</span>`).join('')}</div>
        <div class="days schedule-days-v119">${calendarCells(year,month)}</div>
      </article>
      <aside class="homeside schedule-homeside-v119">${ddayMarkup()}${upcomingMarkup()}</aside>
    </div>`;
    bindScheduleControls();
  }

  function ensureScheduleDialog() {
    let overlay = document.querySelector('[data-schedule-dialog-v119]');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'schedule-dialog-v119';
    overlay.dataset.scheduleDialogV119 = '';
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-labelledby="scheduleDialogTitleV119">
      <header><div><small>NEW SCHEDULE</small><h2 id="scheduleDialogTitleV119">일정 추가</h2></div><button type="button" data-schedule-close-v119 aria-label="닫기">×</button></header>
      <form data-schedule-form-v119>
        <div class="schedule-form-grid-v119"><label>날짜<input name="date" type="date" required></label><label>시간<input name="time" type="time"></label></div>
        <label>일정명<input name="title" maxlength="80" required placeholder="일정 제목을 입력하세요"></label>
        <label>분류<select name="category">${Object.entries(CATEGORY).map(([key,row]) => `<option value="${key}">${row.label}</option>`).join('')}</select></label>
        <label>메모<textarea name="note" maxlength="400" placeholder="장소나 준비할 내용을 짧게 적어보세요."></textarea></label>
        <p class="schedule-sync-note-v119"><i></i><span><b>사이트 일정과 연결</b>로그인 상태에서는 같은 계정의 사이트에도 자동 반영됩니다.</span></p>
        <footer><button type="button" data-schedule-close-v119>취소</button><button type="submit">일정 저장</button></footer>
      </form>
    </section>`;
    document.body.append(overlay);
    overlay.addEventListener('click',event => {
      if (event.target === overlay || event.target.closest('[data-schedule-close-v119]')) closeScheduleDialog();
    });
    overlay.querySelector('form').addEventListener('submit',saveSchedule);
    return overlay;
  }
  function openScheduleDialog(date) {
    const overlay = ensureScheduleDialog(), form = overlay.querySelector('form');
    form.reset(); form.elements.date.value = date || selectedDate;
    overlay.classList.add('on');
    setTimeout(() => form.elements.title.focus(),40);
  }
  function closeScheduleDialog() { document.querySelector('[data-schedule-dialog-v119]')?.classList.remove('on'); }

  async function persistSchedule(row) {
    const api = window.AiderDearFirebase;
    const state = api?.getState?.() || authState || {};
    try { localStorage.setItem('aiderlog-app-v20',JSON.stringify(A)); } catch (_) {}
    if (new URLSearchParams(location.search).has('preview')) return;
    await saveApp();
    if (!state.user || !api?.writeScheduleData) return;
    try {
      const remote = api.readScheduleData ? await api.readScheduleData() : {own:[]};
      const own = mergeRows(remote?.own || [],eventRows(),row);
      await api.writeScheduleData(own);
    } catch (error) { console.warn('Schedule site sync skipped',error); }
  }
  async function saveSchedule(event) {
    event.preventDefault();
    const form = event.currentTarget, data = new FormData(form), title = String(data.get('title') || '').trim();
    if (!title) return;
    const api = window.AiderDearFirebase, state = api?.getState?.() || authState || {}, stamp = Date.now();
    const row = {
      id:`schedule-${stamp}-${Math.random().toString(36).slice(2,7)}`,date:String(data.get('date') || selectedDate),time:String(data.get('time') || ''),
      title:title.slice(0,80),category:String(data.get('category') || 'other'),note:String(data.get('note') || '').trim().slice(0,400),
      authorEmail:state.user?.email || '',authorUid:state.user?.uid || '',owner:'mine',shareWithCouple:false,createdAt:stamp,updatedAt:stamp
    };
    A.scheduleEvents = mergeRows(eventRows(),row);
    selectedDate = row.date;
    cursor = new Date(`${row.date}T12:00:00`); cursor = new Date(cursor.getFullYear(),cursor.getMonth(),1);
    closeScheduleDialog(); renderScheduleV119();
    await persistSchedule(row);
  }

  function ensureEmotionDialog() {
    let overlay = document.querySelector('[data-emotion-dialog-v119]');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'emotion-dialog-v119 emotion-dialog-v126'; overlay.dataset.emotionDialogV119 = '';
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-labelledby="emotionDialogTitleV119">
      <header><div><small>HOW ARE YOU?</small><h2 id="emotionDialogTitleV119">오늘의 감정 기록</h2></div><button type="button" data-emotion-close-v119 aria-label="닫기">×</button></header>
      <form data-emotion-form-v119>
        <div class="emotion-core-grid-v126"><label>날짜<input name="date" type="date" required></label><label>시간<input name="time" type="time"></label><label>장소<select name="location"><option value="">선택</option><option>집</option><option>직장/학교</option><option>카페</option><option>식당</option><option>이동 중</option><option>야외</option><option>기타</option></select></label><label>함께 있는 사람<select name="companion"><option value="">선택</option><option>혼자</option><option>연인</option><option>가족</option><option>친구</option><option>동료</option><option>지인</option><option>기타</option></select></label></div>
        <fieldset><legend>지금 가장 가까운 감정</legend><div class="emotion-options-v119 emotion-characters-v126">${MOODS.map(([mood],index) => `<label><input type="checkbox" name="moods" value="${mood}" ${index===3?'checked':''}><span><img src="./mascots-v118/${EMOTION_FILES_V126[mood]}.png" alt=""><b>${mood}</b></span></label>`).join('')}</div></fieldset>
        <fieldset class="emotion-block-v126"><legend>감정 강도</legend><div class="emotion-intensity-v126">${[1,2,3,4,5].map(level=>`<label><input type="radio" name="intensity" value="${level}" ${level===3?'checked':''}><span>${level}${level===1?' · 약함':level===3?' · 보통':level===5?' · 강함':''}</span></label>`).join('')}</div></fieldset>
        <fieldset class="emotion-block-v126"><legend>무슨 일이 있었나요?</legend><div class="emotion-data-chips-v126">${EMOTION_CONTEXTS_V126.map(value=>`<label><input type="checkbox" name="context" value="${value}"><span>${value}</span></label>`).join('')}</div></fieldset>
        <fieldset class="emotion-block-v126"><legend>그때 무엇을 하고 있었나요?</legend><div class="emotion-data-chips-v126">${EMOTION_CURRENT_V126.map(value=>`<label><input type="checkbox" name="currentActivities" value="${value}"><span>${value}</span></label>`).join('')}</div></fieldset>
        <fieldset class="emotion-block-v126"><legend>그 감정이 든 뒤 어떻게 했나요?</legend><div class="emotion-data-chips-v126">${EMOTION_AFTER_V126.map(value=>`<label><input type="checkbox" name="afterActivities" value="${value}"><span>${value}</span></label>`).join('')}</div></fieldset>
        <label class="emotion-next-v126">그 후의 감정 <small>선택 · 다음 기록이 있다면 Insights에서도 자동으로 연결됩니다.</small><select name="nextEmotion"><option value="">선택하지 않음</option>${MOODS.map(([mood])=>`<option>${mood}</option>`).join('')}</select></label>
        <fieldset class="emotion-block-v126"><legend>지금 하고 싶은 것</legend><div class="emotion-data-chips-v126">${EMOTION_WANTS_V126.map(value=>`<label><input type="checkbox" name="wants" value="${value}"><span>${value}</span></label>`).join('')}</div><input name="wantCustom" maxlength="120" placeholder="직접 입력 · 쉼표로 여러 개 입력할 수 있어요."></fieldset>
        <fieldset class="emotion-block-v126"><legend>3줄 일기</legend><div class="emotion-three-lines-v126"><input name="line1" maxlength="100" placeholder="1. 오늘 가장 기억나는 순간"><input name="line2" maxlength="100" placeholder="2. 지금 마음에 남은 생각"><input name="line3" maxlength="100" placeholder="3. 오늘의 나에게 남기고 싶은 말"></div></fieldset>
        <label class="emotion-period-v126"><input name="period" type="checkbox"><span>생리일 기록</span></label>
        <footer><button type="button" data-emotion-close-v119>취소</button><button type="submit">감정 저장</button></footer>
      </form>
    </section>`;
    document.body.append(overlay);
    overlay.addEventListener('click',event => { if (event.target === overlay || event.target.closest('[data-emotion-close-v119]')) overlay.classList.remove('on'); });
    overlay.querySelector('form').addEventListener('submit',saveEmotionV119);
    return overlay;
  }
  function openEmotionDialog() {
    const overlay = ensureEmotionDialog(), form = overlay.querySelector('form');
    form.reset(); form.elements.date.value = selectedDate || localDate(new Date());
    form.querySelector('input[name="moods"][value="편안함"]').checked = true;
    form.querySelector('input[name="intensity"][value="3"]').checked = true;
    overlay.classList.add('on');
  }
  async function saveEmotionV119(event) {
    event.preventDefault();
    const form = event.currentTarget, data = new FormData(form), moods = data.getAll('moods').map(String), mood = moods[0] || '', stamp = Date.now();
    const splitCustom = String(data.get('wantCustom') || '').split(',').map(value=>value.trim()).filter(Boolean);
    const wants = [...new Set([...data.getAll('wants').map(String),...splitCustom])];
    const context = data.getAll('context').map(String), currentActivities = data.getAll('currentActivities').map(String), afterActivities = data.getAll('afterActivities').map(String);
    const lines = ['line1','line2','line3'].map(name=>String(data.get(name)||'').trim());
    const location = String(data.get('location') || ''), companion = String(data.get('companion') || '');
    if(!moods.length&&!lines.some(Boolean)&&!wants.length&&!context.length&&!currentActivities.length&&!afterActivities.length&&!location&&!companion&&!data.get('period')){alert('기록할 내용을 선택하거나 입력해주세요.');return;}
    E.entries = Array.isArray(E?.entries) ? E.entries : Object.values(E?.entries || {});
    E.entries.push({id:`emotion-${stamp}`,date:String(data.get('date') || localDate(new Date())),time:String(data.get('time')||''),mood,moods,intensity:Number(data.get('intensity') || 3),location,place:location,companion,wants,context,currentActivities,afterActivities,nextEmotion:String(data.get('nextEmotion')||''),activity:currentActivities[0]||'',lines,note:lines.filter(Boolean).join(' / '),period:!!data.get('period'),createdAt:stamp,updatedAt:stamp});
    try { localStorage.setItem('aiderlog-emotion-v119',JSON.stringify(E)); } catch (_) {}
    event.currentTarget.closest('.emotion-dialog-v119').classList.remove('on');
    const api = window.AiderDearFirebase, state = api?.getState?.() || authState || {};
    if (!new URLSearchParams(location.search).has('preview') && state.user && api?.writeEmotionData) try { await api.writeEmotionData(E); } catch (error) { console.warn('Emotion sync skipped',error); }
  }

  function bindScheduleControls() {
    home.querySelectorAll('[data-calendar-shift-v119]').forEach(button => button.onclick = () => { cursor = new Date(cursor.getFullYear(),cursor.getMonth()+Number(button.dataset.calendarShiftV119),1); renderScheduleV119(); });
    home.querySelector('[data-calendar-today-v119]').onclick = () => { const d=new Date();cursor=new Date(d.getFullYear(),d.getMonth(),1);selectedDate=localDate(d);renderScheduleV119(); };
    home.querySelector('[data-schedule-insights-v119]').onclick = () => go('insights');
    home.querySelector('[data-schedule-emotion-v119]').onclick = openEmotionDialog;
    home.querySelectorAll('[data-schedule-date-v119]').forEach(button => button.onclick = () => {
      selectedDate = button.dataset.scheduleDateV119;
      const d = new Date(`${selectedDate}T12:00:00`); cursor = new Date(d.getFullYear(),d.getMonth(),1);
      renderScheduleV119(); openScheduleDialog(selectedDate);
    });
  }

  function restoreEmotionLocal() {
    try {
      const local = JSON.parse(localStorage.getItem('aiderlog-emotion-v119') || 'null');
      if (local?.entries) E.entries = mergeRows(E?.entries || [],local.entries);
    } catch (_) {}
  }
  function bindScheduleSync() {
    if (scheduleSyncBound) return;
    const api = window.AiderDearFirebase; if (!api?.subscribe) return;
    scheduleSyncBound = true;
    api.subscribe(async state => {
      if (!state?.user || !api.readScheduleData) return;
      try {
        const remote = await api.readScheduleData();
        A.scheduleEvents = mergeRows(eventRows(),remote?.own || [],remote?.shared || []);
        try { localStorage.setItem('aiderlog-app-v20',JSON.stringify(A)); } catch (_) {}
        if (activePage === 'home') renderScheduleV119();
      } catch (error) { console.warn('Schedule read sync skipped',error); }
    });
  }

  restoreEmotionLocal();
  renderHome = renderScheduleV119;
  if (activePage === 'home') renderScheduleV119();
  window.addEventListener('aiderdear-firebase-ready',bindScheduleSync,{once:true});
  setTimeout(bindScheduleSync,1200);
})();
