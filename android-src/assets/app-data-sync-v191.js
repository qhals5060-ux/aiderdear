/* App-only document coordinator. Snapshot payloads replace redundant getDoc reads. */
(() => {
  'use strict';
  const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));
  window.createAppDataSyncV191=function({context,apply,blocked=()=>false,onScope=()=>{}}){
    let scope='',api=null,generation=0;
    const states={app:{},private:{}};
    const key=c=>c.uid?`${c.uid}:${c.pairId||'solo'}`:'';
    function reset(){for(const kind of Object.keys(states))states[kind]={version:0,attempted:false,flight:null,pending:null,writes:0,failedWrite:false,refreshAfterWrite:false,deferredRead:false};}
    reset();
    function current(){const c=context(),next=key(c);if(next!==scope||c.api!==api){const previous=scope;scope=next;api=c.api;generation++;reset();onScope(previous,scope);}return c;}
    const same=(g,k,a)=>g===generation&&k===scope&&a===api&&key(context())===k&&context().api===a;
    function flush(){current();for(const kind of Object.keys(states)){const s=states[kind];if(s.writes||s.failedWrite||blocked(kind))continue;if(s.pending){const pending=s.pending;s.pending=null;apply(kind,copy(pending.payload),pending.detail);}if(s.refreshAfterWrite||s.deferredRead){s.refreshAfterWrite=false;s.deferredRead=false;void read(kind);}}}
    async function read(kind){
      const c=current(),s=states[kind];if(!scope||!api||c.ready===false||s.writes||s.failedWrite)return;
      if(blocked(kind)){s.deferredRead=true;s.attempted=true;return;}
      if(s.flight)return s.flight;
      const g=generation,k=scope,a=api,version=s.version;s.attempted=true;
      const method=kind==='app'?'readAppData':'readPrivateData';if(typeof a[method]!=='function')return;
      const task=Promise.resolve().then(()=>a[method](kind==='private'?{remember:false}:undefined)).then(payload=>{if(!same(g,k,a)||s.version!==version)return;s.pending={payload,detail:{uid:c.uid,scope:k,source:'read'}};flush();}).catch(()=>{});
      s.flight=task;return task.finally(()=>{if(s.flight===task)s.flight=null;});
    }
    function request(kinds=['app','private']){current();return Promise.all(kinds.map(read));}
    function observe(){const c=current();if(!scope||c.ready===false)return Promise.resolve();return request(Object.keys(states).filter(kind=>!states[kind].attempted));}
    function receive(kind,detail){
      const c=current();if(!scope||!detail||kind==='app'&&detail.scope!==scope||kind==='private'&&detail.uid!==c.uid)return false;
      if(detail.fromCache&&detail.exists===false)return false;
      if(!Object.hasOwn(detail,'payload')){void request([kind]);return false;}
      const s=states[kind];s.attempted=true;s.version++;
      if(detail.hasPendingWrites){s.pending=null;return false;}
      s.deferredRead=false;s.pending={payload:copy(detail.payload),detail};flush();return true;
    }
    function beginWrite(kind,submitted){
      const c=current(),s=states[kind],g=generation,k=scope,a=api,local=copy(submitted);s.version++;s.writes++;s.pending=null;s.flight=null;
      return (success,result)=>{if(!same(g,k,a))return;s.writes=Math.max(0,s.writes-1);s.failedWrite=!success;s.version++;
        const confirmed=s.pending,payload=result&&typeof result==='object'?copy(result):local;s.pending=null;
        if(!success)return;
        if(payload&&typeof payload==='object'){
          s.pending={payload,detail:{uid:c.uid,scope:k,source:'write'}};
          // The transaction return contains merged concurrent fields. If an
          // already-delivered confirmed snapshot differs, one scoped read is
          // necessary to distinguish a pre-commit snapshot from a newer edit.
          s.refreshAfterWrite=!!confirmed&&!confirmed.detail.hasPendingWrites&&JSON.stringify(confirmed.payload)!==JSON.stringify(payload);
        }
        flush();
      };
    }
    return Object.freeze({observe,request,receive,flush,beginWrite});
  };
})();
