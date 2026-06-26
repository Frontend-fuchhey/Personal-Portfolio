import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BootScreenProps {
  isFading: boolean;
  onLaunch: () => void;
}

export const BootScreen = ({ isFading, onLaunch }: BootScreenProps) => {
  const [timeString, setTimeString] = useState('');
  const [sessionTime, setSessionTime] = useState(0);

  // Time updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Session time updater (counts up in seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard event listener for Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onLaunch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLaunch]);

  return (
    <div
      className={`w-screen h-screen overflow-hidden fixed inset-0 z-50 flex items-center justify-center p-4 select-none ${
        isFading ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-800`}
      style={{
        backgroundImage: "url('/fluid_wave_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DESKTOP / TABLET LAYOUT — hidden on mobile (< md)                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {/* Top System Status Bar — desktop only */}
      <div className="hidden md:flex absolute top-0 left-0 right-0 p-4 flex-col sm:flex-row justify-between items-center w-full gap-2 bg-slate-900/20 backdrop-blur-sm border-b border-white/10">
        <div className="text-white text-xs font-mono opacity-80 text-center sm:text-left">
          SHRAWAN_OS[v7.0.0] :: Nepalese Developer
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 text-white text-xs font-mono opacity-80 text-center">
          <span>TIME: {timeString}</span>
          <span>SESSION: {formatSessionTime(sessionTime)}</span>
          <span>BOOT_TARGET: [GUEST]</span>
        </div>
      </div>

      {/* Central Glassmorphism Boot Card — desktop only */}
      <motion.div
        className="hidden md:block bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-10 pt-8 max-w-2xl w-full text-slate-900 font-sans relative mx-4"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Manifest Row */}
        <div className="font-mono text-xs tracking-wider text-slate-700/90 flex items-center justify-center gap-2 mb-6 w-full">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0">
            SK
          </div>
          <span>SHRAWAN_OS_v7.0_Custom Operating system based portfolio </span>
        </div>

        {/* Typography & Text Content */}
        <span className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2 block text-center">
          SHRAWAN KARKI
        </span>
        <span className="text-lg font-medium text-amber-700/90 text-center mt-1 block">
          Frontend Developer &amp; UI/UX designer
        </span>

        {/* Divider 1 */}
        <div className="border-t border-dashed border-slate-400/50 my-5" />

        {/* Welcome Message */}
        <p className="text-base text-slate-800 leading-relaxed">
          Welcome to my space! I'm a UI/UX designer and frontend developer focused on building
          intuitive, pixel-perfect websites. Dive into my portfolio to see how I combine creativity
          with code to solve real-world problems.
        </p>

        {/* Dual-Interaction Boot Target Section */}
        <div className="mt-6">
          <span className="font-mono text-sm tracking-wider text-slate-600 block">
            [BOOT SEQUENCE]:
          </span>
          <button
            onClick={onLaunch}
            className="w-full text-left cursor-pointer hover:bg-slate-900/5 active:bg-slate-900/10 transition-colors rounded-lg p-2 -mx-2 flex items-center justify-between mt-2"
          >
            <span className="text-slate-800 font-medium">
              → Launch Graphical User Interface
            </span>
            <kbd className="bg-slate-800/10 px-2 py-0.5 rounded border border-slate-800/20 ml-2 font-mono text-sm text-slate-700">
              [Enter]
            </kbd>
          </button>
        </div>

        {/* Divider 2 */}
        <div className="border-t border-dashed border-slate-400/50 my-5" />

        {/* Terminal Status Logs */}
        <div className="flex flex-col gap-1 text-emerald-600 font-mono text-sm font-semibold tracking-wide">
          <div>KERNEL: SHRAWAN_v7.0.0 // READY</div>
          <div>SESSION: INTERACTIVE // [OK]</div>
        </div>
      </motion.div>

      {/* Bottom Navigation Pills — desktop only */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center gap-3 bg-slate-900/60 px-5 py-2.5 rounded-full border border-white/15 backdrop-blur-md shadow-lg max-w-[95vw] overflow-x-auto whitespace-nowrap">
        <button
          onClick={onLaunch}
          className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white font-mono cursor-pointer hover:text-white/80 active:scale-95 transition-all"
        >
          <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] border border-white/20">Enter</kbd>
          <span className="text-white">Launch</span>
        </button>
        <span className="h-3 w-[1px] bg-white/30"></span>
        <button
          className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white font-mono cursor-pointer hover:text-white/80 active:scale-95 transition-all"
        >
          <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] border border-white/20">Edit</kbd>
          <span className="text-white">Options</span>
        </button>
        <span className="h-3 w-[1px] bg-white/30"></span>
        <button
          className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white font-mono cursor-pointer hover:text-white/80 active:scale-95 transition-all"
        >
          <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] border border-white/20">Cancel</kbd>
          <span className="text-white">Exit</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MOBILE WELCOME MICRO-CARD — only visible on mobile (< md)          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex md:hidden absolute inset-0 w-full h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="w-full max-w-sm"
        >
          {/* Glassmorphic card */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {/* Subtle top accent gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444, #a855f7)' }}
            />

            <div className="px-7 pt-8 pb-7 flex flex-col items-center gap-5">
              {/* Avatar badge */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
              >
                SK
              </div>

              {/* Text content */}
              <div className="text-center space-y-2">
                <p
                  className="font-mono text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  SHRAWAN_OS v7.0.0
                </p>
                <h1
                  className="text-white font-bold leading-snug"
                  style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}
                >
                  Welcome to My<br />Personal Portfolio
                </h1>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Explore about me and my work.
                </p>
              </div>

              {/* Terminal-style CTA button */}
              <motion.button
                onClick={onLaunch}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.03 }}
                className="w-full font-mono text-sm font-semibold tracking-widest py-3.5 rounded-xl relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  letterSpacing: '0.12em',
                }}
              >
                {/* Button shimmer overlay */}
                <span
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(168,85,247,0.12))' }}
                />
                <span className="relative z-10">[ Enter Shrawan OS ]</span>
              </motion.button>

              {/* Micro status line */}
              <p
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                KERNEL READY ·&nbsp;
                <span style={{ color: 'rgba(52,211,153,0.8)' }}>●</span>
                &nbsp;INTERACTIVE
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
