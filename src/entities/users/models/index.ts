import { z } from "zod";

const UserSettingsSchema = z.object({
  historyDays: z.number(),
  playbackRate: z.number(),
  syncId: z.string(),
  videoLanguage: z.string(),
  watchedPercentage: z.number(),
  thumbnailGrayscale: z.number().min(0).max(100),
});

export type ZUserSettings = z.infer<typeof UserSettingsSchema>;

export const syncTypes = ["favorites", "history", "settings", "watchLater"];

export const SyncTypesSchema = z.literal(syncTypes);

export type ZSyncTypes = z.infer<typeof SyncTypesSchema>;