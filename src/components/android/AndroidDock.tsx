import { motion } from 'framer-motion';
import { User, FolderOpen, Terminal, Mail, Image as ImageIcon } from 'lucide-react';
import { AppId } from '../../types/os';

interface AndroidDockProps {
  onOpen: (appId: AppId) => void;
}

const DOCK_APPS = [
  { appId: 'about', icon: <User size={28} />, color: 'from-blue-500 to-blue-700' },
  { appId: 'projects', icon: <FolderOpen size={28} />, color: 'from-orange-400 to-orange-600' },
  { appId: 'terminal', icon: <Terminal size={28} />, color: 'from-gray-700 to-gray-900' },
  { appId: 'contact', icon: <Mail size={28} />, color: 'from-green-500 to-green-700' },
];

export function AndroidDock({ onOpen }: AndroidDockProps) {
  return (
    <div 
      className="relative mx-5 h-[84px] flex items-center justify-around px-4 z-[100]"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      {DOCK_APPS.map((app, i) => (
        <motion.div
          key={app.appId}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onOpen(app.appId as AppId)}
          className={`w-[56px] h-[56px] rounded-[20px] bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg cursor-pointer`}
        >
          {app.icon}
        </motion.div>
      ))}
    </div>
  );
}
