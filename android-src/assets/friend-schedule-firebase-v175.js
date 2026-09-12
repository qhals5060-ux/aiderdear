import {collection,doc,getDoc,getDocs,query,where,orderBy,limit,startAfter,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {friendScheduleError,friendScheduleId,friendScheduleContext,friendScheduleDocumentId,friendScheduleRange,friendScheduleTargets,createFriendScheduleShare,friendScheduleProjection} from './friend-schedule-v175.js';

const firebase={collection,doc,getDoc,getDocs,query,where,orderBy,limit,startAfter,runTransaction,serverTimestamp};
/* No listeners or persistent cache. Reads are bounded and every await rechecks the
   actor + accepted friend set. The host refreshes when month/login/friends change. */
export function createFriendScheduleAdapter({db,getContext,sdk=firebase}){
  const capture=()=>friendScheduleContext(getContext());
  function same(context){if(capture().identity!==context.identity)friendScheduleError('계정 또는 친구 연결이 변경되어 작업을 중단했습니다.','aborted');}
  const ref=(friendshipId,uid,eventId)=>sdk.doc(db,'friendships',friendshipId,'scheduleShares',friendScheduleDocumentId(uid,eventId));
  const active=(snapshot,context,friend)=>{
    const row=snapshot.exists()?snapshot.data():null;
    if(row?.status!=='active'||!Array.isArray(row.memberUids)||row.memberUids.length!==2||!row.memberUids.includes(context.uid)||!row.memberUids.includes(friend.uid))friendScheduleError('친구 연결이 해제되었습니다. 화면을 새로고침해주세요.','permission-denied');
  };
  function ownShare(snapshot,context,friendshipId,eventId){
    if(!snapshot.exists())return;
    const row=friendScheduleProjection(snapshot.data(),context,friendshipId);
    if(row.authorUid!==context.uid||row.sourceId!==eventId)friendScheduleError('공유 일정의 소유자 또는 식별자가 일치하지 않습니다.','data-loss');
  }
  async function targets(eventId){
    const context=capture(),id=friendScheduleId(eventId),selected=[];
    for(const friend of context.friends){same(context);const snapshot=await sdk.getDoc(ref(friend.friendshipId,context.uid,id));same(context);if(snapshot.exists()){
      ownShare(snapshot,context,friend.friendshipId,id);selected.push(friend.friendshipId);
    }}
    return selected;
  }
  async function read(input){
    const context=capture(),range=friendScheduleRange(input),events=[],ownTargetsByEventId={};
    for(const friend of context.friends){
      let cursor=null,pages=0;
      do{
        same(context);
        const constraints=[sdk.where('date','>=',range.queryFrom),sdk.where('date','<=',range.to),sdk.orderBy('date'),sdk.limit(100)];
        if(cursor)constraints.push(sdk.startAfter(cursor));
        const snapshot=await sdk.getDocs(sdk.query(sdk.collection(db,'friendships',friend.friendshipId,'scheduleShares'),...constraints));
        same(context);pages++;
        for(const item of snapshot.docs){
          const row=friendScheduleProjection(item.data(),context,friend.friendshipId);
          if(row.authorUid===context.uid)(ownTargetsByEventId[row.sourceId]??=[]).push(friend.friendshipId);
          else if(row.date<=range.to&&row.endDate>=range.from)events.push(row);
        }
        cursor=snapshot.docs.length===100?snapshot.docs.at(-1):null;
        if(cursor&&pages>=10)friendScheduleError('친구 공유 일정이 많아 전체를 불러오지 못했습니다. 공유 목록을 정리한 뒤 다시 시도해주세요.','resource-exhausted');
      }while(cursor);
    }
    same(context);return {events:events.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)),ownTargetsByEventId};
  }
  async function change(event,eventId,friendshipIds){
    const context=capture(),id=friendScheduleId(eventId),selected=friendScheduleTargets(friendshipIds,context);
    // Build all whitelisted copies before any transaction so invalid input
    // cannot partially remove existing recipients.
    const shares=new Map(selected.map(fid=>[fid,createFriendScheduleShare(event,context,fid)]));
    same(context);
    const completedFriendshipIds=[],failedFriendshipIds=[],failures=[];
    // Small per-friend transactions respect Firestore's security-rule access
    // budget. A retry updates/deletes the same IDs, never creates duplicates.
    for(const friend of context.friends){
      same(context);
      try{await sdk.runTransaction(db,async transaction=>{
        same(context);
        const link=await transaction.get(sdk.doc(db,'friendships',friend.friendshipId));
        const target=ref(friend.friendshipId,context.uid,id),share=await transaction.get(target);
        same(context);active(link,context,friend);
        ownShare(share,context,friend.friendshipId,id);
        const next=shares.get(friend.friendshipId);
        if(next)transaction.set(target,{...next,updatedAt:sdk.serverTimestamp()});
        else if(share.exists())transaction.delete(target);
        same(context);
      },{maxAttempts:1});same(context);completedFriendshipIds.push(friend.friendshipId);}
      catch(error){same(context);failedFriendshipIds.push(friend.friendshipId);failures.push({friendshipId:friend.friendshipId,code:String(error?.code||'unknown')});
        if(String(error?.code||'').endsWith('resource-exhausted')){
          for(const remaining of context.friends.slice(context.friends.indexOf(friend)+1)){failedFriendshipIds.push(remaining.friendshipId);failures.push({friendshipId:remaining.friendshipId,code:'not-attempted-after-quota'});}break;
        }
      }
    }
    if(failedFriendshipIds.length){
      const error=new Error('개인 일정은 유지되지만 친구 공유가 일부 반영되지 않았습니다. 다시 시도해주세요.');
      const quota=failures.some(row=>row.code.endsWith('resource-exhausted'));
      error.code=quota?'resource-exhausted':'partial-failure';error.partial=true;error.completedFriendshipIds=completedFriendshipIds;error.failedFriendshipIds=failedFriendshipIds;error.failures=failures;if(quota)error.retryAfterMs=300000;throw error;
    }
    same(context);return {sharedCount:selected.length,friendshipIds:selected};
  }
  return Object.freeze({read,targets,setTargets:(event,friendshipIds)=>change(event,event?.id,friendshipIds),remove:eventId=>change(null,eventId,[])});
}
