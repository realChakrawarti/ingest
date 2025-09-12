import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { useLocalStorage } from "~/shared/hooks/use-local-storage";
import { indexedDB } from "~/shared/lib/api/dexie";
import { LOCAL_USER_SETTINGS } from "~/shared/lib/constants";
import type { History, TUserSettings } from "~/shared/types-schema/types";
import { time } from "~/shared/utils/time";

import currentlyPlayingStore from "./currently-playing-store";

interface UseVideoTrackingProps {
  thisPlayerRef: React.MutableRefObject<YT.Player | null>;
  video: ZVideoMetadataCompatible;
}

function getPercentCompleted(node: YT.Player, video: ZVideoMetadataCompatible) {
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

async function removeOldRecords(days: number) {
  if (days === 0 || Number.isNaN(days)) return;

  const deletePrior = Date.now() - time.days(days);
  const historyQuery = indexedDB["history"]
    .where("updatedAt")
    .below(deletePrior);
  if (await historyQuery.count()) {
    const deletedCount = await historyQuery.delete();
    toast(`Removed ${deletedCount} old videos from history.`);
  }
}

export function useVideoTracking({
  video,
  thisPlayerRef,
}: UseVideoTrackingProps) {
  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const setPlayerRef = currentlyPlayingStore.getState().setPlayerRef;

  const updateProgress = async (player: YT.Player) => {
    await indexedDB["history"].put(getPercentCompleted(player, video));
  };

  const [localUserSettings] = useLocalStorage<TUserSettings>(
    LOCAL_USER_SETTINGS,
    null
  );

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
    removeOldRecords(localUserSettings?.historyDays ?? 0);

    return () => {
      if (trackingRef.current) {
        clearInterval(trackingRef.current);
        trackingRef.current = null;
      }
    };
  }, []);

  return { startTracking, stopTracking };
}
