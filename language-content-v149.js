/* AiderLog v149 · validated, split-loaded Language Lab v2 content adapter */
(function(){
  'use strict';
  const ROOT='./language-data-v2/';
  const cache=new Map();
  let manifestPromise=null;
  let validationPromise=null;
  const normalizeLanguage=value=>['en','ja','zh'].includes(String(value))?String(value):'ja';
  const normalizeLevel=value=>{const n=Number(value);return Number.isInteger(n)&&n>=0&&n<5?n:0};
  const key=(language,level)=>`${normalizeLanguage(language)}:${normalizeLevel(level)}`;
  async function json(path){const response=await fetch(path,{cache:'force-cache'});if(!response.ok)throw new Error(`Language 콘텐츠를 열 수 없습니다 (${response.status}).`);return response.json()}
  function validateCourse(course,language,level){
    if(!course||course.language!==language||Number(course.uiLevelIndex)!==level)throw new Error('선택한 언어 과정과 콘텐츠 파일이 일치하지 않습니다.');
    if(!Array.isArray(course.units)||course.units.length!==8||course.units.some(unit=>!Array.isArray(unit.lessons)||unit.lessons.length!==10))throw new Error('Language 과정은 8 UNIT · 80 Lesson이어야 합니다.');
    const ids=course.units.flatMap(unit=>unit.lessons.map(lesson=>lesson.id));
    if(new Set(ids).size!==ids.length)throw new Error('Language Lesson ID가 중복되었습니다.');
    return course;
  }
  async function loadManifest(){
    validationPromise ||= json(`${ROOT}validation-report.json`).then(report=>{if(report?.ok!==true)throw new Error('Language 콘텐츠 검증을 통과하지 못했습니다.');return report});
    await validationPromise;
    manifestPromise ||= json(`${ROOT}data/manifest.json`);
    return manifestPromise;
  }
  async function loadCourse(language,level){
    language=normalizeLanguage(language);level=normalizeLevel(level);
    const id=key(language,level);if(cache.has(id))return cache.get(id);
    const manifest=await loadManifest();
    const item=(manifest.courses||[]).find(row=>row.language===language&&Number(row.uiLevelIndex)===level);
    if(!item)throw new Error('선택한 Language 과정을 찾을 수 없습니다.');
    const course=validateCourse(await json(`${ROOT}data/${item.path}`),language,level);
    cache.set(id,course);return course;
  }
  window.AiderLogLanguageV2={
    schemaVersion:'aiderlog.language-all-levels.v2',normalizeLanguage,normalizeLevel,loadCourse,
    getCourse:(language,level)=>cache.get(key(language,level))||null,
    get manifest(){return manifestPromise}
  };
  const original=window.initAiderLogLanguageLab;
  if(typeof original!=='function')return;
  window.initAiderLogLanguageLab=async function(root,shell){
    try{
      let saved={};try{saved=JSON.parse(localStorage.getItem('aiderlog-language-course-v114')||'{}')}catch{}
      const language=normalizeLanguage(saved.language);
      const level=normalizeLevel(saved.levelByLanguage?.[language]);
      await loadCourse(language,level);
      const result=original(root,shell);
      const style=document.createElement('style');
      style.dataset.languageV149='true';
      style.textContent=`
        .app-header{height:62px!important;min-height:62px!important;padding:7px 9px!important;display:flex!important;align-items:center!important;gap:6px!important}
        .brand{flex:0 0 auto!important}.brand b{font-family:"Avenir Next","Century Gothic","Trebuchet MS","Noto Sans KR",sans-serif!important;font-size:19px!important;font-weight:600!important;letter-spacing:-.055em!important}
        .header-controls{min-width:0!important;flex:1!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:5px!important}
        .header-course{min-width:0!important;order:1!important}.header-course .course-selectors{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;width:auto!important}
        .header-course .language-select,.header-course .level-select{min-width:0!important;flex:0 1 auto!important;padding:0!important;font-size:0!important}
        .header-course .language-select select,.header-course .level-select select{height:36px!important;margin:0!important;padding:0 22px 0 8px!important;border-radius:11px!important;font-size:11px!important}
        .header-course .language-select select{width:72px!important;min-width:72px!important}.header-course .level-select select{width:118px!important;min-width:0!important}
        .header-course .level-select>small{display:none!important}.header-stats{order:2!important;gap:3px!important}.streak-chip{display:none!important}.records-button{width:38px!important;min-width:38px!important;height:36px!important;padding:0!important;overflow:hidden!important;color:transparent!important;font-size:0!important;border-radius:11px!important}.records-button::before{content:"☰";color:var(--ink);font-size:15px}.records-button b{position:absolute;right:2px;top:2px;color:#fff;font-size:8px}
        .single-page{height:calc(100% - 62px)!important;min-height:0!important;padding:8px!important;overflow-y:auto!important}.dashboard-section{margin-top:10px!important}.course-panel{min-height:360px!important}
        @media(max-width:390px){.app-header{gap:4px!important;padding-inline:6px!important}.brand b{font-size:16px!important}.header-course .language-select select{width:64px!important;min-width:64px!important}.header-course .level-select select{width:105px!important}.records-button{width:34px!important;min-width:34px!important}}
      `;
      root.append(style);
      return result;
    }catch(error){
      console.error('Language v2 initialization failed',error);
      const target=root?.querySelector?.('.language-lab-loading')||root;
      if(target)target.innerHTML=`<div style="padding:28px;font:700 13px/1.7 sans-serif;color:#8a2432">${String(error.message||error)}</div>`;
    }
  };
})();
