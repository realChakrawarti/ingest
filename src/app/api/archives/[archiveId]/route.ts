import type { NextRequest } from "next/server";

import { getArchiveById } from "~/entities/archives";

import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { archiveId } = ctx.params;

  const data = await getArchiveById(archiveId);
  return NxResponse.success(
    `${archiveId} archive data fetched successfully.`,
    data,
    200
  );
}
