import { app, auth, googleProvider, db } from "./lib/firebase";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

export { app, auth, googleProvider, db };

export const storage: FirebaseStorage = getStorage(app);

export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Graceful fallback
  });
}

export default app;
