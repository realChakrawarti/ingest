import { DocumentReference } from "firebase-admin/firestore";
import * as z from "zod/v4";

import type { VideoDetails } from "~/entities/youtube/models";

export type ArchiveByIdResponse = {
  title: string;
  description: string;
  videos: VideoDetails[];
};

const ArchiveVideoSchema = z.object({
  channelId: z.string(),
  channelTitle: z.string(),
  publishedAt: z.string(),
  videoDescription: z.string(),
  videoId: z.string(),
  videoThumbnail: z.string(),
  videoTitle: z.string(),
});

export const ArchiveSchema = z.object({
  data: ArchiveVideoSchema,
  description: z.string(),
  title: z.string(),
  videoRef: DocumentReference,
});
