import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import {
  User, FolderOpen, Terminal, Mail, Settings,
  Wifi, Battery, Signal, ChevronDown, Home, X
} from 'lucide-react';
import { AppId, Wallpaper, wallpaperStyle } from '../types/os';
import { AboutApp } from './apps/AboutApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { TerminalApp } from './apps/TerminalApp';
import { ContactApp } from './apps/ContactApp';
import { SettingsApp } from './apps/SettingsApp';

import React, { memo } from 'react';

const MOBILE_APPS: { id: AppId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'about',    label: 'About',    icon: <User className="w-8 h-8 text-white" />,       color: 'from-blue-500 to-blue-700' },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-8 h-8 text-white" />, color: 'from-orange-400 to-orange-600' },
  { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-8 h-8 text-white" />,   color: 'from-gray-700 to-gray-900' },
  { id: 'contact',  label: 'Contact',  icon: <Mail className="w-8 h-8 text-white" />,       color: 'from-green-500 to-green-700' },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-8 h-8 text-white" />,   color: 'from-slate-500 to-slate-700' },
];

const DOCK_APPS = MOBILE_APPS.slice(0, 4);

interface MobilePortfolioProps {
  wallpaper: Wallpaper;
  onWallpaperChange: (w: Wallpaper) => void;
  showClock: boolean;
  onShowClockChange: (s: boolean) => void;
}

function MobileStatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1">
      <span className="text-white text-sm font-semibold tracking-tight">
        {formatTime(time)}
      </span>
      <div className="flex-center flex items-center gap-2">
        <Signal className="w-3.5 h-3.5 text-white" />
        <Wifi className="w-3.5 h-3.5 text-white" />
        <Battery className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

function MobileHomeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      key="homelock"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative z-10 text-center pt-6 pb-4"
    >
      <p className="text-white/80 text-sm font-medium">{formatDate(time)}</p>
      <p className="text-white text-6xl font-thin tracking-tight leading-none mt-1">
        {formatTime(time)}
      </p>
    </motion.div>
  );
}

const MemoizedAppContent = memo(({
  appId,
  wallpaper,
  onWallpaperChange,
  showClock,
  onShowClockChange
}: {
  appId: AppId;
  wallpaper: Wallpaper;
  onWallpaperChange: (w: Wallpaper) => void;
  showClock: boolean;
  onShowClockChange: (s: boolean) => void;
}) => {
  switch (appId) {
    case 'about':    return <AboutApp />;
    case 'projects': return <ProjectsApp />;
    case 'terminal': return <TerminalApp />;
    case 'contact':  return <ContactApp />;
    case 'settings': return (
      <SettingsApp
        wallpaper={wallpaper}
        onWallpaperChange={onWallpaperChange}
        showClock={showClock}
        onShowClockChange={onShowClockChange}
      />
    );
    default: return null;
  }
});

