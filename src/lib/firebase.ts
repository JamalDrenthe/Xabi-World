import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBOEGPjjkw0B6QViqMqaw-U4y1pQsLtaGU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'xabi-world-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'xabi-world-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'xabi-world-dev.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '402169866007',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:402169866007:web:842a61efd89e4caf967952',
};

let app: FirebaseApp;
if (getApps().length > 0) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { app, firebaseConfig };
