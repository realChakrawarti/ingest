import {
  YOUTUBE_CHANNEL_INFORMATION_BY_HANDLE,
  YOUTUBE_CHANNEL_INFORMATION_BY_IDS,
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
