import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod/v4";

export const CatalogMetaSchema = z.object({
  description: z.string(),
  title: z.string(),
});

const BaseCatalogSchema = z.object({
  channelDescription: z.string(),
  channelHandle: z.string(),
  channelId: z.string(),
  channelLogo: z.string(),
  channelTitle: z.string(),
});

export const CatalogChannelSchema = BaseCatalogSchema.extend({
  type: z.literal("channel"),
});

export const CatalogPlaylistSchema = BaseCatalogSchema.extend({
  playlistDescription: z.string(),
  playlistId: z.string(),
  playlistTitle: z.string(),
  type: z.literal("playlist"),
});

export const CatalogSubredditSchema = z.object({
  subredditDescription: z.string(),
  subredditIcon: z.string(),
  subredditId: z.string(),
  subredditName: z.string(),
  subredditTitle: z.string(),
  subredditUrl: z.string(),
  type: z.literal("subreddit"),
});

const CatalogListSchema = z.discriminatedUnion("type", [
  CatalogChannelSchema,
  CatalogPlaylistSchema,
  CatalogSubredditSchema,
]);

const TimestampSchema = z.custom<Timestamp>(
  (value) => value instanceof Timestamp
);

export const UserCatalogDocumentSchema = z.object({
  list: z.array(CatalogListSchema),
  updatedAt: TimestampSchema,
});

const CatalogByIDSchema = z.object({
  description: z.string(),
  list: z.array(CatalogListSchema),
  title: z.string(),
});

const VideoContentInfoSchema = z.object({
  videoAvailability: z.enum(["live", "none", "upcoming"]).optional(),
  videoComments: z.number(),
  videoDuration: z.number(),
  videoLikes: z.number(),
  videoViews: z.number(),
});

const VideoMetadataSchema = VideoContentInfoSchema.extend({
  channelId: z.string(),
  channelLogo: z.string(),
  channelTitle: z.string(),
  publishedAt: z.string(),
  videoDescription: z.string(),
  videoId: z.string(),
  videoThumbnail: z.string(),
  videoTitle: z.string(),
});

const VideoMetadataWithoutContentSchema = VideoMetadataSchema.omit({
  videoComments: true,
  videoDuration: true,
  videoLikes: true,
  videoViews: true,
});

export const VideoMetadataCompatibleSchema = VideoMetadataSchema.partial({
  channelLogo: true,
  videoComments: true,
  videoDuration: true,
  videoLikes: true,
  videoViews: true,
});

export type ZVideoMetadataCompatible = z.infer<
  typeof VideoMetadataCompatibleSchema
>;

export type ZVideoMetadataWithoutContent = z.infer<
  typeof VideoMetadataWithoutContentSchema
>;

const DocumentReferenceSchema = z.custom<
  DocumentReference<ZUserCatalogDocument>
>((value) => value instanceof DocumentReference);

const CatalogVideoListSchema = z.object({
  day: z.array(VideoMetadataSchema).default([]),
  month: z.array(VideoMetadataSchema).default([]),
  week: z.array(VideoMetadataSchema).default([]),
});

const CatalogDocumentSchema = CatalogMetaSchema.extend({
  data: z.object({
    posts: z.array(z.any()),
    totalPosts: z.number().default(0),
    totalVideos: z.number(),
    updatedAt: TimestampSchema,
    videos: CatalogVideoListSchema.optional(),
  }),
  pageviews: z.number().optional(),
  videoRef: DocumentReferenceSchema,
});

const CatalogValidSchema = z.object({
  description: z.string(),
  id: z.string(),
  pageviews: z.number().default(0),
  thumbnails: z.array(z.string()),
  title: z.string(),
  totalVideos: z.number(),
  updatedAt: TimestampSchema,
});

const CatalogByUserSchema = CatalogMetaSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
});

const VideosByCatalogSchema = CatalogMetaSchema.extend({
  nextUpdate: z.string(),
  posts: z.array(z.any()),
  videos: CatalogVideoListSchema,
});

export type ZCatalogMeta = z.infer<typeof CatalogMetaSchema>;

export type ZCatalogChannel = z.infer<typeof CatalogChannelSchema>;

export type ZCatalogPlaylist = z.infer<typeof CatalogPlaylistSchema>;

export type ZCatalogSubreddit = z.infer<typeof CatalogSubredditSchema>;

export type ZCatalogList = z.infer<typeof CatalogListSchema>;

export type ZCatalogByID = z.infer<typeof CatalogByIDSchema>;

export type ZUserCatalogDocument = z.infer<typeof UserCatalogDocumentSchema>;

export type ZVideoContentInfo = z.infer<typeof VideoContentInfoSchema>;

export type ZVideoMetadata = z.infer<typeof VideoMetadataSchema>;

export type ZCatalogVideoListSchema = z.infer<typeof CatalogVideoListSchema>;

export type ZCatalogDocument = z.infer<typeof CatalogDocumentSchema>;

export type ZVideosByCatalog = z.infer<typeof VideosByCatalogSchema>;

export type ZCatalogByUser = z.infer<typeof CatalogByUserSchema>;

export type ZCatalogValid = z.infer<typeof CatalogValidSchema>;
