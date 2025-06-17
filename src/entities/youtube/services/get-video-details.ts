import {
  YOUTUBE_CHANNEL_INFORMATION_BY_IDS,
  YOUTUBE_VIDEO_DATA,
} from "~/shared/lib/api/youtube-endpoints";

import { ChannelDetails } from "../models";

export async function getVideoDetails(videoIdParam: string) {
  const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
  const result = await response.json();

  const videoData = result.items[0].snippet;

  const channelId = videoData.channelId;

  if (channelId) {
    const response = await fetch(
      YOUTUBE_CHANNEL_INFORMATION_BY_IDS([channelId], 1)
    );
    const result = await response.json();
    const channelData = result.items[0].snippet;
    const channelStats = result.items[0].statistics;

    const data: ChannelDetails = {
      channelDescription: channelData.description,
      channelHandle: channelData.customUrl,
      channelId: videoData.channelId,
      channelLogo: channelData.thumbnails.medium.url,
      channelSubscriberCount: channelStats.subscriberCount,
      channelTitle: videoData.channelTitle,
      channelVideoCount: channelStats.videoCount,
      channelViewCount: channelStats.viewCount,
    };
    return data;
  }
}
