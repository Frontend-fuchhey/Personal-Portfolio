import { Github, Linkedin, Mail, Globe, ArrowLeft, Download, X } from "lucide-react";

export function ResumeView({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {

  const name = "Shrawan Karki";
  const title = "Frontend Developer | UI/UX Designer";
  const contact = {
    email: "pratyushkarki6@gmail.com",
    location: "Morang, Nepal",
    github: "github.com/frontend-fuchhey",
    linkedin: "Shrawan Karki",
    portfolio: "shrawankarki.com.np"
  };

  const skills = [
    { category: "Frontend", items: ["React", "javascript", "html", "css", "Tailwind CSS", "Next.js", "Framer Motion", "Three.js"] },
    { category: "Tools", items: ["Figma", "Git"] }
  ];

  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "Rato topi Inc.",
      range: "2026 – Now",
      achievement: "Architected modern frontend systems using React and TypeScript, optimizing performance and scalability. Led the development of a complex OS-style portfolio platform with interactive window management."
    },
    {
      title: "Freelance Developer",
      company: "Self-Employed",
      range: "2025 – 2026",
      achievement: "Delivered high-quality web solutions for diverse clients globally. Focused on responsive design, performance optimization, and clean architectural principles."
    }
  ];

  const education = [
    {
      degree: "BSc (Hons) Computing",
      institution: "Itahari International College",
      year: "2081 - Present",
      detail: "Focused on Software Engineering and Modern Web Architectures."
    },
    {
      degree: "+2 Science",
      institution: "Arniko College, Biratnagar",
      year: "2079 - 2081",
      detail: "Achieved excellence in Mathematics and Computer Science."
    },
    {
      degree: "SEE (Schooling)",
      institution: "Arniko Secondary School, Biratnagar",
      year: "Completed 2079",
      detail: "Foundational education with focus on STEM subjects."
    }
  ];

  const languages = ["English (Professional)", "Nepali (Native)", "Hindi (Fluent)"];

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <div className={`absolute inset-0 w-full h-full bg-[#f9fafb] dark:bg-[#111827] font-sans flex flex-col overflow-hidden ${isMobile ? 'mobile-content-shift' : ''}`}
      style={{ color: '#111827' }}>

      {/* Sticky Control Bar */}
      <div className="sticky top-0 z-50 w-full h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {onClose && (
            <div className="flex items-center mr-2">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors flex items-center justify-center group cursor-pointer border-0 p-0"
                title="Close"
              >
                <X className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          )}
          {onBack && !isMobile && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hidden sm:block">Digital Resume</h2>
        </div>
        <a
          href="./Shrawan_Karki_CV.pdf"
          download="Shrawan_Karki_CV.pdf"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all font-bold text-sm shadow-md active:scale-95"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>

      {/* Scrollable Area */}
      <div
        className="overflow-y-auto overflow-x-hidden px-4 md:px-8 py-8 md:p-12 custom-scrollbar bg-[#f1f5f9] dark:bg-[#020617]"
        style={{
          height: 'calc(100% - 60px)',
          maxHeight: 'calc(100% - 60px)',
          overflowY: 'auto',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Resume Container (The Paper) */}
        <div
          id="resume-content"
          className="relative max-w-[850px] mx-auto shadow-2xl rounded-sm flex flex-col md:flex-row h-auto"
          style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', color: '#111827' }}
        >
          {/* Left Column (30%) */}
          <div className="w-full md:w-[240px] flex-shrink-0 p-8 pb-20"
            style={{ backgroundColor: '#f9fafb', borderRight: '1px solid #f3f4f6' }}>
            <div className="space-y-10">
              {/* Contact Info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
                  style={{ color: '#2563eb' }}>Contact</h3>
                <ul className="space-y-4 text-[11px]">
                  <li className="flex items-center gap-3" style={{ color: '#4b5563' }}>
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                    <span className="break-all whitespace-normal text-xs">{contact.email}</span>
                  </li>
                  <li className="flex items-center gap-3" style={{ color: '#4b5563' }}>
                    <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                    <span>{contact.portfolio}</span>
                  </li>
                  <li className="flex items-start gap-3" style={{ color: '#4b5563' }}>
                    <Github className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#9ca3af' }} />
                    <span className="break-all whitespace-normal">{contact.github}</span>
                  </li>
                  <li className="flex items-start gap-3" style={{ color: '#4b5563' }}>
                    <Linkedin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#9ca3af' }} />
                    <span className="break-all whitespace-normal">{contact.linkedin}</span>
                  </li>
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
                  style={{ color: '#2563eb' }}>Skills</h3>
                <div className="space-y-5">
                  {skills.map((skill, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: '#9ca3af' }}>{skill.category}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.items.map((item, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#374151' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
                  style={{ color: '#2563eb' }}>Languages</h3>
                <ul className="space-y-2 text-sm" style={{ color: '#4b5563' }}>
                  {languages.map((lang, i) => (
                    <li key={i}>{lang}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (70%) */}
          <div className="flex-1 p-8 md:p-12 pb-32" style={{ backgroundColor: '#ffffff' }}>
            {/* Header */}
            <div className="pb-8 mb-10" style={{ borderBottom: '2px solid #f3f4f6' }}>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 uppercase break-words leading-none"
                style={{ color: '#111827' }}>
                {name}
              </h1>
              <h2 className="text-base md:text-lg font-bold tracking-wide leading-tight"
                style={{ color: '#2563eb' }}>
                {title}
              </h2>
            </div>

            <div className="space-y-12">
              {/* Summary */}
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3"
                  style={{ color: '#111827' }}>
                  <span className="w-8 h-[2px]" style={{ backgroundColor: '#3b82f6' }}></span>
                  Summary
                </h3>
                <p className="text-[15px] leading-relaxed italic" style={{ color: '#4b5563' }}>
                  Architecting modern frontend systems using React and TypeScript, optimizing performance and scalability. I build immersive digital experiences that live at the intersection of design and technology.
                </p>
              </section>

              {/* Experience */}
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3"
                  style={{ color: '#111827' }}>
                  <span className="w-8 h-[2px]" style={{ backgroundColor: '#3b82f6' }}></span>
                  Experience
                </h3>
                <div className="space-y-8">
                  {experiences.map((exp, i) => (
                    <div key={i} className="relative pl-4" style={{ borderLeft: '2px solid #f3f4f6' }}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-base leading-tight" style={{ color: '#111827' }}>{exp.title}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap"
                          style={{ color: '#2563eb', backgroundColor: '#eff6ff' }}>{exp.range}</span>
                      </div>
                      <p className="text-xs font-bold mb-3 uppercase tracking-tight" style={{ color: '#9ca3af' }}>{exp.company}</p>
                      <p className="text-[14px] leading-relaxed" style={{ color: '#4b5563' }}>• {exp.achievement}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3"
                  style={{ color: '#111827' }}>
                  <span className="w-8 h-[2px]" style={{ backgroundColor: '#3b82f6' }}></span>
                  Education
                </h3>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-base leading-tight" style={{ color: '#111827' }}>{edu.degree}</h4>
                        <p className="text-sm font-bold" style={{ color: '#6b7280' }}>{edu.institution}</p>
                        <p className="text-[12px] italic mt-1" style={{ color: '#9ca3af' }}>{edu.detail}</p>
                      </div>
                      <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: '#9ca3af' }}>{edu.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
