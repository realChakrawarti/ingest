import { useEffect, useRef } from "react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";

import currentlyPlayingStore from "./currently-playing-store";

interface UseVideoTrackingProps {
  thisPlayerRef: React.MutableRefObject<YT.Player | null>;
  video: ZVideoMetadataCompatible;
}

export function useVideoTracking({
  video,
  thisPlayerRef,
}: UseVideoTrackingProps) {
  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const setPlayerRef = currentlyPlayingStore.getState().setPlayerRef;

  function getPercentCompleted(node: YT.Player) {
    const duration = node.getDuration() || 0;
    const currentTime = node.getCurrentTime() || 0;
    const percentCompleted = duration
      ? parseInt(((currentTime / duration) * 100).toFixed(2), 10)
      : 0;

    const payload: History = {
      completed: percentCompleted,
      duration: +currentTime.toFixed(2),
      updatedAt: Date.now(),
      ...video,
    };

    return payload;
  }

  const updateProgress = async (player: YT.Player) => {
    await indexedDB["history"].put(getPercentCompleted(player));
  };

  const startTracking = () => {
    if (trackingRef.current) return;

    if (thisPlayerRef.current) {
      setPlayerRef(thisPlayerRef.current);
    }

    trackingRef.current = setInterval(async () => {
      if (!thisPlayerRef.current) return;

      await updateProgress(thisPlayerRef.current);
    }, 2_000);
  };

  const stopTracking = () => {
    setPlayerRef(null);

    if (trackingRef.current) {
      clearInterval(trackingRef.current);
      trackingRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (trackingRef.current) {
        clearInterval(trackingRef.current);
        trackingRef.current = null;
      }
    };
  }, []);

  return { startTracking, stopTracking };
}
