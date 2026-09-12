(function (root) {
  'use strict';
  const OPTIONS = Object.freeze([7, 15, 30]);
  const STORAGE_KEY = 'aiderlog-insight-days-v175';
  const EVENT = 'aiderlog-insight-range-change';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const validDays = value => OPTIONS.includes(Number(value)) ? Number(value) : 30;
  let selected = 30;
  try { selected = validDays(root.localStorage?.getItem(STORAGE_KEY)); } catch (_) {}

  function dateKey(now = Date.now()) {
    const instant = new Date(now);
    if (!Number.isFinite(instant.getTime())) return '';
    return new Date(instant.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }
  function shiftKey(key, offset) {
    return new Date(Date.parse(key + 'T00:00:00Z') + offset * 86400000).toISOString().slice(0, 10);
  }
  function rowDate(row) {
    const key = String(row?.date || row?.createdDate || row?.day || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return '';
    const time = Date.parse(key + 'T00:00:00Z');
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === key ? key : '';
  }
  function bounds(days = selected, now = Date.now()) {
    const to = dateKey(now);
    return { days: validDays(days), from: to ? shiftKey(to, 1 - validDays(days)) : '', to };
  }
  function filterRows(rows = [], days = selected, now = Date.now()) {
    const range = bounds(days, now);
    if (!range.to) return [];
    return (Array.isArray(rows) ? rows : []).filter(row => {
      const key = rowDate(row);
      return key && key >= range.from && key <= range.to;
    });
  }
  function buttons(days = selected) {
    return `<nav class="insight-range-v175" aria-label="인사이트 기간">${OPTIONS.map(value => `<button type="button" data-insight-days-v175="${value}" aria-pressed="${value === validDays(days)}">${value}일</button>`).join('')}</nav>`;
  }
  function paintButtons() {
    root.document?.querySelectorAll('[data-insight-days-v175]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.insightDaysV175) === selected));
    });
  }
  function setDays(value) {
    if (!OPTIONS.includes(Number(value)) || selected === Number(value)) return false;
    selected = Number(value);
    try { root.localStorage?.setItem(STORAGE_KEY, String(selected)); } catch (_) {}
    paintButtons();
    root.dispatchEvent?.(new root.CustomEvent(EVENT, { detail: { days: selected } }));
    return true;
  }
  function values(row, keys) {
    for (const key of keys) {
      const value = row?.[key];
      if (Array.isArray(value) && value.length) return value.map(String).map(x => x.trim()).filter(Boolean);
      if (typeof value === 'string' && value.trim()) return value.split(/[,·/]/).map(x => x.trim()).filter(Boolean);
    }
    return [];
  }
  const moods = row => values(row, ['emotions', 'moods', 'mood', 'emotion']);
  function rank(rows, getter) {
    const counts = new Map();
    rows.forEach(row => getter(row).forEach(value => counts.set(value, (counts.get(value) || 0) + 1)));
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));
  }
  function summarize(rows, days = selected, now = Date.now()) {
    const range = bounds(days, now), basis = filterRows(rows, days, now);
    const moodRank = rank(basis, moods);
    const intensities = basis.map(row => Number(row.intensity ?? row.strength ?? row.score)).filter(value => Number.isFinite(value) && value >= 1 && value <= 5);
    const daily = range.to ? Array.from({ length: range.days }, (_, index) => {
      const date = shiftKey(range.from, index), records = basis.filter(row => rowDate(row) === date);
      return { date, count: records.length, moods: rank(records, moods) };
    }) : [];
    return {
      range, basis, moodRank, total: moodRank.reduce((sum, item) => sum + item[1], 0), daily,
      average: intensities.length ? intensities.reduce((sum, value) => sum + value, 0) / intensities.length : null,
      current: rank(basis, row => values(row, ['currentActivities', 'activity', 'action'])),
      after: rank(basis, row => values(row, ['afterActivities'])),
      places: rank(basis, row => values(row, ['location', 'place'])),
      people: rank(basis, row => values(row, ['people', 'companion'])),
      times: rank(basis, row => {
        const time = String(row.time || '');
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return [];
        const hour = Number(time.slice(0, 2));
        return [hour < 6 ? '새벽 0–6시' : hour < 12 ? '오전 6–12시' : hour < 18 ? '오후 12–18시' : '저녁 18–24시'];
      })
    };
  }
  function mobileMarkup(rows, now = Date.now()) {
    const data = summarize(rows, selected, now);
    const { range, basis, moodRank, total, daily } = data;
    const colors = ['var(--theme-primary,#6255e8)', '#4f7ef3', '#f07872'];
    const pct = value => total ? Math.round(value / total * 100) : 0;
    const empty = '<p class="ins-empty-v175">선택한 기간에 기록이 없습니다.</p>';
    const names = list => list.length ? list.slice(0, 3).map(([label, count]) => `${escape(label)} · ${count}회`).join('<br>') : '기록 없음';
    const section = (number, title, content) => `<article class="ins-card-v143"><header class="ins-card-head-v143"><span>${number}</span><h2>${title}</h2></header>${content}</article>`;
    const bars = moodRank.slice(0, 3).map(([label, value], index) => `<div class="ins-bar-v143" style="--value:${pct(value)}%;--bar:${colors[index]}"><span>${escape(label)}</span><i></i><b>${pct(value)}%</b></div>`).join('');
    const max = Math.max(1, ...daily.map(day => day.count));
    const chart = basis.length ? `<div class="ins-trend-v175" role="img" aria-label="${range.days}일 동안 날짜별 감정 기록 수"><div>${daily.map(day => `<i style="--height:${day.count / max * 100}%" title="${day.date} · ${day.count}회"><span>${day.count}</span></i>`).join('')}</div><footer><span>${range.from.slice(5)}</span><span>${range.to.slice(5)}</span></footer></div><details class="ins-trend-detail-v175"><summary>날짜별 기록 확인</summary><ul>${daily.filter(day => day.count).map(day => `<li><time>${day.date}</time><span>${day.count}회 · ${escape(day.moods.map(item => item[0]).join(', ') || '감정 미선택')}</span></li>`).join('')}</ul></details>` : empty;
    return `<div class="insights-v143 insights-v175"><header class="insights-head-v143"><h1>마음 인사이트</h1>${buttons()}</header><p class="ins-range-caption-v175">${range.from} – ${range.to} · ${basis.length}회 기록</p><div class="insights-stack-v143">
      ${section(1, '감정 균형', `<div class="ins-balance-v143"><div class="ins-score-v143" style="--score-v175:${data.average===null?0:data.average/5*100}%"><span><span><strong>${data.average === null ? '—' : data.average.toFixed(1)}</strong><small>/ 5 · ${basis.length}회 기록</small></span></span></div><i class="ins-divider-v143"></i><div class="ins-bars-v143"><h3>최근 ${range.days}일 자주 느낀 감정</h3>${bars || empty}</div></div>`)}
      ${section(2, '감정과 함께한 활동', `<div class="ins-activity-v143"><article><b>그때 하고 있던 활동</b><span>${names(data.current)}</span></article><article><b>그 후에 한 활동</b><span>${names(data.after)}</span></article></div>`)}
      ${section(3, '기록 환경', `<div class="ins-context-v143"><p><b>시간대</b><span>${names(data.times)}</span></p><p><b>장소</b><span>${names(data.places)}</span></p><p><b>함께한 사람</b><span>${names(data.people)}</span></p></div>`)}
      ${section(4, '감정 기록 흐름', chart)}
      ${section(5, '최근 3일', `<div class="ins-recent-v143">${daily.slice(-3).map(day => `<article><b>${day.date.slice(5).replace('-', '.')}</b><span>${day.count}회 기록</span><strong>${escape(day.moods[0]?.[0] || '기록 없음')}</strong></article>`).join('')}</div>`)}
    </div></div>`;
  }
  const api = Object.freeze({ days: () => selected, setDays, bounds, dateKey, rowDate, filterRows, buttons, summarize, mobileMarkup, event: EVENT });
  root.AiderLogInsightRangeV175 = api;
  if (!root.document) return;
  root.document.documentElement?.classList.add('insight-range-v175');
  root.document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-insight-days-v175]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    setDays(button.dataset.insightDaysV175);
  });
  function mountSite() {
    const group = root.document.querySelector('#emotionInsightFrame .emotion-title-group');
    if (group && !group.querySelector('[data-insight-days-v175]')) group.innerHTML = buttons();
  }
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', mountSite, { once: true });
  else mountSite();
})(typeof window === 'undefined' ? globalThis : window);
