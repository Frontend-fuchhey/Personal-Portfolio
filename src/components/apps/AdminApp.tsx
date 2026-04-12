import { useState, useEffect } from 'react';
import { Lock, Plus, Trash2, Edit2, Check, X, Briefcase, GraduationCap, Package, Terminal } from 'lucide-react';
import { useOsData } from '../../hooks/useOsData';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_session') === 'true';
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'projects'>('experience');

  const {
    aboutData,
    projects,
    updateExperience,
    updateEducation,
    updateProject,
    addExperience,
    addEducation,
    addProject,
    deleteExperience,
    deleteEducation,
    deleteProject
  } = useOsData();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const systemPass = (import.meta.env.VITE_ADMIN_PASSWORD || '').toLowerCase();
    const inputPass = password.trim().toLowerCase();

    if (inputPass && inputPass === systemPass) {
      setIsAuthenticating(true);
      setError('');
      
      setTimeout(() => {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_session', 'true');
        setIsAuthenticating(false);
      }, 1000);
    } else {
      setError('Invalid system access key.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0F0F14] font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className={`w-10 h-10 ${isAuthenticating ? 'text-emerald-500 animate-pulse' : 'text-blue-500'}`} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">
            {isAuthenticating ? 'Access Granted' : 'Security Gate'}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {isAuthenticating ? 'Initializing root dashboard protocol...' : 'Please enter the secondary access key.'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              disabled={isAuthenticating}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all text-center text-lg tracking-widest disabled:opacity-50"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs font-bold font-sans animate-pulse tracking-wide uppercase">{error}</p>}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:bg-emerald-600 disabled:shadow-emerald-500/20"
            >
              {isAuthenticating ? 'PROTOCOL ENGAGED' : 'AUTHENTICATE ACCESS'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }



  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] dark:bg-[#020617] overflow-hidden font-sans">
      {/* Root Status Bar */}
      <div className="bg-red-600 px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Root Access: Authenticated</span>
        </div>
        <span className="text-[10px] font-bold text-white/80 uppercase">System Integrity: Locked</span>
      </div>

      {/* Sidebar / Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md px-6 pt-6">
        {[
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'projects', label: 'Projects', icon: Package }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">System Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Experience</h3>
                  <p className="text-gray-500 text-sm">Manage entries in the 'About Me' timeline.</p>
                </div>
                <button
                  onClick={() => addExperience({ title: 'New Role', company: 'New Company', range: '2024 - Present', achievement: 'Enter key achievement...' })}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Position
                </button>
              </div>

              <div className="grid gap-4">
                {aboutData.experience.map(exp => (
                  <EditableItem
                    key={exp.id}
                    item={exp}
                    onUpdate={(updated) => updateExperience(exp.id, updated)}
                    onDelete={() => deleteExperience(exp.id)}
                    fields={[
                      { key: 'title', label: 'Job Title' },
                      { key: 'company', label: 'Company' },
                      { key: 'range', label: 'Duration' },
                      { key: 'achievement', label: 'Work Achievement', type: 'textarea' }
                    ]}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Foundation</h3>
                  <p className="text-gray-500 text-sm">Manage certificates and schooling data.</p>
                </div>
                <button
                  onClick={() => addEducation({ degree: 'New Degree', institution: 'Institution Name', year: 'Year', status: 'completed' })}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Credential
                </button>
              </div>

              <div className="grid gap-4">
                {aboutData.education.map(edu => (
                  <EditableItem
                    key={edu.id}
                    item={edu}
                    onUpdate={(updated) => updateEducation(edu.id, updated)}
                    onDelete={() => deleteEducation(edu.id)}
                    fields={[
                      { key: 'degree', label: 'Degree' },
                      { key: 'institution', label: 'Institution' },
                      { key: 'year', label: 'Year/Range' },
                      { key: 'status', label: 'Status (completed/ongoing)' }
                    ]}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Repository</h3>
                  <p className="text-gray-500 text-sm">Update portfolio items and case studies.</p>
                </div>
                <button
                  onClick={() => addProject({ name: 'New Project', description: 'Brief overview...', tech: ['React'], color: 'from-blue-500 to-indigo-500' })}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>

              <div className="grid gap-4">
                {projects.map(proj => (
                  <EditableItem
                    key={proj.id}
                    item={proj}
                    onUpdate={(updated) => updateProject(proj.id, updated)}
                    onDelete={() => deleteProject(proj.id)}
                    fields={[
                      { key: 'name', label: 'Project Name' },
                      { key: 'subHeader', label: 'Subtitle' },
                      { key: 'description', label: 'Overview', type: 'textarea' },
                      { key: 'url', label: 'GitHub URL' },
                      { key: 'demoUrl', label: 'Demo URL' }
                    ]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditableItem({ item, onUpdate, onDelete, fields }: { item: any, onUpdate: (u: any) => void, onDelete: () => void, fields: { key: string, label: string, type?: string }[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(item);

  const handleSave = () => {
    onUpdate(edited);
    setIsEditing(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={edited[f.key] || ''}
                    onChange={(e) => setEdited({ ...edited, [f.key]: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50 min-h-[100px]"
                  />
                ) : (
                  <input
                    type="text"
                    value={edited[f.key] || ''}
                    onChange={(e) => setEdited({ ...edited, [f.key]: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500/50"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={() => { setEdited(item); setIsEditing(false); }} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/10 uppercase">
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.title || item.name || item.degree}</h4>
              {'status' in item && (
                <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {item.status}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-gray-500 mb-2">{item.company || item.institution || item.subHeader}</p>
            <p className="text-xs text-gray-400 line-clamp-2 italic">{item.achievement || item.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500/20 dark:hover:text-blue-400 transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { if(confirm('Are you sure?')) onDelete(); }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
