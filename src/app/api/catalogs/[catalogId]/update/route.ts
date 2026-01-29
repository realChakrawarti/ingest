import type { NextRequest } from "next/server";

import { updateCatalogMeta } from "~/entities/catalogs";
import { CatalogMetaSchema } from "~/entities/catalogs/models";

import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  // Validate catalogId route parameter
  if (!catalogId || catalogId.trim() === "") {
    return NxResponse.fail(
      "Missing or invalid Catalog identifier.",
      {
        code: AppErrorCodes.INVALID_CATALOG_ID,
        details:
          "Catalog identifier route parameter is required & cannot be empty.",
      },
      Status.BadRequest
    );
  }

  const body = await request.json();

  const { success, data, error } = CatalogMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const result = await updateCatalogMeta(catalogId, data);

    if (result.success) {
      return NxResponse.success(result.data, {}, Status.Created);
    }

    return NxResponse.fail(
      result.error,
      { code: AppErrorCodes.INVALID_METADATA_UPDATE, details: result.error },
      Status.InternalServerError
    );
  }

  return NxResponse.fail(
    "Invalid data provided.",
    {
      code: AppErrorCodes.INVALID_DATA_PROVIDED,
      details: error?.message ?? "Failed to parse request payload.",
    },
    Status.UnprocessableEntity
  );
}
