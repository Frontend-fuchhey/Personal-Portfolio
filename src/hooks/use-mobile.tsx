import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Checks User-Agent for mobile device signatures.
 * This is synchronous and available immediately — no layout needed.
 */
function isUserAgentMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Returns a best-effort mobile guess that works synchronously on first render.
 * Combines UA sniffing with screen.width (which is stable even in WebViews
 * where window.innerWidth may initially report a desktop-like value).
 */
function getInitialMobileState(): boolean {
  if (typeof window === 'undefined') return false;

  const uaMobile = isUserAgentMobile();
  // screen.width reports the physical device width and is not affected
  // by delayed viewport sizing in in-app browsers (LinkedIn, Instagram, etc.)
  const screenMobile = Math.min(window.innerWidth, window.screen.width) < MOBILE_BREAKPOINT;

  return uaMobile || screenMobile;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(getInitialMobileState);

  useEffect(() => {
    const checkMobile = () => {
      const uaMobile = isUserAgentMobile();
      const screenWidthMobile = Math.min(window.innerWidth, window.screen.width) < MOBILE_BREAKPOINT;
      const mediaQueryMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;

      setIsMobile(uaMobile || screenWidthMobile || mediaQueryMobile);
    };

    // Run once immediately in case innerWidth has settled by now
    checkMobile();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return isMobile;
}
