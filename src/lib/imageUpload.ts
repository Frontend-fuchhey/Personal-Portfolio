export interface CompressOptions {
  maxWidth?: number;
  quality?: number;
  /** Maximum size of the resulting data URL in bytes (default ~700KB). */
  maxBytes?: number;
}

const DEFAULT_MAX_BYTES = 700 * 1024;
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read this image. Try a different JPG, PNG or WebP file.'));
    };
    img.src = url;
  });
}

// Approximate decoded byte size of a data URL (base64 length * 3/4).
const dataUrlBytes = (dataUrl: string) => Math.floor((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);

function render(img: HTMLImageElement, width: number, type: string, quality: number, fillWhite: boolean): string {
  const scale = Math.min(1, width / img.naturalWidth);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser does not support image processing.');
  if (fillWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL(type, quality);
}

export async function fileToCompressedDataUrl(
  file: File,
  { maxWidth = 1280, quality = 0.82, maxBytes = DEFAULT_MAX_BYTES }: CompressOptions = {}
): Promise<string> {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, WebP).');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('This image is too large (over 25MB). Please pick a smaller one.');
  }

  const img = await loadImage(file);

  // Keep PNG as PNG only when small (preserves transparency).
  if (file.type === 'image/png') {
    const png = render(img, Math.min(maxWidth, 800), 'image/png', 1, false);
    if (dataUrlBytes(png) <= 200 * 1024) return png;
  }

  let width = maxWidth;
  let q = quality;
  let result = render(img, width, 'image/jpeg', q, true);

  for (let i = 0; i < 12 && dataUrlBytes(result) > maxBytes; i++) {
    if (q > 0.5) q = Math.max(0.5, q - 0.1);
    else width = Math.round(width * 0.8);
    if (width < 200) break;
    result = render(img, width, 'image/jpeg', q, true);
  }

  if (dataUrlBytes(result) > maxBytes) {
    throw new Error('Could not compress this image small enough. Please use a smaller image.');
  }
  return result;
}
