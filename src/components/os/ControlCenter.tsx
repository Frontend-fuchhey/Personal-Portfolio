import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  EyeOff,
  Eye,
  SlidersHorizontal,
  Terminal,
  Mail,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useSound } from '../../utils/sound';
import { WALLPAPERS } from '../../data/wallpapers';
import { AppId, Wallpaper } from '../../types/os';

export interface ControlCenterProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenApp?: (appId: AppId) => void;
  wallpaper?: Wallpaper;
  onWallpaperChange?: (wallpaper: Wallpaper) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function ControlCenter({
  isOpen = true,
  onClose = () => {},
  onOpenApp,
  wallpaper = WALLPAPERS[0],
  onWallpaperChange = () => {},
  isFocusMode = false,
  onToggleFocusMode = () => {},
  triggerRef,
}: ControlCenterProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme, isDark } = useTheme();
  const { isMuted, toggleSound, playClick, playToggle } = useSound();

  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof document !== 'undefined') {
      return !!document.fullscreenElement;
    }
    return false;
  });

  // Track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = () => {
    playToggle();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Could not enter fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Could not exit fullscreen:', err);
        });
      }
    }
  };

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // Check if click is inside popover
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }

      // Check if click is on trigger button
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  const isW3Classic = wallpaper?.url === '/w3.png' || wallpaper?.value === '/w3.png' || wallpaper?.id === 'w3-default';
  const isFluidWave = wallpaper?.id === 'fluid-wave' || (wallpaper?.url && wallpaper.url.includes('fluid_wave'));

  const handleSelectW3 = () => {
    playClick();
    const w3 = WALLPAPERS.find(w => w.id === 'w3-default') || WALLPAPERS[0];
    onWallpaperChange(w3);
  };

  const handleSelectFluidWave = () => {
    playClick();
    const fluid = WALLPAPERS.find(w => w.id === 'fluid-wave') || WALLPAPERS[1];
    onWallpaperChange(fluid);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-9 right-3 z-[100] w-80 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-3 shadow-2xl space-y-3 select-none text-zinc-800 dark:text-zinc-100 font-sans"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
              Control Center
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              ShrawanOS
            </span>
          </div>

          {/* Quick Toggles Grid (2x2) */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                playToggle();
                toggleTheme();
              }}
              className={`group flex items-center gap-2.5 p-2.5 rounded-2xl transition-all duration-200 text-left cursor-pointer active:scale-95 ${
                isDark
                  ? 'bg-blue-500/15 dark:bg-blue-600/25 border border-blue-500/30 text-blue-600 dark:text-blue-400'
                  : 'bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                  isDark ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate leading-snug">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {isDark ? 'Active' : 'Standard'}
                </div>
              </div>
            </button>

            {/* 2. Fullscreen Toggle */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className={`group flex items-center gap-2.5 p-2.5 rounded-2xl transition-all duration-200 text-left cursor-pointer active:scale-95 ${
                isFullscreen
                  ? 'bg-blue-500/15 dark:bg-blue-600/25 border border-blue-500/30 text-blue-600 dark:text-blue-400'
                  : 'bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                  isFullscreen
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                }`}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate leading-snug">Fullscreen</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {isFullscreen ? 'Expanded' : 'Windowed'}
                </div>
              </div>
            </button>

            {/* 3. UI Sound SFX Toggle */}
            <button
              type="button"
              onClick={() => {
                toggleSound();
              }}
              className={`group flex items-center gap-2.5 p-2.5 rounded-2xl transition-all duration-200 text-left cursor-pointer active:scale-95 ${
                !isMuted
                  ? 'bg-blue-500/15 dark:bg-blue-600/25 border border-blue-500/30 text-blue-600 dark:text-blue-400'
                  : 'bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                  !isMuted
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                }`}
              >
                {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate leading-snug">Sound SFX</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {!isMuted ? 'Enabled' : 'Muted'}
                </div>
              </div>
            </button>

            {/* 4. Focus Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                playToggle();
                onToggleFocusMode();
              }}
              className={`group flex items-center gap-2.5 p-2.5 rounded-2xl transition-all duration-200 text-left cursor-pointer active:scale-95 ${
                isFocusMode
                  ? 'bg-purple-500/15 dark:bg-purple-600/25 border border-purple-500/30 text-purple-600 dark:text-purple-400'
                  : 'bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                  isFocusMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                }`}
              >
                {isFocusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate leading-snug">Focus Mode</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {isFocusMode ? 'Desk Hidden' : 'Standard'}
                </div>
              </div>
            </button>
          </div>

          {/* Wallpaper Quick Switcher */}
          <div className="bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-2.5 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <ImageIcon className="w-3 h-3 text-blue-500" />
                <span>Wallpaper Switcher</span>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                {isFluidWave ? 'Fluid Wave' : 'W3 Classic'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 bg-zinc-200/60 dark:bg-zinc-900/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={handleSelectW3}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isW3Classic
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {isW3Classic && <Check className="w-3 h-3 text-blue-500" />}
                <span>W3 Classic</span>
              </button>

              <button
                type="button"
                onClick={handleSelectFluidWave}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isFluidWave
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {isFluidWave && <Check className="w-3 h-3 text-blue-500" />}
                <span>Fluid Wave</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Row (Bottom) */}
          <div className="pt-0.5">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 px-1 mb-1.5">
              Quick App Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onOpenApp?.('terminal');
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 active:scale-95 transition-all text-xs font-medium cursor-pointer shadow-sm text-zinc-800 dark:text-zinc-200"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Terminal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onOpenApp?.('contact');
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 active:scale-95 transition-all text-xs font-medium cursor-pointer shadow-sm text-zinc-800 dark:text-zinc-200"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
