/* Visual ownership only. Never changes stored records, sharing or permissions. */
(function(root){
  'use strict';
  const email=value=>String(value||'').trim().toLowerCase();
  function isReceived(row,user){
    if(!row||!user?.uid||row.isHoliday||row.isBirthday||row.projectionSource||['work','consult','consulting','estate','business'].includes(row.calendarScope))return false;
    const authorUid=String(row.authorUid||row.ownerUid||''),authorEmail=email(row.authorEmail||row.ownerEmail);
    // Sharing my own event does not turn it into an incoming event.
    if(authorUid===String(user.uid)||authorEmail&&authorEmail===email(user.email))return false;
    const shared=row.friendShared===true||row.shareWithCouple===true||row.owner==='shared'||row.owner==='partner';
    if(!shared)return false;
    return Boolean(authorUid||authorEmail||row.owner==='partner');
  }
  const api=Object.freeze({isReceived,color:(row,user,fallback)=>isReceived(row,user)?'#B58B00':fallback});
  root.AiderSharedScheduleV176=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
