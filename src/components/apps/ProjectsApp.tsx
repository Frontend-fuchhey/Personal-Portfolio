import { useState } from 'react';
import { FolderOpen, ArrowLeft, ExternalLink, Code, Github, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOsData } from '../../hooks/useOsData';
import { INITIAL_PROJECTS } from '../../data/initialData';

interface ProjectFeature {
  icon: any;
  title: string;
  description: string | any;
}

interface ProjectArchitecture {
  title: string;
  description: string | any;
}

interface Project {
  id: string;
  name: string;
  description: string;
  longDesc?: string | any;
  tech: string[];
  category?: string;
  stars?: number;
  forks?: number;
  url?: string;
  demoUrl?: string;
  icon?: string | any;
  iconType?: 'image' | 'emoji';
  iconValue?: string;
  color: string;
  features?: ProjectFeature[];
  architecture?: ProjectArchitecture[];
  images?: string[];
  coverImage?: string;
  subHeader?: string;
}

export function ProjectsApp() {
  const { projects } = useOsData() as { projects: Project[] };
  const [selected, setSelected] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'react' | 'web design'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleProjectClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(project);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(null);
  };

  const filteredProjects = INITIAL_PROJECTS.filter((project) => {
    // Always read from INITIAL_PROJECTS (source of truth) — never stale context state
    if (activeFilter.toLowerCase() === 'all') return true;
    return project.category?.toLowerCase().trim() === activeFilter.toLowerCase().trim();
  });

  // Apply search on top of the category-filtered list
  const projectsData = (filteredProjects as Project[]).filter(project => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return project.name.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.tech.some(t => t.toLowerCase().includes(q));
  });

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <div className={`w-full h-full md:w-[860px] md:h-[580px] flex flex-col bg-white dark:bg-gray-900 overflow-hidden relative ${isMobile ? 'mobile-content-shift' : ''}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex flex-wrap items-center gap-y-2 px-4 py-2 select-none shrink-0 z-10">
          {/* Row 1: Title + Filter Tabs */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Left Section — Project Directory Brand Label */}
            <div className="flex items-center gap-2 text-slate-700 font-sans font-bold text-xs tracking-wide uppercase shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>PROJECTS ({projectsData.length})</span>
            </div>

            {/* Center Section — Filter Tab Navigation */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 font-sans">
              {(['all', 'react', 'web design'] as const).map((cat, idx, arr) => (
                <span key={cat} className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveFilter(cat)}
                    className={activeFilter === cat
                      ? 'text-slate-800 font-bold border-b border-slate-800 pb-0.5 cursor-default'
                      : 'hover:text-slate-600 cursor-pointer transition-colors duration-150'
                    }
                  >
                    {cat === 'all' ? 'All' : cat === 'react' ? 'React' : 'Web Design'}
                  </button>
                  {idx < arr.length - 1 && (
                    <span className="text-slate-200 pointer-events-none px-0.5">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Row 2 on mobile / inline on desktop: Search Input */}
          <div className="relative w-full mt-1 md:mt-0 md:w-auto md:max-w-[160px] md:ml-auto">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200/30 rounded-md pl-7 pr-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all duration-200"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-8 p-8">
            {projectsData.length === 0 ? (
              <div className="w-full py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-slate-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 012.25 2.25v4.25a2.25 2.25 0 01-2.25 2.25H2.25A2.25 2.25 0 010 20v-4.25A2.25 2.25 0 012.25 13.5z" />
                </svg>
                <p className="text-xs">No projects found matching the criteria</p>
              </div>
            ) : (
              projectsData.map(project => {
                const isEmoji = project.iconType === 'emoji' || (typeof project.icon === 'string' && !project.icon.includes('/') && !project.icon.includes('.'));
                const iconDisplay = project.iconType === 'emoji' ? project.iconValue : (project.iconValue || project.icon);

                return (
                  <button
                    key={project.id}
                    onClick={(e) => handleProjectClick(e, project)}
                    className="flex flex-col items-center gap-2 p-4 w-32 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors group text-center"
                  >
                    <div className={`w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-105 ${isEmoji ? 'rounded-2xl bg-gradient-to-br shadow-md group-hover:shadow-lg ' + project.color : ''}`}>
                      {isEmoji ? <span className="text-3xl">{iconDisplay}</span> : <img src={iconDisplay} alt={project.name} className="w-16 h-16 object-cover rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-md bg-white dark:bg-white/10" />}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight break-words">{project.name}</span>
                  </button>
                )
              })
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-xs text-gray-400">Select a project to view details</p>
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute inset-0 z-20 flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-l border-white/20 dark:border-gray-700/30 transition-all duration-300 animate-in fade-in slide-in-from-right-10">
          {!isMobile && (
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
            <div className="max-w-2xl mx-auto pb-12">

              <div className="relative mb-16 shadow-2xl rounded-3xl animate-in zoom-in-95 duration-500">
                <div className={`w-full h-48 sm:h-64 rounded-3xl relative overflow-hidden ${!selected.coverImage ? `bg-gradient-to-br ${selected.color} flex items-center justify-center` : ''}`}>
                  {selected.coverImage ? (
                    <img 
                      src={selected.coverImage} 
                      alt="" 
                      className="w-full h-full object-cover object-top rounded-3xl"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <Code className="w-64 h-64 text-white transform -rotate-12 scale-150" />
                      </div>
                      <div className="text-8xl transform scale-125 opacity-30 drop-shadow-2xl saturate-150 mix-blend-overlay">
                        {selected.iconType === 'emoji' ? selected.iconValue : <img src={selected.iconValue || selected.icon} alt="" className="w-48 h-48 object-contain opacity-50" />}
                      </div>
                    </>
                  )}
                </div>

                <div className="absolute -bottom-8 left-6 sm:left-10 w-24 h-24 rounded-2xl bg-white dark:bg-gray-900 p-2 shadow-xl border border-gray-100 dark:border-gray-700 ring-4 ring-white/50 dark:ring-gray-900/50">
                  <div className={`w-full h-full rounded-xl flex items-center justify-center text-4xl ${selected.iconType === 'emoji' ? 'bg-gradient-to-br ' + selected.color : 'bg-transparent'}`}>
                    {selected.iconType === 'emoji' ? selected.iconValue : <img src={selected.iconValue || selected.icon} alt={selected.name} className="w-full h-full object-cover rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-white/10" />}
                  </div>
                </div>
              </div>

              <div className="px-2 sm:px-4 space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{selected.name}</h2>
                  {selected.subHeader && (
                    <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-4 tracking-tight">
                      {selected.subHeader}
                    </div>
                  )}
                  <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {(selected.longDesc || selected.description).split('||').map((paragraph: string, index: number) => {
                      const isHeader = paragraph.startsWith('🚀') || paragraph.startsWith('💡') || paragraph.startsWith('📈');
                      return (
                        <p 
                          key={index} 
                          className={isHeader ? "font-bold text-slate-800 dark:text-white pt-2" : "text-slate-600 dark:text-slate-300"}
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {selected.features && selected.features.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">High-Impact Features</h3>
                    <div className="flex flex-col gap-4">
                      {selected.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/80 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all items-start group">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selected.color} shadow-inner shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                            <feature.icon className="w-5 h-5 text-white drop-shadow-sm" />
                          </div>
                          <div className="pt-0.5">
                            <h4 className="font-bold text-gray-900 dark:text-white text-[16px] mb-1">{feature.title}</h4>
                            <div className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{feature.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.tech && selected.tech.length > 0 && (
                  <div className="space-y-4 lg:pt-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Technical Highlights</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {selected.tech.map(t => (
                        <span key={t} className="px-4 py-2 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-900 dark:text-blue-100 text-sm font-black tracking-wide rounded-xl border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm hover:-translate-y-1 hover:shadow-md hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-800/60 dark:hover:to-blue-800/60 transition-all duration-300 cursor-default">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {selected.demoUrl && (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-1 items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white font-black tracking-wider transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      LIVE DEMO
                    </a>
                  )}
                  {selected.url && (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center gap-2 ${selected.demoUrl ? 'flex-1' : 'w-full'} py-4 rounded-2xl bg-transparent text-gray-800 dark:text-gray-200 font-black tracking-wider transition-all duration-300 border-[3px] border-gray-800 dark:border-gray-200 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900`}
                    >
                      <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      VIEW CODE
                    </a>
                  )}
                </div>

                {selected.images && selected.images.length > 0 && (
                  <div className="pt-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Camera className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h3>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-gray-200 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-700 dark:to-transparent mb-8"></div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {selected.images.map((img, idx) => (
                        <motion.div
                          key={`${selected.id}-img-${idx}`}
                          layoutId={`image-${img}`}
                          className={`relative overflow-hidden rounded-2xl cursor-pointer ${idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''} border border-white/20 dark:border-gray-700/50 shadow-sm backdrop-blur-md bg-white/10 dark:bg-gray-800/20`}
                          whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedImage(img)}
                        >
                          <img
                            src={img}
                            alt={`${selected.name} screenshot ${idx + 1}`}
                            className={`rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm w-full h-full min-h-[300px] max-h-96 ${img.toString().includes('mb') ? 'object-contain mx-auto bg-gray-50/10 dark:bg-black/20' : 'object-cover'} aspect-[16/10]`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              layoutId={`image-${selectedImage}`}
              src={selectedImage}
              className="relative z-[105] max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              alt="Enlarged screenshot"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

