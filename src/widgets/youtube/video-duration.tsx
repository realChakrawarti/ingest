"use client";

import type { ZVideoMetadata } from "~/entities/catalogs/models";

import formatSecondsToHMS from "~/shared/utils/format-seconds-HMS";

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
}: Pick<ZVideoMetadata, "videoDuration" | "videoAvailability">) {
  const availability = checkVideoAvailability(videoAvailability);

  return (
    <div className="cursor-default">
      {availability || formatSecondsToHMS(videoDuration)}
    </div>
  );
}