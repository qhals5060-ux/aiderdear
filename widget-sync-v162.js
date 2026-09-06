(() => {
  'use strict';

  const bridge = window.AiderLogNative;
  if (!bridge || typeof bridge.syncWidgets !== 'function') return;

  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const unique = values => [...new Set(values.map(clean).filter(Boolean))];
  const texts = (selector, limit = 12) => unique(
    [...document.querySelectorAll(selector)]
      .filter(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true')
      .map(node => node.innerText || node.textContent)
  ).slice(0, limit);
  const firstText = (selector, fallback = '') => clean(document.querySelector(selector)?.textContent) || fallback;
  const readJson = (key, fallback = null) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  };
  const stringList = (value, limit = 12) => {
    if (!Array.isArray(value)) return [];
    return unique(value.map(item => {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return '';
      return item.label || item.title || item.name || item.text || item.content || item.memo || '';
    })).slice(0, limit);
  };
  const visibleText = (selector, limit = 12) => unique(
    [...document.querySelectorAll(selector)]
      .filter(node => !node.closest('[hidden],[aria-hidden="true"]'))
      .map(node => node.innerText || node.textContent)
  ).slice(0, limit);

  function languageRows() {
    const rows = [];
    const legacy = readJson('aiderlog-language-course-v114', {});
    ['en', 'ja'].forEach(language => {
      const label = language === 'en' ? '영어' : '일본어';
      const progress = legacy?.[language] || legacy?.progress?.[language] || {};
      const streak = Number(progress.streak || progress.streakDays || 0);
      const week = Array.isArray(progress.week) ? progress.week : [];
      const completed = week.filter(Boolean).length;
      if (streak || completed) rows.push(`${label} · 연속 ${streak}일 · 최근 7일 ${completed}회`);
    });
    if (!rows.length) rows.push(...visibleText('#privateLanguagePanel [data-language],#privateLanguagePanel .language-streak,#privateLanguagePanel .language-progress', 4));
    return rows;
  }

  function mealRows() {
    return visibleText('.personal-meal-card,.meal-card-v59,[data-health-kind="meal"]', 6)
      .map(row => row.replace(/칼로리|kcal|탄수화물|단백질|지방/gi, '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  function workoutRows() {
    return visibleText('.personal-exercise-card,.exercise-card-v59,[data-health-kind="exercise"]', 10);
  }

  function imageSources() {
    return unique([...document.querySelectorAll('.personal-meal-card img,.meal-card-v59 img,[data-health-kind="meal"] img')]
      .map(image => image.currentSrc || image.src)
      .filter(source => /^(data:|https?:|content:|file:)/i.test(source))).slice(0, 4);
  }

  function routineRows() {
    return visibleText('#privateRoutinePanel .routine-card,#privateRoutinePanel [data-routine-id],.routine-v16-card', 12);
  }

  function routineStats(routines) {
    const completed = document.querySelectorAll('#privateRoutinePanel input[type="checkbox"]:checked,.routine-v16-card.done').length;
    const total = document.querySelectorAll('#privateRoutinePanel input[type="checkbox"],.routine-v16-card').length;
    return total ? [`오늘 ${completed}/${total} 완료`, ...routines.slice(0, 5)] : routines.slice(0, 6);
  }

  function memoRows() {
    return visibleText('#quickMemoList .quick-memo-row,#quickMemoList [data-memo-id],.quick-memo-card,.memo-card', 10);
  }

  function todoRows() {
    return visibleText('#todayJournalContent [data-todo-id],#todayJournalContent .todo-row,.todo-card,.checklist-row', 10);
  }

  function readingRows() {
    return visibleText('.personal-reading-card,.reading-card-v59,[data-personal-kind="reading"]', 10);
  }

  function workflowRows() {
    return visibleText('.personal-workflow-card,.workflow-card-v59,[data-personal-kind="workflow"]', 10);
  }

  function scheduleRows() {
    return visibleText('.schedule-upcoming-line-v126,.shared-row .shared-line,.day:not(.out) .ev', 14);
  }

  function bulletRows(schedule, memos, todos, routines, reading, workouts, days) {
    const dayLabel = days === 7 ? '7일' : '3일';
    return unique([
      `${dayLabel} 일정 · ${schedule.length}`,
      ...schedule.slice(0, days === 7 ? 3 : 2),
      ...memos.slice(0, 2).map(row => `메모 · ${row}`),
      ...todos.slice(0, 2).map(row => `할 일 · ${row}`),
      ...routines.slice(0, 1).map(row => `루틴 · ${row}`),
      ...reading.slice(0, 1).map(row => `독서 · ${row}`),
      ...workouts.slice(0, 1).map(row => `건강 · ${row}`),
    ]).filter(row => !/감정|emotion/i.test(row)).slice(0, 10);
  }

  function snapshot() {
    const now = new Date();
    const schedule = scheduleRows();
    const routines = routineRows();
    const memos = memoRows();
    const todos = todoRows();
    const reading = readingRows();
    const workflows = workflowRows();
    const workouts = workoutRows();
    const meals = mealRows();
    const languages = languageRows();
    const workoutStats = visibleText('.personal-overview-dashboard .exercise-stat,.personal-overview-dashboard [data-stat="exercise"],.exercise-stat-card', 8);
    const inbodyStats = visibleText('.personal-overview-dashboard .inbody-stat,.personal-inbody-history [data-inbody-id],.inbody-stat-card', 8);
    const challenges = visibleText('.personal-challenge-card,.challenge-card-v100,[data-challenge-id]', 10);
    const selectedChallenge = challenges.slice(0, 4);
    const quote = firstText('.personal-reading-card .quote,.reading-card-v59 blockquote,[data-personal-kind="reading"] blockquote', '');
    const youtubeStore = readJson('aiderlog-language-shorts-v118', {});
    const youtube = stringList(youtubeStore?.notes || youtubeStore?.current?.sentences || [], 6);
    const photos = imageSources();
    const month = new Intl.DateTimeFormat('ko-KR', { year:'numeric', month:'long' }).format(now);
    const today = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(now);

    return {
      version:162,
      month,
      today,
      schedule,
      routines,
      routineStats:routineStats(routines),
      language:languages[0] || '학습 기록을 확인해 주세요.',
      languageRows:languages,
      youtubeNotes:youtube,
      meals,
      mealPhotos:photos,
      workouts,
      mealWorkouts:unique([...meals.slice(0, 3), ...workouts.slice(0, 3)]),
      workoutChallenges:unique([...workouts.slice(0, 4), ...selectedChallenge.slice(0, 2)]),
      challengeSelected:selectedChallenge,
      challengeAll:challenges,
      challengeCombined:unique([...selectedChallenge.slice(0, 3), ...challenges.slice(0, 5)]),
      workoutStats,
      workoutStatsInbody:unique([...workoutStats, ...inbodyStats]),
      memos,
      todos,
      memoTodos:unique([...memos.slice(0, 5), ...todos.slice(0, 5)]),
      readingBooks:reading,
      readingCurrent:unique([...reading.slice(0, 4), ...(quote ? [quote] : [])]),
      quote,
      workflows,
      bullet3:bulletRows(schedule, memos, todos, routines, reading, workouts, 3),
      bullet7:bulletRows(schedule, memos, todos, routines, reading, workouts, 7),
      bullet3Workflow:unique([...bulletRows(schedule, memos, todos, routines, reading, workouts, 3), ...workflows.slice(0, 3)]),
      bullet7Workflow:unique([...bulletRows(schedule, memos, todos, routines, reading, workouts, 7), ...workflows.slice(0, 4)]),
    };
  }

  let timer = 0;
  let lastPayload = '';
  const sync = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      try {
        const payload = JSON.stringify(snapshot());
        if (payload === lastPayload) return;
        bridge.syncWidgets(payload);
        lastPayload = payload;
      } catch (_) {
        // Widget synchronization must never interrupt normal site/app use.
      }
    }, 180);
  };

  window.addEventListener('load', sync, { once:true });
  window.addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  document.addEventListener('click', sync, { passive:true });
  document.addEventListener('change', sync, { passive:true });
  window.addEventListener('aiderlog:data-changed', sync);
  new MutationObserver(sync).observe(document.body, { childList:true, subtree:true, characterData:true });
  sync();
})();