// ── Swipeable App Window ──────────────────────────────────────────────────────
function SwipeableAppWindow({
  openApp,
  currentApp,
  wallpaper,
  onWallpaperChange,
  showClock,
  onShowClockChange,
  onClose,
  onHome,
}: {
  openApp: AppId;
  currentApp: typeof MOBILE_APPS[number] | undefined;
  wallpaper: Wallpaper;
  onWallpaperChange: (w: Wallpaper) => void;
  showClock: boolean;
  onShowClockChange: (s: boolean) => void;
  onClose: () => void;
  onHome: () => void;
}) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0]);
  const scale = useTransform(y, [0, 200], [1, 0.92]);

  // Track touch start for swipe detection
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      isSwiping.current = true;
      y.set(delta);
    }
  }, [y]);

  const handleTouchEnd = useCallback(() => {
    if (isSwiping.current && y.get() > 80) {
      onClose();
    } else {
      y.set(0);
    }
    isSwiping.current = false;
  }, [y, onClose]);

  return (
    <motion.div
      key={openApp}
      className="absolute inset-0 z-30 flex flex-col"
      style={{
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
        y,
        opacity,
        scale,
        background: 'rgba(255,255,255,0.97)',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.8 }}
    >
      {/* ── App Title Bar with swipe handle ── */}
      <div
        className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          minHeight: 52,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag pill — centered, indicates swipe-down to close */}
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2 w-12 h-1 rounded-full bg-gray-300"
          title="Swipe down to close"
        />

        <div className="flex items-center gap-2 mt-1">
          {currentApp && (
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentApp.color} flex items-center justify-center`}>
              <span className="scale-75">{currentApp.icon}</span>
            </div>
          )}
          <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            {currentApp?.label}
          </span>
        </div>

        {/* In-header close button (right side) */}
        <button
          onClick={onClose}
          aria-label="Close app"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
            flexShrink: 0,
          }}
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* ── App Content ── */}
      <div className="flex-1 overflow-hidden relative bg-inherit">
        <MemoizedAppContent
          appId={openApp}
          wallpaper={wallpaper}
          onWallpaperChange={onWallpaperChange}
          showClock={showClock}
          onShowClockChange={onShowClockChange}
        />
      </div>

      {/* ── Bottom Bar: Home + Exit ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          paddingTop: 10,
          paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        }}
      >
        {/* Home button — minimise all windows back to desktop */}
        <motion.button
          onClick={onHome}
          aria-label="Go to home screen"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-gray-700 font-semibold text-xs uppercase tracking-wide"
          style={{
            background: 'rgba(0,0,0,0.07)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
            minWidth: 44,
            minHeight: 44,
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Home className="w-4 h-4" />
          Home
        </motion.button>

        {/* Exit app */}
        <motion.button
          onClick={onClose}
          aria-label="Exit app"
          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-gray-900 text-white font-bold text-xs uppercase tracking-wide shadow-lg"
          style={{ minWidth: 44, minHeight: 44 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="w-4 h-4" />
          EXIT APP
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Floating Mobile Close Button ──────────────────────────────────────────────
function FloatingCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <motion.button
      onClick={onClose}
      aria-label="Close current app"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 200,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(255,255,255,0.35)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
    >
      <X className="w-5 h-5 text-white drop-shadow" />
    </motion.button>
  );
}

export function MobilePortfolio({
  wallpaper,
  onWallpaperChange,
  showClock,
  onShowClockChange,
}: MobilePortfolioProps) {
  const [openApp, setOpenApp] = useState<AppId | null>(null);

  const currentApp = MOBILE_APPS.find(a => a.id === openApp);
  const handleClose = () => setOpenApp(null);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{ ...wallpaperStyle(wallpaper), transition: 'background 0.7s ease' }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Hero watermark */}
      <div
        className="absolute pointer-events-none select-none flex flex-col items-center"
        style={{
          zIndex: 5,
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
        }}
      >
        <h1
          className="text-white font-bold text-center"
          style={{
            fontSize: 'clamp(2.2rem, 10vw, 4rem)',
            opacity: 0.22,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Shrawan Karki
        </h1>
        <p
          className="text-white font-light uppercase text-center"
          style={{
            fontSize: 'clamp(0.55rem, 2.5vw, 0.75rem)',
            opacity: 0.18,
            marginTop: '0.5rem',
            letterSpacing: '0.22em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Frontend Developer &amp; UI Designer
        </p>
      </div>

      {/* ── Status Bar ── */}
      <MobileStatusBar />

      {/* ── Lock-screen style clock ── */}
      <AnimatePresence>
        {!openApp && <MobileHomeClock />}
      </AnimatePresence>

      {/* ── App Icon Grid ── */}
      <AnimatePresence>
        {!openApp && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="relative z-10 flex-1 px-6 pt-2 pb-2"
          >
            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
              {MOBILE_APPS.map((app, i) => (
                <MobileHomeIcon
                  key={app.id}
                  app={app}
                  delay={i * 0.05}
                  onTap={() => setOpenApp(app.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-Screen Slide-Up App Window (Swipeable) ── */}
      <AnimatePresence mode="wait">
        {openApp && (
          <SwipeableAppWindow
            key={openApp}
            openApp={openApp}
            currentApp={currentApp}
            wallpaper={wallpaper}
            onWallpaperChange={onWallpaperChange}
            showClock={showClock}
            onShowClockChange={onShowClockChange}
            onClose={handleClose}
            onHome={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ── Floating Glassmorphism Close Button (always visible when app is open) ── */}
      <AnimatePresence>
        {openApp && <FloatingCloseButton onClose={handleClose} />}
      </AnimatePresence>

      {/* ── Mobile Dock — always visible; tapping opens app or returns home ── */}
      <motion.div
        key="dock"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260, delay: 0.1 }}
        className="relative z-50 w-full px-4 pb-4 flex-shrink-0"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
      >
        <div
          className="flex items-center justify-around px-4 py-3 rounded-2xl w-full"
          style={{
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          {DOCK_APPS.map(app => (
            <motion.button
              key={app.id}
              onClick={() => {
                if (openApp === app.id) {
                  handleClose();
                } else {
                  setOpenApp(app.id);
                }
              }}
              aria-label={`Open ${app.label}`}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg relative`}
              style={{
                outline: openApp === app.id ? '2.5px solid rgba(255,255,255,0.7)' : 'none',
                outlineOffset: 2,
              }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 380 }}
            >
              {app.icon}
              {/* Active dot indicator */}
              {openApp === app.id && (
                <span
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </motion.button>
          ))}

          {/* Home button in dock when app is open */}
          {openApp && (
            <motion.button
              onClick={handleClose}
              aria-label="Home"
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.85 }}
            >
              <Home className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MobileHomeIcon({
  app,
  delay,
  onTap,
}: {
  app: { id: AppId; label: string; icon: React.ReactNode; color: string };
  delay: number;
  onTap: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 300 }}
    >
      <motion.button
        onClick={onTap}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', damping: 18, stiffness: 380 }}
      >
        {app.icon}
      </motion.button>
      <span
        className="text-white text-xs font-medium text-center leading-tight"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
      >
        {app.label}
      </span>
    </motion.div>
  );
}
