import Dexie, { type EntityTable } from "dexie";

import type { FavoriteData, History, VideoData } from "~/shared/types-schema/types";

const indexedDB = new Dexie("YTCatalogDatabase") as Dexie & {
  "watch-later": EntityTable<VideoData, "videoId">;
  favorites: EntityTable<FavoriteData, "id">;
  history: EntityTable<History, "videoId">;
};

indexedDB.version(2).stores({
  favorites: "id, title, description",
  history:
    "videoId, duration, updatedAt, completed, title, channelTitle, publishedAt, channelId, channelLogo, description ",
  "watch-later":
    "videoId, title, channelTitle, publishedAt, channelId, channelLogo, description",
});

export type { FavoriteData };
export { indexedDB };
