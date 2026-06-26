import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { USER_CONFIG } from '../../data/userConfig';
import profilePic from '../../assets/shrawan.jpg';

interface DesktopWidgetProps {
  onOpenAbout: () => void;
}

export function DesktopWidget({ onOpenAbout }: DesktopWidgetProps) {
  return (
    <motion.div
      className="absolute left-10 bottom-24 hidden lg:flex items-center gap-6 p-5 rounded-3xl cursor-pointer group"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        zIndex: 2,
      }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      whileHover={{ y: -5, background: 'rgba(255, 255, 255, 0.12)', scale: 1.02 }}
      onClick={onOpenAbout}
    >
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-lg antialiased">
        <img 
          src={profilePic} 
          alt={USER_CONFIG.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 object-center image-render-crisp"
          style={{ 
            // @ts-ignore
            WebkitImageRendering: 'optimize-contrast', 
            imageRendering: 'crisp-edges',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
          onError={(e) => {
            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${USER_CONFIG.name}&backgroundColor=b6e3f4`;
          }}
        />
      </div>

      <div className="flex flex-col pr-4">
        <h3 className="text-white font-bold text-lg leading-tight mb-1">
          {USER_CONFIG.name}
        </h3>
        <div className="flex items-center gap-2 text-white/50 group-hover:text-blue-400 transition-colors">
          <span className="text-[10px] font-black uppercase tracking-widest">
            View Profile
          </span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      <div className="absolute inset-0 rounded-3xl bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}
