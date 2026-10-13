import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
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

/**
 * Automatically seed initial projects into Firestore if the collection is empty.
 */
export async function seedInitialProjectsIfEmpty(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, PROJECTS_COLLECTION));
    if (snap.empty) {
      for (let i = 0; i < INITIAL_PROJECTS.length; i++) {
        const item = INITIAL_PROJECTS[i];
        const docRef = doc(db, PROJECTS_COLLECTION, item.id);
        await setDoc(docRef, {
          ...item,
          order: i,
          updatedAt: Date.now()
        }, { merge: true });
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to seed projects:', err);
    return false;
  }
}

/**
 * Automatically seed initial gallery photos into Firestore if empty.
 */
export async function seedInitialPhotosIfEmpty(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, PHOTOS_COLLECTION));
    if (snap.empty) {
      for (let i = 0; i < STATIC_GALLERY_ITEMS.length; i++) {
        const item = STATIC_GALLERY_ITEMS[i];
        const docRef = doc(db, PHOTOS_COLLECTION, item.id);
        await setDoc(docRef, {
          ...item,
          order: i,
          updatedAt: Date.now()
        }, { merge: true });
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to seed photos:', err);
    return false;
  }
}

/**
 * Subscribe to live projects from Firestore with fallback to INITIAL_PROJECTS.
 */
export function subscribeToProjects(callback: (projects: ProjectItem[]) => void) {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ProjectItem[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ProjectItem);
          });
          list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          callback(list);
        } else {
          // If Firestore collection is empty, trigger seed in background and return INITIAL_PROJECTS
          seedInitialProjectsIfEmpty();
          callback(INITIAL_PROJECTS as unknown as ProjectItem[]);
        }
      },
      (err) => {
        console.warn('Firestore projects read permission or offline fallback:', err);
        callback(INITIAL_PROJECTS as unknown as ProjectItem[]);
      }
    );
  } catch {
    callback(INITIAL_PROJECTS as unknown as ProjectItem[]);
    return () => {};
  }
}

/**
 * Subscribe to live gallery photos from Firestore with fallback to STATIC_GALLERY_ITEMS.
 */
export function subscribeToPhotos(callback: (photos: PhotoItem[]) => void) {
  try {
    const q = query(collection(db, PHOTOS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PhotoItem[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as PhotoItem);
          });
          list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          callback(list);
        } else {
          seedInitialPhotosIfEmpty();
          callback(STATIC_GALLERY_ITEMS as unknown as PhotoItem[]);
        }
      },
      (err) => {
        console.warn('Firestore photos read permission or offline fallback:', err);
        callback(STATIC_GALLERY_ITEMS as unknown as PhotoItem[]);
      }
    );
  } catch {
    callback(STATIC_GALLERY_ITEMS as unknown as PhotoItem[]);
    return () => {};
  }
}

/**
 * Save or update a project in Firestore.
 */
export async function saveProject(project: ProjectItem): Promise<void> {
  const docId = project.id || `proj_${Date.now()}`;
  const docRef = doc(db, PROJECTS_COLLECTION, docId);
  await setDoc(docRef, {
    ...project,
    id: docId,
    updatedAt: Date.now()
  }, { merge: true });
}

/**
 * Delete a project from Firestore.
 */
export async function deleteProjectFromDb(projectId: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
}

/**
 * Save or update a gallery photo in Firestore.
 */
export async function savePhoto(photo: PhotoItem): Promise<void> {
  const docId = photo.id || `photo_${Date.now()}`;
  const docRef = doc(db, PHOTOS_COLLECTION, docId);
  await setDoc(docRef, {
    ...photo,
    id: docId,
    updatedAt: Date.now()
  }, { merge: true });
}

/**
 * Delete a gallery photo from Firestore.
 */
export async function deletePhotoFromDb(photoId: string): Promise<void> {
  const docRef = doc(db, PHOTOS_COLLECTION, photoId);
  await deleteDoc(docRef);
}

/**
 * Read the current administrator passkey from Firestore (collection 'config', document 'auth').
 */
export async function getDatabasePasskey(): Promise<string | null> {
  try {
    const configRef = doc(db, 'config', 'auth');
    const snap = await getDoc(configRef);
    if (snap.exists() && snap.data()?.passkey) {
      return String(snap.data().passkey).trim();
    }
    return null;
  } catch (err) {
    console.error('Failed to read passkey from Firestore:', err);
    return null;
  }
}

/**
 * Save or update the administrator passkey in Firestore (collection 'config', document 'auth').
 */
export async function saveDatabasePasskey(newPasskey: string): Promise<void> {
  const configRef = doc(db, 'config', 'auth');
  await setDoc(configRef, {
    passkey: newPasskey.trim(),
    updatedAt: Date.now()
  }, { merge: true });
}
