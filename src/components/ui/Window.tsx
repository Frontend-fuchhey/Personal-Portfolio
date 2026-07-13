import { useRef, useCallback } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../../types/os';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  isRecentsView?: boolean;
}

export function Window({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  dragConstraints,
  children,
  isRecentsView,
}: WindowProps) {
  const dragControls = useDragControls();
  const handleDragEnd = useCallback(
    (_e: any, info: any) => {
      onUpdatePosition(win.id, win.x + info.offset.x, win.y + info.offset.y);
    },
    [win.id, win.x, win.y, onUpdatePosition]
  );

  if (!win.isOpen || win.isMinimized) return null;

  const isMobile = window.innerWidth < 768;
  const disableDragging = isMobile;

  const windowStyle = isMobile
    ? { 
        position: 'fixed' as const,
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        x: 0,
        y: 0,
        borderRadius: 0,
        margin: 0,
        zIndex: 9999,
      }
    : win.isMaximized
      ? { top: 32, left: 0, right: 0, bottom: 84, width: '100vw', height: 'calc(100vh - 116px)' }
      : win.appId === 'contact' 
        ? {
            position: 'fixed' as const,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            width: win.width,
            height: 460,
            maxWidth: '95vw',
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: '1rem',
          }
        : { 
            top: '50%', 
            left: '50%', 
            x: win.x, 
            y: win.y, 
            width: win.width, 
            height: win.height,
            maxWidth: '95vw',
            maxHeight: 'calc(100vh - 120px)',
            marginTop: -win.height / 2,
            marginLeft: -win.width / 2,
            borderRadius: '1rem',
          };

  const mobileVariants = {
    initial: { y: '100%', opacity: 1 },
    animate: { 
      y: isRecentsView ? '10%' : 0, 
      scale: isRecentsView ? 0.7 : 1, 
      opacity: 1,
      borderRadius: isRecentsView ? '1rem' : 0 
    },
    exit: { y: '100%', opacity: 1 }
  };

  const desktopVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <motion.div
      key={win.id}
      className={`absolute window-container ${win.appId === 'about' ? 'about-me-window' : ''} ${isMobile ? 'bg-white' : 'glass-window'} shadow-2xl overflow-hidden flex flex-col`}
      style={{ 
        ...windowStyle,
        zIndex: 1000 + (win.zIndex || 0), 
        touchAction: isMobile ? 'pan-y' : 'none',
        boxSizing: 'border-box',
        contain: 'layout style',
      }}
      initial={isMobile ? "initial" : "initial"}
      animate={isMobile ? "animate" : "animate"}
      exit={isMobile ? "exit" : "exit"}
      variants={isMobile ? mobileVariants : desktopVariants}
      transition={isMobile 
        ? { type: 'spring', damping: 30, stiffness: 300 } 
        : { type: 'spring', damping: 24, stiffness: 220, mass: 0.8 }
      }
      drag={!disableDragging}
      dragConstraints={dragConstraints}
      dragElastic={0}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }}
      onDragEnd={handleDragEnd}
      onMouseDown={(e) => {
        // Only focus the window; do NOT intercept events from inside the content
        onFocus(win.id);
      }}
      onClick={(e) => {
        // Stop window-level clicks from escaping to desktop layer
        e.stopPropagation();
      }}
    >
      {!isMobile && (
        <div
          className="window-header flex items-center gap-2 px-3 h-10 flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
          style={{ 
            background: win.appId === 'admin' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.4)', 
            borderBottom: win.appId === 'admin' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)' 
          }}
          onPointerDown={(e) => {
            if (!win.isMaximized && !disableDragging) dragControls.start(e);
          }}
        >
          <div className="flex items-center gap-2 group/controls">
            <div className="relative flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
                className="red-circle close-btn w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors flex items-center justify-center group"
              >
                <X className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100" />
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
                className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors flex items-center justify-center group"
              >
                <Minus className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100" />
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}
                className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors flex items-center justify-center group"
              >
                {win.isMaximized
                  ? <Square className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100" />
                  : <Maximize2 className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100" />
                }
              </button>
            </div>
          </div>

          <span className={`flex-1 text-center text-xs font-semibold font-sans truncate pr-14 ${win.appId === 'admin' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
            {win.title}
          </span>
        </div>
      )}


      <div
        className={`window-content flex-1 ${isMobile ? 'overflow-y-auto h-full pt-[60px] pb-[50px] px-0' : 'overflow-hidden'}`}
        style={{ background: isMobile ? '#FFFFFF' : 'transparent' }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  );
}
