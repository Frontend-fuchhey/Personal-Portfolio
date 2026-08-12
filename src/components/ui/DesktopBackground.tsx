import { memo, useState, useEffect } from 'react';
import { Wallpaper, wallpaperStyle } from '../../types/os';

interface DesktopBackgroundProps {
  wallpaper: Wallpaper;
  isMobile: boolean;
  children: React.ReactNode;
}

export const DesktopBackground = memo(({ wallpaper, isMobile, children }: DesktopBackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (wallpaper.type === 'url') {
      setIsLoaded(false);
      const img = new Image();
      img.src = wallpaper.value;
      
      const handleLoad = () => {
        setIsLoaded(true);
      };
      
      img.onload = handleLoad;
      img.onerror = handleLoad;
      
      if (img.complete) {
        setIsLoaded(true);
      }
      
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setIsLoaded(true);
    }
  }, [wallpaper]);

  const style = wallpaperStyle(wallpaper);

  return (
    <div
      className={`w-full max-w-full overflow-x-hidden ${isMobile ? 'h-[100dvh]' : 'h-screen'} overflow-hidden relative select-none ${isMobile ? 'font-roboto' : ''}`}
      style={{
        background: '#0d0f12',
      }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          ...style,
          backgroundPosition: isMobile ? 'center center' : 'center',
          backgroundSize: 'cover',
        }}
      />
      {children}
    </div>
  );
});
