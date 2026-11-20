import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FolderKanban, 
  Image as ImageIcon, 
  Search,
  Key,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  Globe,
  Save,
  School,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { auth, googleProvider, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { verifyAdminEmailInFirestore } from '../../lib/adminAuth';
import { 
  ProjectItem, 
  PhotoItem, 
  subscribeToProjects, 
  subscribeToPhotos, 
  saveProject, 
  deleteProjectFromDb, 
  savePhoto, 
  deletePhotoFromDb,
  getDatabasePasskey,
  saveDatabasePasskey
} from '../../lib/portfolioDataService';
import { fileToCompressedDataUrl } from '../../lib/imageUpload';
import { useOsData } from '../../hooks/useOsData';
import { 
  ProfileData, 
  ExperienceItem, 
  EducationItem, 
  SkillCategory, 
  SkillItem 
} from '../../data/initialData';
import { SkillIcon, SKILL_PRESETS } from '../icons/SkillIcon';

const looksLikeImage = (s: unknown): s is string =>
  typeof s === 'string' && s.trim() !== '' && /^(data:image\/|https?:\/\/|\/|\.\/|[\w-]+\/)|\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(s.trim());

export function getProjectImage(project: Partial<ProjectItem> | null | undefined): string {
  if (!project) return '';
  const p = project as any;
  const candidates = [
    p.coverImage,
    p.image,
    Array.isArray(p.images) ? p.images[0] : undefined,
    p.iconType === 'image' ? p.iconValue : undefined,
    p.icon,
  ];
  for (const c of candidates) if (looksLikeImage(c)) return c.trim();
  return '';
}

function ProjectThumb({ project }: { project: Partial<ProjectItem> }) {
  const src = getProjectImage(project);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className="w-full h-36 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 flex items-center justify-center">
      {src && !failed ? (
        <img src={src} alt={project.name || ''} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <ImageIcon className="w-8 h-8 text-zinc-300" />
      )}
    </div>
  );
}

