"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PauseIcon, PlayIcon, RefreshCcwIcon, XIcon } from "lucide-react";

import useInterval from "~/shared/hooks/use-interval";
import { PlayerState } from "~/shared/lib/constants";
import { Button } from "~/shared/ui/button";
import { useSidebar } from "~/shared/ui/sidebar";
import { Skeleton } from "~/shared/ui/skeleton";
import formatSecondsToHMS from "~/shared/utils/format-seconds-HMS";

import useActivePlayerRef from "./youtube/use-active-player";

export default function PopupPlayer() {
  const [playingStatus, setPlayingStatus] = useState<YT.PlayerState>();
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playerRef = useActivePlayerRef();
  const title = playerRef?.getVideoData().title;
  const duration = playerRef?.getDuration();
  const { state: sidebarState } = useSidebar();

  const pathname = usePathname();
  function renderControls(status: YT.PlayerState | undefined) {
    switch (status) {
      case PlayerState.PLAYING:
        return (
          <Button
            variant="outline"
            className="clickable flex items-center gap-2"
            onClick={() => playerRef?.pauseVideo()}
          >
            <PauseIcon size={24} />
          </Button>
        );

      case PlayerState.PAUSED:
        return (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => playerRef?.playVideo()}
          >
            <PlayIcon size={24} />
          </Button>
        );

      case PlayerState.ENDED:
        return (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => playerRef?.playVideo()}
          >
            <RefreshCcwIcon size={24} />
          </Button>
        );

      default:
        return <Skeleton className="h-9 w-12" />;
    }
  }

  useEffect(() => {
    if (playerRef) {
      const status = playerRef?.getPlayerState();
      setPlayingStatus(status);
      setShowMiniPlayer(true);
    }
  }, [playerRef]);

  // If the pathname changes, hide the mini player
  useEffect(() => {
    setShowMiniPlayer(false);
  }, [pathname]);

  useInterval(() => {
    const status = playerRef?.getPlayerState();
    setPlayingStatus(status);
    setCurrentTime(playerRef?.getCurrentTime() || 0);
  }, 1_000);

  if (!showMiniPlayer) {
    return null;
  }

  return (
    <aside
      style={sidebarState === "collapsed" ? { left: "50%" } : undefined}
      className="bg-secondary fixed bottom-6 left-1/2 z-10 min-h-max w-3/5 -translate-x-1/2 gap-2 rounded-md md:left-[calc(var(--sidebar-width)+((100vw-var(--sidebar-width))/2))]"
    >
      <div className="z-10 grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2">
        <div className="w-max">{renderControls(playingStatus)}</div>
        <p className="line-clamp-2">{title}</p>
        <p className="mr-8 text-sm">
          {formatSecondsToHMS(currentTime || 0)} /{" "}
          {formatSecondsToHMS(duration || 0)}
        </p>
      </div>
      <Button
        className="clickable absolute top-0.5 right-0.5 hover:bg-transparent"
        onClick={() => setShowMiniPlayer(false)}
        size="icon"
        variant="ghost"
      >
        <XIcon />
      </Button>
    </aside>
  );
}