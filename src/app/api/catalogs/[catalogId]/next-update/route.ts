import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { getNextUpdate } from "~/entities/catalogs";

import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";
import { time } from "~/shared/utils/time";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;
  const result = await getNextUpdate(catalogId);
  const currentTime = Date.now();

  const lastUpdatedTime = new Date(result).getTime();
  const nextUpdate = new Date(lastUpdatedTime + time.hours(4)).toUTCString();

  if (currentTime - lastUpdatedTime > time.hours(4)) {
    Log.info(`Revalidating path: /c/${catalogId}`);
    revalidatePath(`/c/${catalogId}`);
  }

  return NxResponse.success("", nextUpdate, 200);
}
