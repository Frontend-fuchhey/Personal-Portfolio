import { memo, useState, useEffect } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppId } from '../../types/os';

const Clock = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="flex items-center gap-2 text-white text-[11px] opacity-90">
      <span>{formatDate(time)}</span>
      <span className="font-bold">{formatTime(time)}</span>
    </div>
  );
});

interface TopBarProps {
  onOpenApp?: (appId: AppId) => void;
  showClock?: boolean;
}

export function TopBar({ onOpenApp, showClock = true }: TopBarProps) {

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-8 z-[600] flex items-center px-4"
      style={{
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320, delay: 0.1 }}
    >
      <div className="flex-1 flex items-center ml-2">
        <span 
          onClick={() => onOpenApp?.('about')}
          className="text-white text-[13px] font-bold tracking-tight cursor-pointer hover:opacity-75 transition-opacity px-2"
        >
          Shrawan OS
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5 text-white opacity-90" />
        </div>
        <div className="flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-white opacity-90" />
        </div>
        <div className="flex items-center gap-1 mr-1">
          <Battery className="w-3.5 h-3.5 text-white opacity-90" />
          <span className="text-white text-[11px] opacity-90 ml-1">100%</span>
        </div>
        {showClock && <Clock />}
      </div>
    </motion.div>
  );
}
