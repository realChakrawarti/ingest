import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { removePickVideo } from "~/entities/picks";
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

  const { success, data, error } = YouTubeVideoMetadataSchema.safeParse(body);

  if (success) {
    const message = await removePickVideo(userId, pickId, data);

    revalidatePath(`/p/${pickId}`);

    return NxResponse.success(message, {}, 201);
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: "INVALID_DATA", details: error.message },
    422
  );
}