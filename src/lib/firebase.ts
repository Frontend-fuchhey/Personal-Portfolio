import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const getApiKey = (): string => {
  const envKey =
    (import.meta.env.VITE_FIREBASE_API_KEY as string) ||
    (import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY as string);
  if (envKey) return envKey;
  try {
    return atob("QUl6YVN5Q3ZXa0tYbUxfMW00TU5qd3BvQjMxUkQ1OS02VGhtZGJj");
  } catch {
    return "";
  }
};

// Read environment variables (supports NEXT_PUBLIC_FIREBASE_* as well as VITE_FIREBASE_*)
const firebaseConfig = {
  apiKey: getApiKey(),
  authDomain:
    (import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string) ||
    (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) ||
    "shrawan-portfolio.firebaseapp.com",
  projectId:
    (import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string) ||
    (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) ||
    "shrawan-portfolio",
  storageBucket:
    (import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string) ||
    (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) ||
    "shrawan-portfolio.firebasestorage.app",
  messagingSenderId:
    (import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string) ||
    (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) ||
    "674306342708",
  appId:
    (import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID as string) ||
    (import.meta.env.VITE_FIREBASE_APP_ID as string) ||
    "1:674306342708:web:fc834664f508060062ef61",
};

// Initialize Firebase App (singleton pattern safe for hot-module reloading)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication & Providers
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db: Firestore = getFirestore(app);

export default app;
