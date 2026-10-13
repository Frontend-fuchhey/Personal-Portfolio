import React, { useState, useEffect } from 'react';
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
  Search
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  ProjectItem, 
  PhotoItem, 
  subscribeToProjects, 
  subscribeToPhotos, 
  saveProject, 
  deleteProjectFromDb, 
  savePhoto, 
  deletePhotoFromDb,
  seedInitialProjectsIfEmpty,
  seedInitialPhotosIfEmpty
} from '../../lib/portfolioDataService';

interface AdminAppProps {
  isStandalone?: boolean;
}

export function AdminApp({ isStandalone = false }: AdminAppProps) {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Content state
  const [activeTab, setActiveTab] = useState<'projects' | 'photos'>('projects');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit / Create Modals
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoItem> | null>(null);

  // 1. Database Security Check
  useEffect(() => {
    const verifyDatabaseAccess = async () => {
      // 1. Passkey verified session check (stored in database as 2006)
      const hasPasskeySession =
        sessionStorage.getItem('admin_passkey_verified') === 'true' ||
        localStorage.getItem('admin_passkey_verified') === 'true';

      if (hasPasskeySession) {
        setStatus('authorized');
        setAdminEmail(localStorage.getItem('admin_verified_email') || 'root (passkey: 2006)');
        return;
      }

      const verifiedEmail = localStorage.getItem('admin_verified_email');
      const sessionToken = localStorage.getItem('admin_session_token');

      if (verifiedEmail && sessionToken) {
        try {
          const userDocRef = doc(db, 'users', verifiedEmail);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists() && docSnap.data()?.admin === true) {
            setStatus('authorized');
            setAdminEmail(verifiedEmail);
            return;
          } else {
            localStorage.removeItem('admin_verified_email');
            localStorage.removeItem('admin_session_token');
            localStorage.removeItem('admin_session');
            setStatus('unauthorized');
            return;
          }
        } catch {
          setStatus('unauthorized');
          return;
        }
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user || !user.email) {
          setStatus('unauthorized');
          return;
        }

        try {
          const userDocRef = doc(db, 'users', user.email);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists() && docSnap.data()?.admin === true) {
            localStorage.setItem('admin_session', 'true');
            sessionStorage.setItem('admin_session', 'true');
            setStatus('authorized');
            setAdminEmail(user.email);
          } else {
            await signOut(auth);
            localStorage.removeItem('admin_session');
            localStorage.removeItem('admin_verified_email');
            localStorage.removeItem('admin_session_token');
            sessionStorage.removeItem('admin_session');
            setStatus('unauthorized');
          }
        } catch {
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
        coverImage: editingProject.coverImage || '',
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
    if (!editingPhoto || !editingPhoto.title || !editingPhoto.image) return;

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
        <p className="text-zinc-600 text-base font-normal mb-8">
          trying to be smart huh 😏
        </p>
        <p className="text-zinc-500 text-xs max-w-sm border-t border-zinc-200 pt-4">
          Direct URL access is restricted. Only accounts with verified admin privileges in the Firestore database are authorized.
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
    <div className="min-h-screen w-full bg-[#f8fafc] text-zinc-900 font-sans flex flex-col selection:bg-zinc-200">
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
          </div>

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
                    {project.coverImage && (
                      <div className="w-full h-36 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                        <img 
                          src={project.coverImage} 
                          alt={project.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}

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
      </main>

      {/* EDIT / CREATE PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-xl w-full p-6 text-zinc-900 my-8 shadow-2xl animate-in fade-in duration-150">
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

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingProject.coverImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                  placeholder="Direct image URL or /assets/..."
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

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
      )}

      {/* EDIT / CREATE PHOTO MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 text-zinc-900 my-8 shadow-2xl animate-in fade-in duration-150">
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

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.image || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, image: e.target.value })}
                  placeholder="https://... or direct image link"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

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
      )}
    </div>
  );
}

export default AdminApp;
