import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface AdminVerifyResult {
  isAdmin: boolean;
  matchedEmail: string;
  foundDoc: boolean;
  actualAdminValue?: unknown;
  errorCode?: string;
  errorMessage?: string;
}

export function isTruthyAdminValue(val: unknown): boolean {
  if (val === true || val === 1) return true;
  if (typeof val === "string") {
    const norm = val.trim().toLowerCase();
    return norm === "true" || norm === "1" || norm === "yes";
  }
  return false;
}

export function extractAdminFlagFromData(data: Record<string, unknown> | undefined): {
  foundField: boolean;
  isAdmin: boolean;
  rawValue: unknown;
} {
  if (!data || typeof data !== "object") {
    return { foundField: false, isAdmin: false, rawValue: undefined };
  }

  for (const [key, value] of Object.entries(data)) {
    const normKey = key.trim().toLowerCase();
    if (normKey === "admin" || normKey === "isadmin" || normKey === "is_admin") {
      return {
        foundField: true,
        isAdmin: isTruthyAdminValue(value),
        rawValue: value,
      };
    }
    if (normKey === "role" && typeof value === "string" && value.trim().toLowerCase() === "admin") {
      return {
        foundField: true,
        isAdmin: true,
        rawValue: value,
      };
    }
  }

  return { foundField: false, isAdmin: false, rawValue: undefined };
}

async function waitForAuthReady(timeoutMs = 2500): Promise<void> {
  try {
    if (typeof auth.authStateReady === "function") {
      await Promise.race([
        auth.authStateReady(),
        new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
      ]);
    }
  } catch {
    // Ignore
  }
}

/**
 * Verifies whether the given email has admin clearance in the Firestore `users` collection.
 * Handles exact document IDs, casing variations, accidental whitespace in document IDs or field names,
 * string/boolean admin flags, and documents storing `email` as a field.
 */
export async function verifyAdminEmailInFirestore(emailInput: string): Promise<AdminVerifyResult> {
  const rawTrimmed = emailInput.trim();
  const cleanEmail = rawTrimmed.toLowerCase();

  if (!cleanEmail) {
    return { isAdmin: false, matchedEmail: "", foundDoc: false };
  }

  await waitForAuthReady();

  try {
    const candidates = Array.from(
      new Set([
        cleanEmail,
        rawTrimmed,
        `${cleanEmail} `,
        ` ${cleanEmail}`,
        `${rawTrimmed} `,
      ])
    );

    let foundDoc = false;
    let lastAdminVal: unknown = undefined;
    let matchedId = cleanEmail;

    // 1. Direct document ID lookups
    for (const candidateId of candidates) {
      const snap = await getDoc(doc(db, "users", candidateId));
      if (snap.exists()) {
        foundDoc = true;
        matchedId = candidateId.trim();
        const extracted = extractAdminFlagFromData(snap.data() as Record<string, unknown>);
        lastAdminVal = extracted.rawValue;
        if (extracted.isAdmin) {
          return {
            isAdmin: true,
            matchedEmail: matchedId,
            foundDoc: true,
            actualAdminValue: extracted.rawValue,
          };
        }
      }
    }

    // 2. Fallback: scan the `users` collection in case doc ID has unexpected whitespace/casing or auto-ID with `email` field
    try {
      const allUsersSnap = await getDocs(collection(db, "users"));
      for (const userDoc of allUsersSnap.docs) {
        const docIdNorm = userDoc.id.trim().toLowerCase();
        const data = userDoc.data() as Record<string, unknown>;
        const fieldEmailNorm = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";

        if (docIdNorm === cleanEmail || fieldEmailNorm === cleanEmail) {
          foundDoc = true;
          matchedId = cleanEmail;
          const extracted = extractAdminFlagFromData(data);
          lastAdminVal = extracted.rawValue;
          if (extracted.isAdmin) {
            return {
              isAdmin: true,
              matchedEmail: cleanEmail,
              foundDoc: true,
              actualAdminValue: extracted.rawValue,
            };
          }
        }
      }
    } catch {
      // Collection list might be restricted even if individual doc get is allowed; ignore fallback error
    }

    return {
      isAdmin: false,
      matchedEmail: matchedId,
      foundDoc,
      actualAdminValue: lastAdminVal,
    };
  } catch (err: any) {
    return {
      isAdmin: false,
      matchedEmail: cleanEmail,
      foundDoc: false,
      errorCode: err?.code || "query_failed",
      errorMessage: err?.message || "Failed to query Firestore",
    };
  }
}
