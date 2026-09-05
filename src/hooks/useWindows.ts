import { useState, useCallback } from 'react';
import { WindowState, AppId } from '../types/os';

const DEFAULT_WINDOWS: Record<AppId, Omit<WindowState, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>> = {
  about: { id: 'about', appId: 'about', title: 'About Me', x: 0, y: 0, width: 980, height: 660, minWidth: 700, minHeight: 500 },
  aboutme: { id: 'aboutme', appId: 'aboutme', title: 'About Me', x: 0, y: 0, width: 980, height: 660, minWidth: 700, minHeight: 500 },
  projects: { id: 'projects', appId: 'projects', title: 'File Explorer — Projects', x: 0, y: 0, width: 860, height: 580 },
  terminal: { id: 'terminal', appId: 'terminal', title: 'Terminal', x: 0, y: 0, width: 680, height: 420 },
  contact: { id: 'contact', appId: 'contact', title: 'Contact', x: 0, y: 0, width: 520, height: 700 },
  settings: { id: 'settings', appId: 'settings', title: 'Settings', x: 0, y: 0, width: 560, height: 460 },
  resume: { id: 'resume', appId: 'resume', title: 'Digital Resume — Shrawan Karki', x: 0, y: 0, width: 850, height: 620 },
  'cert-class12': { id: 'cert-class12', appId: 'cert-class12', title: 'Certificate - Class 12', x: 50, y: 50, width: 800, height: 600 },
  'cert-class10': { id: 'cert-class10', appId: 'cert-class10', title: 'Certificate - Class 10', x: 80, y: 80, width: 800, height: 600 },
  admin: { id: 'admin', appId: 'admin', title: 'System Administration — C-Panel', x: 0, y: 0, width: 950, height: 650 },
  photos: { id: 'photos', appId: 'photos', title: 'Photos', x: 0, y: 0, width: 1000, height: 650 },
  tictactoe: { id: 'tictactoe', appId: 'tictactoe', title: 'Tic Tac Toe', x: 0, y: 0, width: 360, height: 500, minWidth: 320, minHeight: 460 },
};

let zCounter = 100;

export function useWindows() {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback((appId: AppId) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        return prev.map(w =>
          w.appId === appId
            ? { ...w, isOpen: true, isMinimized: false, zIndex: ++zCounter }
            : w
        );
      }
      const defaults = DEFAULT_WINDOWS[appId];
      let { width, height, x, y } = defaults;

      if (appId.startsWith('cert-')) {
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        
        width = 900;
        height = Math.round(viewportHeight * 0.85);
        
        // Centering: Window.tsx uses top: 50%, left: 50% with negative margins, so 0,0 is centered.
        x = 0;
        y = 0;
      }

      const newWindow: WindowState = {
        ...defaults,
        width,
        height,
        x,
        y,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: ++zCounter,
      };
      return [...prev, newWindow];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: ++zCounter } : w));
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
  };
}
