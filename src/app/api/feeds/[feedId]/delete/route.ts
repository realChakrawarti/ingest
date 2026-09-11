import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { deleteFeed } from "~/entities/feeds";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: Promise<{
    feedId: string;
  }>;
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { feedId } = await ctx.params;

  const result = await deleteFeed(userId, feedId);
  if (result) {
    return NxResponse.fail(
      result,
      { code: "CATALOG_DELETE", details: result },
      400
    );
  }
  revalidatePath("/");
  revalidatePath("/explore/feeds");

  return NxResponse.success("Feed deleted successfully.", {}, 200);
}