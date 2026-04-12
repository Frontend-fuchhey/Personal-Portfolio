import { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export function AndroidStatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-transparent text-white px-5 flex justify-between items-center text-[12px] font-medium fixed top-0 left-0 right-0 z-[10001] font-roboto">
      <div className="font-semibold drop-shadow-sm">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="flex items-center gap-2 opacity-90">
        <Wifi size={14} strokeWidth={2.5} />
        <div className="flex items-center gap-0.5">
          <Battery size={16} fill="white" className="rotate-0" />
        </div>
      </div>
    </div>
  );
}
