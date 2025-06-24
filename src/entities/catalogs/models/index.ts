import type { Timestamp } from "firebase-admin/firestore";

interface ChannelBase {
  channelTitle: string;
  channelDescription: string;
  channelLogo: string;
  channelId: string;
  channelHandle: string;
}

interface ChannelType extends ChannelBase {
  type: "channel";
}

interface PlaylistType extends ChannelBase {
  type: "playlist";
  playlistTitle: string;
  playlistDescription: string;
  playlistId: string;
}

export type CatalogList<
  T extends "channel" | "playlist" | undefined = undefined,
> = T extends "channel"
  ? ChannelType
  : T extends "playlist"
    ? PlaylistType
    : ChannelType | PlaylistType;

export type CatalogByIdResponse = {
  title: string;
  description: string;
  list: CatalogList[];
};

export type UserCatalogDocument = {
  list: CatalogList[];
  updatedAt: Timestamp;
};

export type VideoMetadata = {
  description: string;
  title: string;
  channelId: string;
  thumbnail: any;
  channelTitle: string;
  videoId: string;
  publishedAt: string;
  channelLogo: string;
};

export type VideoListData = {
  day: VideoMetadata[];
  week: VideoMetadata[];
  month: VideoMetadata[];
};

export type VideosByCatalog = {
  data: VideoListData;
  description: string;
  nextUpdate: string;
  title: string;
};
