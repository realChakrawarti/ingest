import { z } from "zod/v4";

export const TitleDescriptionSchema = z.object({
  description: z
    .string()
    .min(8, { message: "Description must be at least 8 characters long." })
    .max(64, { message: "Description must be at most 64 characters long." }),
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long." })
    .max(24, { message: "Title must be at most 24 characters long." }),
});
