import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const isProduction =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'xabi.world' ||
    window.location.hostname.endsWith('.vercel.app') ||
    import.meta.env.PROD);

// Fallback configuration ensuring the app always initializes
const defaultConfig = isProduction
  ? {
      apiKey: 'AIzaSyD4QdPseXC5RkrdBxm1EXnH4zeY9hncFtc',
      authDomain: 'xabi-world-prod.firebaseapp.com',
      projectId: 'xabi-world-prod',
      storageBucket: 'xabi-world-prod.firebasestorage.app',
      messagingSenderId: '1072672216138',
      appId: '1:1072672216138:web:6057abb2cdb7e4331ec2b3',
    }
  : {
      apiKey: 'AIzaSyBOEGPjjkw0B6QViqMqaw-U4y1pQsLtaGU',
      authDomain: 'xabi-world-dev.firebaseapp.com',
      projectId: 'xabi-world-dev',
      storageBucket: 'xabi-world-dev.firebasestorage.app',
      messagingSenderId: '402169866007',
      appId: '1:402169866007:web:842a61efd89e4caf967952',
    };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
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
