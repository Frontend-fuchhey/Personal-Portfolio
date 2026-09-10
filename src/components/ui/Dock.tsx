import { motion } from 'framer-motion';
import {
  User,
  FolderOpen,
  Terminal,
  Mail,
  Settings as SettingsIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { AppId, WindowState } from "../../types/os";

interface DockApp {
  id: AppId;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const DOCK_APPS: DockApp[] = [
  { id: 'about', label: 'About Me', icon: <User className="w-7 h-7 text-white" />, color: 'from-blue-500 to-blue-600' },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-7 h-7 text-white" />, color: 'from-orange-400 to-orange-500' },
  { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-7 h-7 text-white" />, color: 'from-gray-700 to-gray-900' },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-7 h-7 text-white" />, color: 'from-green-500 to-green-600' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-7 h-7 text-white" />, color: 'from-slate-500 to-slate-700' },
];

interface DockProps {
  windows: WindowState[];
  onOpen: (appId: AppId) => void;
}

export function Dock({ windows, onOpen }: DockProps) {
  const isOpen = (appId: AppId) => windows.some(w => w.appId === appId && (w.isOpen || w.isMinimized));

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[500]">
      <motion.div
        className="glass-dock rounded-2xl px-3 py-2 flex items-end gap-1.5"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.2 }}
      >
        {DOCK_APPS.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            isOpen={isOpen(app.id)}
            onClick={() => onOpen(app.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface DockIconProps {
  app: DockApp;
  isOpen: boolean;
  onClick: () => void;
}

function DockIcon({ app, isOpen, onClick }: DockIconProps) {
  return (
    <motion.div className="relative flex flex-col items-center" whileHover="hover">
      <motion.div
        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
        variants={{ hover: { opacity: 1, y: 0 }, initial: { opacity: 0, y: 4 } }}
        initial="initial"
        style={{ fontSize: 11 }}
      >
        {app.label}
      </motion.div>

      <motion.button
        onClick={onClick}
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg cursor-pointer relative`}
        variants={{
          hover: { scale: 1.2, y: -6 },
          initial: { scale: 1, y: 0 },
        }}
        initial="initial"
        transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        whileTap={{ scale: 0.9 }}
        title={app.label}
      >
        {app.icon}
      </motion.button>

      {isOpen && (
        <motion.div
          layoutId={`dock-dot-${app.id}`}
          className="w-1 h-1 rounded-full bg-white mt-1.5 shadow-[0_0_8px_rgba(255,255,255,1)]"
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 0 }}
        />
      )}
      {!isOpen && <div className="w-1 h-1 mt-1.5" />}
    </motion.div>
  );
}
