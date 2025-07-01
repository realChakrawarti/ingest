import Dexie, { type EntityTable } from "dexie";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import type { FavoriteData, History } from "~/shared/types-schema/types";

const indexedDB = new Dexie(`${appConfig.name}-database`) as Dexie & {
  "watch-later": EntityTable<ZVideoMetadataCompatible, "videoId">;
  favorites: EntityTable<FavoriteData, "id">;
  history: EntityTable<History, "videoId">;
};

indexedDB.version(4).stores({
  favorites: "id, title, description",
  history:
    "videoId, duration, updatedAt, completed, title, channelTitle, publishedAt, channelId, channelLogo, description, videoDuration",
  "watch-later":
    "videoId, title, channelTitle, publishedAt, channelId, channelLogo, description",
});

export type { FavoriteData };
export { indexedDB };
