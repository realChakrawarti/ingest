import { Button } from "~/shared/ui/button";
import OverlayTip from "../overlay-tip";
import { ExternalLink, MaximizeIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { ZVideoMetadataCompatible } from "~/entities/catalogs/models";
import { OutLink } from "../out-link";
import { Badge } from "~/shared/ui/badge";

const ClientYouTubePlayer = dynamic(() => import("./player"), {
  ssr: false,
});

export default function FocusDialog({
  enableJsApi,
  video,
}: {
  enableJsApi: boolean;
  video: ZVideoMetadataCompatible;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  return (
    <div className="absolute bottom-2 left-0.5 md:left-0 group/focus-mode cursor-default">
      <OverlayTip
        className="rounded-r-md overflow-hidden"
        id="focus"
        aria-label="Focus mode"
      >
        <Button
          className="flex gap-1 place-items-center px-1.25 py-2 rounded-none"
          onClick={() => {
            dialogRef.current?.showModal();
          }}
          variant="ghost"
        >
          <div className="hidden group-hover/focus-mode:block text-xs">
            Focus
          </div>
          <MaximizeIcon className="size-4 grow" />
        </Button>
      </OverlayTip>

      <dialog
        id="focus-player"
        className="m-auto backdrop:bg-black/95 backdrop:backdrop-blur-xs bg-transparent"
        ref={dialogRef}
      >
        <div className="h-full w-180 max-w-full overflow-x-hidden flex flex-col gap-3">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Badge className="py-2 space-x-2 cursor-pointer">
                <ExternalLink className="size-4" />
                <OutLink
                  className="text-white hover:text-white text-nowrap"
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                >
                  Watch on YouTube
                </OutLink>
              </Badge>
              <p className="text-center text-sm text-white/80 text-wrap line-clamp-2">
                {video.videoTitle}
              </p>
            </div>
            <Button
              className="p-2"
              onClick={() => {
                dialogRef.current?.close();
              }}
              variant="ghost"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <div className="rounded-md overflow-clip">
            <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
          </div>
        </div>
      </dialog>
    </div>
  );
}
