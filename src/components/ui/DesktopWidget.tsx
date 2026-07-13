import { motion } from 'framer-motion';

interface DesktopWidgetProps {
  onOpenAbout: () => void;
}

export function DesktopWidget({ onOpenAbout }: DesktopWidgetProps) {
  return (
    <motion.div
      className="absolute left-10 bottom-24 hidden lg:inline-flex flex-row items-center gap-2.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg select-none hover:bg-white/15 transition-all w-fit cursor-pointer group z-10"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      onClick={onOpenAbout}
    >
      {/* Vector Initials Badge - Option 2 */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-inner">
        SK
      </div>

      {/* Profile Links Text (keep existing content and structure) */}
      <div className="flex flex-col pr-2">
        {/* Kept existing 'Shrawan Karki' name */}
        <span className="text-white font-semibold text-sm">Shrawan Karki</span> 
        {/* Kept existing 'VIEW PROFILE' link structure and icon */}
        <a 
          href="/profile" 
          onClick={(e) => { e.preventDefault(); onOpenAbout(); }}
          className="flex items-center gap-1 text-white/70 text-[11px] hover:text-white transition-colors"
        >
          <span>VIEW PROFILE</span>
          {/* Kept existing external link SVG icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
        </a>
      </div>
    </motion.div>
  );
}
