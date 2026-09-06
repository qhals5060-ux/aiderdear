/* Independent authentication only. Never import the main site's profile/data bootstrap. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,setPersistence,browserSessionPersistence,onAuthStateChanged,signInWithPopup,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
const config={apiKey:'AIzaSyALzfkvB9MscSFBxz6I4mtHtCmx1G5bdaw',authDomain:'aiderdear-1bbca.firebaseapp.com',projectId:'aiderdear-1bbca',storageBucket:'aiderdear-1bbca.firebasestorage.app',messagingSenderId:'272602158936',appId:'1:272602158936:web:4b516691f374849a52772d'};
const app=initializeApp(config,'aiderlog-employee-v167'),auth=getAuth(app),provider=new GoogleAuthProvider(),listeners=new Set();
auth.languageCode='ko';provider.setCustomParameters({prompt:'select_account'});
let current=null,known=false,persistenceError=null,lastAuthError=null;
try{await setPersistence(auth,browserSessionPersistence)}catch(error){persistenceError=error}
onAuthStateChanged(auth,user=>{current=user;known=true;lastAuthError=null;for(const listener of listeners)listener(user)},()=>{current=null;known=true;lastAuthError='로그인 상태를 확인하지 못했습니다. 다시 로그인해주세요.';for(const listener of listeners)listener(null)});
window.AiderEmployeeAuthV167=Object.freeze({
 subscribe(listener){listeners.add(listener);if(known)queueMicrotask(()=>listener(current));return()=>listeners.delete(listener)},
 async login(){if(persistenceError)throw Error('로그인 저장소를 사용할 수 없습니다. 브라우저 개인정보 설정을 확인해주세요.');return signInWithPopup(auth,provider)},
 logout:()=>signOut(auth),
 async getToken(){const user=auth.currentUser;if(!user)throw Object.assign(Error('로그인이 필요합니다.'),{status:401});const token=await user.getIdToken();if(auth.currentUser?.uid!==user.uid)throw Object.assign(Error('계정이 변경되었습니다.'),{status:401});return token},
 currentUser:()=>auth.currentUser,
 lastError:()=>lastAuthError
});
dispatchEvent(new CustomEvent('aiderlog-employee-auth-ready'));
