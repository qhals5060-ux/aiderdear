import test from 'node:test';
import assert from 'node:assert/strict';
import {coBrokerDealContext} from '../estate-workflow-v171.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('co-broker transaction context uses private property fields without fabricating payout',()=>{
  const result=coBrokerDealContext({coBroker:true,coBrokerStage:'active',coBrokerSource:'partner',coBrokers:[{office:'가든 부동산',name:'담당자',phone:'테스트 연락처',role:'listing',terms:'별도 협의'}],coBrokerInfo:'이전 메모'},esc);
  for(const text of ['공동중개 진행','상대 사무소 매물','가든 부동산','매물 담당','별도 협의','이전 메모','자동 송금이 아닙니다','자동 공유하지 않습니다'])assert(result.includes(text));
});
test('unknown and legacy property fields remain explicitly unconfirmed',()=>{
  assert(coBrokerDealContext(null,esc).includes('매물을 선택'));
  assert(coBrokerDealContext({coBroker:false},esc).includes('자체 중개'));
  const structured=coBrokerDealContext({coBroker:false,coBrokers:[{office:'보관된 파트너'}]},esc);
  assert(structured.includes('보관된 파트너'));assert(structured.includes('상태 미설정'));
  const result=coBrokerDealContext({coBroker:true,coBrokerInfo:'기존 공동중개 기록'},esc);
  assert(result.includes('기존 공동중개 기록'));assert(result.includes('매물 출처 미확인'));
});
test('counterparty values are escaped, never executable HTML',()=>{
  const result=coBrokerDealContext({coBroker:true,coBrokerInfo:'<img src=x>',coBrokers:[{office:'<script>bad</script>',name:'<b>x</b>',phone:'<a>x</a>',terms:'<img src=x>'}]},esc);
  assert(!result.includes('<script>'));assert(!result.includes('<img '));assert(result.includes('&lt;script&gt;'));assert(result.includes('&lt;img src=x&gt;'));
});
