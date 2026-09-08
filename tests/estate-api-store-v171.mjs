import assert from 'node:assert/strict';
// Local isolated store only. Never substitutes for live Firestore in production.
export class MemoryFirestore {
 constructor(){this.rows=new Map();this.queue=Promise.resolve();this.transactionMetrics=[];this.queryMetrics=[];this.beforeCommit=null;}
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
 constructor(db,path,filters=[],after=null,count=Infinity,orders=[]){Object.assign(this,{db,path,filters,after,count,orders});}
 on(db){return new Query(db,this.path,this.filters,this.after,this.count,this.orders);}
 orderBy(key,direction='asc'){return new Query(this.db,this.path,this.filters,this.after,this.count,[...this.orders,{key,direction}]);}
 limit(count){return new Query(this.db,this.path,this.filters,this.after,count,this.orders);}
 startAfter(...after){return new Query(this.db,this.path,this.filters,after,this.count,this.orders);}
 where(key,op,value){return new Query(this.db,this.path,[...this.filters,{key,op,value}],this.after,this.count,this.orders);}
 doc(id){return this.db.doc(this.path+'/'+id);}
 async get(){
  const prefix=this.path+'/',depth=prefix.split('/').length;
  const orders=this.orders.some(({key})=>key==='__name__')?this.orders:[...this.orders,{key:'__name__',direction:this.orders.at(-1)?.direction||'asc'}];
  const values=([path,row])=>orders.map(({key})=>key==='__name__'?path.split('/').at(-1):row[key]);
  const compare=(a,b)=>{for(let i=0;i<b.length;i++){const result=typeof a[i]==='string'&&typeof b[i]==='string'?Buffer.compare(Buffer.from(a[i]),Buffer.from(b[i])):a[i]<b[i]?-1:a[i]>b[i]?1:0;if(result)return orders[i].direction==='desc'?-result:result;}return 0;};
  const entries=[...this.db.rows].filter(([p,row])=>p.startsWith(prefix)&&p.split('/').length===depth&&orders.every(({key})=>key==='__name__'||Object.hasOwn(row,key))&&this.filters.every(({key,op,value})=>op==='=='?row[key]===value:op==='array-contains'?row[key]?.includes(value):false)).sort((a,b)=>compare(values(a),values(b))).filter(entry=>!this.after||compare(values(entry),this.after)>0).slice(0,this.count);
  this.db.queryMetrics.push({path:this.path,orders,limit:this.count,after:this.after,returned:entries.length});
  return {docs:await Promise.all(entries.map(([path])=>this.db.doc(path).get())),size:entries.length};
 }
}
