import { ChevronLeft, Circle, Square } from 'lucide-react';

interface AndroidNavigationBarProps {
  onBack: () => void;
  onHome: () => void;
  onRecents: () => void;
}

export function AndroidNavigationBar({ onBack, onHome, onRecents }: AndroidNavigationBarProps) {
  return (
    <div className="h-[48px] bg-transparent flex items-center justify-around fixed bottom-2 left-0 right-0 z-[10002] px-12">
      <button 
        onClick={onBack}
        className="text-white/80 hover:text-white transition-colors active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={onHome}
        className="text-white/80 hover:text-white transition-colors active:scale-95"
      >
        <Circle size={18} fill="#ffffff" className="opacity-90" />
      </button>
      <button 
        onClick={onRecents}
        className="text-white/80 hover:text-white transition-colors active:scale-95"
      >
        <Square size={18} />
      </button>
    </div>
  );
}
