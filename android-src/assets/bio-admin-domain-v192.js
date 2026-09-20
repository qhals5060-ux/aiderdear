// Shared validation and cash/budget arithmetic. No network, timers or tax presets.
(function(root){
 'use strict';
 const COLLECTIONS=['programs','orders','projects','entries'];
 const SOURCES=['government','ownCash','inKind'];
 const clone=value=>JSON.parse(JSON.stringify(value));
 const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 function id(value,optional=false){if(optional&&(value==null||value===''))return '';if(typeof value!=='string'||!/^[-\w]{1,128}$/.test(value))fail('기록 ID를 확인해주세요.');return value;}
 function text(value,max=2000,required=false){if(value==null)value='';if(typeof value!=='string'||value.length>max)fail('입력 문구의 길이를 확인해주세요.');value=value.trim();if(required&&!value)fail('필수 항목을 입력해주세요.');return value;}
 function money(value=0){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<0||value>1000000000000)fail('금액은 0 이상 1조 원 이하의 정수로 입력해주세요.');return value;}
 function date(value,optional=false){if(optional&&(value==null||value===''))return '';const parsed=typeof value==='string'?new Date(value+'T00:00:00Z'):null;if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01'||value>'2200-12-31'||!Number.isFinite(parsed?.getTime())||parsed.toISOString().slice(0,10)!==value)fail('날짜를 확인해주세요.');return value;}
 function choice(value,values,fallback){value=value==null||value===''?fallback:value;if(!values.includes(value))fail('선택 항목을 확인해주세요.');return value;}
 const active=rows=>(rows||[]).filter(row=>!row.deleted);
 function empty(){return {revision:0,programs:[],orders:[],projects:[],entries:[]};}
 function normalizeState(input){if(input==null)return empty();if(!object(input)||!Number.isSafeInteger(input.revision)||input.revision<0||COLLECTIONS.some(k=>!Array.isArray(input[k])))fail('기존 기록을 읽을 수 없습니다. 원본은 유지됩니다.',409);return clone(input);}
 function normalizeRow(collection,value){
  if(!COLLECTIONS.includes(collection)||!object(value))fail('자료 종류를 확인해주세요.');
  const row={id:id(value.id),notes:text(value.notes)};
  if(collection==='programs'){
   Object.assign(row,{name:text(value.name,120,true),price:money(value.price),active:value.active!==false});
  }else if(collection==='orders'){
   Object.assign(row,{clientId:id(value.clientId),programId:id(value.programId),amount:money(value.amount),date:date(value.date),dueDate:date(value.dueDate,true),status:choice(value.status,['active','closed','cancelled'],'active')});
  }else if(collection==='projects'){
   Object.assign(row,{title:text(value.title,160,true),code:text(value.code,120),agency:text(value.agency,160),startDate:date(value.startDate),endDate:date(value.endDate),governmentAmount:money(value.governmentAmount),ownCashAmount:money(value.ownCashAmount),inKindAmount:money(value.inKindAmount),status:choice(value.status,['planned','active','complete'],'active')});
   if(row.endDate<row.startDate)fail('과제 종료일은 시작일 이후여야 합니다.');
   if(!Array.isArray(value.budgets)||value.budgets.length>100)fail('과제 예산 항목은 100개 이하로 입력해주세요.');
   const ids=new Set();row.budgets=value.budgets.map(b=>{if(!object(b))fail('예산 항목을 확인해주세요.');const next={id:id(b.id),name:text(b.name,100,true),fundingSource:choice(b.fundingSource,SOURCES,'government'),amount:money(b.amount)};if(ids.has(next.id))fail('예산 항목 ID가 중복되었습니다.');ids.add(next.id);return next;});
   for(const source of SOURCES){const total=row.budgets.filter(b=>b.fundingSource===source).reduce((s,b)=>s+b.amount,0),fund=row[{government:'governmentAmount',ownCash:'ownCashAmount',inKind:'inKindAmount'}[source]];if(total>fund)fail('세부 예산 합계가 해당 재원 협약액보다 큽니다.');}
  }else{
   Object.assign(row,{business:choice(value.business,['consult','bio'],'consult'),kind:choice(value.kind,['receipt','refund','expense','settlement','tax','funding'],'expense'),title:text(value.title,160,true),date:date(value.date),amount:money(value.amount),taxAmount:money(value.taxAmount),orderId:id(value.orderId,true),projectId:id(value.projectId,true),budgetId:id(value.budgetId,true),fundingSource:choice(value.fundingSource,SOURCES,'ownCash'),category:text(value.category,100),counterparty:text(value.counterparty,160),evidenceStatus:choice(value.evidenceStatus,['missing','ready','notRequired'],'missing'),evidenceRef:text(value.evidenceRef,1000),settlementStatus:choice(value.settlementStatus,['pending','submitted','settled','rejected'],'pending')});
   if(row.amount===0)fail('거래 금액은 0원보다 커야 합니다.');
   row.paidAmount=money(value.paidAmount==null?row.amount:value.paidAmount);
   if(row.paidAmount>row.amount||row.taxAmount>row.amount)fail('지급액과 포함 세액은 총액을 초과할 수 없습니다.');
   if(['receipt','refund','funding'].includes(row.kind)&&row.paidAmount!==row.amount)fail('입금과 환불은 실제 거래 금액을 입력해주세요.');
   if(['tax','funding'].includes(row.kind)&&row.taxAmount!==0)fail('세금 납부·재원 입금에 포함 세액을 중복 입력할 수 없습니다.');
   if(row.business==='consult'&&(row.projectId||row.budgetId||row.kind==='funding'||row.fundingSource==='inKind'))fail('컨설팅 거래와 국가과제 재원을 구분해주세요.');
   if(['receipt','refund'].includes(row.kind)&&(row.business!=='consult'||!row.orderId))fail('입금·환불에 고객의 구매 프로그램을 연결해주세요.');
   if(row.business==='bio'&&(row.orderId||['receipt','refund','settlement'].includes(row.kind)))fail('바이오 지출의 정산 상태는 같은 지출 기록에서 변경해주세요.');
   if(row.fundingSource==='inKind'&&(row.kind!=='expense'||row.taxAmount!==0))fail('현물은 포함 세액 없는 비용으로 기록해주세요.');
   if(row.kind==='funding'&&(!row.projectId||row.budgetId))fail('재원 입금에는 국가과제만 연결해주세요.');
   if(row.budgetId&&!row.projectId)fail('세부 예산에 연결할 국가과제를 선택해주세요.');
  }
  return row;
 }
 function validateLinks(state){
  const programs=new Map(state.programs.map(row=>[row.id,row])),orders=new Map(state.orders.map(row=>[row.id,row])),projects=new Map(state.projects.map(row=>[row.id,row]));
  for(const row of active(state.orders))if(!programs.has(row.programId))fail('연결된 프로그램을 찾을 수 없습니다.');
  for(const row of active(state.entries)){
   if(row.orderId&&(!orders.has(row.orderId)||orders.get(row.orderId).deleted))fail('거래가 연결된 구매 기록을 먼저 확인해주세요.');
   if(row.projectId){const project=projects.get(row.projectId);if(!project||project.deleted)fail('거래가 연결된 과제를 먼저 확인해주세요.');if(row.budgetId&&!project.budgets.some(b=>b.id===row.budgetId&&b.fundingSource===row.fundingSource))fail('사용 중인 예산 항목·재원을 삭제하거나 변경할 수 없습니다.');}
  }
  for(const order of active(state.orders)){
   const linked=active(state.entries).filter(e=>e.orderId===order.id),receipts=linked.filter(e=>e.kind==='receipt'),refunds=linked.filter(e=>e.kind==='refund');
   if(refunds.reduce((s,e)=>s+e.amount,0)>receipts.reduce((s,e)=>s+e.amount,0)||refunds.reduce((s,e)=>s+e.taxAmount,0)>receipts.reduce((s,e)=>s+e.taxAmount,0))fail('환불액·환불 세액이 누적 입금액·세액을 초과합니다.');
  }
  return state;
 }
 function summary(input){
  const state=normalizeState(input),orders=active(state.orders),entries=active(state.entries),sum=(rows,key='amount')=>rows.reduce((n,row)=>n+Number(row[key]||0),0),consult=entries.filter(e=>e.business==='consult'),bio=entries.filter(e=>e.business==='bio'),kind=(rows,k)=>rows.filter(e=>e.kind===k);
  const orderRows=orders.map(order=>{const rows=consult.filter(e=>e.orderId===order.id),received=sum(kind(rows,'receipt')),refunded=sum(kind(rows,'refund')),netReceived=received-refunded,contract=order.status==='cancelled'?0:order.amount;return {...order,received,refunded,netReceived,outstanding:Math.max(0,contract-netReceived),overpaid:Math.max(0,netReceived-contract)};});
  const expense=sum(kind(consult,'expense'),'paidAmount'),settlement=sum(kind(consult,'settlement'),'paidAmount'),taxPaid=sum(kind(consult,'tax'),'paidAmount'),received=sum(kind(consult,'receipt')),refunded=sum(kind(consult,'refund'));
  const consulting={contract:sum(orders.filter(o=>o.status!=='cancelled')),received,refunded,netReceived:received-refunded,outstanding:sum(orderRows,'outstanding'),overpaid:sum(orderRows,'overpaid'),expense,settlement,taxPaid,unpaid:sum(consult.filter(e=>['expense','settlement','tax'].includes(e.kind)))-sum(consult.filter(e=>['expense','settlement','tax'].includes(e.kind)),'paidAmount'),includedSalesTax:sum(kind(consult,'receipt'),'taxAmount')-sum(kind(consult,'refund'),'taxAmount'),includedCostTax:sum(consult.filter(e=>['expense','settlement'].includes(e.kind)),'taxAmount'),netCash:received-refunded-expense-settlement-taxPaid};
  const projectRows=active(state.projects).map(project=>{
   const rows=bio.filter(e=>e.projectId===project.id),costs=rows.filter(e=>['expense','tax'].includes(e.kind)),cash=costs.filter(e=>e.fundingSource!=='inKind'),inKind=kind(costs,'expense').filter(e=>e.fundingSource==='inKind'),funding=kind(rows,'funding'),cashBudget=project.governmentAmount+project.ownCashAmount,cashCommitted=sum(cash),cashPaid=sum(cash,'paidAmount');
   const sources=SOURCES.map(source=>{const sourceRows=costs.filter(e=>e.fundingSource===source),budget=project[{government:'governmentAmount',ownCash:'ownCashAmount',inKind:'inKindAmount'}[source]],committed=sum(sourceRows),executed=sum(sourceRows,'paidAmount');return{source,budget,committed,executed,remaining:budget-committed,fundingReceived:sum(funding.filter(e=>e.fundingSource===source))};});
   const budgets=project.budgets.map(b=>{const selected=costs.filter(e=>e.budgetId===b.id),committed=sum(selected),executed=sum(selected,'paidAmount');return {...b,committed,executed,remaining:b.amount-committed};});
   return {...project,cashBudget,totalBudget:cashBudget+project.inKindAmount,cashCommitted,cashPaid,cashUnpaid:cashCommitted-cashPaid,cashRemaining:cashBudget-cashCommitted,inKindCommitted:sum(inKind),inKindExecuted:sum(inKind,'paidAmount'),fundingReceived:sum(funding),cashBalance:sum(funding)-cashPaid,missingEvidence:costs.filter(e=>e.evidenceStatus==='missing').length,unsettled:costs.filter(e=>e.settlementStatus!=='settled').length,settledAmount:sum(costs.filter(e=>e.settlementStatus==='settled')),includedCostTax:sum(cash,'taxAmount'),sources,budgets};
  });
  const bioCash=bio.filter(e=>['expense','tax'].includes(e.kind)&&e.fundingSource!=='inKind'),bioFunding=sum(kind(bio,'funding'));
  return {consulting,orders:orderRows,projects:projectRows,bio:{committed:sum(bioCash),paid:sum(bioCash,'paidAmount'),unpaid:sum(bioCash)-sum(bioCash,'paidAmount'),fundingReceived:bioFunding,cashBalance:bioFunding-sum(bioCash,'paidAmount'),inKindCommitted:sum(bio.filter(e=>e.fundingSource==='inKind')),inKindExecuted:sum(bio.filter(e=>e.fundingSource==='inKind'),'paidAmount'),missingEvidence:bio.filter(e=>['expense','tax'].includes(e.kind)&&e.evidenceStatus==='missing').length,unsettled:bio.filter(e=>['expense','tax'].includes(e.kind)&&e.settlementStatus!=='settled').length,includedCostTax:sum(bioCash,'taxAmount')}};
 }
 root.AiderBioAdminDomainV192={COLLECTIONS,SOURCES,empty,active,normalizeState,normalizeRow,validateLinks,summary,money,date};
})(typeof globalThis!=='undefined'?globalThis:window);
