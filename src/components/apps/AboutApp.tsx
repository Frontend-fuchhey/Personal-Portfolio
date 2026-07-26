import { useState, useEffect, useRef } from "react";
import profilePic from "../../assets/shrawan.jpg";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Briefcase,
  GraduationCap,
  FileText,
  Monitor,
  School,
} from "lucide-react";
import { AppId } from "../../types/os";
import { ResumeView } from "../ResumeView";
import { useOsData } from "../../hooks/useOsData";
import { USER_CONFIG } from "../../data/userConfig";

export function AboutApp({
  windowId,
  onUpdateSize,
  onOpenApp,
  onResumeStateChange,
  onClose,
}: {
  windowId?: string;
  onUpdateSize?: (id: string, w: number, h: number) => void;
  onOpenApp?: (appId: AppId) => void;
  onResumeStateChange?: (open: boolean) => void;
  onClose?: () => void;
}) {
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { aboutData } = useOsData();
  const isMobile = window.innerWidth < 768;

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const profileImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (profileImgRef.current?.complete) {
      setIsProfileLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (onResumeStateChange) {
      onResumeStateChange(isResumeVisible);
    }
  }, [isResumeVisible, onResumeStateChange]);

  useEffect(() => { }, [isMobile]);

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
    return <ResumeView onBack={() => setIsResumeVisible(false)} onClose={onClose} />;
  }

  const systemSpecs = [
    { label: "Processor", value: "16GB Passion" },
    { label: "Graphics", value: "4GB Creativity" },
    { label: "Memory", value: "1TB Overflowing Ideas" },
    { label: "OS", value: "Premium Human Edition" },
    { label: "Developer", value: "Shrawan Karki" },
  ];

  return (
    <div
      className={`h-full w-full flex flex-col font-sans bg-white ${isMobile ? "overflow-visible mobile-content-shift" : "overflow-hidden"}`}
      style={{
        letterSpacing: "-0.01em",
        background: "#ffffff",
        display: isMobile ? "block" : "flex",
      }}
    >
      <div
        className={`flex-1 custom-scroll-cursor ${isMobile ? "px-5 py-6" : "px-8 py-6 md:px-12 md:py-8 overflow-y-auto custom-scrollbar"}`}
      >
        <div
          className={`${isMobile ? "w-full h-auto" : "max-w-[520px] w-full"} flex flex-col items-center`}
        >
          <div className="relative mb-8">
            <div
              className={`absolute -inset-2 bg-blue-500/20 rounded-full blur-xl ${isMobile ? "" : "animate-pulse"}`}
            ></div>
            <div className="relative w-64 h-64 rounded-full border-4 border-white/80 dark:border-white/20 shadow-2xl overflow-hidden bg-white/10 antialiased">
              <img
                ref={profileImgRef}
                src={profilePic}
                alt={USER_CONFIG.name}
                onLoad={() => setIsProfileLoaded(true)}
                className={`w-full h-full object-cover object-center rounded-full image-render-crisp transition-opacity duration-500 ease-in-out ${isProfileLoaded ? "opacity-100" : "opacity-0"}`}
                style={{
                  // @ts-ignore
                  WebkitImageRendering: 'optimize-contrast',
                  imageRendering: 'crisp-edges',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratyush&backgroundColor=b6e3f4";
                }}
              />
            </div>
          </div>

          <div className="mb-6 text-center mt-6">
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
              {
                icon: <Instagram className="w-5 h-5" />,
                href: "https://www.instagram.com/ig_prasar7",
                label: "Instagram",
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
              I build immersive digital experiences that live at the
              intersection of design and technology. Passionate about crafting
              clean, performant, and accessible user interfaces that tell a
              story.
            </p>
            {/* Tech Stack Divider & Section */}
            <div className="w-full max-w-lg flex flex-col gap-5 mt-6 pt-6 border-t border-gray-100 dark:border-white/10 text-sm">
              {(() => {
                const techCategories = [
                  {
                    label: "Frontend",
                    items: [
                      {
                        name: 'React',
                        icon: <svg className="w-4 h-4 text-[#61DAFB]" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor" strokeWidth="1"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /><circle r="2" fill="currentColor" /></svg>
                      },
                      ,
                      {
                        name: 'JavaScript',
                        icon: <svg className="w-4 h-4 text-[#F7DF1E] fill-current" viewBox="0 0 448 512"><path d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.1 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h41.3v143.7zm99.6-42.5c4.8 21.6 18.6 34.6 38.8 34.6 18.6 0 31.5-9.3 31.5-24.3 0-16.8-12.3-22.8-33.1-31.9l-11.4-4.8c-32.5-14.1-54.1-31.3-54.1-68.5 0-38.2 30.4-66.4 72.7-66.4 39.4 0 63.2 17.7 71.3 43.6l-32.8 19.3c-5.7-11.7-14.4-17.7-37.3-17.7-17.1 0-28.3 8.7-28.3 22 0 14.4 9 20.1 27.7 28.3l12.3 5.4c39.1 17.1 59.8 34 59.8 73 0 41.6-31.3 70-79.9 70-52.3 0-77-24.3-86.8-54.4l34.1-19.6z" /></svg>
                      }
                    ]
                  },
                  {
                    label: "Designing & Styling",
                    items: [
                      {
                        name: 'Tailwind CSS',
                        icon: <svg className="w-4 h-4 text-[#38BDF8] fill-current" viewBox="0 0 24 24"><path d="M12 6.5c-2.8 0-4.9 1.4-6.3 4.2 2.1-2.1 4.2-2.8 6.3-2.1 1.2.4 2 1.3 3 2.3 1.5 1.5 3.3 3.3 6.6 3.3 2.8 0 4.9-1.4 6.3-4.2-2.1 2.1-4.2 2.8-6.3 2.1-1.2-.4-2-1.3-3-2.3-1.5-1.5-3.3-3.3-6.6-3.3zM5.4 13c-2.8 0-4.9 1.4-6.3 4.2 2.1-2.1 4.2-2.8 6.3-2.1 1.2.4 2 1.3 3 2.3 1.5 1.5 3.3 3.3 6.6 3.3 2.8 0 4.9-1.4 6.3-4.2-2.1 2.1-4.2 2.8-6.3 2.1-1.2-.4-2-1.3-3-2.3-1.5-1.5-3.3-3.3-6.6-3.3z" /></svg>
                      },
                      {
                        name: 'UI/UX Designing',
                        icon: <svg className="w-4 h-4 text-[#A259FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>
                      },
                      {
                        name: 'Figma',
                        icon: <svg className="w-4 h-4" viewBox="0 0 38 57" fill="none"><path d="M19 0a9.5 9.5 0 0 0-9.5 9.5 9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 19 0z" fill="#F24E1E" /><path d="M9.5 19a9.5 9.5 0 0 0 0 19h9.5V19H9.5z" fill="#A259FF" /><path d="M19 19h9.5a9.5 9.5 0 0 0 0-19H19v19z" fill="#FF7262" /><path d="M19 38h9.5a9.5 9.5 0 0 0 0-19H19v19z" fill="#1ABC9C" /><path d="M9.5 38a9.5 9.5 0 0 0 9.5 9.5V38H9.5z" fill="#18A0FB" /></svg>
                      },
                      {
                        name: 'Photoshop',
                        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4" fill="#001E36" /><path d="M7.5 7h2.6c1.5 0 2.4.7 2.4 2 0 1.4-1 2.1-2.5 2.1H8.8V15H7.5V7zm1.3 3.1h1c.8 0 1.3-.3 1.3-1 0-.6-.4-.9-1.2-.9h-1v1.9zm5.5 2.5c0-.9.6-1.5 1.8-1.6 1.1 0 1.7.3 1.7.3v-1s-.5-.2-1.4-.2c-1.8 0-2.8 1-2.8 2.5 0 2.1 2.8 1.7 2.8 3 0 .4-.4.6-1 .6-.9 0-1.6-.4-1.6-.4l-.3.9s.7.4 1.9.4c1.8 0 2.9-.9 2.9-2.5 0-2.3-2.8-1.8-2.8-3z" fill="#31A8FF" /></svg>
                      }
                    ]
                  },
                  {
                    label: "Tools & Env",
                    items: [
                      {
                        name: 'Git / GitHub',
                        icon: <svg className="w-4 h-4 text-[#24292E] dark:text-gray-200 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                      },
                      {
                        name: 'Vite',
                        icon: <svg className="w-4 h-4 text-[#646CFF] fill-current" viewBox="0 0 24 24"><path d="M19.95 2.5L12 16v6l7.95-13.5h-5.4zM4.05 2.5L12 16V9.5H6.6z" /></svg>
                      },
                      {
                        name: 'Netlify',
                        icon: <svg className="w-4 h-4 text-[#00C7B7] fill-current" viewBox="0 0 24 24"><path d="M12 2L2 12h5v10h10V12h5L12 2z" /></svg>
                      },
                      {
                        name: 'npm',
                        icon: <svg className="w-4 h-4 text-[#CB3837] fill-current" viewBox="0 0 24 24"><path d="M0 0v24h24V0H0zm18.5 18.5h-3.5v-11h-3v11h-6.5v-13h13v13z" /></svg>
                      }
                    ]
                  }
                ];

                return techCategories.map((cat) => (
                  <div key={cat.label} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-2.5 border-b border-gray-50 dark:border-white/[0.02] last:border-0">
                    <span className="w-44 shrink-0 font-bold text-xs uppercase tracking-wider text-gray-400">
                      {cat.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((tech) => (
                        <span key={tech.name} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                          {tech.icon}
                          <span>{tech.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[13px]">
                Professional Experience
              </h2>
            </div>
            <div className="relative space-y-8">
              <div className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-gray-100 dark:bg-white/10" />

              {aboutData.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 group">
                  <div
                    className={`absolute left-0 top-1.5 w-[15px] h-[15px] bg-white dark:bg-gray-900 border-[2.5px] border-blue-500 rounded-full z-10 ${isMobile ? "" : "transition-transform group-hover:scale-125"}`}
                  />
                  <div
                    className={`p-6 rounded-2xl border transition-all h-auto ${isMobile ? "w-full bg-[#f8f9fa] border-gray-200" : "bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10"}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2 h-auto">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {exp.title}
                      </h3>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50/50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                        {exp.range}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-[1.6]">
                      • {exp.achievement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mb-16 space-y-8">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-white/5">
              <GraduationCap className="w-5 h-5 text-teal-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[13px]">
                Academic Foundation
              </h2>
            </div>
            <div className="relative space-y-8">
              <div className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-gray-100 dark:bg-white/10" />

              {aboutData.education.map((edu, i) => (
                <div key={i} className="relative pl-8 group">
                  <div
                    className={`absolute left-0 top-1.5 w-[15px] h-[15px] bg-white dark:bg-gray-900 border-[2.5px] border-teal-500 rounded-full z-10 ${isMobile ? "" : "transition-transform group-hover:scale-125"}`}
                  />
                  <div
                    className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5 h-auto ${isMobile ? "w-full bg-[#f8f9fa] border-gray-200" : "bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10"}`}
                  >
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
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [edu.id]: true,
                            }))
                          }
                        />
                      )}
                    </a>

                    <div className="flex-1 flex justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">
                            {edu.degree}
                          </h3>
                          {edu.status === "ongoing" ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-[9px] font-bold text-red-500 uppercase tracking-tight">
                                Ongoing
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                              <span className="text-[9px] font-bold text-green-500 uppercase tracking-tight">
                                Completed
                              </span>
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
                          <p className="text-[11px] italic text-gray-400 dark:text-gray-500 font-medium">
                            {edu.detail}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end shrink-0 py-0.5">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50/50 dark:bg-teal-900/20 px-2 py-0.5 rounded-md mb-2">
                          {edu.year}
                        </span>
                        {"certId" in edu && (
                          <div className="mt-auto pr-1">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenApp && onOpenApp(edu.certId as any);
                              }}
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
            <div
              className={`w-full border rounded-2xl p-4 md:p-5 font-sans flex flex-col transition-all h-auto ${isMobile ? "bg-[#f8f9fa] border-gray-200 shadow-sm" : "bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10"}`}
            >
              <div className="flex items-center gap-2.5 mb-2 pb-2.5 border-b border-gray-100/40 dark:border-white/[0.04] h-auto">
                <Monitor className="w-[18px] h-[18px] text-blue-500" />
                <h2 className="text-[13px] font-bold text-gray-900 dark:text-white tracking-tight">
                  System Identity
                </h2>
              </div>
              <div className="flex flex-col h-auto">
                {systemSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-2 ${i !== systemSpecs.length - 1 ? "border-b border-gray-100/30 dark:border-white/[0.04]" : ""}`}
                  >
                    <span className="text-[12px] font-normal text-gray-400 dark:text-gray-500">
                      {spec.label}
                    </span>
                    <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">
                      {spec.value}
                    </span>
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
