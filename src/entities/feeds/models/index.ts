import { DocumentReference } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const FeedMetaSchema = z.object({
  description: z.string(),
  isPublic: z.boolean(),
  lastUpdatedAt: z.string().optional(),
  title: z.string(),
});

const BaseFeedSchema = z.object({
  channelDescription: z.string(),
  channelHandle: z.string(),
  channelId: z.string(),
  channelLogo: z.string(),
  channelTitle: z.string(),
});

export const FeedChannelSchema = BaseFeedSchema.extend({
  type: z.literal("channel"),
});

export const FeedPlaylistSchema = BaseFeedSchema.extend({
  playlistDescription: z.string(),
  playlistId: z.string(),
  playlistTitle: z.string(),
  type: z.literal("playlist"),
});

export const FeedSubredditSchema = z.object({
  subredditDescription: z.string(),
  subredditIcon: z.string(),
  subredditId: z.string(),
  subredditName: z.string(),
  subredditTitle: z.string(),
  subredditUrl: z.string(),
  type: z.literal("subreddit"),
});

export const FeedPodcastItemSchema = z.object({
  podcastId: z.number().optional(),
  podcastTitle: z.string().optional(),
  podcastArtwork: z.string().optional(),
  id: z.number(),
  title: z.string(),
  link: z.string(),
  description: z.string(),
  datePublished: z.number(),
  enclosureUrl: z.string(),
  enclosureType: z.string(),
  enclosureLength: z.number(),
  duration: z.number(),
  feedImage: z.string(),
  feedId: z.number(),
});

export const FeedPodcastSchema = z.object({
  podcastTitle: z.string(),
  podcastId: z.number(),
  podcastLink: z.string(),
  podcastEpisode: z.number(),
  podcastDescription: z.string(),
  podcastArtwork: z.string(),
  podcastLastPublished: z.number(),
  type: z.literal("podcast"),
});

const FeedListSchema = z.discriminatedUnion("type", [
  FeedChannelSchema,
  FeedPlaylistSchema,
  FeedSubredditSchema,
  FeedPodcastSchema,
]);

const TimestampSchema = z.custom<Timestamp>(
  (value) => value instanceof Timestamp
);

export const UserFeedDocumentSchema = z.object({
  list: z.array(FeedListSchema),
  updatedAt: TimestampSchema,
});

const FeedByIDSchema = z.object({
  description: z.string(),
  isPublic: z.boolean().default(true),
  lastUpdatedAt: z.string(),
  list: z.array(FeedListSchema),
  pageviews: z.number(),
  title: z.string(),
});

const VideoContentInfoSchema = z.object({
  defaultVideoLanguage: z.string().optional(),
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

const DocumentReferenceSchema = z.custom<DocumentReference<ZUserFeedDocument>>(
  (value) => value instanceof DocumentReference
);

const FeedVideoListSchema = z.object({
  day: z.array(VideoMetadataSchema).prefault([]),
  month: z.array(VideoMetadataSchema).prefault([]),
  week: z.array(VideoMetadataSchema).prefault([]),
});

const FeedSubredditPostSchema = z.object({
  postAuthor: z.string(),
  postCommentsCount: z.number().prefault(0),
  postCreatedAt: z.number(),
  postDomain: z.string(),
  postId: z.string(),
  postImage: z.string(),
  postPermalink: z.string(),
  postSelftext: z.string().optional(),
  postThumbnail: z.string().optional(),
  postTitle: z.string(),
  postType: z.string(),
  postUrl: z.string(),
  postVideo: z.string(),
  postVotes: z.number(),
  subreddit: z.string(),
});

const FeedDocumentSchema = FeedMetaSchema.extend({
  data: z.object({
    posts: z.array(FeedSubredditPostSchema).optional(),
    podcasts: z.array(FeedPodcastItemSchema).optional(),
    totalPosts: z.number().prefault(0),
    totalVideos: z.number().prefault(0),
    totalPodcasts: z.number().prefault(0),
    updatedAt: TimestampSchema,
    videos: FeedVideoListSchema,
  }),
  isPublic: z.boolean().default(true),
  lastUpdatedAt: TimestampSchema.optional(),
  pageviews: z.number().default(0),
  videoRef: DocumentReferenceSchema,
});

const FeedValidSchema = z.object({
  description: z.string(),
  id: z.string(),
  isPublic: z.boolean().default(true),
  pageviews: z.number().prefault(0),
  thumbnails: z.array(z.string()),
  title: z.string(),
  totalPosts: z.number(),
  totalPodcasts: z.number(),
  totalVideos: z.number(),
  updatedAt: TimestampSchema,
});

export const FeedByUserSchema = FeedMetaSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
});

const FeedContentByFeedSchema = FeedMetaSchema.extend({
  nextUpdate: z.string(),
  pageviews: z.number(),
  posts: z.array(FeedSubredditPostSchema),
  podcasts: z.array(FeedPodcastItemSchema),
  totalPosts: z.number().prefault(0),
  totalVideos: z.number().prefault(0),
  totalPodcasts: z.number().prefault(0),
  videos: FeedVideoListSchema,
});

export type ZFeedPodcastItem = z.infer<typeof FeedPodcastItemSchema>;

export type ZFeedSubredditPost = z.infer<typeof FeedSubredditPostSchema>;

export type ZFeedMeta = z.infer<typeof FeedMetaSchema>;

export type ZFeedChannel = z.infer<typeof FeedChannelSchema>;

export type ZFeedPlaylist = z.infer<typeof FeedPlaylistSchema>;

export type ZFeedSubreddit = z.infer<typeof FeedSubredditSchema>;

export type ZFeedList = z.infer<typeof FeedListSchema>;

export type ZFeedByID = z.infer<typeof FeedByIDSchema>;

export type ZUserFeedDocument = z.infer<typeof UserFeedDocumentSchema>;

export type ZVideoContentInfo = z.infer<typeof VideoContentInfoSchema>;

export type ZVideoMetadata = z.infer<typeof VideoMetadataSchema>;

export type ZFeedVideoListSchema = z.infer<typeof FeedVideoListSchema>;

export type ZFeedDocument = z.infer<typeof FeedDocumentSchema>;

export type ZContentByFeed = z.infer<typeof FeedContentByFeedSchema>;

export type ZFeedByUser = z.infer<typeof FeedByUserSchema>;

export type ZFeedValid = z.infer<typeof FeedValidSchema>;

export type ZFeedPodcast = z.infer<typeof FeedPodcastSchema>;