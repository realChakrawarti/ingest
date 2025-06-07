import { Timestamp } from "firebase-admin/firestore";

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
  T extends "channel" | "playlist" | undefined = undefined
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
