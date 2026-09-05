import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useIsMobile } from './hooks/use-mobile';
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
import { TicTacToe } from './components/apps/TicTacToe';
import { DesktopWidget } from './components/ui/DesktopWidget';
import { AndroidStatusBar } from './components/android/AndroidStatusBar';
import { AndroidDock } from './components/android/AndroidDock';
import { ClockWidget } from './components/android/ClockWidget';
import { WALLPAPERS } from './data/wallpapers';
import { AppId, Wallpaper } from './types/os';
import { OsDataProvider } from './hooks/useOsData';
import { GlobalBackButton } from './components/ui/GlobalBackButton';
import { DesktopBackground } from './components/ui/DesktopBackground';
import { USER_CONFIG } from './data/userConfig';
import profilePic from './assets/shrawan.jpg';
import { ResumeView } from './components/ResumeView';
import { ResumeApp } from './components/apps/Resume';
import TextPressure from './components/ui/TextPressure';

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
  onResumeStateChange,
  onClose
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
  onClose?: () => void;
}) => {
  switch (appId) {
    case 'about':    return <AboutApp windowId={windowId} onUpdateSize={onUpdateSize} onOpenApp={onOpenApp} onResumeStateChange={onResumeStateChange} onClose={onClose} />;
    case 'projects': return <ProjectsApp />;
    case 'terminal': return <TerminalApp onOpenApp={onOpenApp} />;
    case 'contact':  return <ContactApp />;
    case 'resume':   return <ResumeApp />;
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
    case 'tictactoe': return <TicTacToe />;
    case 'cert-class12': return (
      <div className="w-full h-full bg-white flex items-center justify-center p-5">
        <img src="./certificates/class12.jpg" alt="Certificate Class 12" className="w-auto h-full object-contain shadow-2xl" />
      </div>
    );
    case 'cert-class10': return (
      <div className="w-full h-full bg-white flex items-center justify-center p-5">
        <img src="./certificates/class10.jpg" alt="Certificate Class 10" className="w-auto h-full object-contain shadow-2xl" />
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
  
  const isMobile = useIsMobile();
  
  const [isBooted, setIsBooted] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const handleLaunch = useCallback(() => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setIsBooted(true);
    }, 800);
  }, [isFading]);
  
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
    const cacheImages = async () => {
      const srcArray = ['/fluid_wave_bg.png', profilePic];
      const promises = srcArray.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
    };
    cacheImages();
  }, []);

  // isMobile detection is now handled by the useIsMobile() hook above
  // which includes UA sniffing, screen.width, matchMedia, resize & orientationchange listeners

  useEffect(() => {
    const handleUrlChange = () => {
      const cleanPath = window.location.pathname.split('?')[0].replace(/^\/+|\/+$/g, '');
      const cleanHash = window.location.hash.split('?')[0].replace(/^#+/, '');
      const rawPath = cleanPath || cleanHash;
      const targetApp = rawPath.toLowerCase().trim();
      const validApps = ['projects', 'resume', 'contact', 'terminal', 'about', 'tictactoe'];

      if (validApps.includes(targetApp)) {
        openWindow(targetApp as AppId);
      }
    };

    // Run on initial mount
    handleUrlChange();

    // Listen for hashchange and popstate events
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [openWindow]);

  const handleCloseWindow = useCallback((id: string) => {
    const win = windows.find(w => w.id === id);
    closeWindow(id);

    if (win) {
      const cleanPath = window.location.pathname.split('?')[0].replace(/^\/+|\/+$/g, '');
      const cleanHash = window.location.hash.split('?')[0].replace(/^#+/, '');
      const rawPath = cleanPath || cleanHash;
      const currentRoute = rawPath.toLowerCase().trim();
      
      const isRouteMatch = 
        currentRoute === win.appId || 
        (win.appId === 'about' && currentRoute === 'resume') ||
        (win.appId === 'resume' && currentRoute === 'about');

      if (isRouteMatch) {
        window.history.pushState({}, '', '/');
      }
    }
  }, [windows, closeWindow]);

  const handleBackClick = () => {
    if (isRecentsView) {
      setIsRecentsView(false);
      return;
    }
    const topWin = [...windows]
      .filter(w => w.isOpen && !w.isMinimized)
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))[0];
    if (topWin) {
      handleCloseWindow(topWin.id);
    }
  };

  if (!isBooted) {
    return (
      <BootScreen 
        isFading={isFading} 
        onLaunch={handleLaunch} 
      />
    );
  }

  return (
    <OsDataProvider>
      <DesktopBackground 
        wallpaper={wallpaper} 
        isMobile={isMobile} 
      >
        {/* Mobile status bar: CSS-controlled visibility for instant matching */}
        <div className="block md:hidden">
          <AndroidStatusBar />
        </div>
        
        {/* Desktop top bar: CSS-controlled visibility */}
        <div className="hidden md:block">
          <TopBar onOpenApp={openWindow} showClock={showClock} />
        </div>

        <div 
          ref={desktopRef}
          className={`${isMobile ? 'hidden' : 'absolute inset-0 top-8 bottom-[80px] pointer-events-none'}`} 
          style={{ zIndex: 5 }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.08)', zIndex: 1 }} />

        {/* ===== MOBILE HOME SCREEN: CSS-visible on <768px ===== */}
        <div 
          className="block md:hidden flex flex-col justify-between h-full w-full relative z-[2]"
          style={{ display: anyWindowOpen ? 'none' : undefined }}
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
                className="text-white/95 text-center font-extrabold tracking-tighter text-4xl"
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
                  fontFamily: 'Inter, system-ui, sans-serif',
                  lineHeight: 1.1,
                }}
              >
                {USER_CONFIG.name}
              </h1>
              <p className="text-zinc-200 dark:text-zinc-300 font-medium text-lg tracking-wide mt-2 opacity-90">
                Frontend Developer & UI/UX Designer
              </p>
            </div>
            
            <div className="relative w-full h-full flex flex-col pt-4 overflow-y-auto" style={{ zIndex: 1, paddingBottom: '100px' }}>
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

        {/* ===== DESKTOP HOME SCREEN: CSS-visible on >=768px ===== */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            style={{ zIndex: 0 }}
          >
            <div className="absolute w-[600px] h-[600px] rounded-full bg-white opacity-[0.03] blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 z-10 pointer-events-auto">
              <div className="w-full relative min-h-[120px] md:min-h-[160px] flex items-center justify-center">
                <TextPressure alpha={false} flex={false} italic={true} minFontSize={52} stroke={false} text="Shrawan Karki" textColor="#FFFFFF" weight={true} width={true}/>
              </div>
              <p className="text-zinc-200 dark:text-zinc-200 font-medium text-lg md:text-2xl tracking-wide mt-2 drop-shadow-md text-center">
                Frontend Developer & UI/UX Designer
              </p>
            </div>
          </motion.div>
        </div>

        <DesktopWidget onOpenCv={() => openWindow('resume')} onOpenResume={() => openWindow('resume')} onOpenAbout={() => openWindow('resume')} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 100 }}>
          <AnimatePresence>
            {windows
              .filter(w => w.isOpen && !w.isMinimized)
              .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
              .map(win => (
                <div key={win.id} className="pointer-events-auto">
                  <Window
                    window={win}
                    onClose={handleCloseWindow}
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
                      onClose={() => handleCloseWindow(win.id)}
                    />
                  </Window>
                </div>
              ))}
          </AnimatePresence>
        </div>

        {/* Mobile back button */}
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

        {/* Desktop icons: CSS-controlled visibility */}
        <div className="hidden md:block">
          <DesktopIcons 
            windows={windows}
            onOpen={handleAppClick} 
            isMobile={false}
          />
        </div>

        {/* Desktop dock: CSS-controlled visibility */}
        <div className="hidden md:block">
          <Dock 
            windows={windows} 
            onOpen={handleAppClick} 
          />
        </div>
      </DesktopBackground>
    </OsDataProvider>
  );
}
