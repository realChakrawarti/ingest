import z from "zod";

import Log from "~/shared/utils/terminal-logger";

const FirebaseTimestampObjectSchema = z.object({
  _nanoseconds: z.number(),
  _seconds: z.number(),
});

export function toMillis(value: any): number | undefined {
  const { error } = FirebaseTimestampObjectSchema.safeParse(value);

  if (error) {
    Log.fail(error.message);
  }

  return value._seconds * 1000 + value._nanoseconds / 1e6;
}
