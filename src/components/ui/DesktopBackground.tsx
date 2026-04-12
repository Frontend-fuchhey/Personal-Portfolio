import { memo } from 'react';
import { Wallpaper, wallpaperStyle } from '../../types/os';

interface DesktopBackgroundProps {
  wallpaper: Wallpaper;
  isMobile: boolean;
  children: React.ReactNode;
}

export const DesktopBackground = memo(({ wallpaper, isMobile, children }: DesktopBackgroundProps) => {
  return (
    <div
      className={`w-screen ${isMobile ? 'h-[100dvh]' : 'h-screen'} overflow-hidden relative select-none ${isMobile ? 'font-roboto' : ''}`}
      style={{ 
        ...wallpaperStyle(wallpaper), 
        transition: 'background 0.8s ease',
        backgroundPosition: isMobile ? 'center center' : 'center',
        backgroundSize: 'cover'
      }}
    >
      {children}
    </div>
  );
});
