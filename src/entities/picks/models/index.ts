import { DocumentReference } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

import { YouTubeVideoMetadataSchema } from "~/entities/youtube/models";

const TimestampSchema = z.custom<Timestamp>(
  (value) => value instanceof Timestamp
);

export const PickMetaSchema = z.object({
  description: z.string(),
  isPublic: z.boolean(),
  lastUpdatedAt: z.string().optional(),
  title: z.string(),
});

const PickByIDSchema = PickMetaSchema.extend({
  isPublic: z.boolean().default(true),
  lastUpdatedAt: z.string().optional(),
  updatedAt: z.string(),
  videos: z.array(YouTubeVideoMetadataSchema),
});

export type ZPickMeta = z.infer<typeof PickMetaSchema>;

export type ZPickByID = z.infer<typeof PickByIDSchema>;

const UserPickDocumentSchema = z.object({
  updatedAt: TimestampSchema,
  videoIds: z.array(z.string()),
});

export type ZUserPickDocument = z.infer<typeof UserPickDocumentSchema>;

const DocumentReferenceSchema = z.custom<DocumentReference<ZUserPickDocument>>(
  (value) => value instanceof DocumentReference
);

const PickVideoSchema = YouTubeVideoMetadataSchema;

export const PickDocumentSchema = z.object({
  data: z.object({
    totalVideos: z.number().prefault(0),
    updatedAt: TimestampSchema,
    videos: z.optional(z.array(PickVideoSchema)),
  }),
  description: z.string(),
  isPublic: z.boolean().default(true),
  lastUpdatedAt: TimestampSchema.optional(),
  title: z.string(),
  videoRef: DocumentReferenceSchema,
});

export type ZPickDocument = z.infer<typeof PickDocumentSchema>;

const PickByUserSchema = PickMetaSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
});

export type ZPickByUser = z.infer<typeof PickByUserSchema>;

const PickValidSchema = z.object({
  description: z.string(),
  id: z.string(),
  isPublic: z.boolean().default(true),
  pageviews: z.number().optional(),
  thumbnails: z.array(z.string()),
  title: z.string(),
  totalPosts: z.number().optional(),
  totalVideos: z.number(),
  totalPodcasts: z.number().optional(),
  updatedAt: TimestampSchema,
});

export type ZPickValid = z.infer<typeof PickValidSchema>;