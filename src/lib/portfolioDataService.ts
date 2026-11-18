import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db } from './firebase';
import { INITIAL_PROJECTS, STATIC_GALLERY_ITEMS } from '../data/initialData';

export interface ProjectItem {
  id: string;
  name?: string;
  title?: string;
  description: string;
  subHeader?: string;
  category?: string;
  tech?: string[];
  tags?: string[];
  url?: string;
  githubUrl?: string;
  demoUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  image?: string;
  images?: string[];
  color?: string;
  iconType?: 'image' | 'emoji';
  iconValue?: string;
  downloads?: any;
  order?: number;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  date: string;
  image: string;
  description: string;
  tags?: string[];
  order?: number;
}

// Collections
const PROJECTS_COLLECTION = 'projects';
const PHOTOS_COLLECTION = 'photos';
const CONFIG_COLLECTION = 'config';
const SEED_DOC = 'seed'; // marker doc so we never reseed after an admin deletes everything

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively remove `undefined` values (Firestore rejects them). */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter((v) => v !== undefined).map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

function describeError(action: string, err: unknown): Error {
  const code = (err as any)?.code ? ` (${(err as any).code})` : '';
  const msg = (err as any)?.message || String(err);
  if ((err as any)?.code === 'permission-denied') {
    return new Error(`Could not ${action}: permission denied by Firestore rules${code}.`);
  }
  if ((err as any)?.code === 'invalid-argument' && /size|bytes/i.test(msg)) {
    return new Error(`Could not ${action}: the data (probably an image) is too large for Firestore (1 MiB limit per document).`);
  }
  return new Error(`Could not ${action}: ${msg}${code}`);
}

/**
 * Stable public URLs of the bundled seed images (files live in /public/images).
 * Keyed by lower-case file basename without extension.
 */
const STABLE_IMAGES: Record<string, string> = {
  'itahari-logo': '/images/itahari-logo.png',
  'arniko-logo': '/images/arniko-logo.png',
  'garmentflow': '/images/garmentflow.png',
  'maingarment': '/images/maingarment.jpg',
  'mb': '/images/mb.png',
  'lp': '/images/lp.jpg',
  'resume-io': '/images/resume-io.png',
  'resume-logo': '/images/resume-logo.png',
  'imagea': '/images/gallery/ImageA.png',
  'imageb': '/images/gallery/ImageB.jpg',
  'imagec': '/images/gallery/ImageC.jpg',
  'imaged': '/images/gallery/ImageD.png'
};

// Matches legacy dev (/src/assets/...) or Vite-hashed (/assets/name-Hash.ext) bundle URLs
const LEGACY_ASSET_RE = /^(?:https?:\/\/[^/]+)?\/(?:src\/)?assets\/(?:[^/]+\/)*([A-Za-z0-9_.-]+?)\.(?:png|jpe?g|webp|gif|svg|avif)(?:\?.*)?$/i;

/** Map a legacy /src/assets/... or hashed /assets/... URL back to its stable /images path. */
export function normalizeImageUrl<T>(value: T): T {
  if (typeof value !== 'string' || value.startsWith('data:')) return value;
  const m = LEGACY_ASSET_RE.exec(value.trim());
  if (!m) return value;
  const rawName = m[1].toLowerCase();
  // Direct match (e.g. garmentflow, resume-io, resume-logo, imagea)
  if (STABLE_IMAGES[rawName]) {
    return STABLE_IMAGES[rawName] as unknown as T;
  }
  // Strip trailing Vite hash suffix (e.g. garmentflow-bvxiirqr, resume-io-jd7qyw4e, mb-nb7-e94x)
  for (const [key, stableUrl] of Object.entries(STABLE_IMAGES)) {
    if (rawName.startsWith(`${key}-`)) {
      return stableUrl as unknown as T;
    }
  }
  return value;
}

const IMAGE_FIELDS = ['image', 'coverImage', 'icon', 'iconValue', 'logo'] as const;

