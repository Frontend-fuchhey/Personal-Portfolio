import { useState, useEffect, useRef } from "react";
import { useIsMobile } from '../../hooks/use-mobile';
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
  Code2,
  Cloud,
  Palette,
  Globe,
  Zap,
  MonitorSmartphone,
  Cpu,
  Braces,
  Maximize2,
  Compass,
  TrendingUp,
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
  const isMobile = useIsMobile();

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



  useEffect(() => {
    if (!windowId || !onUpdateSize) return;

    if (isResumeVisible) {
      const targetWidth = Math.min(850, window.innerWidth * 0.9);
      const targetHeight = window.innerHeight * 0.9;
      onUpdateSize(windowId, targetWidth, targetHeight);
    } else {
      const targetWidth = Math.min(980, window.innerWidth * 0.95);
      const targetHeight = Math.min(660, window.innerHeight * 0.9);
      onUpdateSize(windowId, targetWidth, targetHeight);
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
          className={`${isMobile ? "w-full h-auto" : "max-w-5xl w-full mx-auto"} flex flex-col items-center`}
        >
          <div className="w-full max-w-xl flex flex-col items-center text-center">
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

            <div className="flex gap-8 mb-10">
              {[
                {
                  icon: <Github className="w-5 h-5" />,
                  href: "https://github.com/frontend-fuchhey",
                  label: "GitHub",
                  rel: "me noopener noreferrer",
                },
                {
                  icon: <Linkedin className="w-5 h-5" />,
                  href: "https://www.linkedin.com/in/shrawan-karki-187706428/",
                  label: "LinkedIn",
                  rel: "me noopener noreferrer",
                },
                {
                  icon: <Twitter className="w-5 h-5" />,
                  href: "https://x.com/pratyushkarki6",
                  label: "Twitter",
                  rel: "noopener noreferrer",
                },
                {
                  icon: <Instagram className="w-5 h-5" />,
                  href: "https://www.instagram.com/prasar_7/",
                  label: "Instagram",
                  rel: "me noopener noreferrer",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel={social.rel}
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-all transform hover:scale-125"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-[1.6] font-medium max-w-lg mb-2">
              I build immersive digital experiences that live at the
              intersection of design and technology. Passionate about crafting
              clean, performant, and accessible user interfaces that tell a
              story.
            </p>
          </div>

          {/* Categorized Tech Stack Section */}
          <section className="w-full my-10 p-5 sm:p-7 md:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
            {/* Header & Subheader */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                My <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">Tech Stack</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl mx-auto leading-relaxed">
                Technologies and tools I use to build fast, accessible, and delightful digital experiences.
              </p>
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 mx-auto mt-3 shadow-xs" />
            </div>

            {/* Stacked Categories: Full-width rows with responsive grid items */}
            <div className="flex flex-col gap-6 w-full">
              {[
                {
                  category: "Frontend & Frameworks",
                  icon: <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                  gridClass: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
                  items: [
                    {
                      title: "Next.js",
                      descriptor: "React Framework",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-zinc-900 dark:text-white fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.83 17.89l-6.8-9.43v9.43H9.41V6.11h1.62l6.8 9.43V6.11h1.62v11.78h-1.62z" />
                        </svg>
                      ),
                    },
                    {
                      title: "React",
                      descriptor: "UI Library",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-[#00D8FF]" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <ellipse rx="11" ry="4.2" />
                          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                          <circle r="2" fill="currentColor" />
                        </svg>
                      ),
                    },
                    {
                      title: "TypeScript",
                      descriptor: "Type Safety",
                      icon: (
                        <svg className="w-4.5 h-4.5 rounded" viewBox="0 0 24 24" fill="none">
                          <rect width="24" height="24" rx="4" fill="#3178C6" />
                          <text x="4.5" y="17" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">TS</text>
                        </svg>
                      ),
                    },
                    {
                      title: "JavaScript (ES6+)",
                      descriptor: "Programming Language",
                      icon: (
                        <svg className="w-4.5 h-4.5 rounded" viewBox="0 0 24 24" fill="none">
                          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
                          <text x="5" y="17" fill="#000000" fontSize="13" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">JS</text>
                        </svg>
                      ),
                    },
                    {
                      title: "Tailwind CSS",
                      descriptor: "Utility-first CSS",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-[#38BDF8] fill-current" viewBox="0 0 24 24">
                          <path d="M12 6.5c-2.8 0-4.9 1.4-6.3 4.2 2.1-2.1 4.2-2.8 6.3-2.1 1.2.4 2 1.3 3 2.3 1.5 1.5 3.3 3.3 6.6 3.3 2.8 0 4.9-1.4 6.3-4.2-2.1 2.1-4.2 2.8-6.3 2.1-1.2-.4-2-1.3-3-2.3-1.5-1.5-3.3-3.3-6.6-3.3zM5.4 13c-2.8 0-4.9 1.4-6.3 4.2 2.1-2.1 4.2-2.8 6.3-2.1 1.2.4 2 1.3 3 2.3 1.5 1.5 3.3 3.3 6.6 3.3 2.8 0 4.9-1.4 6.3-4.2-2.1 2.1-4.2 2.8-6.3 2.1-1.2-.4-2-1.3-3-2.3-1.5-1.5-3.3-3.3-6.6-3.3z" />
                        </svg>
                      ),
                    },
                    {
                      title: "Variable Fonts",
                      descriptor: "Custom Typography",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M3.5 19L8 5L12.5 19M5 14.5H11" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M13.5 19L17 9L20.5 19M14.5 15.5H19.5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ),
                    },
                    {
                      title: "HTML5",
                      descriptor: "Markup Language",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-[#E34F26] fill-current" viewBox="0 0 24 24">
                          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.433 4.41l.707 7.962h10.457l-.372 4.156-4.225 1.15-4.225-1.15-.27-3.028H5.111l.465 5.568 6.424 1.781 6.425-1.781.859-9.338H8.531z" />
                        </svg>
                      ),
                    },
                    {
                      title: "CSS3",
                      descriptor: "Styling Language",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-[#1572B6] fill-current" viewBox="0 0 24 24">
                          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.245 2.625 10.635.003-.277 3.03H6.012l.245 2.625h9.873l-.48 5.253-3.65 1.01-3.65-1.01-.233-2.625H5.72l.417 4.838 5.863 1.625 5.863-1.625 1.144-12.89z" />
                        </svg>
                      ),
                    },
                  ],
                },
                {
                  category: "Edge & Cloud Infrastructure",
                  icon: <Cloud className="w-4 h-4 text-sky-500 dark:text-sky-400" />,
                  gridClass: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                  items: [
                    {
                      title: "Cloudflare Workers",
                      descriptor: "Edge Runtime",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-[#F38020] fill-current" viewBox="0 0 24 24">
                          <path d="M18.3 12.3c-.2-2.3-2.1-4.1-4.5-4.1-1.7 0-3.2.9-4 2.3-.4-.1-.8-.2-1.3-.2-2.2 0-4 1.8-4 4 0 .3 0 .5.1.8C2.9 15.6 1.5 17.2 1.5 19.1c0 2.2 1.8 3.9 4 3.9h12.8c2.6 0 4.7-2.1 4.7-4.7 0-2.3-1.6-4.2-3.7-4.6-.2-.7-.5-1-1-1.4z" />
                        </svg>
                      ),
                    },
                    {
                      title: "Vercel / Cloudflare Pages",
                      descriptor: "Hosting & Deployment",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-zinc-900 dark:text-white fill-current" viewBox="0 0 24 24">
                          <path d="M12 1L24 22H0L12 1Z" />
                        </svg>
                      ),
                    },
                    {
                      title: "Git / GitHub",
                      descriptor: "Version Control",
                      icon: (
                        <svg className="w-4.5 h-4.5 text-zinc-900 dark:text-white fill-current" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      ),
                    },
                  ],
                },
                {
                  category: "UI/UX Design & Craftsmanship",
                  icon: <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
                  gridClass: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
                  items: [
                    {
                      title: "Figma",
                      descriptor: "UI/UX Design",
                      icon: (
                        <svg className="w-4.5 h-4.5" viewBox="0 0 38 57" fill="none">
                          <path d="M19 0a9.5 9.5 0 0 0-9.5 9.5 9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 19 0z" fill="#F24E1E" />
                          <path d="M9.5 19a9.5 9.5 0 0 0 0 19h9.5V19H9.5z" fill="#A259FF" />
                          <path d="M19 19h9.5a9.5 9.5 0 0 0 0-19H19v19z" fill="#FF7262" />
                          <path d="M19 38h9.5a9.5 9.5 0 0 0 0-19H19v19z" fill="#1ABC9C" />
                          <path d="M9.5 38a9.5 9.5 0 0 0 9.5 9.5V38H9.5z" fill="#18A0FB" />
                        </svg>
                      ),
                    },
                    {
                      title: "Micro-interactions",
                      descriptor: "Delightful Animations",
                      icon: <Zap className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" />,
                    },
                    {
                      title: "CSS-first Responsive",
                      descriptor: "Mobile WebView Optimized",
                      icon: <MonitorSmartphone className="w-4.5 h-4.5 text-indigo-500" />,
                    },
                    {
                      title: "GPU Acceleration",
                      descriptor: "Performance Tweaks",
                      icon: <Cpu className="w-4.5 h-4.5 text-emerald-500" />,
                    },
                  ],
                },
                {
                  category: "Web Standards & SEO",
                  icon: <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                  gridClass: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
                  items: [
                    {
                      title: "Schema.org JSON-LD",
                      descriptor: "Structured Data",
                      icon: <Braces className="w-4.5 h-4.5 text-blue-500" />,
                    },
                    {
                      title: "Responsive Design",
                      descriptor: "All Screen Sizes",
                      icon: <Maximize2 className="w-4.5 h-4.5 text-violet-500" />,
                    },
                    {
                      title: "Cross-browser",
                      descriptor: "Consistent Experience",
                      icon: <Compass className="w-4.5 h-4.5 text-rose-500" />,
                    },
                    {
                      title: "SEO Best Practices",
                      descriptor: "Visibility & Performance",
                      icon: <TrendingUp className="w-4.5 h-4.5 text-teal-500" />,
                    },
                  ],
                },
              ].map((cat) => (
                <div key={cat.category} className="flex flex-col w-full">
                  {/* Category Header - Full-width Row */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center justify-center shrink-0 shadow-2xs">
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-xs tracking-wider text-zinc-700 dark:text-zinc-200 uppercase">
                      {cat.category}
                    </h3>
                  </div>

                  {/* Responsive Grid for Category Items */}
                  <div className={cat.gridClass}>
                    {cat.items.map((item) => (
                      <div
                        key={item.title}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.descriptor}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Callout Banner */}
            <div className="mt-8 w-full bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-zinc-900 dark:to-zinc-900 border border-blue-100 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                &ldquo;I combine modern technologies with clean design and web standards to build products that are fast, accessible, and built to scale.&rdquo;
              </p>
            </div>
          </section>

          <button
            onClick={() => setIsResumeVisible(true)}
            className="mb-14 flex items-center gap-2.5 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm mx-auto"
          >
            <FileText className="w-4.5 h-4.5" />
            View Full Resume
          </button>

          <div className="w-full max-w-3xl mb-16 space-y-8">
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

          <div className="w-full max-w-3xl mb-16 space-y-8">
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

          <div className="w-full max-w-3xl pl-8 mb-6 h-auto">
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
