import { useState, useEffect, useRef, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindows } from './hooks/useWindows';
import { Window } from './components/ui/Window';
import { Dock } from './components/ui/Dock';
import { TopBar } from './components/ui/TopBar';
import { DesktopIcons } from './components/ui/DesktopIcons';
import { BootScreen } from './components/ui/BootScreen';
import { AboutApp } from './components/apps/AboutApp';
import { ProjectsApp } from './components/apps/ProjectsApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { ContactApp } from './components/apps/ContactApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { AdminApp } from './components/apps/AdminApp';
import { PhotosApp } from './components/apps/PhotosApp';
import { DesktopWidget } from './components/ui/DesktopWidget';
import { AndroidStatusBar } from './components/android/AndroidStatusBar';
import { AndroidDock } from './components/android/AndroidDock';
import { ClockWidget } from './components/android/ClockWidget';
import { WALLPAPERS } from './data/wallpapers';
import { AppId, Wallpaper } from './types/os';
import { OsDataProvider } from './hooks/useOsData';
import { GlobalBackButton } from './components/ui/GlobalBackButton';
import { DesktopBackground } from './components/ui/DesktopBackground';

const initialWallpaper = WALLPAPERS[0];

const MemoizedAppContent = memo(({ 
  appId, 
  wallpaper, 
  onWallpaperChange, 
  onOpenApp,
  windowId,
  onUpdateSize,
  showClock,
  setShowClock,
  onResumeStateChange
}: { 
  appId: AppId; 
  wallpaper: Wallpaper; 
  onWallpaperChange: (w: Wallpaper) => void; 
  onOpenApp: (appId: AppId) => void;
  windowId?: string;
  onUpdateSize?: (id: string, w: number, h: number) => void;
  showClock: boolean;
  setShowClock: (s: boolean) => void;
  onResumeStateChange?: (open: boolean) => void;
}) => {
  switch (appId) {
    case 'about':    return <AboutApp windowId={windowId} onUpdateSize={onUpdateSize} onOpenApp={onOpenApp} onResumeStateChange={onResumeStateChange} />;
    case 'projects': return <ProjectsApp />;
    case 'terminal': return <TerminalApp onOpenApp={onOpenApp} />;
    case 'contact':  return <ContactApp />;
    case 'settings': return (
      <SettingsApp 
        wallpaper={wallpaper} 
        onWallpaperChange={onWallpaperChange}
        showClock={showClock}
        onShowClockChange={setShowClock}
      />
    );
    case 'admin':    return <AdminApp />;

    case 'photos':   return <PhotosApp />;
    case 'cert-class12': return (
      <div className="w-full h-full bg-white flex items-center justify-center p-5">
        <img src="/certificates/class12.jpg" alt="Certificate Class 12" className="w-auto h-full object-contain shadow-2xl" />
      </div>
    );
    case 'cert-class10': return (
      <div className="w-full h-full bg-white flex items-center justify-center p-5">
        <img src="/certificates/class10.jpg" alt="Certificate Class 10" className="w-auto h-full object-contain shadow-2xl" />
      </div>
    );
    default: return null;
  }
});

