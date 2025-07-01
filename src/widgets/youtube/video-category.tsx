"use client";

import { FlameIcon, MessageSquareText, TrendingUp } from "lucide-react";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";

import OverlayTip from "../overlay-tip";
import useActivePlayerRef from "./use-active-player";

/**
 * Categorizes a video based on its views, likes, and comments.
 * Returns "Trending", "Controversial", "Hot", or "Inconclusive".
 *
 * @param {number} views - The number of views the video has.
 * @param {number} likes - The number of likes the video has.
 * @param {number} comments - The number of comments the video has.
 * @returns {string} The category of the video.
 */
function categorizeVideoSimplified(
  views: number,
  likes: number,
  comments: number
): "Trending" | "Controversial" | "Hot" | "Inconclusive" {
  let engagementRate = 0;
  if (views === 0) {
    engagementRate = 0;
  } else {
    engagementRate = (likes + comments) / views;
  }

  let commentToLikeRatio = 0;
  if (likes === 0) {
    if (comments > 0) {
      commentToLikeRatio = comments * 1000; // Assign a very high value if comments exist but no likes
    } else {
      commentToLikeRatio = 0;
    }
  } else {
    commentToLikeRatio = comments / likes;
  }

  // --- 2. Define Thresholds (HYPOTHETICAL VALUES - ADJUST THESE!) ---
  const TRENDING_MIN_VIEWS = 100_000;
  const TRENDING_MIN_LIKES = 5_000;
  const TRENDING_MIN_COMMENTS = 100;

  const CONTROVERSIAL_MIN_COMMENTS = 50;
  const CONTROVERSIAL_COMMENT_TO_LIKE_RATIO_THRESHOLD = 0.1;

  const HOT_MIN_VIEWS = 50_000;
  const HOT_MIN_ENGAGEMENT_RATE = 0.03;

  // --- 3. Categorization Logic ---

  // 1. Check for TRENDING
  if (
    views >= TRENDING_MIN_VIEWS &&
    likes >= TRENDING_MIN_LIKES &&
    comments >= TRENDING_MIN_COMMENTS
  ) {
    return "Trending";
  }

  // 2. Check for CONTROVERSIAL (if not Trending)
  if (
    comments >= CONTROVERSIAL_MIN_COMMENTS &&
    commentToLikeRatio >= CONTROVERSIAL_COMMENT_TO_LIKE_RATIO_THRESHOLD
  ) {
    return "Controversial";
  }

  // 3. Check for HOT (if not Trending or Controversial)
  if (views >= HOT_MIN_VIEWS && engagementRate >= HOT_MIN_ENGAGEMENT_RATE) {
    return "Hot";
  }

  // 4. Default Category
  return "Inconclusive";
}
const Icons = {
  Controversial: MessageSquareText,
  Hot: FlameIcon,
  Trending: TrendingUp,
} as const;

export function VideoCategory({
  videoViews,
  videoLikes,
  videoComments,
  videoId,
}: Omit<ZVideoContentInfo, "videoDuration"> & { videoId: string }) {
  const activePlayerRef = useActivePlayerRef();
  const category = categorizeVideoSimplified(
    videoViews,
    videoLikes,
    videoComments
  );

  if (activePlayerRef?.getVideoData()?.video_id === videoId) {
    return null;
  }

  if (category === "Inconclusive") {
    return null;
  } else {
    const IconComponent = Icons[category];

    return (
      <div className="absolute top-2 left-[2px] md:left-0 cursor-default">
        <OverlayTip
          className="px-[5px] py-2 flex gap-1 place-items-center rounded-r-md"
          id="video-category"
          aria-label="Video category"
        >
          <div className="text-xs flex gap-1 items-center">
            <IconComponent className="size-4" />
            <p className="hidden group-hover/player:flex gap-1 items-center">
              <span>{category}</span>
            </p>
          </div>
        </OverlayTip>
      </div>
    );
  }
}
