import { motion } from 'framer-motion';

interface DesktopWidgetProps {
  onOpenCv?: () => void;
  onOpenResume?: () => void;
  onOpenAbout?: () => void;
}

export function DesktopWidget({ onOpenCv, onOpenResume, onOpenAbout }: DesktopWidgetProps) {
  const handleOpen = onOpenCv || onOpenResume || onOpenAbout || (() => {});

  return (
    <motion.div
      className="absolute left-10 bottom-24 hidden lg:inline-flex flex-row items-center gap-2.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg select-none hover:bg-white/15 transition-all w-fit cursor-pointer group z-10"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      onClick={handleOpen}
    >
      {/* Vector Initials Badge - Option 2 */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-inner">
        SK
      </div>

      {/* Profile Links Text */}
      <div className="flex flex-col pr-2">
        <span className="text-white font-semibold text-sm">Shrawan Karki</span> 
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
