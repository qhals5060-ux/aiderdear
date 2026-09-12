/* Deliberate, minimal copies of personal schedules for selected accepted friends.
   This module never copies memo, private markers, business links or customer data. */
const DAY=86400000;
export const FRIEND_SCHEDULE_MAX_SPAN=366;
export const FRIEND_SCHEDULE_FIELDS=Object.freeze(['source','sourceEventId','ownerUid','ownerEmail','friendshipId','title','date','endDate','time','endTime','allDay']);
export function friendScheduleError(message,code='invalid-argument'){const error=new Error(message);error.code=code;throw error;}
export function friendScheduleId(value){const id=String(value||'');if(!id||id.length>300||/[\u0000-\u001f]/.test(id))friendScheduleError('공유할 일정 또는 연결을 확인해주세요.');return id;}
export function friendScheduleDate(value){
  const date=String(value||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))friendScheduleError('공유 일정의 날짜를 확인해주세요.');
  const stamp=Date.parse(date+'T00:00:00Z');if(!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==date||date<'1900-01-01'||date>'2200-12-31')friendScheduleError('공유 일정의 날짜를 확인해주세요.');return date;
}
const shift=(date,days)=>new Date(Date.parse(date+'T00:00:00Z')+days*DAY).toISOString().slice(0,10);
export function friendScheduleRange({from,to}={}){
  from=friendScheduleDate(from);to=friendScheduleDate(to);
  if(to<from||Date.parse(to)-Date.parse(from)>93*DAY)friendScheduleError('친구 일정은 93일 이내 범위로 조회해주세요.');
  return {from,to,queryFrom:shift(from,-FRIEND_SCHEDULE_MAX_SPAN)};
}
export function friendScheduleContext(input){
  const user=input?.user;if(!user?.uid)friendScheduleError('로그인 후 친구 일정을 사용해주세요.','unauthenticated');
  const uid=friendScheduleId(user.uid),email=String(user.email||'').trim().toLowerCase();
  if(!email||!email.includes('@'))friendScheduleError('로그인 후 친구 일정을 사용해주세요.','unauthenticated');
  const friends=(Array.isArray(input?.friends)?input.friends:[]).filter(row=>row?.friendshipId&&row?.uid&&row.uid!==uid).map(row=>({friendshipId:friendScheduleId(row.friendshipId),uid:friendScheduleId(row.uid)}));
  const unique=[...new Map(friends.map(row=>[row.friendshipId,row])).values()];
  if(/[\/]/.test(uid)||unique.some(row=>/[\/]/.test(row.friendshipId+row.uid)))friendScheduleError('친구 연결 식별자를 확인해주세요.');
  if(unique.length>30)friendScheduleError('친구 일정 공유는 연결된 친구 30명까지 지원합니다.');
  return {uid,email,friends:unique,identity:uid+'|'+email+'|'+unique.map(row=>row.friendshipId+':'+row.uid).sort().join('|')};
}
export function friendScheduleDocumentId(uid,eventId){
  const encode=value=>encodeURIComponent(friendScheduleId(value)).replace(/~/g,'%7E');
  const id=encode(uid)+'~'+encode(eventId);if(id.length>1400)friendScheduleError('일정 식별자가 너무 길어 공유할 수 없습니다.');return id;
}
export function friendScheduleTargets(values,context){
  if(!Array.isArray(values))friendScheduleError('공유할 친구를 선택해주세요.');
  const targets=[...new Set(values.map(friendScheduleId))];
  if(targets.some(id=>!context.friends.some(row=>row.friendshipId===id)))friendScheduleError('현재 연결된 친구만 선택할 수 있습니다.','permission-denied');
  return targets;
}
function time(value){const t=String(value||'');if(t&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(t))friendScheduleError('공유 일정의 시간을 확인해주세요.');return t;}
export function createFriendScheduleShare(event,context,friendshipId){
  if(!event||event.isAiderDear!==true||event.readOnly||event.projectionSource||event.externalSource||event.isHoliday||event.isBirthday||event.friendShared
    ||event.calendarScope&&event.calendarScope!=='personal'||/^(?:work|consult|consulting|estate|business)$/.test(String(event.category||'')))friendScheduleError('직접 등록한 개인 일정만 친구에게 공유할 수 있습니다.','permission-denied');
  if(String(event.authorEmail||'').trim().toLowerCase()!==context.email||event.authorUid&&String(event.authorUid)!==context.uid)friendScheduleError('내가 등록한 일정만 공유할 수 있습니다.','permission-denied');
  friendScheduleTargets([friendshipId],context);
  const sourceEventId=friendScheduleId(event.id),title=String(event.title||'').trim(),date=friendScheduleDate(event.date),endDate=friendScheduleDate(event.endDate||date),allDay=!!event.allDay;
  if(!title||title.length>200)friendScheduleError('일정 이름은 1~200자로 입력해주세요.');
  if(endDate<date||Date.parse(endDate)-Date.parse(date)>FRIEND_SCHEDULE_MAX_SPAN*DAY)friendScheduleError('친구 공유 일정은 시작일 이후 366일 이내로 설정해주세요.');
  const startTime=allDay?'':time(event.time),endTime=allDay?'':time(event.endTime||startTime);
  if(!allDay&&!startTime||date===endDate&&endTime<startTime)friendScheduleError('일정의 시작·종료 시간을 확인해주세요.');
  return {source:'personal',sourceEventId,ownerUid:context.uid,ownerEmail:context.email,friendshipId,title,date,endDate,time:startTime,endTime,allDay};
}
export function friendScheduleProjection(data,context,friendshipId){
  if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).some(key=>!FRIEND_SCHEDULE_FIELDS.includes(key)&&key!=='updatedAt'))friendScheduleError('친구 일정 형식을 확인할 수 없습니다.','data-loss');
  const friend=context.friends.find(row=>row.friendshipId===friendshipId);
  if(!friend||data.friendshipId!==friendshipId||data.source!=='personal'||![context.uid,friend.uid].includes(data.ownerUid))friendScheduleError('현재 친구 연결과 일정의 소유자가 일치하지 않습니다.','permission-denied');
  if(typeof data.ownerEmail!=='string'||!data.ownerEmail.includes('@')||typeof data.allDay!=='boolean')friendScheduleError('친구 일정 형식을 확인할 수 없습니다.','data-loss');
  const share=createFriendScheduleShare({id:data.sourceEventId,title:data.title,date:data.date,endDate:data.endDate,time:data.time,endTime:data.endTime,allDay:data.allDay,authorUid:data.ownerUid,authorEmail:data.ownerEmail,isAiderDear:true},{...context,uid:data.ownerUid,email:String(data.ownerEmail||'').trim().toLowerCase()},friendshipId);
  return {id:'friend:'+friendshipId+':'+share.ownerUid+':'+share.sourceEventId,sourceId:share.sourceEventId,friendshipId,friendShared:true,sourceTitle:'친구 공유 일정',calendarScope:'personal',title:share.title,date:share.date,endDate:share.endDate,time:share.time,endTime:share.endTime,allDay:share.allDay,authorUid:share.ownerUid,authorEmail:share.ownerEmail,owner:'shared',readOnly:true,isAiderDear:false,memo:''};
}
