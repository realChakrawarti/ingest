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

  const effectiveSrc = hasError && fallbackSrc ? fallbackSrc : src;

  const effectiveLoading: NextImageProps["loading"] | undefined = useMemo(() => {
    if (priority) return undefined;
    return loading ?? "lazy";
  }, [priority, loading]);

  const hasAspect = aspectRatio !== undefined && aspectRatio !== null;
  const ratioStyle = useMemo(() => {
    if (!hasAspect) return undefined as React.CSSProperties | undefined;
    const value = typeof aspectRatio === "number" ? aspectRatio : aspectRatio;
    return { aspectRatio: String(value) } as React.CSSProperties;
  }, [hasAspect, aspectRatio]);


  const baseRest = rest as Partial<NextImageProps> & Record<string, unknown>;
  const { src: _srcIgnored, alt: _altIgnored, ...imgRest } = baseRest;
  const effectiveAlt = (decorative ? "" : alt ?? "") as string;
  const finalImageProps: NextImageProps = {
    ...(imgRest as NextImageProps),
    src: effectiveSrc as any,
    alt: effectiveAlt,
    priority,
    loading: effectiveLoading,
    onLoad: (e: any) => {
      try {
        const imgEl = e?.currentTarget as HTMLImageElement | undefined;
        if (imgEl && imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0) {
          handleLoadingComplete();
        } else {
          handleLoadingComplete();
        }
      } catch {
        handleLoadingComplete();
      }
    },
    onError: handleError as any,
    role: decorative ? "presentation" : undefined,
    className: `relative z-0 ${imageClassName ?? ""}`.trim(),
  } as NextImageProps;

  return (
    <div
      className={`relative overflow-hidden ${(containerClassName ?? className) ?? ""}`.trim()}
      aria-busy={!isLoaded}
      aria-live="polite"
      style={ratioStyle}
    >
      {showSkeleton && (
        <div
          aria-hidden
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 motion-safe:animate-pulse z-10 pointer-events-none ${
            skeletonClassName ?? ""
          }`.trim()}
          style={{ willChange: "opacity" }}
        />
      )}

      <Image aria-hidden={decorative ? true : undefined} {...finalImageProps} />

      {hasError && !fallbackSrc && (
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
