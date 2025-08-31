import { YOUTUBE_VIDEO_DATA } from "~/shared/lib/api/youtube-endpoints";

import type { ZYouTubeVideoMetadata } from "../models";

// TODO: Parse only the data required and sent it down
export async function getVideoDetails(videoIdParam: string) {
  const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
  const result = await response.json();

  const videoData = result.items[0].snippet;

  const data: ZYouTubeVideoMetadata = {
    channelId: videoData.channelId,
    channelTitle: videoData.channelTitle,
    defaultVideoLanguage: videoData.defaultAudioLanguage,
    publishedAt: videoData.publishedAt,
    videoDescription: videoData.description,
    videoId: videoIdParam,
    videoThumbnail: videoData.thumbnails.medium.url,
    videoTitle: videoData.title,
  };
  return data;
}
