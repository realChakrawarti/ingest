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

export type VideoDetails = {
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  videoDescription: string;
  videoThumbnail: string;
  videoTitle: string;
};
