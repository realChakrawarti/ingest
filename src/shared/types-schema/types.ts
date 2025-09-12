import type { z } from "zod/v4";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import type { TitleDescriptionSchema } from "./schemas";

export type YouTubeCardOptions = {
  removeVideo?: (_videoId: string) => void;
  hideAvatar: boolean;
  addWatchLater: boolean;
  removeWatchLater?: boolean;
  enableJsApi: boolean;
  markWatched: boolean;
  showVideoStats: boolean;
  showDuration: boolean;
  showVideoCategory: boolean;
};

export interface History extends ZVideoMetadataCompatible {
  updatedAt: number;
  duration: number;
  completed: number;
}

type FavoriteData = {
  id: string;
  title: string;
  description: string;
};

export interface TUserSettings {
  playbackRate: number;
  historyDays: number;
  syncId: string;
  videoLanguage: string;
  watchedPercentage: number;
}

export type { FavoriteData };
export type TitleDescriptionType = z.infer<typeof TitleDescriptionSchema>;
