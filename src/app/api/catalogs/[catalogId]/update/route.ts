import type { NextRequest } from "next/server";

import { updateCatalogMeta, type CatalogUpdateResult } from "~/entities/catalogs";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  const payload = await request.json();

  const result: CatalogUpdateResult = await updateCatalogMeta(catalogId, payload);

  if (!result.success) {
    const statusCode = result.statusCode || 500;
    const errorCode = statusCode === 429 ? "RATE_LIMIT_EXCEEDED" : 
                     statusCode === 404 ? "NOT_FOUND" : "UPDATE_FAILED";
    
    return NxResponse.fail(
      result.message,
      { code: errorCode, details: null },
      statusCode
    );
  }

  return NxResponse.success(result.message, {}, 200);
}
