import type { z } from "zod";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";

import type { TitleDescriptionSchema } from "./schemas";

type VideoData = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  channelId: string;
  channelLogo: string;
  description: string;
};

export type YouTubeCardOptions = {
  removeVideo?: (_videoId: string) => void;
  hideAvatar: boolean;
  addWatchLater: boolean;
  removeWatchLater?: boolean;
  enableJsApi: boolean;
  markWatched: boolean;
};

export interface History extends VideoData {
  updatedAt: number;
  duration: number;
  completed: number;
}

export interface YouTubeCardProps {
  video: VideoData & Partial<ZVideoContentInfo>;
  options?: Partial<YouTubeCardOptions> | any;
}

type FavoriteData = {
  id: string;
  title: string;
  description: string;
};

export type { FavoriteData, VideoData };
export type TitleDescriptionType = z.infer<typeof TitleDescriptionSchema>;

export type CatalogPlaylist = {
  channelDescription: string;
  channelHandle: string;
  channelId: string;
  channelLogo: string;
  channelTitle: string;
  description: string;
  id: string;
  publishedAt: string;
  title: string;
};

export type PlaylistItem = {
  title: string;
  thumbnail: string;
  id: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
};

export type CatalogChannel = {
  description: string;
  handle: string;
  id: string;
  logo: string;
  title: string;
};
