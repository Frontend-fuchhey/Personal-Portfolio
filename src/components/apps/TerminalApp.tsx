import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AppId } from "../../types/os";

interface HistoryEntry {
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

const COMMANDS: Record<string, string> = {
  help: `AVAILABLE COMMANDS:
  BIO         → LEARN ABOUT ME
  SKILLS      → LIST MY TECHNICAL SKILLS
  PROJECTS    → SEE MY RECENT PROJECTS
  CONTACT     → GET MY CONTACT INFORMATION
  SOCIALS     → FIND ME ON SOCIAL MEDIA
  EXPERIENCE  → MY WORK HISTORY
  CLEAR       → CLEAR THE TERMINAL
  WHOAMI      → WHO IS SHRAWAN?
  DATE        → SHOW CURRENT DATE & TIME
  ECHO [TEXT] → PRINT TEXT`,
  bio: `HI! I'M SHRAWAN KARKI 👨‍💻
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  ROLE:     FRONTEND DEVELOPER
  LOCATION: MORANG, NEPAL
  STATUS:   OPEN TO OPPORTUNITIES
  PASSION:  CRAFTING CLEAN, INTERACTIVE WEB EXPERIENCES`,
  skills: `TECHNICAL SKILLS:
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  FRONTEND:  REACT, TYPESCRIPT, TAILWIND CSS, NEXT.JS
  DESIGN:    FIGMA, FRAMER MOTION, THREE.JS`,
  projects: `AVAILABLE PROJECTS:
  1. GARMENT FLOW  -> ERP SYSTEM
  2. SHRAWAN OS   -> PORTFOLIO
  Type 'open projects' to view files.`,
  contact: `CONTACT INFO:
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  EMAIL:    pratyushkarki6@GMAIL.COM
  GITHUB:   GITHUB.COM/FRONTEND-FUCHHEY
  LINKEDIN: LINKEDIN.COM/IN/SHRAWAN-KARKI-59B0BA392/
  TWITTER:  @SHRAWANKARKI
  LOCATION: MORANG, NEPAL `,
  socials: `SOCIAL MEDIA:
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  🐙 GITHUB:    GITHUB.COM/FRONTEND-FUCHHEY
  💼 LINKEDIN:  LINKEDIN.COM/IN/SHRAWAN-KARKI-59B0BA392/
  🐦 TWITTER:   @SHRAWANKARKI
  📸 INSTAGRAM: IG_PRASAR7`,
  experience: `WORK EXPERIENCE:
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  2026–NOW  SENIOR FRONTEND ENGINEER @ Rato topi.
  2025–2026 FREELANCE DEVELOPER @ SELF-EMPLOYED`,
  whoami: `SHRAWAN KARKI — FRONTEND DEVELOPER 👨‍💻
  UID=1000(SHRAWAN) GID=1000(DEVELOPERS)
  GROUPS=DEVELOPERS,DESIGNERS,COFFEE-DRINKERS`,
  date: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
};

export function TerminalApp({ onOpenApp }: { onOpenApp?: (appId: AppId) => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: `PORTFOLIO TERMINAL V7.0.0 — TYPE 'HELP' TO SEE AVAILABLE COMMANDS.` },
    { type: 'output', text: `WELCOME, VISITOR! 👋\n` },
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

    const [cmd, ...args] = trimmed.toLowerCase().split(' ');
    const entries: HistoryEntry[] = [{ type: 'input', text: `$ ${raw}` }];

    if (cmd === 'clear') {
      setHistory([{ type: 'output', text: `PORTFOLIO TERMINAL V7.0.0 — TYPE 'HELP' FOR COMMANDS.\n` }]);
      return;
    } else if (cmd === 'echo') {
      entries.push({ type: 'output', text: args.join(' ') || '' });
    } else if (cmd === 'date') {
      entries.push({ type: 'output', text: COMMANDS.date });
    } else if (cmd === 'open') {
      if (args[0] === 'projects') {
        entries.push({ type: 'success', text: 'Opening Projects File Explorer...' });
        onOpenApp?.('projects');
      } else {
        entries.push({ type: 'error', text: 'Usage: open [folder_name]' });
      }
    } else if (COMMANDS[cmd]) {
      entries.push({ type: 'output', text: COMMANDS[cmd] });
    } else {
      entries.push({ type: 'error', text: `COMMAND NOT FOUND: '${cmd}'. TYPE 'HELP' FOR AVAILABLE COMMANDS.` });
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

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <div
      className={`h-full w-full max-w-full flex flex-col overflow-hidden cursor-text ${isMobile ? 'mobile-content-shift' : ''}`}
      style={{ background: 'rgba(15, 15, 20, 0.97)' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 custom-scrollbar">
        {history.map((entry, i) => (
          <div key={i} className="terminal-text mb-1.5 break-words overflow-wrap-anywhere">
            {entry.type === 'input' && (
              <span className="text-green-400 font-bold">{entry.text}</span>
            )}
            {entry.type === 'output' && (
              <pre className="text-gray-300 whitespace-pre-wrap font-normal break-words uppercase">{entry.text}</pre>
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