export default function App() {
  const [wallpaper, setWallpaperState] = useState<Wallpaper>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shrawan_os_wallpaper');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return initialWallpaper;
        }
      }
    }
    return initialWallpaper;
  });

  const setWallpaper = (newWallpaper: Wallpaper) => {
    setWallpaperState(newWallpaper);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shrawan_os_wallpaper', JSON.stringify(newWallpaper));
    }
  };

  const [showClock, setShowClock] = useState(true);
  
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  
  const [isSystemReady, setIsSystemReady] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });
  
  const [isRecentsView, setIsRecentsView] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
  } = useWindows();

  const anyWindowOpen = windows.some(w => w.isOpen && !w.isMinimized);

  const handleAppClick = (appId: AppId) => {
    const isMobileDevice = window.innerWidth < 768;
    const win = windows.find((w) => w.appId === appId);

    if (!win || !win.isOpen || win.isMinimized) {
      if (isMobileDevice && win) {
        updatePosition(win.id, 0, 0);
      }
      openWindow(appId);
      return;
    }

    if (isMobileDevice) {
      const openWindows = windows.filter(w => w.isOpen && !w.isMinimized);
      const maxZ = openWindows.length > 0 ? Math.max(...openWindows.map(w => w.zIndex)) : 0;
      
      if (win.zIndex < maxZ) {
        updatePosition(win.id, 0, 0);
        focusWindow(win.id);
      } else {
        minimizeWindow(win.id);
      }
      return;
    }

    const openWindows = windows.filter(w => w.isOpen && !w.isMinimized);
    const maxZ = openWindows.length > 0 ? Math.max(...openWindows.map(w => w.zIndex)) : 0;

    if (win.zIndex < maxZ) {
      focusWindow(win.id);
    } else {
      minimizeWindow(win.id);
    }
  };

  useEffect(() => {
    const updateDeviceStatus = () => setIsMobile(window.innerWidth < 768);
    updateDeviceStatus();
    window.addEventListener('resize', updateDeviceStatus);

    return () => window.removeEventListener('resize', updateDeviceStatus);
  }, []);

  const handleBackClick = () => {
    if (isRecentsView) {
      setIsRecentsView(false);
      return;
    }
    const topWin = [...windows]
      .filter(w => w.isOpen && !w.isMinimized)
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))[0];
    if (topWin) {
      closeWindow(topWin.id);
    }
  };

  return (
    <OsDataProvider>
      <DesktopBackground 
        wallpaper={wallpaper} 
        isMobile={isMobile} 
      >
        {isMobile && <AndroidStatusBar />}
        
        <AnimatePresence>
          {!isSystemReady && <BootScreen onComplete={() => setIsSystemReady(true)} />}
        </AnimatePresence>

        {!isMobile && <TopBar onOpenApp={openWindow} showClock={showClock} />}

        <div 
          ref={desktopRef}
          className={`${isMobile ? 'hidden' : 'absolute inset-0 top-8 bottom-[80px] pointer-events-none'}`} 
          style={{ zIndex: 5 }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.08)', zIndex: 1 }} />

        {isMobile ? (
          <div 
            className="flex flex-col justify-between h-full w-full relative z-[2]"
            style={{ display: anyWindowOpen ? 'none' : 'flex' }}
          >
            <div className="pt-16 flex-none">
              <ClockWidget />
            </div>

            <div className="flex-1 relative flex items-center justify-center">
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-10"
                style={{ zIndex: 0 }}
              >
                <h1
                  className="text-white font-bold text-center"
                  style={{
                    fontSize: 'clamp(3rem, 15vw, 5rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  SHRAWAN KARKI
                </h1>
                <p
                  className="text-white font-light uppercase text-center mt-2"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.3em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Frontend Developer & UI Designer
                </p>
              </div>
              
              <div className="relative w-full h-full flex flex-col pt-4 overflow-y-auto" style={{ zIndex: 1, paddingBottom: isMobile ? '100px' : '0' }}>
                <DesktopIcons 
                  windows={windows}
                  onOpen={handleAppClick} 
                  isMobile={true}
                />
              </div>
            </div>

            <div 
              className="flex-none relative"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
            >
               <AndroidDock onOpen={handleAppClick} />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 3.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            style={{ zIndex: 0 }}
          >
            <div className="absolute w-[600px] h-[600px] rounded-full bg-white opacity-[0.03] blur-[100px] pointer-events-none" />

            <h1
              className="text-white text-center"
              style={{
                fontSize: 'clamp(2.6rem, 7.5vw, 6rem)',
                fontWeight: 100,
                opacity: 0.16,
                letterSpacing: '0.18em',
                lineHeight: 1.1,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              SHRAWAN KARKI
            </h1>

            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "12%", opacity: 0.08 }}
              transition={{ delay: 4.5, duration: 1 }}
              className="h-[1px] bg-white my-8 min-w-[80px]"
            />

            <p
              className="text-white font-light uppercase text-center"
              style={{
                fontSize: 'clamp(0.5rem, 1.1vw, 0.7rem)',
                opacity: 0.14,
                letterSpacing: '0.45em',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Frontend Developer &amp; UI Designer
            </p>
          </motion.div>
        )}

        <DesktopWidget onOpenAbout={() => openWindow('about')} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 100 }}>
          <AnimatePresence>
            {windows
              .filter(w => w.isOpen && !w.isMinimized)
              .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
              .map(win => (
                <div key={win.id} className="pointer-events-auto">
                  <Window
                    window={win}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    onMaximize={maximizeWindow}
                    onFocus={(id) => { focusWindow(id); setIsRecentsView(false); }}
                    onUpdatePosition={updatePosition}
                    dragConstraints={desktopRef}
                    isRecentsView={isRecentsView}
                  >
                    <MemoizedAppContent
                      appId={win.appId}
                      wallpaper={wallpaper}
                      onWallpaperChange={setWallpaper}
                      onOpenApp={handleAppClick}
                      windowId={win.id}
                      onUpdateSize={updateSize}
                      showClock={showClock}
                      setShowClock={setShowClock}
                      onResumeStateChange={setIsResumeOpen}
                    />
                  </Window>
                </div>
              ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isMobile && anyWindowOpen && (
            <GlobalBackButton 
              onClick={() => {
                if (isResumeOpen) {
                  setIsResumeOpen(false);
                } else {
                  handleBackClick();
                }
              }}
            />
          )}
        </AnimatePresence>

        {!isMobile && (
          <DesktopIcons 
            windows={windows}
            onOpen={handleAppClick} 
            isMobile={isMobile}
          />
        )}

        {!isMobile && (
          <Dock 
            windows={windows} 
            onOpen={handleAppClick} 
          />
        )}
      </DesktopBackground>
    </OsDataProvider>
  );
}
