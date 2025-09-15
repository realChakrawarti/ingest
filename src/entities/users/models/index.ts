import { z } from "zod";

const UserSettingsSchema = z.object({
  historyDays: z.number(),
  playbackRate: z.number(),
  syncId: z.string(),
  videoLanguage: z.string(),
  watchedPercentage: z.number(),
});

export type ZUserSettings = z.infer<typeof UserSettingsSchema>;

export const SyncTypesSchema = z.literal([
  "favorites",
  "history",
  "settings",
  "watchLater",
]);

export type ZSyncTypes = z.infer<typeof SyncTypesSchema>;
