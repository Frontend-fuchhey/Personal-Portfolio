import profilePic from '../assets/shrawan.jpg';
import garmentIcon from '../assets/garmentflow.png';
import gallery2 from '../assets/maingarment.png';
import mbPortfolio from '../assets/mb.png';
import lpPortfolio from '../assets/lp.png';
import resumeIoBg from '../assets/resume-io.png';
import resumeLogo from '../assets/resume-logo.png';
import itahariLogo from '../assets/itahari-logo.png';
import arnikoLogo from '../assets/arniko-logo.png';
import imageA from '../assets/galleryimages/ImageA.png';
import imageB from '../assets/galleryimages/ImageB.png';
import imageC from '../assets/galleryimages/ImageC.png';
import imageD from '../assets/galleryimages/ImageD.png';
import tictactoeIcon from '../assets/tictactoe.png';

export const CRITICAL_IMAGES: string[] = [
  // Primary desktop & wallpaper assets
  '/w3.png',
  '/fluid_wave_bg.png',
  profilePic,

  // Projects app icons & preview images
  garmentIcon,
  resumeLogo,
  resumeIoBg,
  gallery2,
  lpPortfolio,
  mbPortfolio,

  // Education & certificates
  itahariLogo,
  arnikoLogo,
  '/certificates/class10.jpg',
  '/certificates/class12.jpg',

  // Photos app gallery
  imageA,
  imageB,
  imageC,
  imageD,

  // System & app icons
  tictactoeIcon,
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
  maxTimeoutMs = 5000
): Promise<void> {
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

  // Race all preloads against a safety timeout
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, maxTimeoutMs);
  });

  await Promise.race([
    Promise.allSettled(preloadPromises),
    timeoutPromise
  ]);
}
