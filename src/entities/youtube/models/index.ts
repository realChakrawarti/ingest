export type ChannelPlaylist = {
  channelId: string;
  channelTitle: string;
  playlistDescription: string;
  playlistId: string;
  playlistTitle: string;
  publishedAt: string;
  thumbnail: string;
  videoCount: number;
};

export type ChannelDetails = {
  channelViewCount: number;
  channelVideoCount: number;
  channelSubscriberCount: number;
  channelHandle: string;
  channelLogo: string;
  channelId: string;
  channelTitle: string;
  channelDescription: string;
};

export type VideoDetails = {
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  videoDescription: string;
  videoId: string;
  videoThumbnail: string;
  videoTitle: string;
};
