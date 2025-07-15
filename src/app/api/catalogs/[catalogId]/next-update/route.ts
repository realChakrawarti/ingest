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

// TODO: Maybe deprecate this endpoint? I having hard time properly integrating the flow on the UI to refreshing the page
// when the catalog is stale
export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;
  const result = await getNextUpdate(catalogId);
  const currentTime = Date.now();

  if (result) {
    const lastUpdatedTime = result?.getTime();
    const nextUpdate = new Date(lastUpdatedTime + time.hours(4)).toUTCString();

    if (currentTime - lastUpdatedTime > time.hours(4)) {
      Log.info(`Revalidating path: /c/${catalogId}`);
      revalidatePath(`/c/${catalogId}`);
    }

    return NxResponse.success("", nextUpdate, 200);
  }
}
