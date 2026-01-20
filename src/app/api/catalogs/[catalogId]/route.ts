import type { NextRequest } from "next/server";

import { getCatalogById } from "~/entities/catalogs";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  const userId = getUserIdHeader();
  const result = await getCatalogById(catalogId, userId);

  if (result.success) {
    return NxResponse.success(
      `${catalogId} catalog data fetched successfully.`,
      result.data,
      Status.Ok
    );
  }

  return NxResponse.fail(
    result.error,
    {
      code: AppErrorCodes.GET_CATALOG_BY_ID_FAILED,
      details: result.error,
    },
    Status.BadRequest
  );
}
