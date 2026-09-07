import './vendor/pako-2.1.0.min.js';

// Lossless storage representation only. UI, IDs, ordering and record status do
// not change. Gzip CRC/length and an immediate round trip are checked before save.
const MARK = '__aiderlogQuarterArchive168';
const MAX_RAW = 16 * 1024 * 1024;
const utf8 = new TextEncoder(), decoder = new TextDecoder('utf-8', {fatal:true});
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const dateFields = ['date','endDate','dueDate','performedAt','createdAt','updatedAt','completedAt','archivedAt'];
function clock(v) {
  if (typeof v === 'number') return Number.isFinite(v) && v > 946684800000 ? v : 0;
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:$|[T ])/.test(v)) return 0;
  const n = Date.parse(v.length===10 ? v+'T00:00:00Z' : v); return Number.isFinite(n)?n:0;
}
export function cutoffThreeMonths(now=Date.now()) {
  const d=new Date(now),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-3);
  const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
  d.setUTCDate(Math.min(day,last));d.setUTCHours(0,0,0,0);return d.getTime();
}
function quarter(row,cutoff) {
  if(!row || typeof row!=='object' || Array.isArray(row))return '';
  const n=Math.max(0,...dateFields.map(k=>clock(row[k])));if(!n||n>=cutoff)return '';
  const d=new Date(n);return `${d.getUTCFullYear()}-Q${Math.floor(d.getUTCMonth()/3)+1}`;
}
function base64(bytes) {let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);}
function bytes64(s) {if(typeof s!=='string'||s.length>MAX_RAW*2||!/^[-A-Za-z0-9+/]*={0,2}$/.test(s))throw Error('압축 기록 형식 오류');return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
function isPack(value) {return !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===1&&own(value,MARK);}
function unpack(pack,budget) {
  const m=pack[MARK];
  if(!m||m.codec!=='gzip-json'||m.version!==1||!['value','rows','entries'].includes(m.kind)||!Number.isInteger(m.rawBytes)||m.rawBytes<1||m.rawBytes>MAX_RAW)throw Error('지원하지 않는 압축 기록입니다. 저장을 중단했습니다.');
  budget.bytes+=m.rawBytes;if(budget.bytes>MAX_RAW)throw Error('압축 기록 복원 한도를 초과했습니다. 원본은 보존됩니다.');
  const parts=[],inflate=new globalThis.pako.Inflate({chunkSize:16384});let size=0;
  inflate.onData=part=>{size+=part.length;if(size>m.rawBytes||size>MAX_RAW)throw Error('압축 기록 크기가 일치하지 않습니다.');parts.push(part);};
  inflate.push(bytes64(m.data),true);
  if(inflate.err||!inflate.ended||size!==m.rawBytes)throw Error('압축 기록 무결성 검사 실패. 원본을 덮어쓰지 않았습니다.');
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  const value=JSON.parse(decoder.decode(bytes));
  if((m.kind==='rows'||m.kind==='entries')&&(!Array.isArray(value)||value.length!==m.count))throw Error('압축 기록 건수가 일치하지 않습니다.');
  return {kind:m.kind,value};
}
export function decodeArchive(input) {
  const budget={bytes:0};
  function walk(v,depth=0) {
    if(depth>100)throw Error('기록 중첩 한도를 초과했습니다.');
    if(isPack(v)) {
      const p=unpack(v,budget);
      // Archives cannot contain archives. This also bounds malicious nesting.
      if(JSON.stringify(p.value).includes('"'+MARK+'"'))throw Error('중첩 압축 기록은 지원하지 않습니다.');
      return p.kind==='entries'?Object.fromEntries(p.value):p.value;
    }
    if(Array.isArray(v)) {const out=[];for(const item of v){if(isPack(item)&&item[MARK]?.kind==='rows')out.push(...walk(item,depth+1));else out.push(walk(item,depth+1));}return out;}
    if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,item])=>[k,walk(item,depth+1)]));
    return v;
  }
  return walk(input);
}
export function encodeArchive(input,{now=Date.now()}={}) {
  const original=decodeArchive(input),cutoff=cutoffThreeMonths(now);
  function packed(v,q,kind='value') {
    const json=JSON.stringify(v),bytes=utf8.encode(json);if(bytes.length<384||bytes.length>MAX_RAW)return null;
    if(json.includes('"'+MARK+'"'))return null;
    const compressed=globalThis.pako.gzip(bytes,{level:6,header:{time:0}});
    const out={[MARK]:{codec:'gzip-json',version:1,kind,quarter:q,rawBytes:bytes.length,count:Array.isArray(v)?v.length:1,data:base64(compressed)}};
    if(utf8.encode(JSON.stringify(out)).length>=bytes.length*.88)return null;
    if(JSON.stringify(unpack(out,{bytes:0}).value)!==json)throw Error('압축 전후 내용이 달라 저장하지 않았습니다.');
    return out;
  }
  function walk(v) {
    if(Array.isArray(v)) {
      const out=[];for(let i=0;i<v.length;){const q=quarter(v[i],cutoff);if(!q){out.push(walk(v[i++]));continue;}
        let end=i+1;while(end<v.length&&quarter(v[end],cutoff)===q&&end-i<300)end++;
        const rows=v.slice(i,end),p=packed(rows,q,'rows');if(p)out.push(p);else out.push(...rows.map(row=>walk(row)));i=end;
      }return out;
    }
    if(v&&typeof v==='object') {
      const q=quarter(v,cutoff);if(q){const p=packed(v,q);if(p)return p;}
      // Date-indexed history (routine stamps, language review history) keeps its
      // exact key order when it is wholly older than the rolling three months.
      const entries=Object.entries(v);if(entries.length>2&&entries.every(([k])=>clock(k)>0&&clock(k)<cutoff)) {
        const p=packed(entries,'history-before-'+new Date(cutoff).toISOString().slice(0,10),'entries');if(p)return p;
      }
      return Object.fromEntries(entries.map(([k,item])=>[k,walk(item)]));
    }
    return v;
  }
  const result=walk(original);
  if(JSON.stringify(decodeArchive(result))!==JSON.stringify(original))throw Error('기록 압축 복원 검사에 실패했습니다.');
  return result;
}
export function archiveStats(payload) {
  const plain=decodeArchive(payload),packed=encodeArchive(plain);return {originalBytes:utf8.encode(JSON.stringify(plain)).length,storedBytes:utf8.encode(JSON.stringify(packed)).length};
}
export const STORAGE_VERSION=168;
// Keep top-level collection keys addressable for protected Consult fields and
// transactional widget updates. The contents remain losslessly compressed.
export function encodeStoredPayload(input,options) {
  const plain=decodeArchive(input);
  if(!plain||typeof plain!=='object'||Array.isArray(plain))return encodeArchive(plain,options);
  const stored=Object.fromEntries(Object.entries(plain).map(([key,value])=>[key,encodeArchive(value,options)]));
  if(JSON.stringify(decodeArchive(stored))!==JSON.stringify(plain))throw Error('저장 문서 복원 검사에 실패했습니다.');
  return stored;
}
