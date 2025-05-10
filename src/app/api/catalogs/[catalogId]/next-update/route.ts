import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { getNextUpdate } from "~/entities/catalogs";
import { timeMs } from "~/shared/lib/constants";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;
  const result = await getNextUpdate(catalogId);
  const currentTime = Date.now();

  const lastUpdatedTime = new Date(result).getTime();
  const nextUpdate = new Date(lastUpdatedTime + timeMs["4h"]).toUTCString();

  if (currentTime - lastUpdatedTime > timeMs["4h"]) {
    console.log(`Revalidating path: /c/${catalogId}`);
    revalidatePath(`/c/${catalogId}`);
  }

  return NxResponse.success("", nextUpdate, 200);
}
