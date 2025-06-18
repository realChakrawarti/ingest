import {
  YOUTUBE_CHANNEL_INFORMATION_BY_HANDLE,
  YOUTUBE_CHANNEL_INFORMATION_BY_IDS,
  YOUTUBE_VIDEO_DATA,
} from "~/shared/lib/api/youtube-endpoints";

import { ChannelDetails } from "../models";

function generateChannelDetails(item: any) {
  const channelData = item.snippet;
  const channelStats = item.statistics;

  const data: ChannelDetails = {
    channelDescription: channelData.description,
    channelHandle: channelData.customUrl,
    channelId: item.id,
    channelLogo: channelData.thumbnails.medium.url,
    channelSubscriberCount: channelStats.subscriberCount,
    channelTitle: channelData.title,
    channelVideoCount: channelStats.videoCount,
    channelViewCount: channelStats.viewCount,
  };

  return data;
}

type ChannelParams = {
  channelId: string;
  channelHandle: string;
};

export async function getChannelDetails({
  channelId = "",
  channelHandle = "",
}: ChannelParams) {
  if (channelId) {
    const response = await fetch(
      YOUTUBE_CHANNEL_INFORMATION_BY_IDS([channelId], 1)
    );
    const result = await response.json();
    const item = result.items[0];
    return generateChannelDetails(item);
  }

  if (channelHandle) {
    const response = await fetch(
      YOUTUBE_CHANNEL_INFORMATION_BY_HANDLE(channelHandle)
    );
    const result = await response.json();
    const item = result.items[0];
    return generateChannelDetails(item);
  }
}

export async function getChannelDetailsFromVideoId(videoId: string) {
  const response = await fetch(YOUTUBE_VIDEO_DATA(videoId));
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
