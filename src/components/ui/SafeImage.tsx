import React, { useState, useRef, useEffect } from 'react';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  wrapperClassName?: string;
}

/**
 * SafeImage ensures an image never displays the progressive "top-to-bottom" scanline effect.
 * If the image is already preloaded/cached, it displays instantly.
 * If loading over a slow connection, it remains hidden until fully ready and then smoothly fades in.
 */
export const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  fallbackSrc,
  onLoad,
  onError,
  style,
  ...rest
}, forwardedRef) => {
  const localRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Combine forwarded ref and local ref
  const setRef = (node: HTMLImageElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
    }
  };

  useEffect(() => {
    // Check if the image is already cached/complete
    if (localRef.current && localRef.current.complete && localRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && !hasError) {
      setHasError(true);
      if (localRef.current) {
        localRef.current.src = fallbackSrc;
      }
    } else {
      setIsLoaded(true); // reveal fallback / broken state gracefully
    }
    if (onError) onError(e);
  };

  return (
    <img
      ref={setRef}
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} transition-opacity duration-300 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        ...style,
        // Ensures hardware acceleration and avoids sub-pixel re-renders
        transform: style?.transform || 'translateZ(0)',
        backfaceVisibility: style?.backfaceVisibility || 'hidden',
      }}
      {...rest}
    />
  );
});

SafeImage.displayName = 'SafeImage';
