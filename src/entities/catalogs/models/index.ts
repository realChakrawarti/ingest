import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

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
	isPublic: z.boolean().default(true),
	isPublicUpdatedAt: z.string().optional(),
	list: z.array(CatalogListSchema),
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

const DocumentReferenceSchema = z.custom<
	DocumentReference<ZUserCatalogDocument>
>((value) => value instanceof DocumentReference);

const CatalogVideoListSchema = z.object({
	day: z.array(VideoMetadataSchema).prefault([]),
	month: z.array(VideoMetadataSchema).prefault([]),
	week: z.array(VideoMetadataSchema).prefault([]),
});

const CatalogSubredditPostSchema = z.object({
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

const CatalogDocumentSchema = CatalogMetaSchema.extend({
	data: z.object({
		posts: z.array(CatalogSubredditPostSchema).optional(),
		totalPosts: z.number().prefault(0),
		totalVideos: z.number().prefault(0),
		updatedAt: TimestampSchema,
		videos: CatalogVideoListSchema,
	}),
	isPublic: z.boolean().default(true),
	isPublicUpdatedAt: TimestampSchema.optional(),
	pageviews: z.number().optional(),
	videoRef: DocumentReferenceSchema,
});

const CatalogValidSchema = z.object({
	description: z.string(),
	id: z.string(),
	isPublic: z.boolean().default(true),
	pageviews: z.number().prefault(0),
	thumbnails: z.array(z.string()),
	title: z.string(),
	totalPosts: z.number(),
	totalVideos: z.number(),
	updatedAt: TimestampSchema,
});

const CatalogByUserSchema = CatalogMetaSchema.extend({
	id: z.string(),
	updatedAt: z.string(),
});

const ContentByCatalogSchema = CatalogMetaSchema.extend({
	nextUpdate: z.string(),
	pageviews: z.number(),
	posts: z.array(CatalogSubredditPostSchema),
	totalPosts: z.number().prefault(0),
	totalVideos: z.number().prefault(0),
	videos: CatalogVideoListSchema,
});

export type ZCatalogSubredditPost = z.infer<typeof CatalogSubredditPostSchema>;

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

export type ZContentByCatalog = z.infer<typeof ContentByCatalogSchema>;

export type ZCatalogByUser = z.infer<typeof CatalogByUserSchema>;

export type ZCatalogValid = z.infer<typeof CatalogValidSchema>;
