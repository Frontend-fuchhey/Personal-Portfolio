import { useState, useRef, useEffect, KeyboardEvent, ReactNode } from 'react';
import { AppId } from "../../types/os";
import { useIsMobile } from '../../hooks/use-mobile';

interface HistoryEntry {
  type: 'input' | 'output' | 'error' | 'success' | 'ai';
  text: string;
}

// Portfolio Knowledge Base for Conversational Fallbacks
const SHRAWAN_KNOWLEDGE = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'namaste'],
    response: "Namaste! I'm Shrawan Karki's AI terminal assistant. Ask me anything about Shrawan's skills, education, projects, or background!"
  },
  {
    keywords: ['who', 'about', 'bio', 'shrawan', 'pratyush', 'identity', 'yourself'],
    response: "Shrawan Karki (also known as Pratyush Karki) is a Frontend Developer & UI/UX Designer based in Nepal. He specializes in crafting interactive web environments, modern interfaces, and scalable React/Next.js applications."
  },
  {
    keywords: ['study', 'college', 'education', 'degree', 'university', 'itahari'],
    response: "Shrawan is an IT undergraduate student pursuing his degree at Itahari International College in Nepal, focusing on modern web software engineering."
  },
  {
    keywords: ['stack', 'tech', 'skills', 'technologies', 'tools', 'languages', 'react', 'tailwind'],
    response: "Shrawan's core tech stack includes React, Next.js, TypeScript, Tailwind CSS, JavaScript (ES6+), Schema.org JSON-LD, Cloudflare Workers, and modern UI/UX design tools like Figma."
  },
  {
    keywords: ['resume', 'cv', 'builder', 'resume.io'],
    response: "Check out Resume.io! It's an automated resume builder built by Shrawan hosted on Cloudflare Workers. Live URL: [https://resume-io.pratyushkarki6.workers.dev/](https://resume-io.pratyushkarki6.workers.dev/)"
  },
  {
    keywords: ['projects', 'work', 'built', 'portfolio', 'creations'],
    response: "Shrawan has built interactive web experiences including:\n1. Shrawan OS (Portfolio)\n2. Resume.io (Automatic Resume Builder)\n3. Rato Topi Technical Support Operations\nType 'projects' or open the Projects app to explore more!"
  },
  {
    keywords: ['contact', 'email', 'social', 'linkedin', 'github', 'instagram', 'reach', 'hire'],
    response: "You can connect with Shrawan across the web:\n- LinkedIn: [https://www.linkedin.com/in/shrawan-karki-187706428/](https://www.linkedin.com/in/shrawan-karki-187706428/)\n- GitHub: [https://github.com/frontend-fuchhey](https://github.com/frontend-fuchhey)\n- Instagram: @prasar_7"
  },
  {
    keywords: ['experience', 'work', 'job', 'role'],
    response: "Shrawan specializes in frontend engineering and UI/UX design, building highly responsive custom web applications, system dashboards, and interactive user experiences."
  }
];

const matchConversationalQuery = (input: string): string => {
  const lowerInput = input.toLowerCase().trim();

  for (const entry of SHRAWAN_KNOWLEDGE) {
    if (entry.keywords.some(kw => lowerInput.includes(kw))) {
      return entry.response;
    }
  }

  return `I'm Shrawan's AI terminal assistant. I can answer questions about his tech stack, college, projects, or background! Try asking "What's your tech stack?" or type "help" for CLI commands.`;
};