function ImageUploadField({ 
  label, 
  value, 
  onChange,
  heightClass = "h-44",
  hint,
  placeholder = "Click to upload or drag & drop an image"
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  heightClass?: string;
  hint?: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  useEffect(() => {
    setBroken(false);
    setUrlInput(value);
  }, [value]);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onChange(dataUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to process image.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-semibold text-zinc-700">{label}</label>
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
        >
          {isUrlMode ? 'Upload File' : 'Paste Image URL'}
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... or /images/..."
            className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
          />
          <button
            type="button"
            onClick={() => onChange(urlInput.trim())}
            className="px-3 py-1 text-xs font-semibold bg-zinc-900 text-white rounded-lg hover:bg-black cursor-pointer shadow-xs"
          >
            Apply
          </button>
        </div>
      ) : value && !broken ? (
        <div className={`relative w-full ${heightClass} bg-zinc-100 border border-zinc-200 rounded-lg overflow-hidden`}>
          <img src={value} alt="Preview" className="w-full h-full object-contain bg-zinc-50" onError={() => setBroken(true)} />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="px-2.5 py-1 text-xs font-semibold bg-white border border-zinc-300 rounded-md text-zinc-800 hover:bg-zinc-50 cursor-pointer shadow-xs">
              {busy ? 'Processing...' : 'Replace'}
            </button>
            <button type="button" disabled={busy} onClick={() => { setError(null); onChange(''); }} className="px-2.5 py-1 text-xs font-semibold bg-white border border-red-200 rounded-md text-red-600 hover:bg-red-50 cursor-pointer shadow-xs">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          className={`w-full ${heightClass} flex flex-col items-center justify-center gap-1.5 border border-dashed rounded-lg text-xs text-zinc-600 transition-colors cursor-pointer ${dragOver ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5 text-zinc-400" />}
          <span className="font-semibold">{busy ? 'Compressing image...' : placeholder}</span>
          {!busy && <span className="text-zinc-400">{broken ? 'Current image could not be loaded' : 'JPG, PNG, WebP or SVG'}</span>}
        </button>
      )}

      {hint && <p className="text-[11px] text-zinc-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

interface AdminAppProps {
  isStandalone?: boolean;
}

export function AdminApp(_props: AdminAppProps) {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Live OS Data Context
  const {
    profile,
    aboutData,
    skills,
    saveProfile,
    saveSkills,
    updateExperience,
    addExperience,
    deleteExperience,
    updateEducation,
    addEducation,
    deleteEducation,
  } = useOsData();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'skills' | 'projects' | 'photos' | 'security'>('profile');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Local Profile Form State
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Database Passkey Management state
  const [currentDbPasskey, setCurrentDbPasskey] = useState<string | null>(null);
  const [newPasskeyInput, setNewPasskeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoadingPasskey, setIsLoadingPasskey] = useState(false);

  // Direct Login State (for standalone /admin)
  const [directPasskey, setDirectPasskey] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Modals state
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoItem> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<ExperienceItem> | null>(null);
  const [editingEducation, setEditingEducation] = useState<Partial<EducationItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ categoryId: string; item: Partial<SkillItem> } | null>(null);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);

  // Load passkey from Firestore when authorized
  useEffect(() => {
    if (status === 'authorized') {
      setIsLoadingPasskey(true);
      getDatabasePasskey()
        .then((pk) => setCurrentDbPasskey(pk))
        .catch(() => setCurrentDbPasskey(null))
        .finally(() => setIsLoadingPasskey(false));
    }
  }, [status, activeTab]);

  // Database Security Check
  useEffect(() => {
    const verifyDatabaseAccess = async () => {
      const hasPasskeySession =
        sessionStorage.getItem('admin_passkey_verified') === 'true' ||
        localStorage.getItem('admin_passkey_verified') === 'true';

      if (hasPasskeySession) {
        setStatus('authorized');
        setAdminEmail(localStorage.getItem('admin_verified_email') || 'root (database passkey)');
        return;
      }

      const verifiedEmail = localStorage.getItem('admin_verified_email');
      const sessionToken = localStorage.getItem('admin_session_token');

      if (verifiedEmail && sessionToken) {
        try {
          const result = await verifyAdminEmailInFirestore(verifiedEmail);
          if (result.isAdmin) {
            setStatus('authorized');
            setAdminEmail(result.matchedEmail);
            return;
          }
        } catch (e) {
          localStorage.removeItem('admin_verified_email');
          localStorage.removeItem('admin_session_token');
        }
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user || !user.email) {
          const passkeyActive =
            sessionStorage.getItem('admin_passkey_verified') === 'true' ||
            localStorage.getItem('admin_passkey_verified') === 'true';
          if (!passkeyActive) {
            setStatus('unauthorized');
            setAdminEmail(null);
          }
          return;
        }

        try {
          const result = await verifyAdminEmailInFirestore(user.email);
          if (result.isAdmin) {
            setStatus('authorized');
            setAdminEmail(result.matchedEmail);
            localStorage.setItem('admin_verified_email', result.matchedEmail);
          } else {
            setStatus('unauthorized');
            setAdminEmail(user.email);
            localStorage.removeItem('admin_verified_email');
            localStorage.removeItem('admin_session_token');
          }
        } catch {
          setStatus('unauthorized');
          setAdminEmail(user.email);
        }
      });

      return () => unsubscribe();
    };

    verifyDatabaseAccess();
  }, []);

  // Subscribe to live Projects & Photos
  useEffect(() => {
    if (status !== 'authorized') return;
    const unsubProjects = subscribeToProjects(setProjects);
    const unsubPhotos = subscribeToPhotos(setPhotos);
    return () => {
      unsubProjects();
      unsubPhotos();
    };
  }, [status]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_passkey_verified');
    sessionStorage.removeItem('admin_verified_email');
    localStorage.removeItem('admin_passkey_verified');
    localStorage.removeItem('admin_verified_email');
    localStorage.removeItem('admin_session_token');
    await signOut(auth).catch(() => {});
    setStatus('unauthorized');
    setAdminEmail(null);
  };

  // --- Profile Actions ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveProfile(profileForm);
      showNotification('Profile & branding changes saved successfully!');
    } catch (err: any) {
      alert(`Error saving profile: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Experience Actions ---
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience || !editingExperience.title?.trim() || !editingExperience.company?.trim()) {
      alert('Job Title and Company are required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingExperience.id) {
        await updateExperience(editingExperience.id, editingExperience);
      } else {
        await addExperience(editingExperience as Omit<ExperienceItem, 'id'>);
      }
      setEditingExperience(null);
      showNotification('Experience updated successfully.');
    } catch (err: any) {
      alert(`Error saving experience: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete experience "${title}"?`)) return;
    try {
      await deleteExperience(id);
      showNotification('Experience deleted.');
    } catch (err: any) {
      alert(`Error: ${err?.message}`);
    }
  };

  // --- Education Actions ---
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEducation || !editingEducation.degree?.trim() || !editingEducation.institution?.trim()) {
      alert('Degree and Institution are required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingEducation.id) {
        await updateEducation(editingEducation.id, editingEducation);
      } else {
        await addEducation(editingEducation as Omit<EducationItem, 'id'>);
      }
      setEditingEducation(null);
      showNotification('Education updated successfully.');
    } catch (err: any) {
      alert(`Error saving education: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string, degree: string) => {
    if (!confirm(`Are you sure you want to delete education "${degree}"?`)) return;
    try {
      await deleteEducation(id);
      showNotification('Education deleted.');
    } catch (err: any) {
      alert(`Error: ${err?.message}`);
    }
  };

  // --- Skills Actions ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.item.title?.trim()) {
      alert('Skill Title is required.');
      return;
    }
    setIsSaving(true);
    try {
      const { categoryId, item } = editingSkill;
      const updatedCategories = skills.map((cat) => {
        if (cat.id !== categoryId) return cat;
        if (item.id) {
          return {
            ...cat,
            items: cat.items.map((it) => (it.id === item.id ? ({ ...it, ...item } as SkillItem) : it)),
          };
        } else {
          const newItem: SkillItem = {
            id: `skill_${Date.now()}`,
            title: item.title || '',
            descriptor: item.descriptor || '',
            icon: item.icon || 'code',
            iconType: item.iconType || 'preset',
          };
          return { ...cat, items: [...cat.items, newItem] };
        }
      });
      await saveSkills(updatedCategories);
      setEditingSkill(null);
      showNotification('Skill saved successfully.');
    } catch (err: any) {
      alert(`Error saving skill: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (categoryId: string, skillId: string, skillTitle: string) => {
    if (!confirm(`Delete skill "${skillTitle}"?`)) return;
    try {
      const updated = skills.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.filter((it) => it.id !== skillId),
        };
      });
      await saveSkills(updated);
      showNotification('Skill removed.');
    } catch (err: any) {
      alert(`Error deleting skill: ${err?.message}`);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.category.trim()) return;
    setIsSaving(true);
    try {
      let updated: SkillCategory[];
      if (skills.some((c) => c.id === editingCategory.id)) {
        updated = skills.map((c) => (c.id === editingCategory.id ? editingCategory : c));
      } else {
        updated = [...skills, { ...editingCategory, id: editingCategory.id || `cat_${Date.now()}` }];
      }
      await saveSkills(updated);
      setEditingCategory(null);
      showNotification('Category saved.');
    } catch (err: any) {
      alert(`Error saving category: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all skills inside it?`)) return;
    try {
      const updated = skills.filter((c) => c.id !== categoryId);
      await saveSkills(updated);
      showNotification('Category removed.');
    } catch (err: any) {
      alert(`Error: ${err?.message}`);
    }
  };

  // --- Project Actions ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) return;
    setIsSaving(true);
    try {
      const tech = typeof editingProject.tech === 'string'
        ? (editingProject.tech as string).split(',').map((t) => t.trim()).filter(Boolean)
        : editingProject.tech || [];
      await saveProject({ ...editingProject, tech } as ProjectItem);
      setEditingProject(null);
      showNotification('Project saved to live site!');
    } catch (err: any) {
      alert(`Error saving project: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProjectFromDb(id);
      showNotification('Project deleted from live site.');
    } catch (err: any) {
      alert(`Error: ${err?.message}`);
    }
  };

  // --- Photo Actions ---
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.title || !editingPhoto.image) {
      alert('Photo Title and Image are required.');
      return;
    }
    setIsSaving(true);
    try {
      const tags = typeof editingPhoto.tags === 'string'
        ? (editingPhoto.tags as string).split(',').map((t) => t.trim()).filter(Boolean)
        : editingPhoto.tags || [];
      await savePhoto({ ...editingPhoto, tags } as PhotoItem);
      setEditingPhoto(null);
      showNotification('Photo saved to live gallery!');
    } catch (err: any) {
      alert(`Error saving photo: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deletePhotoFromDb(id);
      showNotification('Photo removed from gallery.');
    } catch (err: any) {
      alert(`Error: ${err?.message}`);
    }
  };

  // --- Passkey Database Actions ---
  const handleUpdatePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskeyInput.trim()) {
      alert('Please enter a new passkey.');
      return;
    }
    setIsSaving(true);
    try {
      await saveDatabasePasskey(newPasskeyInput.trim());
      setCurrentDbPasskey(newPasskeyInput.trim());
      setNewPasskeyInput('');
      showNotification('Passkey saved live in Firestore.');
    } catch (err: any) {
      alert(`Error updating passkey: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Direct Login Handlers
  const handleDirectPasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = directPasskey.trim();
    if (!entered) return;
    setIsAuthenticating(true);
    setLoginError(null);
    try {
      const snap = await getDoc(doc(db, 'config', 'auth'));
      if (snap.exists() && snap.data()?.passkey) {
        const dbPasskey = String(snap.data().passkey).trim();
        if (dbPasskey === entered) {
          sessionStorage.setItem('admin_passkey_verified', 'true');
          sessionStorage.setItem('admin_session', 'true');
          localStorage.setItem('admin_passkey_verified', 'true');
          localStorage.setItem('admin_session', 'true');
          localStorage.setItem('admin_verified_email', 'admin (database passkey)');
          setAdminEmail('admin (database passkey)');
          setStatus('authorized');
          return;
        }
      }
      setLoginError('Invalid administrator passkey.');
    } catch (err: any) {
      setLoginError(err?.message || 'Verification failed. Check Firebase connection.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDirectGoogleLogin = async () => {
    setIsAuthenticating(true);
    setLoginError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      if (userCredential.user?.email) {
        const verifyRes = await verifyAdminEmailInFirestore(userCredential.user.email);
        if (verifyRes.isAdmin) {
          sessionStorage.setItem('admin_passkey_verified', 'true');
          sessionStorage.setItem('admin_session', 'true');
          localStorage.setItem('admin_passkey_verified', 'true');
          localStorage.setItem('admin_session', 'true');
          localStorage.setItem('admin_verified_email', verifyRes.matchedEmail);
          setAdminEmail(verifyRes.matchedEmail);
          setStatus('authorized');
          return;
        } else {
          setLoginError(`Email ${userCredential.user.email} is not authorized in Firestore users collection.`);
        }
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Google sign-in error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Filtering
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  const filteredPhotos = photos.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  const containerClass = _props.isStandalone
    ? "fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden"
    : "h-full w-full min-h-0 overflow-y-auto overflow-x-hidden";

  if (status === 'checking') {
    return (
      <div className={`${containerClass} flex flex-col items-center justify-center bg-zinc-50 text-zinc-800 font-sans p-6`}>
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900 mb-4" />
        <p className="text-sm font-semibold tracking-wide">Checking administrator security access...</p>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className={`${containerClass} bg-zinc-50 text-zinc-800 font-sans p-4 sm:p-6 flex flex-col items-center touch-pan-y`}>
        <div className="w-full max-w-md my-auto bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-400 mb-5 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-zinc-900 mb-1.5">Admin Control Center</h2>
          <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
            Enter your administrator passkey or authenticate with Google to access site controls.
          </p>

          {loginError && (
            <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Passkey Login Form */}
          <form onSubmit={handleDirectPasskeyLogin} className="w-full flex flex-col gap-3">
            <div className="flex flex-col text-left">
              <label className="text-xs font-semibold text-zinc-700 mb-1">Master Database Passkey</label>
              <input
                type="password"
                required
                value={directPasskey}
                onChange={(e) => setDirectPasskey(e.target.value)}
                placeholder="Enter passkey..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="relative w-full my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Or
            </span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleDirectGoogleLogin}
            disabled={isAuthenticating}
            className="w-full py-2.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <a
            href="/"
            className="mt-6 text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio Desktop</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass} bg-zinc-50 flex flex-col text-zinc-800 font-sans selection:bg-zinc-200 touch-pan-y`}>
      {/* Top Banner & Status Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-zinc-900">Admin Control Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full tracking-wide">
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Session: <span className="text-zinc-800 font-semibold">{adminEmail || 'root'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {statusMessage && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-red-600 bg-white hover:bg-red-50 border border-zinc-200 hover:border-red-200 rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Session</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 pb-28 md:pb-36 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => { setActiveTab('profile'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'profile' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Branding</span>
            </button>

            <button
              onClick={() => { setActiveTab('about'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'about' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>About & Education</span>
            </button>

            <button
              onClick={() => { setActiveTab('skills'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'skills' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Skills & Tech</span>
            </button>

            <button
              onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'projects' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('photos'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'photos' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({photos.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'security' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Security</span>
            </button>
          </div>

          {(activeTab === 'projects' || activeTab === 'photos') && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-xs"
                />
              </div>

              {activeTab === 'projects' ? (
                <button
                  onClick={() => setEditingProject({ name: '', category: 'React', description: '', tech: [], subHeader: '', url: '', demoUrl: '', coverImage: '' })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditingPhoto({ title: '', category: 'Tech Team', subCategory: 'GALLERY MOMENT', date: 'October 2026', image: '', description: '', tags: [] })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* TAB: PROFILE & BRANDING */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Avatar & Favicon */}
              <div className="flex flex-col gap-6">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Profile Picture</span>
                  </h3>
                  <ImageUploadField
                    label="Avatar Photo"
                    value={profileForm.profilePic || ''}
                    onChange={(v) => setProfileForm({ ...profileForm, profilePic: v })}
                    heightClass="h-48"
                    hint="Uploaded photo displays across About Me, Contact, Top Bar, and Desktop Widget."
                    placeholder="Upload high-res profile photo"
                  />
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Browser Favicon</span>
                  </h3>
                  <ImageUploadField
                    label="Tab Icon (PNG, ICO, SVG)"
                    value={profileForm.favicon || ''}
                    onChange={(v) => setProfileForm({ ...profileForm, favicon: v })}
                    heightClass="h-32"
                    hint="Updates the browser tab icon live for all visitors."
                    placeholder="Upload favicon"
                  />
                </div>
              </div>

              {/* Middle & Right Column: Details, Socials, Specs */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-zinc-900">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Shrawan Karki"
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        placeholder="Frontend Developer & UI/UX Designer"
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Primary Email</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="pratyushkarki6@gmail.com"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Bio / Intro (About App)</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="About Me introduction..."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Motto / Callout Quote</label>
                    <input
                      type="text"
                      value={profileForm.quote || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, quote: e.target.value })}
                      placeholder="I combine modern technologies with clean design..."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-zinc-900">Social Profiles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={profileForm.socials?.github || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, github: e.target.value }
                        })}
                        placeholder="https://github.com/..."
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={profileForm.socials?.linkedin || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, linkedin: e.target.value }
                        })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Twitter / X URL</label>
                      <input
                        type="url"
                        value={profileForm.socials?.twitter || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, twitter: e.target.value }
                        })}
                        placeholder="https://x.com/..."
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={profileForm.socials?.instagram || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, instagram: e.target.value }
                        })}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>
                </div>

                {/* System Identity Specs */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">System Identity Specs</h3>
                      <p className="text-xs text-zinc-500">Key-value specs shown in the About App System Identity box.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileForm({
                        ...profileForm,
                        systemSpecs: [...(profileForm.systemSpecs || []), { label: 'Feature', value: 'Custom Value' }]
                      })}
                      className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg cursor-pointer"
                    >
                      + Add Spec
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(profileForm.systemSpecs || []).map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const updated = [...profileForm.systemSpecs];
                            updated[idx].label = e.target.value;
                            setProfileForm({ ...profileForm, systemSpecs: updated });
                          }}
                          placeholder="Label (e.g. Memory)"
                          className="w-1/3 bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...profileForm.systemSpecs];
                            updated[idx].value = e.target.value;
                            setProfileForm({ ...profileForm, systemSpecs: updated });
                          }}
                          placeholder="Value (e.g. 1TB Ideas)"
                          className="flex-1 bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = profileForm.systemSpecs.filter((_, i) => i !== idx);
                            setProfileForm({ ...profileForm, systemSpecs: updated });
                          }}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Profile Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile & Branding Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB: ABOUT & EDUCATION */}
        {activeTab === 'about' && (
          <div className="flex flex-col gap-8">
            {/* 1. Work Experience Section */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-zinc-900">Work Experience ({aboutData.experience.length})</h3>
                </div>
                <button
                  onClick={() => setEditingExperience({ title: '', company: '', range: '2026 – Now', achievement: '' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.experience.map((exp) => (
                  <div key={exp.id} className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-300 transition shadow-2xs">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-zinc-900 text-sm">{exp.title}</h4>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                          {exp.range}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-500 mb-2">{exp.company}</p>
                      <p className="text-xs text-zinc-600 leading-relaxed">• {exp.achievement}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-zinc-100">
                      <button
                        onClick={() => setEditingExperience(exp)}
                        className="px-2.5 py-1 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id, exp.title)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Academic Foundation Section */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-zinc-900">Academic Foundation ({aboutData.education.length})</h3>
                </div>
                <button
                  onClick={() => setEditingEducation({ degree: '', institution: '', detail: '', year: '2081 - Present', status: 'ongoing', logo: '', link: '' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.education.map((edu) => (
                  <div key={edu.id} className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-300 transition shadow-2xs">
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                          {edu.logo ? (
                            <img src={edu.logo} alt={edu.institution} className="w-full h-full object-contain" />
                          ) : (
                            <School className="w-6 h-6 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-zinc-900 text-sm truncate">{edu.degree}</h4>
                            <span className={`text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full ${
                              edu.status === 'ongoing' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                            }`}>
                              {edu.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 font-medium truncate">{edu.institution}</p>
                          {edu.detail && <p className="text-[11px] text-zinc-400 italic truncate">{edu.detail}</p>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                        <span>Period: <strong>{edu.year}</strong></span>
                        {edu.certId && <span className="text-teal-600 font-semibold">Cert App: {edu.certId}</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-zinc-100">
                      <button
                        onClick={() => setEditingEducation(edu)}
                        className="px-2.5 py-1 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(edu.id, edu.degree)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SKILLS & TECH STACK */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Skills & Tech Stack</h3>
                <p className="text-xs text-zinc-500">Manage categories, skills, icons, and tech stack entries shown in About Me.</p>
              </div>
              <button
                onClick={() => setEditingCategory({ id: `cat_${Date.now()}`, category: '', items: [] })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill Category</span>
              </button>
            </div>

            <div className="space-y-6">
              {skills.map((cat) => (
                <div key={cat.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">{cat.category}</h4>
                      <span className="text-xs text-zinc-400">({cat.items.length} skills)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 rounded-md"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.category)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setEditingSkill({ categoryId: cat.id, item: { title: '', descriptor: '', icon: 'code', iconType: 'preset' } })}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {cat.items.map((skill) => (
                      <div
                        key={skill.id}
                        className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 flex items-center justify-between gap-2 hover:border-zinc-300 transition group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/60 flex items-center justify-center shrink-0">
                            <SkillIcon skill={skill} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-zinc-900 truncate">{skill.title}</div>
                            <div className="text-[10px] text-zinc-400 truncate">{skill.descriptor}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingSkill({ categoryId: cat.id, item: skill })}
                            className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(cat.id, skill.id, skill.title)}
                            className="p-1 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="flex flex-col gap-3">
                    <ProjectThumb project={project} />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {project.category || 'React'}
                        </span>
                        <h4 className="font-bold text-sm text-zinc-900 mt-1">{project.name || project.title}</h4>
                      </div>
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-zinc-400 hover:text-blue-600 transition-colors p-1"
                          title="Open Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {project.subHeader && (
                      <p className="text-xs text-zinc-500 line-clamp-1 italic">{project.subHeader}</p>
                    )}
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {project.description.replace(/\|\|/g, ' ')}
                    </p>
                    {project.tech && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tech.slice(0, 4).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-zinc-100">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name || project.title || '')}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB: PHOTOS MANAGEMENT */}
        {activeTab === 'photos' && (
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-44 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {photo.category}
                        </span>
                        {photo.date && (
                          <span className="text-[10px] font-medium text-zinc-400">
                            {photo.date}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 mt-1">{photo.title}</h4>
                      {photo.description && (
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-zinc-100">
                    <button
                      onClick={() => setEditingPhoto(photo)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id, photo.title)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB: DATABASE SECURITY & PASSKEY MANAGEMENT */}
        {activeTab === 'security' && (
          <section className="flex flex-col gap-6 max-w-2xl">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">Database Passkey Management</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  This passkey is stored live in Cloud Firestore (<span className="font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">config/auth</span>) and is verified when you authenticate via <span className="font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">sudo admin</span> in the terminal.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Current Database Passkey</p>
                  <button 
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    {showPasskey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPasskey ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-zinc-800 bg-white border border-zinc-200 px-3 py-2 rounded-lg">
                  {isLoadingPasskey 
                    ? 'Loading from Firestore...' 
                    : currentDbPasskey 
                      ? (showPasskey ? currentDbPasskey : '••••••••••••••••') 
                      : 'None configured'}
                </div>
              </div>

              <form onSubmit={handleUpdatePasskey} className="flex flex-col gap-3 pt-2">
                <label className="text-xs font-semibold text-zinc-700">Set New Live Database Passkey</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newPasskeyInput}
                    onChange={(e) => setNewPasskeyInput(e.target.value)}
                    placeholder="Enter new passkey..."
                    className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900"
                  />
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update Passkey</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* EDIT / CREATE PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-xl w-full p-6 text-zinc-900 my-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
                <h3 className="text-base font-bold text-zinc-900">
                  {editingProject.id ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button onClick={() => setEditingProject(null)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    placeholder="e.g. Garment flow"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProject.category || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      placeholder="e.g. React, Full Stack, Mobile"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : (editingProject.tech || '')}
                      onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value as any })}
                      placeholder="React, TypeScript, Tailwind CSS"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Short Subtitle / Subheader</label>
                  <input
                    type="text"
                    value={editingProject.subHeader || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subHeader: e.target.value })}
                    placeholder="One-line project overview"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={editingProject.demoUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={editingProject.url || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Cover Image"
                  value={getProjectImage(editingProject)}
                  onChange={(v) => setEditingProject(v
                    ? { ...editingProject, coverImage: v }
                    : { ...editingProject, coverImage: '', image: '', images: [], iconValue: '', icon: '' } as Partial<ProjectItem>)}
                />

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Description</label>
                  <textarea
                    rows={5}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Detailed project description (use || for paragraph breaks)"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Project</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE PHOTO MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 text-zinc-900 my-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
                <h3 className="text-base font-bold text-zinc-900">
                  {editingPhoto.id ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
                </h3>
                <button onClick={() => setEditingPhoto(null)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPhoto.title || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    placeholder="e.g. AI Summit Nepal"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <ImageUploadField
                  label="Photo Image *"
                  value={editingPhoto.image || ''}
                  onChange={(v) => setEditingPhoto({ ...editingPhoto, image: v })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingPhoto.category || ''}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                      placeholder="Tech Team, Moments, etc."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={editingPhoto.date || ''}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                      placeholder="e.g. October 2026"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Caption / Description</label>
                  <textarea
                    rows={3}
                    value={editingPhoto.description || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                    placeholder="Short description..."
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                  <button type="button" onClick={() => setEditingPhoto(null)} className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Photo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE EXPERIENCE MODAL */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 text-zinc-900 my-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
                <h3 className="text-base font-bold text-zinc-900">
                  {editingExperience.id ? 'Edit Experience' : 'Add Experience'}
                </h3>
                <button onClick={() => setEditingExperience(null)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExperience} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.title || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                    placeholder="Senior Frontend Developer"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={editingExperience.company || ''}
                      onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                      placeholder="e.g. Rato topi Inc."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Date Range *</label>
                    <input
                      type="text"
                      required
                      value={editingExperience.range || ''}
                      onChange={(e) => setEditingExperience({ ...editingExperience, range: e.target.value })}
                      placeholder="e.g. 2026 – Now"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Key Achievement / Responsibilities</label>
                  <textarea
                    rows={4}
                    value={editingExperience.achievement || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, achievement: e.target.value })}
                    placeholder="Architected modern frontend systems using React and TypeScript..."
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                  <button type="button" onClick={() => setEditingExperience(null)} className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Experience</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE EDUCATION MODAL */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 text-zinc-900 my-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
                <h3 className="text-base font-bold text-zinc-900">
                  {editingEducation.id ? 'Edit Education' : 'Add Education'}
                </h3>
                <button onClick={() => setEditingEducation(null)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEducation} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Degree / Qualification *</label>
                  <input
                    type="text"
                    required
                    value={editingEducation.degree || ''}
                    onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                    placeholder="e.g. Bachelors Degree"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    value={editingEducation.institution || ''}
                    onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                    placeholder="e.g. Itahari International College"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Detail / Major</label>
                    <input
                      type="text"
                      value={editingEducation.detail || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, detail: e.target.value })}
                      placeholder="e.g. BSc (Hons) Computing"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Year / Period *</label>
                    <input
                      type="text"
                      required
                      value={editingEducation.year || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, year: e.target.value })}
                      placeholder="e.g. 2081 - Present"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Status</label>
                    <select
                      value={editingEducation.status || 'completed'}
                      onChange={(e) => setEditingEducation({ ...editingEducation, status: e.target.value as any })}
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Institution Website URL</label>
                    <input
                      type="url"
                      value={editingEducation.link || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, link: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Institution Logo"
                  value={editingEducation.logo || ''}
                  onChange={(v) => setEditingEducation({ ...editingEducation, logo: v })}
                  heightClass="h-28"
                  placeholder="Upload logo or paste logo URL"
                />

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Certificate Viewer App ID (optional)</label>
                  <input
                    type="text"
                    value={editingEducation.certId || ''}
                    onChange={(e) => setEditingEducation({ ...editingEducation, certId: e.target.value })}
                    placeholder="e.g. cert-class12 or cert-class10"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                  <button type="button" onClick={() => setEditingEducation(null)} className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Education</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE SKILL MODAL */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 text-zinc-900 my-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
                <h3 className="text-base font-bold text-zinc-900">
                  {editingSkill.item.id ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button onClick={() => setEditingSkill(null)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSkill} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Skill Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.item.title || ''}
                    onChange={(e) => setEditingSkill({
                      ...editingSkill,
                      item: { ...editingSkill.item, title: e.target.value }
                    })}
                    placeholder="e.g. React, Next.js, Docker"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Descriptor / Subtitle</label>
                  <input
                    type="text"
                    value={editingSkill.item.descriptor || ''}
                    onChange={(e) => setEditingSkill({
                      ...editingSkill,
                      item: { ...editingSkill.item, descriptor: e.target.value }
                    })}
                    placeholder="e.g. UI Library, Framework, Tool"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Icon Style</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {(['preset', 'emoji', 'image'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEditingSkill({
                          ...editingSkill,
                          item: { ...editingSkill.item, iconType: type }
                        })}
                        className={`py-1.5 text-xs font-semibold rounded-lg capitalize border ${
                          (editingSkill.item.iconType || 'preset') === type
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {(editingSkill.item.iconType || 'preset') === 'preset' && (
                    <div className="space-y-2">
                      <select
                        value={editingSkill.item.icon || 'code'}
                        onChange={(e) => setEditingSkill({
                          ...editingSkill,
                          item: { ...editingSkill.item, icon: e.target.value }
                        })}
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                      >
                        {SKILL_PRESETS.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <span className="text-xs text-zinc-500">Preview:</span>
                        <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center">
                          <SkillIcon skill={{ id: 'preview', title: '', descriptor: '', icon: editingSkill.item.icon || 'code', iconType: 'preset' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingSkill.item.iconType === 'emoji' && (
                    <div>
                      <input
                        type="text"
                        value={editingSkill.item.icon || ''}
                        onChange={(e) => setEditingSkill({
                          ...editingSkill,
                          item: { ...editingSkill.item, icon: e.target.value }
                        })}
                        placeholder="Enter an emoji e.g. 🚀, ⚛️, 🐍, ⚡"
                        className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                      />
                    </div>
                  )}

                  {editingSkill.item.iconType === 'image' && (
                    <ImageUploadField
                      label="Custom Icon Image"
                      value={editingSkill.item.icon || ''}
                      onChange={(v) => setEditingSkill({
                        ...editingSkill,
                        item: { ...editingSkill.item, icon: v }
                      })}
                      heightClass="h-28"
                      placeholder="Upload custom icon image"
                    />
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                  <button type="button" onClick={() => setEditingSkill(null)} className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Skill</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl max-w-sm w-full p-6 text-zinc-900 my-4 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
                <h3 className="text-base font-bold text-zinc-900">Skill Category</h3>
                <button onClick={() => setEditingCategory(null)} className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.category}
                    onChange={(e) => setEditingCategory({ ...editingCategory, category: e.target.value })}
                    placeholder="e.g. AI & Machine Learning"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                  <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApp;
