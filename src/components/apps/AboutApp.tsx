import { useState, useEffect } from "react";
import { Github, Linkedin, Twitter, Briefcase, GraduationCap, FileText, Monitor, School } from "lucide-react";
import { AppId } from "../../types/os";
import { ResumeView } from "../ResumeView";
import { useOsData } from "../../hooks/useOsData";
import { USER_CONFIG } from "../../data/userConfig";

export function AboutApp({
  windowId,
  onUpdateSize,
  onOpenApp,
  onResumeStateChange
}: {
  windowId?: string,
  onUpdateSize?: (id: string, w: number, h: number) => void,
  onOpenApp?: (appId: AppId) => void,
  onResumeStateChange?: (open: boolean) => void
}) {
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { aboutData } = useOsData();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (onResumeStateChange) {
      onResumeStateChange(isResumeVisible);
    }
  }, [isResumeVisible, onResumeStateChange]);

  useEffect(() => {
  }, [isMobile]);

  useEffect(() => {
    if (!windowId || !onUpdateSize) return;

    if (isResumeVisible) {
      const targetWidth = Math.min(850, window.innerWidth * 0.9);
      const targetHeight = window.innerHeight * 0.9;
      onUpdateSize(windowId, targetWidth, targetHeight);
    } else {
      onUpdateSize(windowId, 620, 520);
    }
  }, [isResumeVisible, windowId, onUpdateSize]);

  if (isResumeVisible) {
    return <ResumeView onBack={() => setIsResumeVisible(false)} />;
  }

  const systemSpecs = [
    { label: 'Processor', value: '16GB Passion' },
    { label: 'Graphics', value: '4GB Creativity' },
    { label: 'Memory', value: '1TB Overflowing Ideas' },
    { label: 'OS', value: 'Premium Human Edition' },
    { label: 'Developer', value: 'Shrawan Karki' },
  ];

  return (
    <div
      className={`h-full w-full flex flex-col font-sans bg-white ${isMobile ? 'overflow-visible mobile-content-shift' : 'overflow-hidden'}`}
      style={{
        letterSpacing: '-0.01em',
        background: '#ffffff',
        display: isMobile ? 'block' : 'flex',
      }}
    >
      <div className={`flex-1 ${isMobile ? 'p-5' : 'p-8 md:p-12 overflow-y-auto custom-scrollbar'}`}>
        <div className={`${isMobile ? 'w-full h-auto' : 'max-w-[520px] w-full'} flex flex-col items-center`}>
          <div className="relative mb-8">
            <div className={`absolute -inset-2 bg-blue-500/20 rounded-full blur-xl ${isMobile ? '' : 'animate-pulse'}`}></div>
            <div className="relative w-32 h-32 rounded-full border-4 border-white/80 dark:border-white/20 shadow-2xl overflow-hidden bg-white/10">
              <img
                src={USER_CONFIG.profilePic}
                alt={USER_CONFIG.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratyush&backgroundColor=b6e3f4";
                }}
              />
            </div>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              {USER_CONFIG.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
              {USER_CONFIG.title}
            </p>
          </div>

          <div className="flex gap-8 mb-12">
            {[
              {
                icon: <Github className="w-5 h-5" />,
                href: "https://github.com/frontend-fuchhey",
                label: "GitHub",
              },
              {
                icon: <Linkedin className="w-5 h-5" />,
                href: "https://www.linkedin.com/in/shrawan-karki-59b0ba392/",
                label: "LinkedIn",
              },
              {
                icon: <Twitter className="w-5 h-5" />,
                href: "https://x.com/pratyushkarki6",
                label: "Twitter",
              },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all transform hover:scale-125"
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="mb-16 text-center">
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-[1.6] font-medium max-w-lg">
              I build immersive digital experiences that live at the intersection
              of design and technology. Passionate about crafting clean,
              performant, and accessible user interfaces that tell a story.
            </p>
            <button
              onClick={() => setIsResumeVisible(true)}
              className="mt-8 flex items-center gap-2.5 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm mx-auto"
            >
              <FileText className="w-4.5 h-4.5" />
              View Full Resume
            </button>
          </div>

          <div className="w-full mb-16 space-y-8">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-white/5">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[13px]">Professional Experience</h2>
            </div>
            <div className="relative space-y-8">
              <div className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-gray-100 dark:bg-white/10" />

              {aboutData.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 group">
                  <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] bg-white dark:bg-gray-900 border-[2.5px] border-blue-500 rounded-full z-10 ${isMobile ? '' : 'transition-transform group-hover:scale-125'}`} />
                  <div className={`p-6 rounded-2xl border transition-all h-auto ${isMobile ? 'w-full bg-[#f8f9fa] border-gray-200' : 'bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2 h-auto">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">{exp.title}</h3>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50/50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">{exp.range}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">{exp.company}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-[1.6]">• {exp.achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mb-16 space-y-8">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-white/5">
              <GraduationCap className="w-5 h-5 text-teal-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[13px]">Academic Foundation</h2>
            </div>
            <div className="relative space-y-8">
              <div className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-gray-100 dark:bg-white/10" />

              {aboutData.education.map((edu, i) => (
                <div key={i} className="relative pl-8 group">
                  <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] bg-white dark:bg-gray-900 border-[2.5px] border-teal-500 rounded-full z-10 ${isMobile ? '' : 'transition-transform group-hover:scale-125'}`} />
                  <div className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5 h-auto ${isMobile ? 'w-full bg-[#f8f9fa] border-gray-200' : 'bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10'}`}>
                    <a
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 flex-shrink-0 flex items-center justify-center p-2 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-inner cursor-pointer hover:shadow-md transition-all active:scale-95"
                    >
                      {imageErrors[edu.id] ? (
                        <School className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <img 
                          src={edu.logo} 
                          alt={edu.institution} 
                          className="max-w-full max-h-full object-contain" 
                          onError={() => setImageErrors(prev => ({ ...prev, [edu.id]: true }))}
                        />
                      )}
                    </a>

                    <div className="flex-1 flex justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">{edu.degree}</h3>
                          {edu.status === 'ongoing' ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-[9px] font-bold text-red-500 uppercase tracking-tight">Ongoing</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                              <span className="text-[9px] font-bold text-green-500 uppercase tracking-tight">Completed</span>
                            </div>
                          )}
                        </div>
                        <a
                          href={edu.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 hover:text-gray-400 dark:hover:text-gray-300 hover:underline cursor-pointer transition-colors"
                        >
                          {edu.institution}
                        </a>
                        {edu.detail && (
                          <p className="text-[11px] italic text-gray-400 dark:text-gray-500 font-medium">{edu.detail}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end shrink-0 py-0.5">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50/50 dark:bg-teal-900/20 px-2 py-0.5 rounded-md mb-2">{edu.year}</span>
                        {'certId' in edu && (
                          <div className="mt-auto pr-1">
                            <div
                              onClick={(e) => { e.stopPropagation(); onOpenApp && onOpenApp(edu.certId as any); }}
                              className="p-1.5 cursor-pointer text-[#2DD4BF]/60 hover:text-[#2DD4BF] transition-all hover:scale-110 active:scale-95 group/cert"
                              title="View Certificate"
                            >
                              <FileText className="w-4.5 h-4.5 stroke-[2.5px]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full pl-8 mb-6 h-auto">
            <div className={`w-full border rounded-2xl p-4 md:p-5 font-sans flex flex-col transition-all h-auto ${isMobile ? 'bg-[#f8f9fa] border-gray-200 shadow-sm' : 'bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10'}`}>
              <div className="flex items-center gap-2.5 mb-2 pb-2.5 border-b border-gray-100/40 dark:border-white/[0.04] h-auto">
                <Monitor className="w-[18px] h-[18px] text-blue-500" />
                <h2 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight">System Identity</h2>
              </div>
              <div className="flex flex-col h-auto">
                {systemSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-2 ${i !== systemSpecs.length - 1 ? 'border-b border-gray-100/30 dark:border-white/[0.04]' : ''}`}
                  >
                    <span className="text-[12px] font-normal text-gray-400 dark:text-gray-500">{spec.label}</span>
                    <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



