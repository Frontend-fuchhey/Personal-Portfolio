import { useState, useRef, useEffect, KeyboardEvent, ReactNode } from 'react';
import { AppId } from "../../types/os";
import { useIsMobile } from '../../hooks/use-mobile';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../../lib/firebase';

interface HistoryEntry {
  type: 'input' | 'output' | 'error' | 'success' | 'ai' | 'action';
  text: string;
  actionUrl?: string;
  actionLabel?: string;
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
    response: "Check out Resume.io! It's an automated resume builder built by Shrawan hosted on Cloudflare Workers. Live URL: [https://resumeio.pages.dev/](https://resumeio.pages.dev/)"
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
  SUDO ADMIN  → AUTHENTICATE ADMINISTRATOR PRIVILEGES

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
tictactoe/   admin/       README.md`,
  date: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
};

const AUTH_OPTIONS = [
  { id: 'google', label: '1. Sign in with Google' },
  { id: 'passkey', label: '2. Use Pass Key' },
];

export interface UserAccountOption {
  id: string;
  label: string;
  email: string;
  isAction?: boolean;
}

const getLoggedInAccounts = (): UserAccountOption[] => {
  const accounts: Array<{ name: string; email: string }> = [];

  // 1. Current active Firebase Auth user
  if (auth.currentUser?.email) {
    accounts.push({
      name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
      email: auth.currentUser.email,
    });
  }

  // 2. Previously authenticated Google accounts stored on this device profile
  try {
    const saved = localStorage.getItem('logged_in_google_accounts');
    if (saved) {
      const parsed: Array<{ name?: string; email: string }> = JSON.parse(saved);
      parsed.forEach(acc => {
        if (acc.email && !accounts.some(a => a.email.toLowerCase() === acc.email.toLowerCase())) {
          accounts.push({
            name: acc.name || acc.email.split('@')[0],
            email: acc.email,
          });
        }
      });
    }
  } catch {
    // Ignore
  }

  // Map to options
  const items: UserAccountOption[] = accounts.map((acc, idx) => ({
    id: `acc_${acc.email}`,
    label: `${idx + 1}. ${acc.name} (${acc.email})`,
    email: acc.email,
    isAction: false,
  }));

  if (items.length > 0) {
    items.push({
      id: 'custom_account',
      label: `${items.length + 1}. Use another account...`,
      email: '',
      isAction: true,
    });
  } else {
    items.push({
      id: 'sign_in_google',
      label: '1. Sign in with Google Account...',
      email: '',
      isAction: true,
    });
    items.push({
      id: 'custom_account',
      label: '2. Use another account...',
      email: '',
      isAction: true,
    });
  }

  return items;
};

const saveAccountToDevice = (email: string, name?: string) => {
  try {
    const saved = localStorage.getItem('logged_in_google_accounts');
    const list: Array<{ name?: string; email: string }> = saved ? JSON.parse(saved) : [];
    if (!list.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      list.push({ name: name || email.split('@')[0], email });
      localStorage.setItem('logged_in_google_accounts', JSON.stringify(list));
    }
  } catch {
    // Ignore
  }
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

  // CLI Interactive Authentication State
  const [authMode, setAuthMode] = useState<'none' | 'menu' | 'google_picker' | 'custom_email_input' | 'passkey_input' | 'authenticating'>('none');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);
  const [googleAccounts, setGoogleAccounts] = useState<UserAccountOption[]>([]);
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [passkeyInput, setPasskeyInput] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, authMode, selectedOptionIdx, selectedAccountIdx]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const confirmAndVerifyAccount = async (emailToVerify: string) => {
    const email = emailToVerify.trim().toLowerCase();
    if (!email) {
      setAuthMode('none');
      return;
    }

    setAuthMode('authenticating');
    setHistory(prev => [
      ...prev,
      { type: 'output', text: `● Selected account: ${email}` },
      { type: 'output', text: `● Verifying database administrator clearance for ${email}...` }
    ]);

    try {
      const userDocRef = doc(db, 'users', email);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists() && docSnap.data()?.admin === true) {
        const sessionToken = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('admin_verified_email', email);
        localStorage.setItem('admin_session_token', sessionToken);
        localStorage.setItem('admin_session', 'true');
        sessionStorage.setItem('admin_session', 'true');

        let openedTab = false;
        try {
          const newTab = window.open('/admin', '_blank');
          if (newTab && !newTab.closed && typeof newTab.closed !== 'undefined') {
            openedTab = true;
          }
        } catch {
          openedTab = false;
        }

        if (!openedTab) {
          try {
            const anchor = document.createElement('a');
            anchor.href = '/admin';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
          } catch {
            // ignore
          }
        }

        setHistory(h => [
          ...h,
          { type: 'success', text: `✔ Administrator privileges verified for ${email}` },
          {
            type: 'action',
            text: `✔ Launching Admin Panel in a new browser tab. Click the button below if your browser blocked popups:`,
            actionUrl: '/admin',
            actionLabel: 'Open Admin Panel in New Tab ↗'
          }
        ]);
        setAuthMode('none');
      } else {
        try {
          await signOut(auth);
        } catch {
          // ignore
        }
        setHistory(h => [
          ...h,
          { type: 'error', text: `✖ Access Denied: ${email} is not configured as an Admin in Firestore.` },
          { type: 'output', text: `Authentication failed.` }
        ]);
        setAuthMode('none');
      }
    } catch {
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
      setHistory(h => [
        ...h,
        { type: 'error', text: `✖ Access Denied: ${email} is not configured as an Admin in Firestore.` },
        { type: 'output', text: `Authentication failed.` }
      ]);
      setAuthMode('none');
    }
  };

  const handleSelectGoogleAccount = async (index: number) => {
    const selected = googleAccounts[index];
    if (!selected) return;

    if (selected.isAction) {
      setAuthMode('authenticating');
      setHistory(prev => [
        ...prev,
        { type: 'output', text: `? Choose a Google Account › ${selected.label}` },
        { type: 'output', text: `● Opening Google authentication in your browser...` }
      ]);

      try {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        if (!user || !user.email) {
          throw new Error('No account returned from Google sign-in.');
        }

        saveAccountToDevice(user.email, user.displayName || undefined);
        setGoogleAccounts(getLoggedInAccounts());

        setHistory(h => [
          ...h,
          { type: 'success', text: `✔ Authenticated with Google as: ${user.email}` }
        ]);
        await confirmAndVerifyAccount(user.email);
      } catch (err: any) {
        if (err?.code === 'auth/popup-closed-by-user') {
          setHistory(h => [
            ...h,
            { type: 'error', text: `✖ Authentication cancelled: Google popup was closed.` },
            { type: 'output', text: `Authentication cancelled.` }
          ]);
        } else if (err?.code === 'auth/unauthorized-domain') {
          const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
          setHistory(h => [
            ...h,
            { type: 'error', text: `✖ Firebase Security Error: Domain '${currentHost}' is not authorized.` },
            { type: 'output', text: `● Fix in Firebase Console: Authentication → Settings → Authorized domains → Add '${currentHost}'` }
          ]);
        } else {
          setHistory(h => [
            ...h,
            { type: 'error', text: `✖ Authentication error: ${err?.message || 'Failed to authenticate with Google'}` },
            { type: 'output', text: `Authentication failed.` }
          ]);
        }
        setAuthMode('none');
      }
      return;
    }

    // Selected an existing logged-in account
    setHistory(prev => [
      ...prev,
      { type: 'output', text: `? Choose a Google Account › ${selected.label}` }
    ]);

    if (auth.currentUser && auth.currentUser.email?.toLowerCase() === selected.email.toLowerCase()) {
      await confirmAndVerifyAccount(selected.email);
    } else {
      setAuthMode('authenticating');
      setHistory(prev => [
        ...prev,
        { type: 'output', text: `● Verifying Google credentials for ${selected.email}...` }
      ]);
      try {
        googleProvider.setCustomParameters({ login_hint: selected.email });
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        if (!user || !user.email) {
          throw new Error('Authentication failed.');
        }
        saveAccountToDevice(user.email, user.displayName || undefined);
        await confirmAndVerifyAccount(user.email);
      } catch (err: any) {
        if (err?.code === 'auth/popup-closed-by-user') {
          setHistory(h => [
            ...h,
            { type: 'error', text: `✖ Authentication cancelled: Google popup was closed.` },
            { type: 'output', text: `Authentication cancelled.` }
          ]);
        } else if (err?.code === 'auth/unauthorized-domain') {
          const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
          setHistory(h => [
            ...h,
            { type: 'error', text: `✖ Firebase Security Error: Domain '${currentHost}' is not authorized.` },
            { type: 'output', text: `● Fix in Firebase Console: Authentication → Settings → Authorized domains → Add '${currentHost}'` }
          ]);
        } else {
          setHistory(h => [
            ...h,
            { type: 'error', text: `✖ Authentication error: ${err?.message || 'Failed to verify account'}` },
            { type: 'output', text: `Authentication failed.` }
          ]);
        }
        setAuthMode('none');
      }
    }
  };

  const handleSelectOption = (index: number) => {
    if (index === 0) {
      // 1. Sign in with Google
      const accounts = getLoggedInAccounts();
      setGoogleAccounts(accounts);
      setAuthMode('google_picker');
      setSelectedAccountIdx(0);
      setHistory(prev => [
        ...prev,
        { type: 'output', text: `? How would you like to authenticate for this project? › 1. Sign in with Google` }
      ]);
    } else if (index === 1) {
      // 2. Use Pass Key
      setAuthMode('passkey_input');
      setPasskeyInput('');
      setHistory(prev => [
        ...prev,
        { type: 'output', text: `? How would you like to authenticate for this project? › 2. Use Pass Key` },
        { type: 'output', text: `Enter administrator pass key below (stored in database):` }
      ]);
    }
  };

  const handlePasskeySubmit = async () => {
    const entered = passkeyInput.trim();
    if (!entered) {
      setAuthMode('none');
      return;
    }

    setAuthMode('authenticating');
    setHistory(h => [
      ...h,
      { type: 'input', text: `root [passkey]: ••••••••` },
      { type: 'output', text: `● Verifying administrator pass key with database...` }
    ]);

    let isValid = false;
    let notConfigured = false;
    try {
      // Query Firestore database document config/auth
      const configRef = doc(db, 'config', 'auth');
      const snap = await getDoc(configRef);
      if (snap.exists() && snap.data()?.passkey) {
        const dbPasskey = String(snap.data().passkey).trim();
        isValid = dbPasskey === entered;
      } else {
        notConfigured = true;
      }
    } catch (err: any) {
      setHistory(h => [
        ...h,
        { type: 'error', text: `✖ Database error while verifying passkey: ${err?.message || 'Access denied'}` },
        { type: 'output', text: `Authentication failed.` }
      ]);
      setAuthMode('none');
      setPasskeyInput('');
      return;
    }

    if (notConfigured) {
      setHistory(h => [
        ...h,
        { type: 'error', text: `✖ Access Denied: No passkey is configured in Firestore (collection 'config' -> document 'auth').` },
        { type: 'output', text: `Please add document 'auth' with field 'passkey' in your Firebase Console.` },
        { type: 'output', text: `Authentication failed.` }
      ]);
      setAuthMode('none');
      setPasskeyInput('');
      return;
    }

    if (isValid) {
      sessionStorage.setItem('admin_passkey_verified', 'true');
      sessionStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_passkey_verified', 'true');
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_verified_email', 'admin (database passkey)');
      setAuthMode('none');
      setPasskeyInput('');

      setHistory(h => [
        ...h,
        { type: 'success', text: `✔ Pass key verified successfully in database.` },
        { type: 'success', text: `✔ Access Granted. Opening Admin Panel...` },
        {
          type: 'action',
          text: `✔ Launching Admin Panel in a new browser tab. Click below if your browser blocked popups:`,
          actionUrl: '/admin',
          actionLabel: 'Open Admin Panel in New Tab ↗'
        }
      ]);

      try {
        const newTab = window.open('/admin', '_blank');
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          // popup blocked, fallback action button is already displayed
        }
      } catch {
        // popup blocked, fallback action button is already displayed
      }
    } else {
      setHistory(h => [
        ...h,
        { type: 'error', text: `✖ Invalid pass key. Access Denied.` },
        { type: 'output', text: `Authentication failed.` }
      ]);
      setAuthMode('none');
      setPasskeyInput('');
    }
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const [cmd, ...args] = lower.split(' ');
    const entries: HistoryEntry[] = [{ type: 'input', text: `$ ${raw}` }];

    if (cmd === 'clear') {
      setHistory([{ type: 'output', text: `SHRAWAN OS TERMINAL — TYPE 'HELP' FOR COMMANDS OR ASK ANY QUESTION.\n` }]);
      return;
    } else if (lower === 'sudo admin' || cmd === 'admin' || (cmd === 'sudo' && args[0] === 'admin')) {
      setHistory(prev => [...prev, ...entries]);
      setCmdHistory(prev => [trimmed, ...prev]);
      setHistIdx(-1);
      setAuthMode('menu');
      setSelectedOptionIdx(0);
      return;
    } else if (cmd === 'echo') {
      entries.push({ type: 'output', text: args.join(' ') || '' });
    } else if (cmd === 'date') {
      entries.push({ type: 'output', text: new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    } else if (cmd === 'open') {
      if (args[0] === 'projects') {
        entries.push({ type: 'success', text: 'Opening Projects File Explorer...' });
        onOpenApp?.('projects');
      } else if (args[0] === 'admin') {
        entries.push({ type: 'success', text: 'Opening standalone Admin Panel in new tab...' });
        try {
          const newTab = window.open('/admin', '_blank');
          if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
            window.location.href = '/admin';
          }
        } catch {
          window.location.href = '/admin';
        }
      } else if (args[0] === 'about' || args[0] === 'contact' || args[0] === 'photos' || args[0] === 'resume' || args[0] === 'settings' || args[0] === 'terminal' || args[0] === 'tictactoe') {
        entries.push({ type: 'success', text: `Opening ${args[0]} app...` });
        onOpenApp?.(args[0] as AppId);
      } else {
        entries.push({ type: 'error', text: 'Usage: open [about|projects|contact|photos|resume|settings|admin|tictactoe]' });
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

    // 1. Menu Selection Mode (1. Sign in with Google, 2. Use Pass Key)
    if (authMode === 'menu') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedOptionIdx(prev => (prev > 0 ? prev - 1 : AUTH_OPTIONS.length - 1));
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedOptionIdx(prev => (prev < AUTH_OPTIONS.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectOption(selectedOptionIdx);
        return;
      }
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        setAuthMode('none');
        setHistory(h => [...h, { type: 'output', text: '? Authentication cancelled.' }]);
        return;
      }
      return;
    }

    // 2. Google Account Picker Mode
    if (authMode === 'google_picker') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAccountIdx(prev => (prev > 0 ? prev - 1 : (googleAccounts.length ? googleAccounts.length - 1 : 0)));
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAccountIdx(prev => (prev < googleAccounts.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectGoogleAccount(selectedAccountIdx);
        return;
      }
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        setAuthMode('none');
        setHistory(h => [...h, { type: 'output', text: '? Authentication cancelled.' }]);
        return;
      }
      return;
    }

    // 3. Passkey Input Mode
    if (authMode === 'passkey_input') {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePasskeySubmit();
        return;
      }
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        setAuthMode('none');
        setPasskeyInput('');
        setHistory(h => [...h, { type: 'output', text: '? Pass key authentication cancelled.' }]);
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        setPasskeyInput(prev => prev.slice(0, -1));
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setPasskeyInput(prev => prev + e.key);
        return;
      }
      return;
    }

    // 2. Custom Email Input Mode
    if (authMode === 'custom_email_input') {
      if (e.key === 'Enter') {
        e.preventDefault();
        const entered = customEmailInput.trim();
        if (inputRef.current) inputRef.current.value = '';
        setCustomEmailInput('');
        if (entered) {
          setHistory(h => [...h, { type: 'input', text: `email: ${entered}` }]);
          confirmAndVerifyAccount(entered);
        } else {
          setAuthMode('none');
          setHistory(h => [...h, { type: 'output', text: '? Email input cancelled.' }]);
        }
        return;
      }
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        if (inputRef.current) inputRef.current.value = '';
        setAuthMode('none');
        setCustomEmailInput('');
        setHistory(h => [...h, { type: 'output', text: '? Authentication cancelled.' }]);
        return;
      }
      return;
    }

    // 3. Authenticating Mode (lock inputs)
    if (authMode === 'authenticating') {
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        setAuthMode('none');
        setHistory(h => [...h, { type: 'output', text: '? Authentication cancelled.' }]);
      }
      return;
    }

    // 4. Default Terminal Command Line Mode
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
            {entry.type === 'action' && (
              <div className="my-3 p-3.5 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono shadow-lg shadow-emerald-950/30">
                <div>
                  <p className="text-emerald-400 font-bold text-xs">{entry.text}</p>
                </div>
                {entry.actionUrl && (
                  <a
                    href={entry.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg transition-all shadow-md active:scale-95 no-underline shrink-0 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{entry.actionLabel || 'Open Admin Panel in New Tab ↗'}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        ))}


        {/* CLI Interactive Authentication Menu (Google vs Pass Key) */}
        {authMode === 'menu' && (
          <div className="my-3 py-2 font-mono select-none animate-in fade-in duration-150">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#e879f9] font-bold text-base">?</span>
              <span className="text-white font-bold text-sm tracking-wide">How would you like to authenticate for this project?</span>
            </div>
            <div className="space-y-1.5 pl-4">
              {AUTH_OPTIONS.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                return (
                  <div
                    key={opt.id}
                    className="flex items-center gap-2 text-xs py-0.5 cursor-pointer"
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span className={`w-3 text-center ${isSelected ? 'text-emerald-400 font-bold' : 'text-transparent'}`}>
                      ●
                    </span>
                    <span
                      className={`transition-all ${
                        isSelected
                          ? 'bg-[#1b4332] text-[#d1fae5] px-2 py-0.5 rounded font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pl-4 text-[11px] text-zinc-500">
              (Use <span className="text-zinc-300">↑/↓</span> to navigate, <span className="text-zinc-300">Enter</span> to select, <span className="text-zinc-300">Esc</span> to cancel)
            </div>
          </div>
        )}

        {/* CLI Interactive Google Account Picker */}
        {authMode === 'google_picker' && (
          <div className="my-3 py-2 font-mono select-none animate-in fade-in duration-150">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#38bdf8] font-bold text-base">?</span>
              <span className="text-white font-bold text-sm tracking-wide">Choose a Google Account</span>
            </div>
            <div className="text-zinc-400 text-xs mb-3 pl-4">
              to continue to shrawan-portfolio
            </div>
            <div className="space-y-1.5 pl-4">
              {googleAccounts.map((acc, idx) => {
                const isSelected = selectedAccountIdx === idx;
                return (
                  <div
                    key={acc.id}
                    className="flex items-center gap-2 text-xs py-0.5 cursor-pointer"
                    onClick={() => handleSelectGoogleAccount(idx)}
                  >
                    <span className={`w-3 text-center ${isSelected ? 'text-emerald-400 font-bold' : 'text-transparent'}`}>
                      ●
                    </span>
                    <span
                      className={`transition-all ${
                        isSelected
                          ? 'bg-[#1b4332] text-[#d1fae5] px-2 py-0.5 rounded font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {acc.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pl-4 text-[11px] text-zinc-500">
              (Use <span className="text-zinc-300">↑/↓</span> to navigate, <span className="text-zinc-300">Enter</span> to select, <span className="text-zinc-300">Esc</span> to cancel)
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Bar */}
      <div
        className="relative flex items-center px-4 md:px-8 py-3 border-t border-gray-800 bg-black/20 overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center flex-wrap w-full pointer-events-none font-mono">
          {authMode === 'menu' ? (
            <>
              <span className="text-[#e879f9] terminal-text font-bold whitespace-nowrap mr-2">? auth [select]:</span>
              <span className="text-zinc-400 terminal-text font-normal text-xs">
                {AUTH_OPTIONS[selectedOptionIdx].label} (press Enter to confirm)
              </span>
            </>
          ) : authMode === 'passkey_input' ? (
            <>
              <span className="text-yellow-400 terminal-text font-bold whitespace-nowrap mr-2">root [passkey]:</span>
              <span className="text-gray-100 terminal-text font-normal whitespace-pre inline-block">
                {'•'.repeat(passkeyInput.length)}
              </span>
              <span className="inline-block w-[7px] h-[15px] bg-yellow-400 opacity-80 animate-pulse ml-0.5" />
            </>
          ) : authMode === 'google_picker' ? (
            <>
              <span className="text-[#38bdf8] terminal-text font-bold whitespace-nowrap mr-2">? account [select]:</span>
              <span className="text-zinc-400 terminal-text font-normal text-xs">
                {googleAccounts[selectedAccountIdx]?.label || 'Select an account'} (press Enter to confirm)
              </span>
            </>
          ) : authMode === 'custom_email_input' ? (
            <>
              <span className="text-cyan-400 terminal-text font-bold whitespace-nowrap mr-2">custom [email]:</span>
              <span className="text-gray-100 terminal-text font-normal whitespace-pre inline-block">{customEmailInput}</span>
              <span className="inline-block w-[7px] h-[15px] bg-cyan-400 opacity-80 animate-pulse ml-0.5" />
            </>
          ) : authMode === 'authenticating' ? (
            <>
              <span className="text-cyan-400 terminal-text font-bold whitespace-nowrap mr-2">● verifying:</span>
              <span className="text-gray-400 terminal-text font-normal italic animate-pulse">
                checking database administrator clearance...
              </span>
            </>
          ) : (
            <>
              <span className="text-green-400 terminal-text font-bold whitespace-nowrap mr-2">shrawan@portfolio:~$</span>
              <span className="text-gray-100 terminal-text font-normal whitespace-pre inline-block">{inputValue}</span>
              <span className="inline-block w-[7px] h-[15px] bg-green-400 opacity-80 animate-pulse ml-0.5" />
            </>
          )}
        </div>
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            if (authMode === 'none') {
              setInputValue(e.target.value);
            } else if (authMode === 'custom_email_input') {
              setCustomEmailInput(e.target.value);
            }
          }}
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
