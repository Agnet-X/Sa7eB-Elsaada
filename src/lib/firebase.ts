import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAfFor_lP8DSAHx_FCpMWaD1FONlvxlwuI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "saada-butchery.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "saada-butchery",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "saada-butchery.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "883484800338",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:883484800338:web:c89b4f6ce822c41eed768b",
  measurementId: "G-829QYQHHEV",
};

// Prevent re-initialization during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
