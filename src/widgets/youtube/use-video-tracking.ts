import { useEffect, useRef } from "react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";

import currentlyPlayingStore from "~/stores/currently-playing-store";

interface UseVideoTrackingProps {
  thisPlayerRef: React.RefObject<YT.Player | null>;
  video: ZVideoMetadataCompatible;
}

function getPercentCompleted(node: YT.Player, video: ZVideoMetadataCompatible) {
  const duration = node.getDuration() || 0;
  const currentTime = node.getCurrentTime() || 0;
  const percentCompleted = duration
    ? Number.parseInt(((currentTime / duration) * 100).toFixed(2), 10)
    : 0;

  const payload: History = {
    completed: percentCompleted,
    duration: +currentTime.toFixed(2),
    updatedAt: Date.now(),
    ...video,
  };

  return payload;
}

export function useVideoTracking({
  video,
  thisPlayerRef,
}: UseVideoTrackingProps) {
  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const setPlayer = currentlyPlayingStore.getState().setPlayer;

  const updateProgress = async (player: YT.Player) => {
    await indexedDB["history"].put(getPercentCompleted(player, video));
  };

  const startTracking = () => {
    if (trackingRef.current) return;

    if (thisPlayerRef.current) {
      setPlayer(thisPlayerRef.current);
    }

    trackingRef.current = setInterval(async () => {
      if (!thisPlayerRef.current) return;

      await updateProgress(thisPlayerRef.current);
    }, 2_000);
  };

  const stopTracking = () => {
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