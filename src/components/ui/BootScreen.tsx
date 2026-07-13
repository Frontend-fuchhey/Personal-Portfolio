import { useState, useEffect } from 'react';

interface BootScreenProps {
  isFading: boolean;
  onLaunch: () => void;
}

export const BootScreen = ({ isFading, onLaunch }: BootScreenProps) => {
  const [liveTime, setLiveTime] = useState(() => new Date().toLocaleTimeString());

  // Real-time Clock Sync
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick 1.5 Second Boot Sequence Timer
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      onLaunch();
    }, 1500);

    return () => clearTimeout(bootTimer);
  }, [onLaunch]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] font-sans text-white p-8 flex flex-col justify-center items-center select-none overflow-hidden transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}>

      {/* Top Status Bar Maintained */}
      <div className="w-full absolute top-0 left-0 border-b border-white/5 px-6 py-2 flex justify-between items-center font-mono text-[11px] text-zinc-400">
        <span>SHRAWAN_OS[v 7] :: Nepalese Developer ꔪ</span>
        <span>TIME: {liveTime}  |  SESSION: 00:14  |  BOOT_TARGET: [GUEST]</span>
      </div>

      {/* Minimalist Login Center Layout */}
      <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
        <h1 className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          Signing In...
        </h1>
        {/* White Rounded Loaded Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white animate-spin"></div>
        </div>

        {/* Modern Minimalist Greeting Block */}
        <div className="space-y-2">

          <p className="text-sm font-bold tracking-[0.15em] text-white uppercase sm:text-base px-4 max-w-xl leading-relaxed">
            WELCOME TO SHRAWAN KARKI PORTFOLIO
          </p>
        </div>

      </div>

      {/* CSS Animations Layer */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};