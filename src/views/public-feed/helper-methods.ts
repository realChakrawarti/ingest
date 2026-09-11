// TODO: Make use lodash to simplify the code

import type {
  ZFeedVideoListSchema,
  ZVideoMetadata,
} from "~/entities/feeds/models";

import { time } from "~/shared/utils/time";

function filterChannel(
  videoData: ZFeedVideoListSchema,
  channelId?: string
): [ZVideoMetadata[], ZVideoMetadata[], ZVideoMetadata[]] {
  const today = videoData?.day;
  const week = videoData?.week;
  const month = videoData?.month;

  if (!channelId) {
    return [today, week, month];
  }

  const filteredToday = today.filter((video) => video.channelId === channelId);
  const filteredWeek = week.filter((video) => video.channelId === channelId);
  const filteredMonth = month.filter((video) => video.channelId === channelId);

  return [filteredToday, filteredWeek, filteredMonth];
}

function filterDuration(
  videoData: ZFeedVideoListSchema,
  duration?: "short" | "medium" | "long"
): ZFeedVideoListSchema {
  const today = videoData?.day;
  const week = videoData?.week;
  const month = videoData?.month;

  if (!duration) {
    return { day: today, month, week };
  }

  if (duration === "short") {
    const filteredToday = today.filter(
      (video) => video.videoDuration <= time.minutes(4) / 1000
    );
    const filteredWeek = week.filter(
      (video) => video.videoDuration <= time.minutes(4) / 1000
    );
    const filteredMonth = month.filter(
      (video) => video.videoDuration <= time.minutes(4) / 1000
    );

    return { day: filteredToday, month: filteredMonth, week: filteredWeek };
  }
  if (duration === "medium") {
    const filteredToday = today.filter(
      (video) =>
        video.videoDuration >= time.minutes(4) / 1000 &&
        video.videoDuration <= time.minutes(20) / 1000
    );
    const filteredWeek = week.filter(
      (video) =>
        video.videoDuration >= time.minutes(4) / 1000 &&
        video.videoDuration <= time.minutes(20) / 1000
    );
    const filteredMonth = month.filter(
      (video) =>
        video.videoDuration >= time.minutes(4) / 1000 &&
        video.videoDuration <= time.minutes(20) / 1000
    );
    return { day: filteredToday, month: filteredMonth, week: filteredWeek };
  }
  const filteredToday = today.filter(
    (video) => video.videoDuration >= time.minutes(20) / 1000
  );
  const filteredWeek = week.filter(
    (video) => video.videoDuration >= time.minutes(20) / 1000
  );
  const filteredMonth = month.filter(
    (video) => video.videoDuration >= time.minutes(20) / 1000
  );
  return { day: filteredToday, month: filteredMonth, week: filteredWeek };
}

export function filterVideos(
  videoData: ZFeedVideoListSchema,
  channelId?: string,
  duration?: "short" | "medium" | "long" | null
): [ZVideoMetadata[], ZVideoMetadata[], ZVideoMetadata[]] {
  if (channelId && !duration) return filterChannel(videoData, channelId);

  if (duration && !channelId) {
    const { day, week, month } = filterDuration(videoData, duration);
    return [day, week, month];
  }

  if (duration && channelId) {
    return filterChannel(filterDuration(videoData, duration), channelId);
  }

  return [videoData.day, videoData.week, videoData.month];
}

export type ChannelTag = { title: string; id: string; logo: string };

function getChannels(videos: ZVideoMetadata[]) {
  const channels = [];
  for (let i = 0; i < videos?.length; i++) {
    const video = videos[i];
    const channel = {
      id: video.channelId,
      logo: video.channelLogo,
      title: video.channelTitle,
    };
    channels.push(channel);
  }

  return channels;
}

function channelUnique(channels: ChannelTag[]) {
  const uniqueChannels = [];
  const _trackhannelIds: string[] = [];

  for (let i = 0; i < channels?.length; i++) {
    const channel = channels[i];
    if (!_trackhannelIds.includes(channel.id)) {
      _trackhannelIds.push(channel.id);
      uniqueChannels.push(channel);
    }
  }
  return uniqueChannels;
}

export function getActiveChannelIds(
  videoData: ZFeedVideoListSchema
): ChannelTag[] {
  const channelIds: ChannelTag[] = [];

  const today = videoData?.day;
  const week = videoData?.week;
  const month = videoData?.month;

  channelIds.push(...getChannels(today));
  channelIds.push(...getChannels(week));
  channelIds.push(...getChannels(month));

  return channelUnique(channelIds);
}