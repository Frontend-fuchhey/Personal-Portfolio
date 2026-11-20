import { motion } from 'framer-motion';
import { useOsData } from '../../hooks/useOsData';

interface DesktopWidgetProps {
  onOpenCv?: () => void;
  onOpenResume?: () => void;
  onOpenAbout?: () => void;
}

export function DesktopWidget({ onOpenCv, onOpenResume, onOpenAbout }: DesktopWidgetProps) {
  const { profile } = useOsData();
  const handleOpen = onOpenCv || onOpenResume || onOpenAbout || (() => {});
  const displayName = profile?.name?.trim() || 'Shrawan Karki';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'SK';

  return (
    <motion.div
      className="absolute left-10 bottom-24 hidden lg:inline-flex flex-row items-center gap-2.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg select-none hover:bg-white/15 transition-all w-fit cursor-pointer group z-10"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      onClick={handleOpen}
    >
      {/* Profile Pic or Initials Badge */}
      {profile?.profilePic ? (
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-inner">
          <img src={profile.profilePic} alt={displayName} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-inner">
          {initials}
        </div>
      )}

      {/* Profile Links Text */}
      <div className="flex flex-col pr-2">
        <span className="text-white font-semibold text-sm">{displayName}</span> 
        <a 
          href="/resume" 
          onClick={(e) => { e.preventDefault(); handleOpen(); }}
          className="flex items-center gap-1 text-white/70 text-[11px] hover:text-white transition-colors"
        >
          <span>VIEW CV 📄</span>
        </a>
      </div>
    </motion.div>
  );
}
