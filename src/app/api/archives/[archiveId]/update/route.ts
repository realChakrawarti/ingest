import type { NextRequest } from "next/server";

import { updateArchiveMeta } from "~/entities/archives";

import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: Promise<{
    archiveId: string;
  }>;
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { archiveId } = await ctx.params;

  const payload = await request.json();

  const message = await updateArchiveMeta(archiveId, payload);

  return NxResponse.success(message, {}, 201);
}
