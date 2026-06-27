import { useState, useEffect } from 'react';

interface BootScreenProps {
  isFading: boolean;
  onLaunch: () => void;
}

export const BootScreen = ({ isFading, onLaunch }: BootScreenProps) => {
  const [stage, setStage] = useState<'terminal' | 'login' | 'desktop'>('terminal');
  const [typedName, setTypedName] = useState('');
  const [typedWelcome, setTypedWelcome] = useState('');
  const [typedIntro, setTypedIntro] = useState('');
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liveTime, setLiveTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nameText = 'SHRAWAN KARKI';
  const welcomeText = 'WELCOME TO MY PERSONAL PORTFOLIO';
  const introText = 'I am a Frontend Developer & UI/UX Designer focused on building intuitive, pixel-perfect interfaces.';

  // Initial Typewriter Sequencer & Mobile check
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    if (checkMobile()) {
      onLaunch();
      return;
    }

    let currentText = '';
    let i = 0;
    let nameTimeout: NodeJS.Timeout;
    let welcomeTimeout: NodeJS.Timeout;
    let introTimeout: NodeJS.Timeout;

    const typeName = () => {
      if (i < nameText.length) {
        currentText += nameText[i];
        setTypedName(currentText);
        i++;
        nameTimeout = setTimeout(typeName, 60);
      } else {
        i = 0;
        currentText = '';
        welcomeTimeout = setTimeout(typeWelcome, 400);
      }
    };

    const typeWelcome = () => {
      if (i < welcomeText.length) {
        currentText += welcomeText[i];
        setTypedWelcome(currentText);
        i++;
        welcomeTimeout = setTimeout(typeWelcome, 40);
      } else {
        i = 0;
        currentText = '';
        introTimeout = setTimeout(typeIntro, 400);
      }
    };

    const typeIntro = () => {
      if (i < introText.length) {
        currentText += introText[i];
        setTypedIntro(currentText);
        i++;
        introTimeout = setTimeout(typeIntro, 25);
      } else {
        setIsTypewriterDone(true);
      }
    };

    typeName();

    return () => {
      clearTimeout(nameTimeout);
      clearTimeout(welcomeTimeout);
      clearTimeout(introTimeout);
    };
  }, [onLaunch]);

  // Loading progress bar sequencer (runs after typewriter is complete)
  useEffect(() => {
    if (!isTypewriterDone) return;

    const totalDuration = 3500; // 3.5 seconds
    const steps = 70;
    const intervalTime = totalDuration / steps;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setStage('login');
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isTypewriterDone]);

  // Listen for Enter key during the login stage
  useEffect(() => {
    if (stage !== 'login') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setStage('desktop');
        onLaunch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [stage, onLaunch]);

  const getLoadingBar = (percent: number) => {
    const totalBlocks = 20;
    const filledBlocks = Math.min(totalBlocks, Math.floor((percent / 100) * totalBlocks));
    const emptyBlocks = totalBlocks - filledBlocks;
    return `[${'█'.repeat(filledBlocks)}${'-'.repeat(emptyBlocks)}]`;
  };

  if (stage === 'login') {
    return (
      <div 
        className={`fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#0d0f12] select-none overflow-hidden transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Background Wallpaper with Blur Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-105 opacity-60"
          style={{ backgroundImage: "url('/fluid_wave_bg.png')" }}
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Card */}
        <div className="login-fade-in relative z-10 w-80 sm:w-96 p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center text-center text-white">
          {/* Avatar: round gray user silhouette container */}
          <div className="w-20 h-20 rounded-full bg-zinc-700/60 mb-4 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-zinc-300/80" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>

          {/* User Info */}
          <h2 className="text-xl font-bold uppercase tracking-wider mb-1">
            SHRAWAN KARKI
          </h2>
          <p className="text-xs text-zinc-300/90 mb-6 font-light">
            Frontend Developer & UI/UX designer
          </p>

          {/* Password Input */}
          <input 
            type="text" 
            value="••••••••" 
            readOnly 
            className="w-full text-center bg-white/10 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none tracking-widest text-lg select-none mb-6"
          />

          {/* Call to Action: slow pulse */}
          <div className="text-[11px] tracking-[0.2em] uppercase font-semibold text-white/60 animate-slow-pulse">
            PRESS ENTER TO START
          </div>
        </div>

        {/* Bottom Utilities */}
        <div className="absolute bottom-8 flex items-center gap-4 sm:gap-6 text-xs text-white/40 font-light z-10">
          <button className="hover:text-white/80 transition-colors cursor-pointer">Sleep</button>
          <span className="text-white/10">|</span>
          <button className="hover:text-white/80 transition-colors cursor-pointer">Restart</button>
          <span className="text-white/10">|</span>
          <button className="hover:text-white/80 transition-colors cursor-pointer">Guest Login</button>
          <span className="text-white/10">|</span>
          <button className="hover:text-white/80 transition-colors cursor-pointer">Shut Down</button>
        </div>

        <style>{`
          @keyframes fadeInLogin {
            from { opacity: 0; transform: scale(0.97) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .login-fade-in {
            animation: fadeInLogin 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slowPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.85; }
          }
          .animate-slow-pulse {
            animation: slowPulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 bg-[#0d0f12] font-mono text-green-400 p-8 flex flex-col justify-center items-center select-none overflow-hidden transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full absolute top-0 left-0 border-b border-zinc-800/60 px-6 py-2 flex justify-between items-center font-mono text-[11px] select-none text-green-400 z-50">
        <span>SHRAWAN_OS[v 7] ::  Nepalese Developer ꔪ</span>
        <span>TIME: {liveTime}  |  SESSION: 00:14  |  BOOT_TARGET: [GUEST]</span>
      </div>
      <style>{`
        @keyframes terminalBlink {
          50% { opacity: 0; }
        }
        .terminal-cursor {
          animation: terminalBlink 1s step-end infinite;
        }
        .fade-in-log {
          animation: fadeInQuick 0.4s ease-out forwards;
        }
        @keyframes fadeInQuick {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-2xl w-full flex flex-col gap-6 text-sm sm:text-base leading-relaxed">
        {/* Row 1: Name */}
        <div className="h-8 flex items-center">
          <span className="text-xl font-bold tracking-widest">{typedName}</span>
          {typedName && !typedWelcome && <span className="terminal-cursor ml-1">█</span>}
        </div>

        {/* Row 2: Welcome message */}
        <div className="h-8 flex items-center">
          <span className="text-md opacity-90">{typedWelcome}</span>
          {typedWelcome && !typedIntro && <span className="terminal-cursor ml-1">█</span>}
        </div>

        {/* Row 3: Intro details */}
        <div className="min-h-[60px] flex items-start">
          <p className="opacity-80 text-sm sm:text-base">{typedIntro}</p>
          {typedIntro && !isTypewriterDone && <span className="terminal-cursor ml-1">█</span>}
        </div>

        {/* Phase 2: Dev Environment Logs & Loading Progress */}
        {isTypewriterDone && (
          <div className="mt-4 flex flex-col gap-2 border-t border-green-500/20 pt-4">
            {progress > 10 && <div className="fade-in-log opacity-0">► Initializing kernel log matrices... [OK]</div>}
            {progress > 30 && <div className="fade-in-log opacity-0">► Injecting core packages & system resources... [OK]</div>}
            {progress > 55 && <div className="fade-in-log opacity-0">► Compiling responsive layout frames... [SUCCESS]</div>}
            {progress > 75 && <div className="fade-in-log opacity-0">► Establishing secure terminal handshake... [OK]</div>}
            {progress > 90 && <div className="fade-in-log opacity-0">► Initializing graphical user interface... [READY]</div>}
            
            <div className="mt-6 font-bold flex flex-col sm:flex-row sm:items-center gap-2">
              <span>LOADING SYSTEM:</span>
              <span>{getLoadingBar(progress)}</span>
              <span>{Math.min(100, Math.floor(progress))}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
