import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Printer,
  MoreVertical,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Globe,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  User,
  Check,
  MapPin,
  Phone,
  Eye,
  Copy,
  X,
} from "lucide-react";

interface ResumeAppProps {
  onOpenApp?: (appId: any) => void;
}

export const ResumeApp: React.FC<ResumeAppProps> = ({}) => {
  const pdfPath = "/Shrawan_karki_CV.pdf";

  // Navigation & Active Section
  const [activeSection, setActiveSection] = useState<
    | "overview"
    | "experience"
    | "skills"
    | "education"
    | "projects"
    | "certifications"
  >("overview");
  const [viewMode, setViewMode] = useState<"dashboard" | "pdf">("dashboard");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<{
    title: string;
    image: string;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "certifications", label: "Certifications", icon: Award },
  ] as const;

  // Contact Data
  const contact = {
    name: "SHRAWAN KARKI",
    headline: "Full Stack Web Developer | UI/UX-Focused Engineer",
    location: "Budhiganga 3, Morang, Nepal",
    phone: "+977 9700511314",
    email: "pratyushkarki6@gmail.com",
    portfolio: "https://shrawankarki.com.np",
    portfolioDisplay: "shrawankarki.com.np",
    github: "https://github.com/frontend-fuchhey",
    githubDisplay: "github.com/frontend-fuchhey",
    linkedin: "https://www.linkedin.com/in/shrawan-karki-187706428/",
    linkedinDisplay: "in/shrawan-karki",
  };

  // Skill Groups
  const skillGroups = [
    {
      title: "Frontend & Frameworks",
      skills: [
        "Next.js",
        "React.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "Tailwind CSS",
        "Framer Motion",
        "HTML5",
        "CSS3",
        "Responsive UI/UX Design",
      ],
    },
    {
      title: "Backend & Databases",
      skills: [
        "Node.js",
        "Express",
        "Supabase",
        "PostgreSQL",
        "Firebase",
        "Firestore",
        "Authentication",
        "RESTful APIs",
      ],
    },
    {
      title: "UI/UX Design",
      skills: ["Figma", "Balsamiq"],
    },
    {
      title: "Cloud & Tools",
      skills: [
        "Cloudflare Workers",
        "Vercel",
        "Cloudflare Pages",
        "Git",
        "GitHub",
        "Vite",
        "VS Code",
      ],
    },
    {
      title: "Security & Architecture",
      skills: [
        "Input Sanitization",
        "Modular Component Architecture",
        "Database Schema Design",
      ],
    },
  ];

  // Work Experience
  const experiences = [
    {
      title: "Frontend Developer",
      company: "Rato Topi IT Team",
      period: "Aug 2026 — Present",
      current: true,
      description:
        "Architected modern frontend systems using React and TypeScript, optimizing performance and scalability. Led the development of a complex OS-style portfolio platform with interactive window management.",
      highlights: [
        "Designed modular windowing architecture with draggable and resizable state orchestration.",
        "Engineered responsive layouts seamlessly transitioning between desktop and mobile viewport dynamics.",
        "Implemented strict performance budgets and lazy-loaded asset streaming.",
      ],
    },
    {
      title: "Freelance Developer",
      company: "Self-Employed",
      period: "2025 — 2026",
      current: false,
      description:
        "Delivered high-quality web solutions for diverse clients globally. Focused on responsive design, performance optimization, and clean architectural principles.",
      highlights: [
        "Built full-stack applications with integrated Supabase authentication and database rules.",
        "Delivered pixel-perfect interfaces directly converted from Figma prototypes.",
      ],
    },
  ];

  // Education
  const educationList = [
    {
      degree: "BSc (Hons) Computing",
      institution: "Itahari International College",
      period: "2081 — Present",
      status: "Ongoing",
      detail:
        "Focused on Software Engineering, Database Systems, and Modern Web Architectures.",
      link: "https://iic.edu.np/",
    },
    {
      degree: "+2 Science",
      institution: "Arniko College, Biratnagar",
      period: "2079 — 2081",
      status: "Completed",
      detail:
        "Achieved excellence with specialization in Mathematics and Computer Science.",
      certId: "cert-class12",
      certImage: "./certificates/class12.jpg",
      certTitle: "+2 Science Certificate (Class 12)",
    },
    {
      degree: "SEE (Schooling)",
      institution: "Arniko Secondary School, Biratnagar",
      period: "Completed 2079",
      status: "Completed",
      detail:
        "Foundational education with focus on STEM subjects and computer fundamentals.",
      certId: "cert-class10",
      certImage: "./certificates/class10.jpg",
      certTitle: "SEE Certificate (Class 10)",
    },
  ];

  // Featured Projects
  const featuredProjects = [
    {
      title: "GarmentFlow",
      subtitle: "Specialized ERP Platform for Garment Manufacturers",
      description:
        "Custom enterprise system managing raw material purchasing, sales revenue, dynamic split-flow VAT compliance, inventory utilization, and in-place invoice grouping.",
      tech: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"],
      github: "https://github.com/Frontend-fuchhey/Garment-flow",
      live: "https://garment-flow.app",
    },
    {
      title: "Shrawan OS",
      subtitle: "macOS & Mobile Dual-Mode Interactive Portfolio",
      description:
        "Interactive desktop operating system environment simulating window layering, dock behavior, live terminal commands, custom app launcher, and native responsiveness.",
      tech: ["React", "TypeScript", "Framer Motion", "Tailwind CSS"],
      github: "https://github.com/Frontend-fuchhey/Personal-Portfolio",
      live: "https://shrawankarki.com.np",
    },
    {
      title: "Resume.io",
      subtitle: "Automatic Technical Resume Builder",
      description:
        "High-impact resume creation engine hosted on Cloudflare Workers edge network featuring real-time layout preview, ATS compliance, and instant export.",
      tech: ["React", "TypeScript", "Cloudflare Workers", "Tailwind CSS"],
      github: "https://github.com/Frontend-fuchhey/resume.io",
      live: "https://resume-io.pratyushkarki6.workers.dev/",
    },
  ];

  // Certifications
  const certifications = [
    {
      id: "cert-class12",
      title: "Class 12 Certificate (+2 Science)",
      issuer: "National Examinations Board (NEB)",
      institution: "Arniko College, Biratnagar",
      year: "2081",
      image: "./certificates/class12.jpg",
    },
    {
      id: "cert-class10",
      title: "Secondary Education Examination (SEE)",
      issuer: "Government of Nepal Examination Board",
      institution: "Arniko Secondary School, Biratnagar",
      year: "2079",
      image: "./certificates/class10.jpg",
    },
  ];

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId as any);
    if (viewMode === "pdf") {
      setViewMode("dashboard");
      setTimeout(() => {
        performScroll(sectionId);
      }, 50);
    } else {
      performScroll(sectionId);
    }
  };

  const performScroll = (sectionId: string) => {
    const el = document.getElementById(`resume-sec-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll spy to update active section automatically
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || viewMode === "pdf") return;

    const handleScroll = () => {
      const sections = navItems.map((item) =>
        document.getElementById(`resume-sec-${item.id}`),
      );
      const scrollPos = container.scrollTop + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id as any);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [viewMode]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans select-text overflow-hidden">
      {/* 1. Application Toolbar Header */}
      <div className="shrink-0 h-11 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-20">
        {/* Left: Document Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight flex items-center gap-1.5">
              Shrawan_karki_CV.pdf
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              PDF Document
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Mode Segmented Control */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/70 dark:border-slate-700 text-[11px] font-medium mr-1">
            <button
              onClick={() => setViewMode("dashboard")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === "dashboard"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                viewMode === "pdf"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              }`}
            >
              <Eye className="w-3 h-3" />
              View PDF
            </button>
          </div>

          {/* Download PDF Button */}
          <a
            href={pdfPath}
            download="Shrawan_karki_CV.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-xs active:scale-95 cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Download PDF</span>
          </a>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition text-xs flex items-center gap-1.5 cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* More / Options Button */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <div
                className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg py-1.5 z-50 text-xs"
                onClick={() => setShowMoreMenu(false)}
              >
                <button
                  onClick={() =>
                    setViewMode(viewMode === "dashboard" ? "pdf" : "dashboard")
                  }
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  {viewMode === "dashboard"
                    ? "Switch to Raw PDF"
                    : "Switch to Dashboard"}
                </button>
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Open PDF in New Tab
                </a>
                <button
                  onClick={() =>
                    copyToClipboard(
                      window.location.origin + pdfPath,
                      "PDF Link",
                    )
                  }
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Copy Resume Link
                </button>
                <button
                  onClick={() => copyToClipboard(contact.email, "Email")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Copy Email Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy notification popup */}
      {copiedText && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span>{copiedText} copied to clipboard!</span>
        </div>
      )}

      {/* Mobile Horizontal Navigation Header */}
      <div className="md:hidden shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-3 py-2 overflow-x-auto flex items-center gap-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeSection === item.id && viewMode === "dashboard";
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/60"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Body: Two-Column / PDF Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === "pdf" ? (
          /* Raw PDF Embedded Viewport */
          <div className="w-full h-full bg-slate-900 flex flex-col">
            <iframe
              src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
              title="Shrawan Karki CV"
              className="w-full h-full border-none"
            />
          </div>
        ) : (
          /* Dashboard Layout */
          <>
            {/* 2. Left Sidebar */}
            <aside className="hidden md:flex w-51.25 lg:w-55 shrink-0 flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 p-3.5 justify-between select-none">
              <div className="space-y-4">
                {/* Profile Brief */}
                <div className="px-2 pt-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      SK
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </div>
                  </div>
                  <h1 className="text-xs font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    SHRAWAN KARKI
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Full Stack Web Developer
                  </p>
                </div>

                <div className="h-px bg-slate-200/60 dark:bg-slate-800" />

                {/* Navigation Items */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-[10px] transition-all text-left group cursor-pointer ${
                          isActive
                            ? "bg-blue-50/90 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          }`}
                        />
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom: Let's Connect */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
                  Let&apos;s Connect
                </p>
                <div className="grid grid-cols-4 gap-1 px-1">
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center transition group cursor-pointer"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center transition group cursor-pointer"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center transition group cursor-pointer"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href={contact.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center transition group cursor-pointer"
                    title="Portfolio"
                  >
                    <Globe className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* 3. Main Scrollable Dashboard Area */}
            <main
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-8 scroll-smooth"
            >
              {/* Profile Header with subtle blue gradient accent */}
              <section
                id="resume-sec-overview"
                className="relative overflow-hidden rounded-2xl border border-blue-100/80 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900/40 p-5 sm:p-7 shadow-xs"
              >
                {/* Subtle ambient gradient accent */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-900/40 border border-blue-200/60 dark:border-blue-800/50 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                      <span>Curriculum Vitae</span>
                      <span className="w-1 h-1 rounded-full bg-blue-500" />
                      <span>Updated 2026</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                      {contact.name}
                    </h1>

                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 leading-snug">
                      {contact.headline}
                    </p>

                    {/* Contact Details */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* External Links */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                    <a
                      href={contact.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition group cursor-pointer"
                    >
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition group cursor-pointer"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition group cursor-pointer"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </section>

              {/* Professional Summary Card */}
              <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Professional Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Full Stack Web Developer with hands-on experience building
                  production-grade React applications and end-to-end systems
                  using Node.js, Supabase, and Firebase. Combines precise UI/UX
                  execution — translating Figma designs into pixel-accurate,
                  responsive components — with backend proficiency in database
                  schema design, authentication, and secure API integration.
                </p>
              </section>

              {/* Technical Skills Section */}
              <section id="resume-sec-skills" className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                    <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Technical Skills</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Organized by specialization
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {skillGroups.map((group, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition ${
                        group.title === "Frontend & Frameworks"
                          ? "md:col-span-2"
                          : ""
                      }`}
                    >
                      <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center justify-between">
                        <span>{group.title}</span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {group.skills.length} skills
                        </span>
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/80 hover:-translate-y-0.5 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xs transition-all cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Work Experience Section (Vertical Timeline) */}
              <section id="resume-sec-experience" className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Work Experience</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Node */}
                      <span
                        className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-950 flex items-center justify-center transition-transform group-hover:scale-125 ${
                          exp.current
                            ? "border-blue-600 dark:border-blue-400"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            exp.current
                              ? "bg-blue-600 dark:bg-blue-400"
                              : "bg-slate-400"
                          }`}
                        />
                      </span>

                      {/* Experience Card */}
                      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-5 shadow-xs hover:shadow-sm hover:border-blue-200 dark:hover:border-blue-900/40 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            {exp.title}
                          </h2>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md w-fit ${
                              exp.current
                                ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {exp.period}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                          {exp.company}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                          {exp.description}
                        </p>

                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                            {exp.highlights.map((h, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="leading-normal">{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section id="resume-sec-education" className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Academic Foundation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {educationList.map((edu, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-xs hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              edu.status === "Ongoing"
                                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50"
                                : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
                            }`}
                          >
                            {edu.status}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {edu.period}
                          </span>
                        </div>

                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {edu.degree}
                        </h2>

                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {edu.institution}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                          {edu.detail}
                        </p>
                      </div>

                      {"certImage" in edu && edu.certImage && (
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() =>
                              setActiveCertificate({
                                title: edu.certTitle || edu.degree,
                                image: edu.certImage!,
                              })
                            }
                            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700 text-xs font-medium transition cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-blue-500" />
                            <span>View Certificate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects Section */}
              <section id="resume-sec-projects" className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                    <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Featured Projects</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Production & Open Source
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {featuredProjects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            {proj.title}
                          </h2>
                          <div className="flex items-center gap-1">
                            {proj.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="View Repository"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {proj.live && (
                              <a
                                href={proj.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                          {proj.subtitle}
                        </p>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                        {proj.tech.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications Section */}
              <section id="resume-sec-certifications" className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Verified Certifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-xs flex items-center justify-between gap-3 hover:border-blue-200 dark:hover:border-blue-900/40 transition"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Year {cert.year}
                        </span>
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {cert.title}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {cert.issuer} • {cert.institution}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setActiveCertificate({
                            title: cert.title,
                            image: cert.image,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bottom Document Footer */}
              <div className="pt-6 pb-2 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Shrawan Karki — Curriculum Vitae</span>
                <span className="flex items-center gap-1.5">
                  <span>Built with React, TypeScript & Tailwind CSS</span>
                  <span>•</span>
                  <a
                    href={pdfPath}
                    download="Shrawan_karki_CV.pdf"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download Original PDF
                  </a>
                </span>
              </div>
            </main>
          </>
        )}
      </div>

      {/* Certificate Lightbox Modal */}
      {activeCertificate && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveCertificate(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                {activeCertificate.title}
              </h3>
              <button
                onClick={() => setActiveCertificate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-h-[70vh] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2">
              <img
                src={activeCertificate.image}
                alt={activeCertificate.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setActiveCertificate(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeApp;
