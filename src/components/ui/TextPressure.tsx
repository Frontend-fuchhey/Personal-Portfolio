import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  textColor?: string;
  className?: string;
  minFontSize?: number;
}

const TextPressure = ({
  text = 'Shrawan Karki',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  textColor = '#FFFFFF',
  className = '',
  minFontSize = 44
}: TextPressureProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const cursorRef = useRef({ x: -1000, y: -1000 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        cursorRef.current.x = e.touches[0].clientX;
        cursorRef.current.y = e.touches[0].clientY;
      }
    };
    const handleMouseLeave = () => {
      cursorRef.current.x = -1000;
      cursorRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current) return;
    const { width: containerW } = containerRef.current.getBoundingClientRect();
    const calculatedSize = Math.max(containerW / (chars.length * 0.65), minFontSize);
    setFontSize(calculatedSize);
  }, [chars.length, minFontSize]);

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [setSize]);

  useEffect(() => {
    let rafId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.15;

      const hoverRadius = 180; // Proximity threshold in pixels

      spansRef.current.forEach((span, index) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const charCenter = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        };

        const d = dist(mouseRef.current, charCenter);

        // Baseline (Idle state - crisp, clean, bold)
        let wght = 700;
        let wdth = 100;
        let ital = 0;
        let translateY = 0;

        // Hover / Proximity Wobble Modulation
        if (d < hoverRadius) {
          const factor = 1 - d / hoverRadius; // 0 to 1 float
          
          // Smooth variable font modulation
          wght = Math.min(900, Math.floor(700 + factor * 200));
          wdth = Math.min(150, Math.floor(100 + factor * 45));
          ital = parseFloat((factor * 0.8).toFixed(2));
          
          // Subtle wobble spring bounce
          translateY = Math.sin(time * 4 + index) * (factor * 6);
        }

        const fontSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
        if (span.style.fontVariationSettings !== fontSettings) {
          span.style.fontVariationSettings = fontSettings;
        }

        const transformStyle = `translateY(${translateY.toFixed(1)}px)`;
        if (span.style.transform !== transformStyle) {
          span.style.transform = transformStyle;
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const styleElement = useMemo(() => {
    return (
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('${fontUrl}');
        .text-pressure-container {
          font-family: '${fontFamily}', sans-serif;
          color: ${textColor};
        }
      `}} />
    );
  }, [fontFamily, fontUrl, textColor]);

  return (
    <div
      ref={containerRef}
      className={`text-pressure-container w-full flex justify-center items-center select-none ${className}`}
      style={{ background: 'transparent' }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className="flex justify-center items-center tracking-normal m-0 p-0"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.1,
          textAlign: 'center',
          color: textColor
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => {
              spansRef.current[i] = el;
            }}
            style={{
              display: 'inline-block',
              transition: 'font-variation-settings 0.15s ease-out, transform 0.15s ease-out',
              willChange: 'transform, font-variation-settings',
              fontVariationSettings: "'wght' 700, 'wdth' 100, 'ital' 0"
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
