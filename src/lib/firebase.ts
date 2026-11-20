import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";

const sanitizeEnvValue = (
  val: unknown,
  options?: { mustInclude?: string; mustNotInclude?: string; minLength?: number }
): string => {
  if (typeof val !== "string") return "";
  const cleaned = val.trim().replace(/^['"`]+|['"`]+$/g, "").trim();
  if (!cleaned || cleaned.toLowerCase().startsWith("your_")) return "";
  if (options?.minLength && cleaned.length < options.minLength) return "";
  if (options?.mustInclude && !cleaned.includes(options.mustInclude)) return "";
  if (options?.mustNotInclude && cleaned.includes(options.mustNotInclude)) return "";
  return cleaned;
};

const firebaseConfig = {
  apiKey: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_API_KEY as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY as string),
    { minLength: 30 }
  ),
  authDomain: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string),
    { mustInclude: "." }
  ),
  projectId: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string),
    { mustNotInclude: "." }
  ),
  storageBucket: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string),
    { mustInclude: "." }
  ),
  messagingSenderId: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string)
  ),
  appId: sanitizeEnvValue(
    (import.meta.env.VITE_FIREBASE_APP_ID as string) ||
      (import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID as string),
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
