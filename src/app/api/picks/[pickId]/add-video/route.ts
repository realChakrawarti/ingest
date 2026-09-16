import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { addPickVideo } from "~/entities/picks";
import { YouTubeVideoMetadataSchema } from "~/entities/youtube/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: Promise<{
    pickId: string;
  }>;
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { pickId } = await ctx.params;

  const body = await request.json();

  const { success, error, data } = YouTubeVideoMetadataSchema.safeParse(body);

  if (success) {
    const result = await addPickVideo(userId, pickId, data);

    // Reset page cache when picks updates
    revalidatePath("/explore/picks");
    revalidatePath(`/p/${pickId}`);

    return NxResponse.success(result, {}, 201);
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: "INVALID_DATA", details: error.message },
    422
  );
}