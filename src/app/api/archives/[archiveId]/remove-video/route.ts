import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { removeArchiveVideo } from "~/entities/archives";
import { YouTubeVideoMetadataSchema } from "~/entities/youtube/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdHeader();
  const { archiveId } = ctx.params;

  const body = await request.json();

  const { success, data, error } = YouTubeVideoMetadataSchema.safeParse(body);

  if (success) {
    const message = await removeArchiveVideo(userId, archiveId, data);

    revalidatePath(`/a/${archiveId}`);

    return NxResponse.success(message, {}, 201);
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: "INVALID_DATA", details: error.message },
    422
  );
}
