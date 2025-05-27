import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { removeArchiveVideo } from "~/entities/archives";
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

  const payload = await request.json();

  const message = await removeArchiveVideo(userId, archiveId, payload);

  revalidatePath(`/a/${archiveId}`);

  return NxResponse.success(message, {}, 201);
}
