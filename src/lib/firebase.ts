import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";

const sanitizeEnvValue = (
  val: unknown,
  fallback: string,
  options?: { mustInclude?: string; mustNotInclude?: string; minLength?: number }
): string => {
  if (typeof val !== "string") return fallback;
  const cleaned = val.trim().replace(/^['"`]+|['"`]+$/g, "").trim();
  if (!cleaned || cleaned.toLowerCase().startsWith("your_")) return fallback;
  if (options?.minLength && cleaned.length < options.minLength) return fallback;
  if (options?.mustInclude && !cleaned.includes(options.mustInclude)) return fallback;
  if (options?.mustNotInclude && cleaned.includes(options.mustNotInclude)) return fallback;
  return cleaned;
};

const getApiKey = (): string => {
  let fallbackKey = "";
  try {
    fallbackKey = atob("QUl6YVN5Q3ZXa0tYbUxfMW00TU5qd3BvQjMxUkQ1OS02VGhtZGJj");
  } catch {
    fallbackKey = "";
  }
  const rawEnvKey =
    (import.meta.env.VITE_FIREBASE_API_KEY as string) ||
    (import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY as string);

  return sanitizeEnvValue(rawEnvKey, fallbackKey, { minLength: 30 });
};

const firebaseConfig = {
  apiKey: getApiKey(),
  authDomain: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string),
    "shrawan-portfolio.firebaseapp.com",
    { mustInclude: "." }
  ),
  projectId: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string),
    "shrawan-portfolio",
    { mustNotInclude: "." }
  ),
  storageBucket: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string),
    "shrawan-portfolio.firebasestorage.app",
    { mustInclude: "." }
  ),
  messagingSenderId: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string),
    "674306342708"
  ),
  appId: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_APP_ID as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID as string),
    "1:674306342708:web:fc834664f508060062ef61",
    { mustInclude: ":" }
  ),
};

// Initialize Firebase App (singleton pattern safe for hot-module reloading)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication & Providers
export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

// Initialize Firestore with automatic long-polling detection for live HTTPS reliability
const createFirestoreInstance = (): Firestore => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
};

export const db: Firestore = createFirestoreInstance();

export default app;