/** Normalise image fields. Returns [normalisedItem, changed]. */
function normalizeItemImages<T extends Record<string, any>>(item: T): [T, boolean] {
  let changed = false;
  const out: Record<string, any> = { ...item };
  for (const f of IMAGE_FIELDS) {
    if (typeof out[f] === 'string') {
      const n = normalizeImageUrl(out[f]);
      if (n !== out[f]) { out[f] = n; changed = true; }
    }
  }
  if (Array.isArray(out.images)) {
    const imgs = out.images.map((i: any) => {
      const n = normalizeImageUrl(i);
      if (n !== i) changed = true;
      return n;
    });
    out.images = imgs;
  }
  return [out as T, changed];
}

const sortByOrder = <T extends { order?: number }>(list: T[]) =>
  list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

async function hasSeeded(kind: 'projects' | 'photos'): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, CONFIG_COLLECTION, SEED_DOC));
    return !!(snap.exists() && snap.data()?.[kind]);
  } catch (err) {
    throw err; // caller treats as error -> never reseed
  }
}

async function markSeeded(kind: 'projects' | 'photos') {
  try {
    await setDoc(doc(db, CONFIG_COLLECTION, SEED_DOC), { [kind]: true, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn('Could not write seed marker:', err);
  }
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

type SeedStatus = 'seeded' | 'already' | 'error';
let projectsSeedPromise: Promise<SeedStatus> | null = null;
let photosSeedPromise: Promise<SeedStatus> | null = null;

/** Seed initial projects into Firestore if the collection is empty and was never seeded. Runs at most once per page load. */
function seedProjects(): Promise<SeedStatus> {
  if (!projectsSeedPromise) {
    projectsSeedPromise = (async () => {
      try {
        if (await hasSeeded('projects')) return 'already';
        const snap = await getDocs(collection(db, PROJECTS_COLLECTION));
        if (!snap.empty) { await markSeeded('projects'); return 'already'; }
        for (let i = 0; i < INITIAL_PROJECTS.length; i++) {
          const item = INITIAL_PROJECTS[i] as any;
          await setDoc(doc(db, PROJECTS_COLLECTION, item.id), stripUndefined({
            ...item,
            order: i,
            updatedAt: Date.now()
          }), { merge: true });
        }
        await markSeeded('projects');
        return 'seeded';
      } catch (err) {
        console.warn('Failed to seed projects:', err);
        return 'error';
      }
    })();
  }
  return projectsSeedPromise;
}

/** Seed initial gallery photos into Firestore if empty and never seeded. Runs at most once per page load. */
function seedPhotos(): Promise<SeedStatus> {
  if (!photosSeedPromise) {
    photosSeedPromise = (async () => {
      try {
        if (await hasSeeded('photos')) return 'already';
        const snap = await getDocs(collection(db, PHOTOS_COLLECTION));
        if (!snap.empty) { await markSeeded('photos'); return 'already'; }
        for (let i = 0; i < STATIC_GALLERY_ITEMS.length; i++) {
          const item = STATIC_GALLERY_ITEMS[i] as any;
          await setDoc(doc(db, PHOTOS_COLLECTION, item.id), stripUndefined({
            ...item,
            order: i,
            updatedAt: Date.now()
          }), { merge: true });
        }
        await markSeeded('photos');
        return 'seeded';
      } catch (err) {
        console.warn('Failed to seed photos:', err);
        return 'error';
      }
    })();
  }
  return photosSeedPromise;
}

export const seedInitialProjectsIfEmpty = async (): Promise<boolean> => (await seedProjects()) === 'seeded';
export const seedInitialPhotosIfEmpty = async (): Promise<boolean> => (await seedPhotos()) === 'seeded';

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

function subscribeToCollection<T extends { id: string; order?: number }>(
  collectionName: string,
  fallback: T[],
  seed: () => Promise<SeedStatus>,
  callback: (items: T[]) => void
): () => void {
  let repaired = false;
  let emptyEvents = 0;
  try {
    return onSnapshot(
      query(collection(db, collectionName)),
      (snapshot) => {
        if (snapshot.empty) {
          // Don't trust an empty *cache* snapshot: wait for the server.
          if (snapshot.metadata.fromCache) {
            callback(fallback);
            return;
          }
          // Show the static fallback meanwhile; seed once if never seeded.
          // If it WAS seeded before, the admin emptied it on purpose -> show empty.
          callback(fallback);
          const nth = ++emptyEvents;
          seed().then((status) => { if (status === 'already' || (status === 'seeded' && nth > 1)) callback([]); });
          return;
        }
        const list: T[] = [];
        const repairs: Array<[string, T]> = [];
        snapshot.forEach((d) => {
          const raw = { ...(d.data() as any), id: d.id } as T;
          const [item, changed] = normalizeItemImages(raw as any) as [T, boolean];
          if (changed) repairs.push([d.id, item]);
          list.push(item);
        });
        sortByOrder(list);
        callback(list);

        // One-time repair of old hashed URLs stored in Firestore
        if (!repaired && repairs.length > 0 && !snapshot.metadata.fromCache) {
          repaired = true;
          repairs.forEach(([id, item]) => {
            setDoc(doc(db, collectionName, id), stripUndefined(item as any), { merge: true })
              .catch((e) => console.warn(`Could not repair image URLs for ${collectionName}/${id}:`, e));
          });
        }
      },
      (err) => {
        console.warn(`Firestore ${collectionName} read error, using static fallback:`, err);
        callback(fallback);
      }
    );
  } catch (err) {
    console.warn(`Firestore ${collectionName} subscribe failed:`, err);
    callback(fallback);
    return () => {};
  }
}

/** Subscribe to live projects from Firestore with fallback to INITIAL_PROJECTS. */
export function subscribeToProjects(callback: (projects: ProjectItem[]) => void) {
  return subscribeToCollection<ProjectItem>(
    PROJECTS_COLLECTION,
    INITIAL_PROJECTS as unknown as ProjectItem[],
    seedProjects,
    callback
  );
}

/** Subscribe to live gallery photos from Firestore with fallback to STATIC_GALLERY_ITEMS. */
export function subscribeToPhotos(callback: (photos: PhotoItem[]) => void) {
  return subscribeToCollection<PhotoItem>(
    PHOTOS_COLLECTION,
    STATIC_GALLERY_ITEMS as unknown as PhotoItem[],
    seedPhotos,
    callback
  );
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

/** Save or update a project in Firestore. */
export async function saveProject(project: ProjectItem): Promise<void> {
  const docId = project.id || `proj_${Date.now()}`;
  try {
    await setDoc(doc(db, PROJECTS_COLLECTION, docId), stripUndefined({
      ...project,
      id: docId,
      updatedAt: Date.now()
    }), { merge: true });
  } catch (err) {
    throw describeError('save project', err);
  }
}

/** Delete a project from Firestore. */
export async function deleteProjectFromDb(projectId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (err) {
    throw describeError('delete project', err);
  }
}

/** Save or update a gallery photo in Firestore. */
export async function savePhoto(photo: PhotoItem): Promise<void> {
  const docId = photo.id || `photo_${Date.now()}`;
  try {
    await setDoc(doc(db, PHOTOS_COLLECTION, docId), stripUndefined({
      ...photo,
      id: docId,
      updatedAt: Date.now()
    }), { merge: true });
  } catch (err) {
    throw describeError('save photo', err);
  }
}

/** Delete a gallery photo from Firestore. */
export async function deletePhotoFromDb(photoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));
  } catch (err) {
    throw describeError('delete photo', err);
  }
}

/** Read the current administrator passkey from Firestore (collection 'config', document 'auth'). */
export async function getDatabasePasskey(): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, CONFIG_COLLECTION, 'auth'));
    if (snap.exists() && snap.data()?.passkey) {
      return String(snap.data().passkey).trim();
    }
    return null;
  } catch (err) {
    console.error('Failed to read passkey from Firestore:', err);
    return null;
  }
}

/** Save or update the administrator passkey in Firestore (collection 'config', document 'auth'). */
export async function saveDatabasePasskey(newPasskey: string): Promise<void> {
  try {
    await setDoc(doc(db, CONFIG_COLLECTION, 'auth'), {
      passkey: newPasskey.trim(),
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    throw describeError('save passkey', err);
  }
}
