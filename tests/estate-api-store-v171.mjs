import assert from 'node:assert/strict';
// Local isolated store only. Never substitutes for live Firestore in production.
export class MemoryFirestore {
 constructor(){this.rows=new Map();this.queue=Promise.resolve();this.transactionMetrics=[];this.beforeCommit=null;}
 doc(path){return new Ref(this,path);}
 collection(path){return new Query(this,path);}
 async runTransaction(fn){
  const previous=this.queue;let release;this.queue=new Promise(resolve=>{release=resolve;});await previous;
  try{const working=new MemoryFirestore();working.rows=structuredClone(this.rows);let writes=false;const operations=[],measure=row=>Buffer.byteLength(JSON.stringify(row||{}));
   const tx={get:async target=>{assert.equal(writes,false,'Firestore transactions cannot read after writing');return target instanceof Ref?working.doc(target.path).get():target.on(working).get();},set:(ref,row)=>{writes=true;operations.push({type:'set',path:ref.path,bytes:measure(row)});working.rows.set(ref.path,structuredClone(row));},delete:ref=>{writes=true;operations.push({type:'delete',path:ref.path,bytes:measure(working.rows.get(ref.path))});working.rows.delete(ref.path);}};
   const result=await fn(tx),metric={writes:operations.length,bytes:operations.reduce((sum,op)=>sum+op.bytes,0),operations};if(this.beforeCommit)await this.beforeCommit(metric);this.transactionMetrics.push(metric);this.rows=working.rows;return result;
  }finally{release();}
 }
}
class Ref {
 constructor(db,path){this.db=db;this.path=path;this.id=path.split('/').at(-1);}
 collection(name){return this.db.collection(this.path+'/'+name);}
 async get(){const row=this.db.rows.get(this.path);return {exists:row!==undefined,id:this.id,ref:this,data:()=>structuredClone(row)};}
}
class Query {
 constructor(db,path,filters=[],after='',count=Infinity){Object.assign(this,{db,path,filters,after,count});}
 on(db){return new Query(db,this.path,this.filters,this.after,this.count);}
 orderBy(){return this;}
 limit(count){return new Query(this.db,this.path,this.filters,this.after,count);}
 startAfter(after){return new Query(this.db,this.path,this.filters,after,this.count);}
 where(key,op,value){return new Query(this.db,this.path,[...this.filters,{key,op,value}],this.after,this.count);}
 doc(id){return this.db.doc(this.path+'/'+id);}
 async get(){const prefix=this.path+'/',depth=prefix.split('/').length;const entries=[...this.db.rows].filter(([p,row])=>p.startsWith(prefix)&&p.split('/').length===depth&&p.split('/').at(-1)>this.after&&this.filters.every(({key,op,value})=>op==='=='?row[key]===value:op==='array-contains'?row[key]?.includes(value):false)).sort(([a],[b])=>a<b?-1:a>b?1:0).slice(0,this.count);return {docs:await Promise.all(entries.map(([path])=>this.db.doc(path).get())),size:entries.length};}
}
