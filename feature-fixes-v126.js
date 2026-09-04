(function(){
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>typeof esc==='function'?esc(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const MOOD_COLORS={
    '기쁨':'#F27C8B','행복':'#EFAE72','설렘':'#C882D8','편안함':'#71BFC2','평온':'#71BFC2',
    '감사':'#D5A74E','피곤함':'#9B8EA8','불안':'#7085D8','짜증':'#C85B72','외로움':'#766BAE','슬픔':'#6A92C9'
  };
  const RECOMMENDATIONS={
    '기쁨':'기쁜 순간을 사진이나 한 문장으로 남겨보세요.',
    '행복':'좋았던 이유를 짧게 적어 오늘의 온기를 이어가세요.',
    '설렘':'기대하는 일을 작은 다음 행동 하나로 연결해보세요.',
    '편안함':'지금의 안정감을 유지할 수 있는 조용한 시간을 이어가세요.',
    '평온':'지금의 안정감을 유지할 수 있는 조용한 시간을 이어가세요.',
    '감사':'고마운 사람이나 순간을 한 줄로 기록해보세요.',
    '피곤함':'해야 할 일을 줄이고 짧은 휴식과 수분 보충을 우선해보세요.',
    '불안':'걱정되는 일을 한 가지씩 적고 지금 할 수 있는 것만 골라보세요.',
    '짜증':'잠시 자리를 옮겨 몸을 움직인 뒤 감정의 원인을 분리해보세요.',
    '외로움':'부담 없는 메시지 하나로 믿을 수 있는 사람과 연결해보세요.',
    '슬픔':'감정을 밀어내지 말고 조용히 쉬며 마음을 글로 풀어보세요.'
  };
  const rows=()=>{
    try{
      const source=typeof emotionRows==='function'?emotionRows():(typeof E!=='undefined'?E?.entries:[]);
      return (Array.isArray(source)?source:Object.values(source||{})).filter(Boolean);
    }catch(_){return[]}
  };
  const array=value=>Array.isArray(value)?value:(value?[value]:[]);
  const moods=row=>array(row?.moods?.length?row.moods:(row?.mood||row?.emotion)).filter(Boolean);
  const values=(row,keys)=>keys.flatMap(key=>array(row?.[key])).filter(Boolean);
  const rowDate=row=>String(row?.date||new Date(Number(row?.createdAt)||Date.now()).toISOString().slice(0,10));
  const count=(source,getter)=>{
    const result={};
    source.forEach(row=>getter(row).forEach(value=>{const key=String(value).trim();if(key)result[key]=(result[key]||0)+1}));
    return result;
  };
  const ranked=(object,limit=5)=>Object.entries(object).sort((a,b)=>b[1]-a[1]).slice(0,limit);
  const percent=(value,total)=>Math.round(Number(value||0)/Math.max(1,total)*100);
  const dayPart=time=>{
    const hour=Number(String(time||'').split(':')[0]);
    if(!Number.isFinite(hour))return'';
    if(hour<6)return'새벽';if(hour<12)return'오전';if(hour<18)return'오후';return'밤';
  };
  const emptyRows=message=>`<p class="insight-empty-v126">${safe(message)}</p>`;
  function topRowsMarkup(list,total){
    return list.length?list.map(([label,value],index)=>`<article style="--mood-color:${safe(MOOD_COLORS[label]||['#6255E8','#7B6CF2','#A89BFA'][index]||'#A89BFA')}"><small>TOP ${index+1}</small><b>${safe(label)}</b><strong>${percent(value,total)}%</strong></article>`).join(''):emptyRows('감정 기록이 쌓이면 TOP 3를 보여드려요.');
  }
  function listMarkup(list,total,type='mood'){
    if(!list.length)return emptyRows('아직 분석할 기록이 없습니다.');
    return list.map(([label,value])=>type==='mood'
      ?`<div class="insight-mood-row-v126" style="--mood-color:${safe(MOOD_COLORS[label]||'var(--theme-primary)')}"><i></i><b>${safe(label)}</b><span>${value}회 · ${percent(value,total)}%</span></div>`
      :`<div class="insight-activity-row-v126"><b>${safe(label)}</b><span>${value}회 · ${percent(value,total)}%</span></div>`).join('');
  }
  function renderInsightsV126(){
    const root=typeof insights!=='undefined'?insights:$('#insights');if(!root)return;
    const all=rows(),cutoff=new Date();cutoff.setHours(0,0,0,0);cutoff.setDate(cutoff.getDate()-29);
    const recent=all.filter(row=>{const date=new Date(`${rowDate(row)}T00:00:00`);return !Number.isNaN(date.valueOf())&&date>=cutoff});
    const basis=recent.length?recent:all;
    const moodCounts=count(basis,moods),moodRank=ranked(moodCounts,5),moodTotal=Object.values(moodCounts).reduce((sum,value)=>sum+value,0);
    const top=moodRank[0]?.[0]||'기록 없음',topCount=moodRank[0]?.[1]||0;
    const intensities=basis.map(row=>Number(row.intensity||row.strength||row.score)).filter(Number.isFinite);
    const avg=intensities.length?(intensities.reduce((sum,value)=>sum+value,0)/intensities.length).toFixed(1):'—';
    const timeRank=ranked(count(basis,row=>[dayPart(row.time)].filter(Boolean)),4);
    const placeRank=ranked(count(basis,row=>values(row,['location','place'])),4);
    const companionRank=ranked(count(basis,row=>values(row,['companion'])),4);
    const contextRank=ranked(count(basis,row=>values(row,['contexts','context'])),5);
    const currentRank=ranked(count(basis,row=>values(row,['currentActivities','activity','action'])),5);
    const afterRank=ranked(count(basis,row=>values(row,['afterActivities'])),5);
    const nextRank=ranked(count(basis,row=>values(row,['nextEmotion'])),4);
    const todayKey=new Date().toISOString().slice(0,10),todayRows=all.filter(row=>rowDate(row)===todayKey);
    const todayMoodRank=ranked(count(todayRows,moods),1),todayTop=todayMoodRank[0]?.[0]||top;
    const todayActivity=values(todayRows[0]||{},['currentActivities','activity','action'])[0]||currentRank[0]?.[0]||'짧게 마음을 기록하기';
    const oneLine=todayRows.length?`${todayTop}의 흐름이 오늘 마음에서 가장 선명했어요.`:'오늘의 마음을 기록하면 한 줄로 정리해드려요.';
    const recommendation=RECOMMENDATIONS[todayTop]||'지금 필요한 작은 활동 하나를 가볍게 시작해보세요.';
    const donut=moodRank.length?`conic-gradient(${moodRank.map(([mood,value],index)=>{const before=moodRank.slice(0,index).reduce((sum,item)=>sum+item[1],0);return `${MOOD_COLORS[mood]||'var(--theme-primary)'} ${percent(before,moodTotal)}% ${percent(before+value,moodTotal)}%`}).join(',')})`:'conic-gradient(var(--theme-accent-soft) 0 100%)';
    const recordPattern=basis.length
      ?`${timeRank[0]?.[0]?`${timeRank[0][0]}에 `:''}${top} 기록이 가장 많았고, ${currentRank[0]?.[0]||contextRank[0]?.[0]||'일상 활동'}과 자주 연결됐어요.${nextRank[0]?.[0]?` 기록 뒤에는 ${nextRank[0][0]}을(를) 바라는 경우가 많았어요.`:''}`
      :'감정 기록이 쌓이면 시간·장소·활동의 연결 패턴을 보여드려요.';
    window.AiderLogInsightsSummaryV132=Object.freeze({
      oneLine,
      topEmotion:todayTop,
      topEmotionDetail:todayRows.length?`${todayRows.length}개의 오늘 기록에서 가장 가까운 감정`:`최근 ${topCount}회 기록된 감정`,
      activity:todayActivity,
      recommendation
    });
    root.dataset.insightSummaryMovedV132='1';
    root.innerHTML=`
      <section class="ins-hero ins-hero-v126">
        <span class="ins-kicker">30 DAY · INSIGHT ATLAS</span><h1>마음의 궤적</h1>
        <p>${basis.length?`최근 30일 ${basis.length}개의 기록을 바탕으로 마음의 흐름을 정리했어요.`:'마음을 기록하면 오늘의 흐름과 회복 단서를 함께 정리해드려요.'}</p>
        <div class="insight-hero-orbit-v132" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>
      <section class="insight-site-v126">
        <article class="insight-site-card-v126"><header><h3>Mood Balance</h3><span>최근 30일</span></header><div class="insight-balance-v126"><div class="insight-donut-v126" style="background:${donut}"><span><strong>${basis.length}</strong>기록<br>평균 ${avg}/5</span></div><div class="insight-mood-list-v126">${listMarkup(moodRank,moodTotal)}</div></div></article>
        <article class="insight-site-card-v126"><header><h3>자주 느낀 감정 TOP 3</h3><span>EMOTION</span></header><div class="insight-top-v126">${topRowsMarkup(moodRank.slice(0,3),moodTotal)}</div><div class="insight-pattern-v126">${safe(RECOMMENDATIONS[top]||recordPattern)}</div></article>
        <article class="insight-site-card-v126"><header><h3>기록 환경 분석</h3><span>CONTEXT</span></header><div class="insight-analysis-v126"><article><b>시간대</b><p>${timeRank.length?timeRank.map(([name,value])=>`${safe(name)} ${value}회`).join(' · '):'기록 시간이 쌓이면 분석됩니다.'}</p></article><article><b>장소 · 함께한 사람</b><p>${[...placeRank,...companionRank].length?[...placeRank,...companionRank].slice(0,5).map(([name,value])=>`${safe(name)} ${value}회`).join(' · '):'장소와 함께한 사람을 기록하면 연결 패턴이 나타납니다.'}</p></article><article><b>상황</b><p>${contextRank.length?contextRank.map(([name,value])=>`${safe(name)} ${value}회`).join(' · '):'상황을 선택하면 감정의 계기를 비교할 수 있어요.'}</p></article></div></article>
        <article class="insight-site-card-v126"><header><h3>감정 흐름 분석</h3><span>PATTERN</span></header><div class="insight-analysis-v126"><article><b>가장 강한 감정</b><p>${safe(top)} · ${topCount}회 · 평균 강도 ${avg}/5</p></article><article><b>원하는 다음 감정</b><p>${nextRank.length?nextRank.map(([name,value])=>`${safe(name)} ${value}회`).join(' · '):'다음 감정을 선택하면 변화 방향을 보여드려요.'}</p></article></div><div class="insight-pattern-v126">${safe(recordPattern)}</div></article>
        <article class="insight-site-card-v126 insight-wide-v126"><header><h3>활동 전후 분석</h3><span>ACTIVITY</span></header><div class="insight-activity-columns-v126"><section><h4>감정과 함께한 활동</h4><div class="insight-activity-list-v126">${listMarkup(currentRank,basis.length,'activity')}</div></section><section><h4>기록 후 한 활동</h4><div class="insight-activity-list-v126">${listMarkup(afterRank,basis.length,'activity')}</div></section></div></article>
      </section>`;
  }
  function removeEventEyebrows(){
    $$('#event .section-label').forEach(node=>{const text=node.textContent.trim();if(text==='YOUR MOMENTS'||text==='MY CULTURE')node.remove()});
  }
  if(typeof renderInsights==='function')renderInsights=renderInsightsV126;
  window.AiderLogInsightsV126=Object.freeze({render:renderInsightsV126,rows});
  let queued=false;const refresh=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;removeEventEyebrows()})};
  new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>{removeEventEyebrows();if(typeof activePage!=='undefined'&&activePage==='insights')renderInsightsV126()},{once:true}):removeEventEyebrows();
})();
