import { Timestamp } from "firebase/firestore";
import { DocumentReference } from "firebase-admin/firestore";
import { z } from "zod";

import { YouTubeVideoMetadataSchema } from "~/entities/youtube/models";

const TimestampSchema = z.custom<Timestamp>(
  (value) => value instanceof Timestamp
);

export const ArchiveMetaSchema = z.object({
  description: z.string(),
  isPublic: z.boolean(),
  lastUpdatedAt: z.string().optional(),
  title: z.string(),
});

const ArchiveByIDSchema = ArchiveMetaSchema.extend({
  isPublic: z.boolean().default(true),
  lastUpdatedAt: z.string().optional(),
  updatedAt: z.string(),
  videos: z.array(YouTubeVideoMetadataSchema),
});

export type ZArchiveMeta = z.infer<typeof ArchiveMetaSchema>;

export type ZArchiveByID = z.infer<typeof ArchiveByIDSchema>;

const UserArchiveDocumentSchema = z.object({
  updatedAt: TimestampSchema,
  videoIds: z.array(z.string()),
});

export type ZUserArchiveDocument = z.infer<typeof UserArchiveDocumentSchema>;

const DocumentReferenceSchema = z.custom<
  DocumentReference<ZUserArchiveDocument>
>((value) => value instanceof DocumentReference);

const ArchiveVideoSchema = YouTubeVideoMetadataSchema;

export const ArchiveDocumentSchema = z.object({
  data: z.object({
    totalVideos: z.number().prefault(0),
    updatedAt: TimestampSchema,
    videos: z.optional(z.array(ArchiveVideoSchema)),
  }),
  description: z.string(),
  isPublic: z.boolean().default(true),
  lastUpdatedAt: TimestampSchema.optional(),
  title: z.string(),
  videoRef: DocumentReferenceSchema,
});

export type ZArchiveDocument = z.infer<typeof ArchiveDocumentSchema>;

const ArchiveByUserSchema = ArchiveMetaSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
});

export type ZArchiveByUser = z.infer<typeof ArchiveByUserSchema>;

const ArchiveValidSchema = z.object({
  description: z.string(),
  id: z.string(),
  isPublic: z.boolean().default(true),
  pageviews: z.number().optional(),
  thumbnails: z.array(z.string()),
  title: z.string(),
  totalPosts: z.number().optional(),
  totalVideos: z.number(),
  updatedAt: TimestampSchema,
});

export type ZArchiveValid = z.infer<typeof ArchiveValidSchema>;
