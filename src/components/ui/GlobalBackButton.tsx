import { motion } from 'framer-motion';

interface GlobalBackButtonProps {
  onClick: () => void;
}

export function GlobalBackButton({ onClick }: GlobalBackButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={onClick}
      className="fixed top-[2.5rem] left-[1.5rem] w-12 h-12 rounded-full flex items-center justify-center text-black shadow-lg pointer-events-auto transition-all active:scale-90 active:bg-black/10"
      style={{
        zIndex: 999999,
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <span className="text-2xl font-bold mt-[-2px]">←</span>
    </motion.button>
  );
}
