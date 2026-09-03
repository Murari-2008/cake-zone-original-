import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged as nativeOnAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Custom onAuthStateChanged to allow Developer Bypass Mode when Firebase is misconfigured in console
export function onAuthStateChanged(authInstance: any, callback: (user: User | null) => void) {
  // Listen to native firebase auth changes
  const nativeUnsubscribe = nativeOnAuthStateChanged(authInstance, (user) => {
    // If there is an active bypass user, don't override it with null
    const bypassUserStr = localStorage.getItem('cz_bypass_auth_user');
    if (bypassUserStr && !user) {
      try {
        const bypassUser = JSON.parse(bypassUserStr);
        callback(bypassUser as User);
        return;
      } catch (e) {
        // ignore
      }
    }
    callback(user);
  });

  // Listen to localStorage changes or custom bypass events to trigger callback
  const handleBypassUpdate = () => {
    const bypassUserStr = localStorage.getItem('cz_bypass_auth_user');
    if (bypassUserStr) {
      try {
        const bypassUser = JSON.parse(bypassUserStr);
        callback(bypassUser as User);
      } catch (e) {
        callback(null);
      }
    } else {
      callback(authInstance.currentUser);
    }
  };

  window.addEventListener('cz_bypass_auth_changed', handleBypassUpdate);

  // Initial trigger to sync state immediately
  handleBypassUpdate();

  return () => {
    nativeUnsubscribe();
    window.removeEventListener('cz_bypass_auth_changed', handleBypassUpdate);
  };
}

