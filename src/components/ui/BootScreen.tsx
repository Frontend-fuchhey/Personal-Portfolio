import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "SHRAWAN KARKI BOOT LOADER", delay: 0 },
  { text: "SHRAWAN_OS v1.0.4 LOADING...", delay: 400 },
  { text: "MEMORY CHECK OK", delay: 1000 },
  { text: "INITIALIZING INTERFACE...", delay: 1500 },
  { text: "CONNECTING TO PORTFOLIO_DB...", delay: 2200 },
  { text: "SYSTEM READY.", delay: 2800 },
];

export const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const playBeep = () => {
      const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
      audio.volume = 0.15;
      
      const play = async () => {
        try {
          await audio.play();
          window.removeEventListener('click', play);
        } catch (e) {
          // Autoplay blocked. Beep will play on first touch/click.
        }
      };

      play();
      window.addEventListener('click', play, { once: true });
    };

    playBeep();

    const timers = BOOT_LINES.map((line, index) => {
      return setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, line.delay);
    });

    // Complete sequence after 3500ms
    const finalTimer = setTimeout(() => {
      onComplete();
    }, 3500); 

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-black text-white p-8 md:p-12 font-mono flex flex-col items-start justify-start select-none overflow-hidden"
      style={{ fontFamily: "'VT323', monospace" }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-4xl w-full pt-10">
        {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl mb-3 tracking-widest text-[#e0e0e0]"
          >
            <span className="text-[#00ff00] mr-4 opacity-70">{">"}</span>
            {line.text}
          </motion.div>
        ))}
        {visibleLines < BOOT_LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl text-[#00ff00]"
          >
            ▊
          </motion.span>
        )}
      </div>
      
      {/* Scanline & CRT effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
    </motion.div>
  );
};
