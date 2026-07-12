import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

export const mockVideo: ZVideoMetadataCompatible = {
  channelId: "UCtest-channel",
  channelTitle: "Test Channel",
  publishedAt: "2024-01-01T00:00:00Z",
  videoAvailability: "none",
  videoDescription: "A test video description.",
  videoDuration: 600,
  videoId: "test-video-id",
  videoThumbnail: "https://example.com/thumbnail.jpg",
  videoTitle: "Test Video",
};
