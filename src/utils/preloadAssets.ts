import profilePic from '../assets/shrawan.jpg';
import garmentIcon from '../assets/garmentflow.png';
import gallery2 from '../assets/maingarment.jpg';
import mbPortfolio from '../assets/mb.png';
import lpPortfolio from '../assets/lp.jpg';
import resumeIoBg from '../assets/resume-io.png';
import resumeLogo from '../assets/resume-logo.png';
import itahariLogo from '../assets/itahari-logo.png';
import arnikoLogo from '../assets/arniko-logo.png';
import imageA from '../assets/galleryimages/ImageA.png';
import imageB from '../assets/galleryimages/ImageB.jpg';
import imageC from '../assets/galleryimages/ImageC.jpg';
import imageD from '../assets/galleryimages/ImageD.png';
import tictactoeIcon from '../assets/tictactoe.png';

// Critical assets required strictly for the initial desktop / mobile home screen
export const CRITICAL_IMAGES: string[] = [
  '/w3.jpg',
  profilePic,
  tictactoeIcon,
];

// Secondary background assets loaded AFTER the session is interactive
export const SECONDARY_IMAGES: string[] = [
  '/fluid_wave_bg.jpg',
  garmentIcon,
  resumeLogo,
  resumeIoBg,
  gallery2,
  lpPortfolio,
  mbPortfolio,
  itahariLogo,
  arnikoLogo,
  '/certificates/class10.jpg',
  '/certificates/class12.jpg',
  imageA,
  imageB,
  imageC,
  imageD,
  '/apple-touch-icon.png',
];

/**
 * Preloads an image and decodes it in memory so it renders instantly with 0ms scanlines.
 */
function preloadAndDecodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    // If already loaded/cached by browser
    if (img.complete) {
      if ('decode' in img) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
      return;
    }

    img.onload = () => {
      if ('decode' in img) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };

    img.onerror = () => {
      // Don't fail the preloader if a single image fails
      resolve();
    };
  });
}

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Preloads all critical application assets with progress reporting
 * and a hard safety timeout to guarantee the boot sequence never hangs.
 */
export async function preloadAllAssets(
  onProgress?: (progress: PreloadProgress) => void,
  maxTimeoutMs = 1500
): Promise<void> {
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || 
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );

  const total = CRITICAL_IMAGES.length;
  let loaded = 0;

  const updateProgress = () => {
    loaded++;
    const percentage = Math.min(100, Math.round((loaded / total) * 100));
    if (onProgress) {
      onProgress({ loaded, total, percentage });
    }
  };

  const preloadPromises = CRITICAL_IMAGES.map(async (src) => {
    await preloadAndDecodeImage(src);
    updateProgress();
  });

  // Race all preloads against a fast safety timeout (800ms mobile, 1500ms desktop)
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, isMobile ? 800 : maxTimeoutMs);
  });

  await Promise.race([
    Promise.allSettled(preloadPromises),
    timeoutPromise
  ]);

  // Silently preload secondary assets in the background during idle time
  if (typeof window !== 'undefined') {
    const idleCallback = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1000));
    idleCallback(() => {
      SECONDARY_IMAGES.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }
}
