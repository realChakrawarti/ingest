"use client";

import Image, { ImageProps as NextImageProps } from "next/image";
import React, { useEffect, useMemo, useState } from "react";

type SmartImageProps = Omit<NextImageProps, "onLoadingComplete"> & {
  forceSkeleton?: boolean;
  fallbackSrc?: string;
  containerClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
  aspectRatio?: number | string;
  decorative?: boolean;
  ariaLive?: "polite" | "assertive" | undefined;
};

// Skeleton styling constants for better maintainability
const SKELETON_BASE_CLASSES = "absolute inset-0 z-10 pointer-events-none";
const SKELETON_COLOR_CLASSES = "bg-gray-200 dark:bg-gray-800";
const SKELETON_ANIMATION_CLASSES = "motion-safe:animate-pulse motion-reduce:bg-gradient-to-r motion-reduce:from-gray-200 motion-reduce:via-gray-300 motion-reduce:to-gray-200 dark:motion-reduce:from-gray-800 dark:motion-reduce:via-gray-700 dark:motion-reduce:to-gray-800";


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
    ...rest
  } = props as SmartImageProps & {
    src: NextImageProps["src"];
    alt: string;
  };

  if (!alt && !decorative) {
    console.warn("SmartImage: 'alt' prop is required for accessibility.");
  }

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [clientHydrated, setClientHydrated] = useState(false);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  useEffect(() => {
    setClientHydrated(true);
  }, []);

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
  
  // Auto-enable fill when no dimensions provided but aspect/container is present
  const shouldAutoFill = !width && !height && !fill && (hasAspect || containerClassName);
  const effectiveFill = fill ?? shouldAutoFill;
  const effectiveSizes = sizes ?? (shouldAutoFill ? "100vw" : undefined);
  
  const internalOnLoad = (e: any) => {
    try {
      const imgEl = e?.currentTarget as HTMLImageElement | undefined;
      // Defensive check for valid dimensions (naturalWidth/Height > 0)
      handleLoadingComplete();
    } catch {
      handleLoadingComplete();
    }

    if (userOnLoad) {
      try {
        userOnLoad(e);
      } catch (error) {
        console.error("Error in user onLoad handler:", error);
      }
    }
  };
  
  const internalOnError = (e: any) => {
    // Check if we're already showing the fallback based on state
    const isCurrentlyFallback = Boolean(fallbackSrc && attemptedFallback);
    
    if (isCurrentlyFallback) {
      // Fallback already attempted, stop retrying
      setHasError(true);
      setIsLoaded(false);
    } else if (fallbackSrc) {
      // Try fallback for the first time
      setAttemptedFallback(true);
      setHasError(false); // Reset error state to try fallback
    } else {
      // No fallback available, just set error
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
    src: effectiveSrc as any,
    alt: effectiveAlt,
    priority,
    loading: effectiveLoading,
    width: effectiveFill ? undefined : width,
    height: effectiveFill ? undefined : height,
    fill: effectiveFill,
    sizes: effectiveSizes,
    onLoad: internalOnLoad as any,
    onError: internalOnError as any,
    role: decorative ? "presentation" : undefined,
    className: `relative z-0 ${imageClassName ?? ""}`.trim(),
  } as NextImageProps;

  return (
    <div
      className={`relative overflow-hidden ${(containerClassName ?? className) ?? ""}`.trim()}
      aria-busy={!isLoaded}
      aria-live={ariaLive}
      style={ratioStyle}
    >
      {showSkeleton && (
        <div
          aria-hidden
          className={`${SKELETON_BASE_CLASSES} ${SKELETON_COLOR_CLASSES} ${SKELETON_ANIMATION_CLASSES} ${
            skeletonClassName ?? ""
          }`.trim()}
          style={{ 
            willChange: "opacity"
          }}
        />
      )}

      <Image {...finalImageProps} />

      {hasError && (!fallbackSrc || attemptedFallback) && (
        <div
          aria-live="polite"
          className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-600 select-none pointer-events-none"
        >
          Image unavailable
        </div>
      )}
    </div>
  );
}
