(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);

  function fallbackSummary() {
    if (typeof emotionStats !== 'function') return {};
    const stats = emotionStats();
    const top = stats.top?.[0] || '기록 없음';
    return {
      oneLine: stats.top ? `${top}의 흐름이 오늘 마음에서 가장 선명했어요.` : '오늘의 마음을 기록하면 한 줄로 정리해드려요.',
      topEmotion: top,
      topEmotionDetail: stats.top ? `최근 ${stats.top[1]}회 기록된 감정` : '오늘의 감정을 기다리고 있어요.',
      activity: '짧게 마음을 기록하기',
      recommendation: '작은 기록이 마음의 궤적을 만들어요.'
    };
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = String(value || '');
  }

  function openInsightLetterV132() {
    window.AiderLogInsightsV126?.render?.();
    const summary = window.AiderLogInsightsSummaryV132 || fallbackSummary();
    const now = new Date();
    setText('#introLetterDate', new Intl.DateTimeFormat('ko-KR', {year:'numeric', month:'long', day:'numeric', weekday:'short'}).format(now));
    setText('#introText', summary.oneLine || '오늘의 마음을 기록하면 한 줄로 정리해드려요.');
    setText('#introMood', summary.topEmotion || '기록 없음');
    setText('#introMoodDetailV132', summary.topEmotionDetail || '오늘의 감정을 기다리고 있어요.');
    setText('#introActivityV132', summary.activity || '짧게 마음을 기록하기');
    setText('#introActivityDetailV132', summary.recommendation || '작은 기록이 마음의 궤적을 만들어요.');
    const mascotMap={'기쁨':'joy','행복':'happiness','설렘':'excitement','편안함':'calm','평온':'calm','감사':'gratitude','피곤함':'tired','불안':'anxiety','짜증':'irritation','외로움':'loneliness','슬픔':'sadness'};
    const mascot=$('#introMascotV133 img'),mascotKey=mascotMap[summary.topEmotion]||'calm';
    if(mascot){mascot.src=`./mascots-v118/${mascotKey}.png`;mascot.alt=`${summary.topEmotion||'오늘의'} 감정 마스코트`}

    const modal = $('#intro');
    if (!modal) return;
    modal.classList.remove('on');
    void modal.offsetWidth;
    modal.classList.add('on');
    requestAnimationFrame(() => $('#introView')?.focus({preventScroll:true}));
  }

  function closeInsightLetterV132() {
    $('#intro')?.classList.remove('on');
  }

  const view = $('#introView');
  if (view) view.onclick = closeInsightLetterV132;

  window.openAiderLogInsightLetter = openInsightLetterV132;
  if (typeof openIntro === 'function') openIntro = openInsightLetterV132;
})();
