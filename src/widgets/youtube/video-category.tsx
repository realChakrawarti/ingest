"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { FlameIcon, MessageSquareText, TrendingUp } from "lucide-react";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";

import OverlayTip from "../overlay-tip";
import useActivePlayerRef from "./use-active-player";

interface CategoryThresholds {
  trending: { minViews: number; minLikes: number; minComments: number };
  controversial: { minComments: number; commentToLikeRatio: number };
  hot: { minViews: number; minEngagementRate: number };
}

const CATEGORY_THRESHOLDS: CategoryThresholds = {
  controversial: { commentToLikeRatio: 0.1, minComments: 50 },
  hot: { minEngagementRate: 0.03, minViews: 50_000 },
  trending: { minComments: 100, minLikes: 5_000, minViews: 100_000 },
};

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
      commentToLikeRatio = Math.min(comments * 10, 100);
    } else {
      commentToLikeRatio = 0;
    }
  } else {
    commentToLikeRatio = comments / likes;
  }

  // Check for TRENDING
  if (
    views >= CATEGORY_THRESHOLDS.trending.minViews &&
    likes >= CATEGORY_THRESHOLDS.trending.minLikes &&
    comments >= CATEGORY_THRESHOLDS.trending.minComments
  ) {
    return "Trending";
  }

  // Check for CONTROVERSIAL (if not Trending)
  if (
    comments >= CATEGORY_THRESHOLDS.controversial.minComments &&
    commentToLikeRatio >= CATEGORY_THRESHOLDS.controversial.commentToLikeRatio
  ) {
    return "Controversial";
  }

  // Check for HOT (if not Trending or Controversial)
  if (
    views >= CATEGORY_THRESHOLDS.hot.minViews &&
    engagementRate >= CATEGORY_THRESHOLDS.hot.minEngagementRate
  ) {
    return "Hot";
  }

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

  const videoProgress = useLiveQuery(() => indexedDB["history"].get(videoId));

  const category = categorizeVideoSimplified(
    videoViews,
    videoLikes,
    videoComments
  );

  if (activePlayerRef?.getVideoData()?.video_id === videoId) {
    return null;
  }

  if (
    category === "Inconclusive" ||
    (videoProgress && videoProgress.completed > appConfig.watchedPercentage)
  ) {
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
