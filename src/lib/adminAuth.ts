import { signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export interface AdminAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export type AdminAuthProgressCallback = (status: {
  step: 'popup_opened' | 'user_signed_in' | 'verifying_firestore';
  email?: string;
}) => void;

/**
 * Initiates Google Auth popup and verifies if the authenticated user
 * has an admin document in Firestore (`users/{email}`) with `admin === true`.
 */
export async function authenticateAdmin(
  onProgress?: AdminAuthProgressCallback
): Promise<AdminAuthResult> {
  try {
    onProgress?.({ step: 'popup_opened' });

    // a) Call signInWithPopup with Google provider
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // b) Read the signed-in user's email
    if (!user || !user.email) {
      await signOut(auth);
      return {
        success: false,
        error: "Access Denied: Account is not configured as an Admin.",
      };
    }

    onProgress?.({ step: 'user_signed_in', email: user.email });
    onProgress?.({ step: 'verifying_firestore', email: user.email });

    // c) Query Firestore document doc(db, 'users', user.email)
    const userDocRef = doc(db, "users", user.email);
    const docSnap = await getDoc(userDocRef);

    // d) If docSnap.exists() AND docSnap.data().admin === true
    if (docSnap.exists() && docSnap.data()?.admin === true) {
      return {
        success: true,
        user,
      };
    }

    // e) Otherwise: call signOut(auth) immediately
    await signOut(auth);
    return {
      success: false,
      error: `Access Denied: Account (${user.email}) is not configured as an Admin in Firestore.`,
    };
  } catch (error: any) {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }

    if (error?.code === "auth/popup-closed-by-user") {
      return {
        success: false,
        error: "Authentication popup closed by user.",
      };
    }

    if (error?.code === "permission-denied" || error?.message?.toLowerCase().includes("permission")) {
      return {
        success: false,
        error: "Firestore permission denied: Your Firestore Security Rules do not allow reading the 'users' collection. Please update your rules in Firebase Console.",
      };
    }

    return {
      success: false,
      error: error?.message || "Access Denied: Account is not configured as an Admin.",
    };
  }
}

/**
 * Verifies if an email has an admin document in Firestore (`users/{email}`) with `admin === true`.
 */
export async function verifyAdminEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, "users", email);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data()?.admin === true) {
      return { success: true };
    }
    return {
      success: false,
      error: `Access Denied: ${email} is not configured as an Admin in Firestore.`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || `Access Denied: ${email} is not configured as an Admin in Firestore.`,
    };
  }
}
