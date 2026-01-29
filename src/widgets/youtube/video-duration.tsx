"use client";

function formatSecondsToHMS(totalSeconds: number) {
  if (typeof totalSeconds !== "number" || totalSeconds < 0) {
    return "Invalid Input";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad single-digit numbers with a leading zero
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours === 0) {
    // If hours are 0, return mm:ss
    return `${paddedMinutes}:${paddedSeconds}`;
  }
  // Otherwise, return HH:mm:ss
  const paddedHours = String(hours).padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

import type { ZVideoMetadata } from "~/entities/catalogs/models";

import OverlayTip from "../overlay-tip";
import useActivePlayerRef from "./use-active-player";

function checkVideoAvailability(
  availability: "live" | "none" | "upcoming" | undefined
) {
  if (availability === "live") return "LIVE";
  if (availability === "upcoming") return "PREMIERE";
  return "";
}

export function VideoDuration({
  videoAvailability,
  videoDuration,
  videoId,
}: Pick<ZVideoMetadata, "videoId" | "videoDuration" | "videoAvailability">) {
  const activePlayerRef = useActivePlayerRef();

  if (activePlayerRef?.getVideoData()?.video_id === videoId) {
    return null;
  }

  const availability = checkVideoAvailability(videoAvailability);

  return (
    <div className="absolute bottom-2 right-[2px] md:right-0 cursor-default">
      <OverlayTip
        className="px-[5px] py-2 flex gap-1 place-items-center rounded-l-md"
        id="video-duration"
        aria-label="Video duration"
      >
        <div className="text-xs">
          {availability || formatSecondsToHMS(videoDuration)}
        </div>
      </OverlayTip>
    </div>
  );
}
