import {applicationDefault,cert,getApps,initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
export function services(){
  let app=getApps()[0];
  if(!app){let c;const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if(raw){c=JSON.parse(raw);c.private_key=c.private_key?.replace(/\\n/g,'\n');}
    else if(process.env.FIREBASE_PROJECT_ID&&process.env.FIREBASE_CLIENT_EMAIL&&process.env.FIREBASE_PRIVATE_KEY)c={projectId:process.env.FIREBASE_PROJECT_ID,clientEmail:process.env.FIREBASE_CLIENT_EMAIL,privateKey:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n')};
    app=initializeApp({credential:c?cert(c):applicationDefault(),projectId:c?.project_id||c?.projectId||process.env.FIREBASE_PROJECT_ID});
  }
  return {db:getFirestore(app),auth:getAuth(app)};
}
