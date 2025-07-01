import type { z } from "zod";

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

export type { FavoriteData };
export type TitleDescriptionType = z.infer<typeof TitleDescriptionSchema>;
