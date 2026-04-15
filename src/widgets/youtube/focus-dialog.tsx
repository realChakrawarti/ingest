import { useRef } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, MaximizeIcon, XIcon } from "lucide-react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";

import { OutLink } from "../out-link";
import OverlayTip from "../overlay-tip";

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
    <div className="group/focus-mode absolute bottom-2 left-0.5 cursor-default md:left-0">
      <OverlayTip
        className="overflow-hidden rounded-r-md"
        id="focus"
        aria-label="Focus mode"
      >
        <Button
          className="flex place-items-center gap-1 rounded-none px-1.25 py-2 hover:bg-transparent hover:text-white"
          onClick={() => {
            dialogRef.current?.showModal();
          }}
          variant="ghost"
        >
          <div className="hidden text-xs group-hover/focus-mode:block">
            Focus
          </div>
          <MaximizeIcon className="size-4 grow" />
        </Button>
      </OverlayTip>

      <dialog
        id="focus-player"
        className="m-auto bg-transparent backdrop:bg-black/95 backdrop:backdrop-blur-xs"
        ref={dialogRef}
      >
        <div className="flex h-full w-180 max-w-full flex-col gap-3 overflow-x-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge className="cursor-pointer space-x-2 py-2">
                <ExternalLink className="size-4" />
                <OutLink
                  className="text-nowrap text-white hover:text-white"
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                >
                  Watch on YouTube
                </OutLink>
              </Badge>
              <p className="line-clamp-2 text-center text-sm text-wrap text-white/80">
                {video.videoTitle}
              </p>
            </div>
            <Button
              className="p-2 text-white hover:bg-transparent hover:text-white"
              onClick={() => {
                dialogRef.current?.close();
              }}
              variant="ghost"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <div className="overflow-clip rounded-md">
            <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
          </div>
        </div>
      </dialog>
    </div>
  );
}