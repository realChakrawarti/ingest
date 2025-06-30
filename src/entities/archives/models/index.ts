import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod/v4";

import { YouTubeVideoMetadataSchema } from "~/entities/youtube/models";

const ArchiveMetaSchema = z.object({
  description: z.string(),
  title: z.string(),
});

const ArchiveByIDSchema = ArchiveMetaSchema.extend({
  videos: z.array(YouTubeVideoMetadataSchema),
});

export type ZArchiveMeta = z.infer<typeof ArchiveMetaSchema>;

export type ZArchiveByID = z.infer<typeof ArchiveByIDSchema>;

const TimestampSchema = z.custom<Timestamp>(
  (value) => value instanceof Timestamp
);

const UserArchiveDocumentSchema = z.object({
  updatedAt: TimestampSchema,
  videoIds: z.array(z.string()),
});

export type ZUserArchiveDocument = z.infer<typeof UserArchiveDocumentSchema>;

const DocumentReferenceSchema = z.custom<
  DocumentReference<ZUserArchiveDocument>
>((value) => value instanceof DocumentReference);

const ArchiveVideoSchema = z.object({
  channelId: z.string(),
  channelTitle: z.string(),
  publishedAt: z.string(),
  videoDescription: z.string(),
  videoId: z.string(),
  videoThumbnail: z.string(),
  videoTitle: z.string(),
});

export const ArchiveDocumentSchema = z.object({
  data: z.object({
    totalVideos: z.number().default(0),
    updatedAt: TimestampSchema,
    videos: z.optional(z.array(ArchiveVideoSchema)),
  }),
  description: z.string(),
  title: z.string(),
  videoRef: DocumentReferenceSchema,
});

export type ZArchiveDocumentSchema = z.infer<typeof ArchiveDocumentSchema>;

const ArchiveByUserSchema = ArchiveMetaSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
});

export type ZArchiveByUser = z.infer<typeof ArchiveByUserSchema>;

const ArchiveValidSchema = z.object({
  description: z.string(),
  id: z.string(),
  thumbnails: z.array(z.string()),
  title: z.string(),
  totalVideos: z.number(),
  updatedAt: TimestampSchema,
});

export type ZArchiveValid = z.infer<typeof ArchiveValidSchema>;
