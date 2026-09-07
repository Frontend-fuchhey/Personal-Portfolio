import { memo, useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Volume2, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppId, Wallpaper } from '../../types/os';
import { USER_CONFIG } from '../../data/userConfig';
import { WALLPAPERS } from '../../data/wallpapers';
import { ControlCenter } from './ControlCenter';

const Clock = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="flex items-center gap-2 text-white text-[11px] opacity-90 select-none">
      <span>{formatDate(time)}</span>
      <span className="font-bold">{formatTime(time)}</span>
    </div>
  );
});

export interface TopBarProps {
  onOpenApp?: (appId: AppId) => void;
  showClock?: boolean;
  wallpaper?: Wallpaper;
  onWallpaperChange?: (wallpaper: Wallpaper) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  isControlCenterOpen?: boolean;
  onToggleControlCenter?: () => void;
  onCloseControlCenter?: () => void;
}

export function TopBar({
  onOpenApp,
  showClock = true,
  wallpaper = WALLPAPERS[0],
  onWallpaperChange = () => {},
  isFocusMode = false,
  onToggleFocusMode = () => {},
  isControlCenterOpen: controlledIsOpen,
  onToggleControlCenter,
  onCloseControlCenter,
}: TopBarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isControlCenterOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggleControlCenter) {
      onToggleControlCenter();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    if (onCloseControlCenter) {
      onCloseControlCenter();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-8 z-[600] flex items-center px-4 select-none"
        style={{
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320, delay: 0.1 }}
      >
        <div className="flex-1 flex items-center ml-2">
          <span 
            onClick={() => onOpenApp?.('about')}
            className="text-white text-[13px] font-bold tracking-tight cursor-pointer hover:opacity-75 transition-opacity px-2"
          >
            {USER_CONFIG.name.split(' ')[0]} OS
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-white opacity-90" />
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-white opacity-90" />
          </div>
          <div className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-white opacity-90" />
            <span className="text-white text-[11px] opacity-90 ml-0.5">100%</span>
          </div>

          {/* Control Center Trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={handleToggle}
            className={`flex items-center justify-center p-1 rounded-md transition-all cursor-pointer ${
              isControlCenterOpen
                ? 'bg-white/30 text-white shadow-sm'
                : 'text-white/85 hover:text-white hover:bg-white/15'
            }`}
            aria-label="Control Center"
            title="Control Center"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {showClock && <Clock />}
        </div>
      </motion.div>

      {/* Control Center Popover if not controlled by parent */}
      {!isControlled && (
        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={handleClose}
          onOpenApp={onOpenApp}
          wallpaper={wallpaper}
          onWallpaperChange={onWallpaperChange}
          isFocusMode={isFocusMode}
          onToggleFocusMode={onToggleFocusMode}
          triggerRef={triggerRef}
        />
      )}
    </>
  );
}

export default TopBar;
