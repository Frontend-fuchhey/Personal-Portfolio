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
      const scrollPos = container.scrollTop + 80;

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
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans select-text overflow-hidden">
      {/* 1. Simplified Native Document Toolbar (Height ~56px) */}
      <div className="shrink-0 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/70 dark:border-slate-800 px-4 sm:px-5 flex items-center justify-between z-20">
        {/* Left: Document Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
              Shrawan_karki_CV.pdf
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
              PDF Document
            </span>
          </div>
        </div>

        {/* Right: Actions (Download PDF, Print, More) */}
        <div className="flex items-center gap-2">
          {/* Subtle View Mode Toggle */}
          {viewMode === "dashboard" ? (
            <button
              onClick={() => setViewMode("pdf")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-medium transition cursor-pointer"
              title="View raw PDF document"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">View PDF</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode("dashboard")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 text-xs font-medium transition cursor-pointer"
              title="Switch to designed document view"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Document View</span>
            </button>
          )}

          {/* Download PDF Button */}
          <a
            href={pdfPath}
            download="Shrawan_karki_CV.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition active:scale-95 cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Download PDF</span>
          </a>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition text-xs font-medium flex items-center gap-1.5 cursor-pointer"
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
                className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs"
                onClick={() => setShowMoreMenu(false)}
              >
                <button
                  onClick={() =>
                    setViewMode(viewMode === "dashboard" ? "pdf" : "dashboard")
                  }
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  {viewMode === "dashboard" ? "View Raw PDF" : "View Document"}
                </button>
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center gap-2 text-slate-700 dark:text-slate-200"
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
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Copy Resume Link
                </button>
                <button
                  onClick={() => copyToClipboard(contact.email, "Email")}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
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
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{copiedText} copied to clipboard!</span>
        </div>
      )}

      {/* Mobile Horizontal Navigation Header */}
      <div className="md:hidden shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/70 dark:border-slate-800 px-3 py-2 overflow-x-auto flex items-center gap-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeSection === item.id && viewMode === "dashboard";
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold"
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
          /* Native Document Layout */
          <>
            {/* 2. Narrow Left Sidebar (~190px) */}
            <aside className="hidden md:flex w-[185px] lg:w-48.75 shrink-0 flex-col bg-slate-50/70 dark:bg-slate-900/60 border-r border-slate-200/70 dark:border-slate-800/80 p-3 justify-between select-none">
              <div className="space-y-3">
                <div className="px-2 pt-1 pb-0.5">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Document
                  </span>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-0.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors text-left cursor-pointer ${
                          isActive
                            ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-medium"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 transition-colors ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom: LET'S CONNECT */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
                  LET&apos;S CONNECT
                </p>
                <div className="flex items-center gap-1 px-1">
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={contact.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="Portfolio"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* 3. Main Typeset Document Area (Max width ~740px) */}
            <main
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950 p-6 sm:p-10 lg:p-12 scroll-smooth"
            >
              <div className="max-w-[740px] mx-auto space-y-8">
                {/* Profile Header (No floating card, dark navy title, subtle divider) */}
                <header
                  id="resume-sec-overview"
                  className="pb-6 border-b border-slate-200/80 dark:border-slate-800/80"
                >
                  <h1 className="text-3xl sm:text-[34px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
                    {contact.name}
                  </h1>

                  <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 font-normal mt-1.5">
                    {contact.headline}
                  </p>

                  {/* Contact Metadata */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 pt-3 text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.location}</span>
                    </span>
                    <span>&bull;</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {contact.phone}
                    </a>
                    <span>&bull;</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>

                  {/* External Links */}
                  <div className="flex items-center gap-4 pt-3 text-[13px] font-medium text-blue-600 dark:text-blue-400">
                    <a
                      href={contact.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3 text-blue-500/80" />
                    </a>
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-blue-500/80" />
                    </a>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-blue-500/80" />
                    </a>
                  </div>
                </header>

                {/* Professional Summary */}
                <section className="space-y-2.5">
                  <h2 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Professional Summary
                  </h2>
                  <p className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                    Full Stack Web Developer with hands-on experience building
                    production-grade React applications and end-to-end systems
                    using Node.js, Supabase, and Firebase. Combines precise
                    UI/UX execution — translating Figma designs into
                    pixel-accurate, responsive components — with backend
                    proficiency in database schema design, authentication, and
                    secure API integration.
                  </p>
                </section>

                {/* Technical Skills */}
                <section id="resume-sec-skills" className="space-y-4 pt-2">
                  <h2 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
                    Technical Skills
                  </h2>

                  <div className="space-y-3.5">
                    {skillGroups.map((group, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <h3 className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                          {group.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {group.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-[8px] text-[12px] font-normal bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shadow-none cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Work Experience (Simple Timeline, No Heavy Cards) */}
                <section id="resume-sec-experience" className="space-y-4 pt-2">
                  <h2 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
                    Work Experience
                  </h2>

                  <div className="relative pl-5 space-y-6 border-l border-slate-200 dark:border-slate-800 ml-1.5">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline node */}
                        <span
                          className={`absolute -left-[24.5px] top-1.5 w-2 h-2 rounded-full ${
                            exp.current
                              ? "bg-blue-600 dark:bg-blue-400 ring-4 ring-blue-50 dark:ring-blue-950"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />

                        <div className="space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 dark:text-white">
                              {exp.title}
                            </h3>
                            <span className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                              {exp.period}
                            </span>
                          </div>

                          <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
                            {exp.company}
                          </p>

                          <p className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                            {exp.description}
                          </p>

                          {exp.highlights && exp.highlights.length > 0 && (
                            <ul className="space-y-1 text-[13px] text-slate-600 dark:text-slate-400 pt-1">
                              {exp.highlights.map((h, hIdx) => (
                                <li
                                  key={hIdx}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-blue-600 dark:text-blue-400 select-none mt-0.5">
                                    •
                                  </span>
                                  <span className="leading-relaxed">{h}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section id="resume-sec-education" className="space-y-4 pt-2">
                  <h2 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
                    Education
                  </h2>

                  <div className="space-y-5">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                            {edu.degree}
                          </h3>
                          <span className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                            {edu.period}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400">
                          <span>{edu.institution}</span>
                          {edu.status && (
                            <>
                              <span>&bull;</span>
                              <span className="text-[12px] text-slate-500">
                                {edu.status}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {edu.detail}
                        </p>

                        {"certImage" in edu && edu.certImage && (
                          <div className="pt-1">
                            <button
                              onClick={() =>
                                setActiveCertificate({
                                  title: edu.certTitle || edu.degree,
                                  image: edu.certImage!,
                                })
                              }
                              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer pt-0.5"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Projects */}
                <section id="resume-sec-projects" className="space-y-4 pt-2">
                  <h2 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
                    Projects
                  </h2>

                  <div className="space-y-5">
                    {featuredProjects.map((proj, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{proj.title}</span>
                            <span className="text-slate-400 font-normal text-xs">
                              &bull;
                            </span>
                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                              {proj.subtitle}
                            </span>
                          </h3>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {proj.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                title="View Code"
                              >
                                <span>Code</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {proj.live && (
                              <a
                                href={proj.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                title="Live Demo"
                              >
                                <span>Demo</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {proj.tech.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-[6px] text-[11px] font-normal bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Certifications */}
                <section
                  id="resume-sec-certifications"
                  className="space-y-4 pt-2"
                >
                  <h2 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-1.5 border-b border-slate-200/70 dark:border-slate-800">
                    Certifications
                  </h2>

                  <div className="space-y-3">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <h3 className="text-[14px] font-medium text-slate-900 dark:text-white">
                            {cert.title}
                          </h3>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400">
                            {cert.issuer} &bull; {cert.institution} ({cert.year}
                            )
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            setActiveCertificate({
                              title: cert.title,
                              image: cert.image,
                            })
                          }
                          className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0 cursor-pointer"
                        >
                          View Certificate
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Document Footer */}
                <div className="pt-6 pb-4 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>Curriculum Vitae &mdash; Shrawan Karki</span>
                  <a
                    href={pdfPath}
                    download="Shrawan_karki_CV.pdf"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download PDF Document
                  </a>
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {/* Certificate Lightbox Modal */}
      {activeCertificate && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveCertificate(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {activeCertificate.title}
              </h3>
              <button
                onClick={() => setActiveCertificate(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-h-[70vh] overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-2">
              <img
                src={activeCertificate.image}
                alt={activeCertificate.title}
                className="max-w-full max-h-[65vh] object-contain rounded shadow-xs"
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
