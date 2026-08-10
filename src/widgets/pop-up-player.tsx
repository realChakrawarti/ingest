import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PauseIcon, PlayIcon, RefreshCcwIcon, XIcon } from "lucide-react";

import useInterval from "~/shared/hooks/use-interval";
import { PlayerState } from "~/shared/lib/constants";
import { Button } from "~/shared/ui/button";
import { SidebarGroup, SidebarGroupContent } from "~/shared/ui/sidebar";
import { Skeleton } from "~/shared/ui/skeleton";

import useActivePlayerRef from "./youtube/use-active-player";

export default function PopupPlayer() {
  const [playingStatus, setPlayingStatus] = useState<YT.PlayerState>();
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const playerRef = useActivePlayerRef();
  const title = playerRef?.getVideoData().title;

  const pathname = usePathname();
  function renderControls(status: YT.PlayerState | undefined) {
    switch (status) {
      case PlayerState.PLAYING:
        return (
          <Button
            className="clickable flex items-center gap-2"
            onClick={() => playerRef?.pauseVideo()}
          >
            <PauseIcon size={24} />
            Pause
          </Button>
        );

      case PlayerState.PAUSED:
        return (
          <Button
            className="flex items-center gap-2"
            onClick={() => playerRef?.playVideo()}
          >
            <PlayIcon size={24} />
            Resume
          </Button>
        );

      case PlayerState.ENDED:
        return (
          <Button
            className="flex items-center gap-2"
            onClick={() => playerRef?.playVideo()}
          >
            <RefreshCcwIcon size={24} />
            Start Over
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
  }, 1_000);

  if (!showMiniPlayer) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="relative">
        <Button
          className="clickable absolute top-0.5 right-0.5 hover:bg-transparent"
          onClick={() => setShowMiniPlayer(false)}
          size="icon"
          variant="ghost"
        >
          <XIcon />
        </Button>
        <div className="bg-primary/40 flex h-max flex-col gap-3 rounded-md p-2">
          <div className="flex grow justify-start">
            {renderControls(playingStatus)}
          </div>
          <p className="line-clamp-2">{title}</p>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}