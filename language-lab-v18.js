(function(){
  class AiderLogLanguageLab extends HTMLElement{
    constructor(){
      super();
      this.attachShadow({mode:'open'});
      this.completion=null;
      this.keepLessonScrollInside=(event)=>event.stopPropagation();
    }
    async connectedCallback(){
      ['wheel','touchstart','touchmove','touchend'].forEach(type=>this.addEventListener(type,this.keepLessonScrollInside,{passive:true}));
      if(this.shadowRoot.childNodes.length)return;
      try{
        const [templateResponse,styleResponse]=await Promise.all([
          fetch('./language-lab-v18-template.html',{cache:'no-store'}),
          fetch('./language-lab-v18.css',{cache:'no-store'})
        ]);
        if(!templateResponse.ok||!styleResponse.ok)throw new Error('어학 학습 자산을 불러오지 못했습니다.');
        const [source,style]=await Promise.all([templateResponse.text(),styleResponse.text()]);
        const parsed=new DOMParser().parseFromString(source,'text/html');
        const app=parsed.querySelector('.app-shell'),toast=parsed.querySelector('.toast');
        if(!app||!toast)throw new Error('어학 학습 화면 구조를 찾지 못했습니다.');
        const styleElement=document.createElement('style');styleElement.textContent=style;
        app.querySelector('.brand-icon')?.remove();
        app.querySelector('.brand b').textContent='LANGUAGE LAB';
        app.querySelector('.brand small')?.remove();
        const share=document.createElement('button');
        share.type='button';share.className='language-partner-share';share.textContent='학습 완료 보내기';share.disabled=true;
        share.hidden=this.getAttribute('data-paired')!=='true';
        app.querySelector('.recent-study-actions')?.appendChild(share);
        this.shadowRoot.append(styleElement,app,toast);
        this.addEventListener('language-lab-complete',event=>{
          this.completion=event.detail||null;
          share.disabled=!this.completion;
          share.textContent='학습 완료 보내기';
        });
        share.addEventListener('click',()=>{
          if(!this.completion)return;
          this.dispatchEvent(new CustomEvent('language-lab-share',{bubbles:true,composed:true,detail:this.completion}));
        });
        window.initAiderLogLanguageLab?.(this.shadowRoot,app);
        this.dispatchEvent(new CustomEvent('language-lab-ready',{bubbles:true,composed:true}));
      }catch(error){
        this.shadowRoot.innerHTML=`<div style="padding:24px;font:700 13px/1.6 sans-serif;color:#8a2432">${String(error.message||error)}</div>`;
      }
    }
    disconnectedCallback(){
      ['wheel','touchstart','touchmove','touchend'].forEach(type=>this.removeEventListener(type,this.keepLessonScrollInside));
    }
    static get observedAttributes(){return ['data-paired']}
    attributeChangedCallback(name,oldValue,newValue){
      if(name==='data-paired'){
        const button=this.shadowRoot.querySelector('.language-partner-share');
        if(button)button.hidden=newValue!=='true';
      }
    }
  }
  if(!customElements.get('aiderlog-language-lab'))customElements.define('aiderlog-language-lab',AiderLogLanguageLab);
})();
