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
  EyeOff
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [value]);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onChange(await fileToCompressedDataUrl(file));
    } catch (err: any) {
      setError(err?.message || 'Failed to process image.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-700 mb-1">{label}</label>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      {value && !broken ? (
        <div className="relative w-full h-44 bg-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={() => setBroken(true)} />
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
          className={`w-full h-32 flex flex-col items-center justify-center gap-1.5 border border-dashed rounded-lg text-xs text-zinc-600 transition-colors cursor-pointer ${dragOver ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5 text-zinc-400" />}
          <span className="font-semibold">{busy ? 'Compressing image...' : 'Click to upload or drag & drop an image'}</span>
          {!busy && <span className="text-zinc-400">{broken ? 'Current image could not be loaded' : 'JPG, PNG or WebP'}</span>}
        </button>
      )}
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

  // Content state
  const [activeTab, setActiveTab] = useState<'projects' | 'photos' | 'security'>('projects');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Database Passkey Management state
  const [currentDbPasskey, setCurrentDbPasskey] = useState<string | null>(null);
  const [newPasskeyInput, setNewPasskeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoadingPasskey, setIsLoadingPasskey] = useState(false);

  // Edit / Create Modals
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoItem> | null>(null);

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

  // 1. Database Security Check
  useEffect(() => {
    const verifyDatabaseAccess = async () => {
      // 1. Database Passkey verified session check
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
        const result = await verifyAdminEmailInFirestore(verifiedEmail);
        if (result.isAdmin) {
          setStatus('authorized');
          setAdminEmail(result.matchedEmail || verifiedEmail);
          return;
        } else {
          localStorage.removeItem('admin_verified_email');
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_session');
          setStatus('unauthorized');
          return;
        }
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user || !user.email) {
          setStatus('unauthorized');
          return;
        }

        const result = await verifyAdminEmailInFirestore(user.email);
        if (result.isAdmin) {
          localStorage.setItem('admin_session', 'true');
          sessionStorage.setItem('admin_session', 'true');
          setStatus('authorized');
          setAdminEmail(result.matchedEmail || user.email);
        } else {
          try {
            await signOut(auth);
          } catch {
            // ignore
          }
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_verified_email');
          localStorage.removeItem('admin_session_token');
          sessionStorage.removeItem('admin_session');
          setStatus('unauthorized');
        }
      });

      return unsubscribe;
    };

    let unsub: (() => void) | undefined;
    verifyDatabaseAccess().then(u => {
      if (typeof u === 'function') unsub = u;
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // 2. Subscribe to live database updates once authorized
  useEffect(() => {
    if (status !== 'authorized') return;

    const unsubProjects = subscribeToProjects((liveList) => {
      setProjects(liveList);
    });

    const unsubPhotos = subscribeToPhotos((liveList) => {
      setPhotos(liveList);
    });

    return () => {
      unsubProjects();
      unsubPhotos();
    };
  }, [status]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_passkey_verified');
    sessionStorage.removeItem('admin_session');
    localStorage.removeItem('admin_passkey_verified');
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_verified_email');
    localStorage.removeItem('admin_session_token');
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    setStatus('unauthorized');
  };

  // --- Project Actions ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) return;

    setIsSaving(true);
    try {
      const id = editingProject.id || `proj_${Date.now()}`;
      await saveProject({
        id,
        name: editingProject.name,
        category: editingProject.category || 'React',
        subHeader: editingProject.subHeader || '',
        description: editingProject.description || '',
        tech: Array.isArray(editingProject.tech) ? editingProject.tech : (editingProject.tech as any || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        url: editingProject.url || '',
        demoUrl: editingProject.demoUrl || '',
        coverImage: editingProject.coverImage || getProjectImage(editingProject),
        order: editingProject.order ?? projects.length,
      } as ProjectItem);
      setEditingProject(null);
      showNotification('Project saved successfully to live database.');
    } catch (err: any) {
      if (err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission')) {
        alert(
          `Permission Denied in Firestore:\n\n` +
          `Your Cloud Firestore Security Rules in Firebase Console are currently blocking writes.\n\n` +
          `To fix:\n` +
          `1. Open Firebase Console -> Firestore Database -> Rules tab.\n` +
          `2. Allow writes to 'projects' and 'photos' collections.\n` +
          `3. Click Publish.`
        );
      } else {
        alert(`Error saving project: ${err?.message || 'Check Firestore permissions'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, name?: string) => {
    if (!confirm(`Are you sure you want to delete project "${name || id}"? This will immediately remove it from the live portfolio.`)) {
      return;
    }
    try {
      await deleteProjectFromDb(id);
      showNotification('Project deleted from live database.');
    } catch (err: any) {
      alert(`Error deleting project: ${err?.message}`);
    }
  };

  // --- Photo Actions ---
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.title) return;
    if (!editingPhoto.image) {
      alert('Please upload an image for this photo.');
      return;
    }

    setIsSaving(true);
    try {
      const id = editingPhoto.id || `photo_${Date.now()}`;
      await savePhoto({
        id,
        title: editingPhoto.title,
        category: editingPhoto.category || 'Tech Team',
        subCategory: editingPhoto.subCategory || 'GALLERY MOMENT',
        date: editingPhoto.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        image: editingPhoto.image,
        description: editingPhoto.description || '',
        tags: Array.isArray(editingPhoto.tags) ? editingPhoto.tags : (editingPhoto.tags as any || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        order: editingPhoto.order ?? photos.length,
      } as PhotoItem);
      setEditingPhoto(null);
      showNotification('Photo saved successfully to live gallery.');
    } catch (err: any) {
      if (err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission')) {
        alert(
          `Permission Denied in Firestore:\n\n` +
          `Your Cloud Firestore Security Rules in Firebase Console are currently blocking writes.\n\n` +
          `To fix:\n` +
          `1. Open Firebase Console -> Firestore Database -> Rules tab.\n` +
          `2. Allow writes to 'projects' and 'photos' collections.\n` +
          `3. Click Publish.`
        );
      } else {
        alert(`Error saving photo: ${err?.message || 'Check Firestore permissions'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete photo "${title || id}"? This will immediately remove it from the live gallery.`)) {
      return;
    }
    try {
      await deletePhotoFromDb(id);
      showNotification('Photo deleted from live gallery.');
    } catch (err: any) {
      alert(`Error deleting photo: ${err?.message}`);
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
      showNotification('Passkey saved and updated live in Firestore (config/auth).');
    } catch (err: any) {
      alert(`Error updating passkey in Firestore: ${err?.message || 'Check Firestore rules for collection config'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ================= RENDER STATES =================
  if (status === 'checking') {
    return (
      <div className="fixed inset-0 bg-[#f8fafc] text-zinc-900 font-sans flex flex-col items-center justify-center p-6 select-none">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600 mb-3" />
        <p className="text-zinc-600 text-sm font-medium">Verifying database administrator clearance...</p>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className="fixed inset-0 bg-[#f8fafc] text-zinc-900 font-sans flex flex-col items-center justify-center p-6 select-none text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center mb-6 shadow-sm">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <div className="px-3.5 py-1 bg-red-100 border border-red-200 text-red-700 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
          403 Access Denied
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">
          smart hunu khojeyko babu !!!
        </h1>
        <p className="text-zinc-600 text-base font-normal">
          trying to be smart huh 😏
        </p>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPhotos = photos.filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto overflow-x-hidden bg-[#f8fafc] text-zinc-900 font-sans flex flex-col selection:bg-zinc-200" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-900 tracking-tight">Portfolio Admin Panel</h1>
            <p className="text-xs text-zinc-500 font-medium">Live Content Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {adminEmail && (
            <span className="text-xs text-zinc-700 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg font-mono hidden sm:inline-block">
              {adminEmail}
            </span>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-lg transition-colors shadow-xs"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
            <button
              onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('photos'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo Gallery ({photos.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Security & Passkey</span>
            </button>
          </div>

          {activeTab !== 'security' && (
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors shadow-xs"
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

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="space-y-3">
                    <ProjectThumb project={project} />

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                          {project.category || 'Project'}
                        </span>
                        <h3 className="text-base font-bold text-zinc-900 mt-1.5 tracking-tight">{project.name || project.title}</h3>
                      </div>
                    </div>

                    {project.subHeader && (
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">{project.subHeader}</p>
                    )}

                    {project.description && (
                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">{project.description.replace(/\|\|/g, ' ')}</p>
                    )}

                    {project.tech && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tech.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="Live Demo"
                        >
                          Demo ↗
                        </a>
                      )}
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="GitHub Source"
                        >
                          Code ↗
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-16 text-center border border-dashed border-zinc-300 rounded-xl bg-white">
                <p className="text-zinc-500 text-sm">No projects found matching your search.</p>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: PHOTOS GALLERY MANAGEMENT */}
        {activeTab === 'photos' && (
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="w-full h-44 bg-zinc-100 overflow-hidden relative border-b border-zinc-100">
                      <img 
                        src={photo.image} 
                        alt={photo.title}
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-zinc-800 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs">
                        {photo.category}
                      </span>
                    </div>

                    <div className="p-4 pt-1 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500">
                        <span>{photo.subCategory || 'MOMENT'}</span>
                        <span>{photo.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 tracking-tight line-clamp-1">{photo.title}</h4>
                      {photo.description && (
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{photo.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-end gap-1.5 border-t border-zinc-100 mt-2">
                    <button
                      onClick={() => setEditingPhoto(photo)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
                      title="Edit Photo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id, photo.title)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="py-16 text-center border border-dashed border-zinc-300 rounded-xl bg-white">
                <p className="text-zinc-500 text-sm">No photos found matching your search.</p>
              </div>
            )}
          </section>
        )}

        {/* TAB 3: DATABASE SECURITY & PASSKEY MANAGEMENT */}
        {activeTab === 'security' && (
          <section className="flex flex-col gap-6 max-w-2xl">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              <div className="flex items-start gap-4 pb-5 border-b border-zinc-200">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight">Database Passkey Management</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    This passkey is stored live in Cloud Firestore (<span className="font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">config/auth</span>) and is verified when you authenticate via <span className="font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">sudo admin</span> in the portfolio terminal. It is not hardcoded anywhere in the codebase.
                  </p>
                </div>
              </div>

              {/* Current Passkey in Database */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Current Database Passkey</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isLoadingPasskey ? (
                      <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching from Firestore...
                      </span>
                    ) : currentDbPasskey ? (
                      <span className="text-sm font-mono font-bold text-zinc-900">
                        {showPasskey ? currentDbPasskey : '••••••••'}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        Not configured in database yet
                      </span>
                    )}
                  </div>
                </div>

                {currentDbPasskey && (
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    {showPasskey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPasskey ? 'Hide Passkey' : 'Reveal Passkey'}</span>
                  </button>
                )}
              </div>

              {/* Form to Update Passkey */}
              <form onSubmit={handleUpdatePasskey} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Enter New Database Passkey
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new passkey..."
                    value={newPasskeyInput}
                    onChange={(e) => setNewPasskeyInput(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors shadow-xs font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1.5">
                    Saving writes directly to Firestore document <span className="font-mono text-zinc-700">config/auth</span>. You will immediately need this new key when running <span className="font-mono text-zinc-700">sudo admin</span>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving || !newPasskeyInput.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-zinc-900 text-white hover:bg-black rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Passkey to Live Database</span>
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
              <button 
                onClick={() => setEditingProject(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors"
              >
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
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
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
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : (editingProject.tech || '')}
                    onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value as any })}
                    placeholder="React, TypeScript, Tailwind CSS"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
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
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
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
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
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
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Project to Live Site</span>
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
              <button 
                onClick={() => setEditingPhoto(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors"
              >
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
                  placeholder="e.g. AI Summit Nepal — Kathmandu"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
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
                    placeholder="Tech Team, Events & Moments, etc."
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Sub-Category Tag</label>
                  <input
                    type="text"
                    value={editingPhoto.subCategory || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, subCategory: e.target.value })}
                    placeholder="BEHIND THE SCENES, EVENT, etc."
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={editingPhoto.date || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingPhoto.tags) ? editingPhoto.tags.join(', ') : (editingPhoto.tags || '')}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, tags: e.target.value as any })}
                    placeholder="Hackathon, AWS, Networking"
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Caption / Description</label>
                <textarea
                  rows={3}
                  value={editingPhoto.description || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                  placeholder="Short description of the photo..."
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-black rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Photo to Live Gallery</span>
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
