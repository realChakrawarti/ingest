"use client";

import Image, { type ImageProps as NextImageProps } from "next/image";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "../shared/ui/skeleton";

type SmartImageProps = Omit<NextImageProps, "onLoadingComplete"> & {
  forceSkeleton?: boolean;
  fallbackSrc?: string;
  /** Use containerClassName to style the wrapper div */
  containerClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
  aspectRatio?: number | string;
  decorative?: boolean;
  ariaLive?: "polite" | "assertive" | undefined;
  /** Enable automatic fill behavior when no explicit width/height provided */
  autoFill?: boolean;
};


export default function SmartImage(props: SmartImageProps) {
  const {
    src,
    alt,
    className,
    containerClassName,
    imageClassName,
    skeletonClassName,
    priority,
    fallbackSrc,
    forceSkeleton,
    aspectRatio,
    loading,
    decorative,
    ariaLive,
    autoFill = false,
    ...rest
  } = props as SmartImageProps & {
    src: NextImageProps["src"];
    alt: string;
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [clientHydrated, setClientHydrated] = useState(false);
  const [attemptedFallback, setAttemptedFallback] = useState(false);
  const [invalidDimensions, setInvalidDimensions] = useState(false);

  useEffect(() => {
    setClientHydrated(true);
  }, []);

  // Warn about missing alt prop only when alt or decorative changes
  useEffect(() => {
    if (!alt && !decorative) {
      console.warn("SmartImage: 'alt' prop is required for accessibility.");
    }
  }, [alt, decorative]);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setAttemptedFallback(false);
    setInvalidDimensions(false);
  }, [src]);

  const showSkeleton = (forceSkeleton || !isLoaded) && clientHydrated;

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const effectiveSrc = (attemptedFallback || hasError) && fallbackSrc ? fallbackSrc : src;

  const effectiveLoading: NextImageProps["loading"] | undefined = useMemo(() => {
    if (priority) return undefined;
    return loading ?? "lazy";
  }, [priority, loading]);

  const hasAspect = aspectRatio !== undefined && aspectRatio !== null;
  const ratioStyle = useMemo(() => {
    if (!hasAspect) return undefined as React.CSSProperties | undefined;
    return { aspectRatio: String(aspectRatio) } as React.CSSProperties;
  }, [hasAspect, aspectRatio]);


  const baseRest = rest as Partial<NextImageProps> & Record<string, unknown>;
  const { 
    src: _srcIgnored, 
    alt: _altIgnored, 
    onLoad: userOnLoad, 
    onError: userOnError, 
    width, 
    height, 
    fill, 
    sizes, 
    ...imgRest 
  } = baseRest;
  
  const effectiveAlt = (decorative ? "" : alt ?? "") as string;
  
  const shouldAutoFill = autoFill && !width && !height && !fill;
  const effectiveFill = fill ?? shouldAutoFill;
  const effectiveSizes = sizes ?? (shouldAutoFill ? "100vw" : undefined);
  
  const internalOnLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    try {
      const imgEl = e.currentTarget as HTMLImageElement;
      
      if (imgEl && imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0) {
        setInvalidDimensions(false);
        handleLoadingComplete();
      } else {
        console.warn(`SmartImage: Image loaded but has invalid dimensions (${imgEl.naturalWidth}x${imgEl.naturalHeight}) for src: ${effectiveSrc}`);
      
          setInvalidDimensions(true);

          
          if (fallbackSrc && !attemptedFallback) {
            setAttemptedFallback(true);
            setHasError(false);
          } else {
            setInvalidDimensions(true);
            setHasError(true);
            setIsLoaded(false);
          }
      }
    } catch (err) {
      console.error("SmartImage: error while validating image load:", err);
      handleError();
    }

    if (userOnLoad) {
      try {
        userOnLoad(e);
      } catch (error) {
        console.error("Error in user onLoad handler:", error);
      }
    }
  };
  
  const internalOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const isCurrentlyFallback = Boolean(fallbackSrc && attemptedFallback);
    
    if (isCurrentlyFallback) {
      setHasError(true);
      setIsLoaded(false);
    } else if (fallbackSrc) {
      setAttemptedFallback(true);
      setHasError(false); 
    } else {
      handleError();
    }
    
    if (userOnError) {
      try {
        userOnError(e);
      } catch (error) {
        console.error("Error in user onError handler:", error);
      }
    }
  };
  
  const finalImageProps: NextImageProps = {
    ...(imgRest as NextImageProps),
    src: effectiveSrc,
    alt: effectiveAlt,
    priority,
    loading: effectiveLoading,
    width: effectiveFill ? undefined : width,
    height: effectiveFill ? undefined : height,
    fill: effectiveFill,
    sizes: effectiveSizes,
    onLoad: internalOnLoad,
    onError: internalOnError,
    role: decorative ? "presentation" : undefined,
    className: `relative z-0 ${className || imageClassName || ""}`.trim(),
  } as NextImageProps;

  return (
    <div
      className={`relative overflow-hidden ${containerClassName ?? ""}`.trim()}
      aria-busy={!isLoaded}
      aria-live={ariaLive}
      style={ratioStyle}
    >
      {showSkeleton && (
        <Skeleton
          aria-hidden
          className={`absolute inset-0 z-10 pointer-events-none ${skeletonClassName ?? ""}`.trim()}
          style={{ willChange: "opacity" }}
        />
      )}

      <Image {...finalImageProps} />

      {(hasError || invalidDimensions) && (!fallbackSrc || attemptedFallback) && (
        <div
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-600 select-none pointer-events-none"
        >
          {invalidDimensions ? "Invalid image dimensions" : "Image unavailable"}
        </div>
      )}
    </div>
  );
}
