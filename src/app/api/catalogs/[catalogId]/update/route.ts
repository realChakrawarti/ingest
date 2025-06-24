import type { NextRequest } from "next/server";

import { updateCatalogMeta } from "~/entities/catalogs";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  const payload = await request.json();

  const message = await updateCatalogMeta(catalogId, payload);

  return NxResponse.success(message, {}, 201);
}
