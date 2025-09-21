import { z } from "zod";

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

export const YouTubeVideoMetadataSchema = z.object({
  channelId: z.string(),
  channelTitle: z.string(),
  defaultVideoLanguage: z.string().optional(),
  publishedAt: z.string(),
  videoDescription: z.string(),
  videoId: z.string(),
  videoThumbnail: z.string(),
  videoTitle: z.string(),
});

export type ZYouTubeVideoMetadata = z.infer<typeof YouTubeVideoMetadataSchema>;
