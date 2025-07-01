import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { addArchiveVideo } from "~/entities/archives";
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

  const { success, error, data } = YouTubeVideoMetadataSchema.safeParse(body);

  if (success) {
    const result = await addArchiveVideo(userId, archiveId, data);

    // Reset page cache when archives updates
    revalidatePath("/explore/archives");
    revalidatePath(`/a/${archiveId}`);

    return NxResponse.success(result, {}, 201);
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}
