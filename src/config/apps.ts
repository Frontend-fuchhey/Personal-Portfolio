import { TicTacToeIcon } from '../components/icons/TicTacToeIcon';

export interface AppConfig {
  id: string;
  title: string;
  icon: string | React.ComponentType;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  defaultPosition?: {
    x: number | 'center';
    y: number | 'center';
  };
}

export const APPS_CONFIG: Record<string, AppConfig> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: 'user',
    defaultWidth: 980,
    defaultHeight: 660,
    minWidth: 700,
    minHeight: 500,
    defaultPosition: {
      x: 'center',
      y: 36,
    },
  },
  aboutme: {
    id: 'aboutme',
    title: 'About Me',
    icon: 'user',
    defaultWidth: 980,
    defaultHeight: 660,
    minWidth: 700,
    minHeight: 500,
    defaultPosition: {
      x: 'center',
      y: 36,
    },
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: 'folder',
    defaultWidth: 860,
    defaultHeight: 580,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    defaultWidth: 680,
    defaultHeight: 420,
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: 'mail',
    defaultWidth: 520,
    defaultHeight: 700,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    defaultWidth: 560,
    defaultHeight: 460,
  },
  photos: {
    id: 'photos',
    title: 'Photos',
    icon: 'image',
    defaultWidth: 1000,
    defaultHeight: 650,
  },
  tictactoe: {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    icon: TicTacToeIcon,
    defaultWidth: 360,
    defaultHeight: 500,
    minWidth: 320,
    minHeight: 460,
  },
};
