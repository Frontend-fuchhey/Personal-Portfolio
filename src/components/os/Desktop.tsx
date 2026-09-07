import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { ControlCenter } from './ControlCenter';
import { WindowManager } from './WindowManager';
import { Dock } from '../ui/Dock';
import { DesktopIcons as DesktopGrid } from '../ui/DesktopIcons';
import { DesktopBackground } from '../ui/DesktopBackground';
import { WALLPAPERS } from '../../data/wallpapers';
import { useWindows } from '../../hooks/useWindows';
import { AppId, Wallpaper } from '../../types/os';

export interface DesktopProps {
  wallpaper?: Wallpaper;
  onWallpaperChange?: (wallpaper: Wallpaper) => void;
  onOpenApp?: (appId: AppId) => void;
  children?: React.ReactNode;
}

export function Desktop({
  wallpaper = WALLPAPERS[0],
  onWallpaperChange = () => {},
  onOpenApp,
  children,
}: DesktopProps) {
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { windows, openWindow } = useWindows();

  const handleOpenApp = onOpenApp || openWindow;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Top Status Bar */}
      <TopBar
        onOpenApp={handleOpenApp}
        wallpaper={wallpaper}
        onWallpaperChange={onWallpaperChange}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        isControlCenterOpen={isControlCenterOpen}
        onToggleControlCenter={() => setIsControlCenterOpen((prev) => !prev)}
        onCloseControlCenter={() => setIsControlCenterOpen(false)}
      />

      {/* Desktop Icons & Wallpaper */}
      <DesktopBackground wallpaper={wallpaper} isMobile={false}>
        <div className="hidden md:block">
          <DesktopGrid windows={windows} onOpen={handleOpenApp} isMobile={false} />
        </div>
        {children}
      </DesktopBackground>

      {/* Window Manager */}
      <WindowManager />

      {/* Control Center Popover (Z-Index 100) */}
      {isControlCenterOpen && (
        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
          onOpenApp={handleOpenApp}
          wallpaper={wallpaper}
          onWallpaperChange={onWallpaperChange}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        />
      )}

      {/* Bottom Dock (Always Rendered, Z-Index 50) */}
      <Dock windows={windows} onOpen={handleOpenApp} />
    </div>
  );
}

export { Desktop as DesktopLayout, Desktop as OSLayout };
export default Desktop;