const COMMANDS: Record<string, string> = {
  help: `AVAILABLE COMMANDS:
  ABOUT / BIO → LEARN ABOUT SHRAWAN
  SKILLS      → LIST TECHNICAL SKILLS & STACK
  PROJECTS    → SEE RECENT PROJECTS
  CONTACT     → GET CONTACT INFORMATION
  SOCIALS     → FIND SOCIAL MEDIA LINKS
  EXPERIENCE  → WORK HISTORY
  WHOAMI      → WHO IS SHRAWAN?
  LS          → LIST DIRECTORIES & APPS
  DATE        → SHOW CURRENT DATE & TIME
  CLEAR       → CLEAR THE TERMINAL
  ECHO [TEXT] → PRINT TEXT

💡 NATURAL LANGUAGE AI ASSISTANT:
  You can also type any question directly! E.g.:
  • "Who are you?"
  • "What is your tech stack?"
  • "Where do you study?"
  • "Tell me about your projects"`,
  bio: `HI! I'M SHRAWAN KARKI 👨‍💻
━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE:     FRONTEND DEVELOPER & UI/UX DESIGNER
LOCATION: MORANG, NEPAL
STATUS:   OPEN TO OPPORTUNITIES
PASSION:  CRAFTING CLEAN, INTERACTIVE WEB EXPERIENCES`,
  about: `HI! I'M SHRAWAN KARKI 👨‍💻
━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE:     FRONTEND DEVELOPER & UI/UX DESIGNER
LOCATION: MORANG, NEPAL
STATUS:   OPEN TO OPPORTUNITIES
PASSION:  CRAFTING CLEAN, INTERACTIVE WEB EXPERIENCES`,
  skills: `TECHNICAL SKILLS:
━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND:  REACT, TYPESCRIPT, TAILWIND CSS, NEXT.JS
DESIGN:    FIGMA, FRAMER MOTION, THREE.JS
BACKEND:   CLOUDFLARE WORKERS, NODE.JS`,
  projects: `AVAILABLE PROJECTS:
1. GARMENT FLOW  -> SPECIALIZED ERP PLATFORM
2. SHRAWAN OS   -> MACOS-INSPIRED WEB PORTFOLIO
3. RESUME.IO    -> AUTOMATED RESUME BUILDER ON CLOUDFLARE
Type 'open projects' to view files.`,
  contact: `CONTACT INFO:
━━━━━━━━━━━━━━━━━━━━━━━━━
EMAIL:    pratyushkarki6@gmail.com
GITHUB:   github.com/frontend-fuchhey
LINKEDIN: linkedin.com/in/shrawan-karki-187706428/
TWITTER:  @shrawankarki
LOCATION: Morang, Nepal`,
  socials: `SOCIAL MEDIA:
━━━━━━━━━━━━━━━━━━━━━━━━━
🐙 GITHUB:    github.com/frontend-fuchhey
💼 LINKEDIN:  linkedin.com/in/shrawan-karki-187706428/
🐦 TWITTER:   @shrawankarki
📸 INSTAGRAM: @prasar_7`,
  experience: `WORK EXPERIENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━
2026–NOW  SENIOR FRONTEND DEVELOPER @ Rato topi Inc.
2025–2026 FREELANCE DEVELOPER @ SELF-EMPLOYED`,
  whoami: `SHRAWAN KARKI — FRONTEND DEVELOPER 👨‍💻
UID=1000(SHRAWAN) GID=1000(DEVELOPERS)
GROUPS=DEVELOPERS,DESIGNERS,AI-ASSISTANTS`,
  ls: `about/       projects/    resume/
contact/     photos/      settings/
tictactoe/   README.md`,
  date: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
};

