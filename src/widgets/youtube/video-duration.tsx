"use client";

import type { ZVideoMetadata } from "~/entities/catalogs/models";

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
  const availability = checkVideoAvailability(videoAvailability);

  return (
    <div className="cursor-default">
      {availability || formatSecondsToHMS(videoDuration)}
    </div>
  );
}
