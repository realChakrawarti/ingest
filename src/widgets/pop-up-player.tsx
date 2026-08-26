"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PauseIcon,
  PlayIcon,
  RefreshCcwIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";

import useInterval from "~/shared/hooks/use-interval";
import { PlayerState } from "~/shared/lib/constants";
import { Button } from "~/shared/ui/button";
import { useSidebar } from "~/shared/ui/sidebar";
import formatSecondsToHMS from "~/shared/utils/format-seconds-HMS";

import useActivePlayerRef from "./youtube/use-active-player";

function PlayerControls({
  status,
  setShowMiniPlayer,
}: {
  status: YT.PlayerState | undefined;
  setShowMiniPlayer: (value: boolean) => void;
}) {
  const playerRef = useActivePlayerRef();
  const ICON_SIZE = 18;

  function handlePlayerClose() {
    playerRef?.stopVideo();
    setShowMiniPlayer(false);
  }

  if (status === PlayerState.PLAYING) {
    return (
      <>
        <Button onClick={handlePlayerClose} variant="outline">
          <SquareIcon size={ICON_SIZE} />
        </Button>
        <Button variant="outline" onClick={() => playerRef?.pauseVideo()}>
          <PauseIcon size={ICON_SIZE} />
        </Button>
      </>
    );
  } else if (status === PlayerState.PAUSED) {
    return (
      <>
        <Button onClick={handlePlayerClose} variant="outline">
          <SquareIcon size={ICON_SIZE} />
        </Button>
        <Button variant="outline" onClick={() => playerRef?.playVideo()}>
          <PlayIcon size={ICON_SIZE} />
        </Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={handlePlayerClose} variant="outline">
        <XIcon size={ICON_SIZE} />
      </Button>
      <Button variant="outline" onClick={() => playerRef?.playVideo()}>
        <RefreshCcwIcon size={ICON_SIZE} />
      </Button>
    </>
  );
}

export default function PopupPlayer() {
  const [playingStatus, setPlayingStatus] = useState<YT.PlayerState>();
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playerRef = useActivePlayerRef();
  const title = playerRef?.getVideoData().title;
  const duration = playerRef?.getDuration();
  const { state: sidebarState } = useSidebar();

  const pathname = usePathname();

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
      className="bg-secondary fixed bottom-6 left-1/2 z-10 min-h-max w-3/5 -translate-x-1/2 gap-2 rounded-md px-2 text-sm md:left-[calc(var(--sidebar-width)+((100vw-var(--sidebar-width))/2))]"
    >
      <div className="z-10 flex flex-col items-center gap-2 p-2 text-sm lg:flex-row lg:justify-between">
        <a
          className="outline-offset-2 hover:outline-dotted"
          href={`#${playerRef?.getVideoData().video_id}`}
        >
          <p className="line-clamp-2 w-full text-wrap">{title}</p>
        </a>
        <div className="flex items-center justify-center gap-2">
          <div className="flex w-max items-center gap-2">
            <PlayerControls
              setShowMiniPlayer={setShowMiniPlayer}
              status={playingStatus}
            />
          </div>

          <p>
            {formatSecondsToHMS(currentTime || 0)} /{" "}
            {formatSecondsToHMS(duration || 0)}
          </p>
        </div>
      </div>
    </aside>
  );
}