function renderFormattedText(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {match[3]}
        </a>
      );
    }
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function TerminalApp({ onOpenApp }: { onOpenApp?: (appId: AppId) => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: `SHRAWAN OS TERMINAL V8.0.0 — AI ASSISTANT ENABLED` },
    { type: 'ai', text: `Namaste! I'm Shrawan's AI terminal assistant. Type 'help' for commands or ask me any question about Shrawan in natural language!` },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const [cmd, ...args] = lower.split(' ');
    const entries: HistoryEntry[] = [{ type: 'input', text: `$ ${raw}` }];

    if (cmd === 'clear') {
      setHistory([{ type: 'output', text: `SHRAWAN OS TERMINAL — TYPE 'HELP' FOR COMMANDS OR ASK ANY QUESTION.\n` }]);
      return;
    } else if (cmd === 'echo') {
      entries.push({ type: 'output', text: args.join(' ') || '' });
    } else if (cmd === 'date') {
      entries.push({ type: 'output', text: new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    } else if (cmd === 'open') {
      if (args[0] === 'projects') {
        entries.push({ type: 'success', text: 'Opening Projects File Explorer...' });
        onOpenApp?.('projects');
      } else if (args[0] === 'about' || args[0] === 'contact' || args[0] === 'photos' || args[0] === 'resume' || args[0] === 'settings' || args[0] === 'terminal' || args[0] === 'tictactoe') {
        entries.push({ type: 'success', text: `Opening ${args[0]} app...` });
        onOpenApp?.(args[0] as AppId);
      } else {
        entries.push({ type: 'error', text: 'Usage: open [about|projects|contact|photos|resume|settings|tictactoe]' });
      }
    } else if (COMMANDS[cmd]) {
      entries.push({ type: 'output', text: COMMANDS[cmd] });
    } else {
      // Natural language conversational intent matching
      const aiResponse = matchConversationalQuery(trimmed);
      entries.push({ type: 'ai', text: aiResponse });
    }

    setHistory(prev => [...prev, ...entries]);
    setCmdHistory(prev => [trimmed, ...prev]);
    setHistIdx(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!inputRef.current) return;

    if (e.key === 'Enter') {
      const val = inputRef.current.value;
      runCommand(val);
      inputRef.current.value = '';
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      if (idx !== -1) {
        setHistIdx(idx);
        const val = cmdHistory[idx] ?? '';
        inputRef.current.value = val;
        setInputValue(val);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      const val = idx === -1 ? '' : cmdHistory[idx];
      inputRef.current.value = val;
      setInputValue(val);
    }
  };

  const isMobile = useIsMobile();

  return (
    <div
      className={`h-full w-full max-w-full flex flex-col overflow-hidden cursor-text ${isMobile ? 'mobile-content-shift' : ''}`}
      style={{ background: 'rgba(15, 15, 20, 0.97)' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 custom-scrollbar">
        {history.map((entry, i) => (
          <div key={i} className="terminal-text mb-2 break-words overflow-wrap-anywhere">
            {entry.type === 'input' && (
              <span className="text-green-400 font-bold">{entry.text}</span>
            )}
            {entry.type === 'output' && (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono font-normal break-words leading-relaxed">{entry.text}</pre>
            )}
            {entry.type === 'ai' && (
              <div className="text-cyan-300 whitespace-pre-wrap font-mono leading-relaxed bg-cyan-950/20 border-l-2 border-cyan-500/50 pl-3 py-1 my-1">
                <span className="text-purple-400 font-bold mr-2">🤖 AI:</span>
                {renderFormattedText(entry.text)}
              </div>
            )}
            {entry.type === 'error' && (
              <span className="text-red-400 font-normal">{entry.text}</span>
            )}
            {entry.type === 'success' && (
              <span className="text-green-400 font-normal">{entry.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div
        className="relative flex items-center px-4 md:px-8 py-3 border-t border-gray-800 bg-black/20 overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center flex-wrap w-full pointer-events-none">
          <span className="text-green-400 terminal-text font-bold whitespace-nowrap mr-2">shrawan@portfolio:~$</span>
          <span className="text-gray-100 terminal-text font-normal whitespace-pre inline-block">{inputValue}</span>
          <span className="inline-block w-[7px] h-[15px] bg-green-400 opacity-80 animate-pulse ml-0.5" />
        </div>
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
          className="absolute inset-0 w-full h-full bg-transparent text-transparent outline-none border-none caret-transparent cursor-text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          autoCapitalize="none"
          autoFocus
        />
      </div>
    </div>
  );
}

