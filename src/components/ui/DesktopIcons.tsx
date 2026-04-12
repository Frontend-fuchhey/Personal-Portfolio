import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, FolderOpen, Terminal, Mail, Settings as SettingsIcon, Image as ImageIcon } from 'lucide-react';
import { AppId, WindowState } from "../../types/os";

interface DesktopIcon {
  appId: AppId;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { appId: 'about', label: 'About Me', icon: <User className="w-9 h-9 text-white" />, color: 'from-blue-500 to-blue-700' },
  { appId: 'projects', label: 'Projects', icon: <FolderOpen className="w-9 h-9 text-white" />, color: 'from-orange-400 to-orange-600' },
  { appId: 'photos', label: 'Photos', icon: <ImageIcon className="w-9 h-9 text-white" />, color: 'from-pink-500 to-rose-600' },
  { appId: 'terminal', label: 'Terminal', icon: <Terminal className="w-9 h-9 text-white" />, color: 'from-gray-700 to-gray-900' },
  { appId: 'contact', label: 'Contact', icon: <Mail className="w-9 h-9 text-white" />, color: 'from-green-500 to-green-700' },
  { appId: 'settings', label: 'Settings', icon: <SettingsIcon className="w-9 h-9 text-white" />, color: 'from-slate-500 to-slate-700' },
];

interface DesktopIconsProps {
  windows: WindowState[];
  onOpen: (appId: AppId) => void;
  isMobile?: boolean;
}

export function DesktopIcons({ windows, onOpen, isMobile }: DesktopIconsProps) {
  const [pressed, setPressed] = useState<AppId | null>(null);

  const handleClick = (appId: AppId) => {
    setPressed(appId);
    setTimeout(() => setPressed(null), 300);
    onOpen(appId);
  };

  const handlePrefetch = (appId: AppId) => {
    if (appId === 'photos') {
      // Prefetch first 3 images for the gallery
      const prefetchUrls = [
        'https://picsum.photos/400/400?random=1',
        'https://picsum.photos/400/400?random=2',
        'https://picsum.photos/400/400?random=3'
      ];
      prefetchUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    }
  };

  return (
    <div
      className={isMobile 
        ? "relative grid grid-cols-3 gap-[30px] px-10 justify-items-center" 
        : "absolute top-10 right-4 flex flex-col gap-4 pt-4"
      }
      style={{ zIndex: 10 }}
    >
      {DESKTOP_ICONS.map((icon, i) => {
        const isPressed = pressed === icon.appId;
        return (
          <motion.div
            key={icon.appId}
            initial={isMobile ? { scale: 0, opacity: 0 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07, type: 'spring', damping: 22, stiffness: 300 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer group relative"
            onClick={() => handleClick(icon.appId)}
            onMouseEnter={() => handlePrefetch(icon.appId)}
            onTouchStart={() => handlePrefetch(icon.appId)}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {windows.some(w => w.appId === icon.appId && w.isOpen) && !isMobile && (
              <motion.div 
                layoutId={`active-dot-${icon.appId}`}
                className="absolute -right-1 top-0 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)] z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
            <motion.div
              className={`${isMobile ? 'w-[60px] h-[60px] rounded-[18px]' : 'w-16 h-16 rounded-2xl'} bg-gradient-to-br ${icon.color} flex items-center justify-center shadow-lg transition-all duration-300`}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255,255,255,0.25), 0 10px 15px -3px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.92 }}
              animate={isPressed ? { scale: 0.88, opacity: 0.8 } : { scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            >
              <div className={isMobile ? 'transform scale-110' : ''}>
                {icon.icon}
              </div>
            </motion.div>
            <motion.span
              className={`text-white text-center font-roboto ${isMobile ? 'text-[11px] mt-1' : 'text-xs px-1.5 py-0.5 rounded bg-black/30'}`}
              animate={isPressed && !isMobile
                ? { background: 'rgba(59,130,246,0.6)', scale: 0.96 }
                : {}
              }
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {icon.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
