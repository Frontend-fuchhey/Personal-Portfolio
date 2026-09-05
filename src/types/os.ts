export type AppId = 'about' | 'aboutme' | 'projects' | 'terminal' | 'contact' | 'settings' | 'resume' | 'cert-class12' | 'cert-class10' | 'admin' | 'photos' | 'tictactoe';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  zIndex: number;
}

export interface Wallpaper {
  id: string;
  name: string;
  value: string;
  type: 'gradient' | 'solid' | 'url';
}

export function wallpaperStyle(wp: Wallpaper): React.CSSProperties {
  if (wp.type === 'url') {
    return {
      backgroundImage: `url(${wp.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return { background: wp.value };
}
