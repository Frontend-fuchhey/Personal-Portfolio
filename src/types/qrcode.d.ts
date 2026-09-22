declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    margin?: number;
    width?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export function toDataURL(
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  export function toDataURL(
    text: string,
    callback: (err: Error | null, url: string) => void
  ): void;

  export function toDataURL(
    text: string,
    options: QRCodeToDataURLOptions,
    callback: (err: Error | null, url: string) => void
  ): void;

  export function toString(
    text: string,
    options?: { type?: 'svg' | 'utf8'; margin?: number; color?: { dark?: string; light?: string } },
    callback?: (err: Error | null, string: string) => void
  ): Promise<string>;
}
