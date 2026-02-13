import type { NextRequest } from "next/server";

import { createCatalog, getCatalogByUser } from "~/entities/catalogs";
import { CatalogMetaSchema } from "~/entities/catalogs/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

export async function GET() {
  const userId = await getUserIdHeader();
  try {
    const data = await getCatalogByUser(userId);
    return NxResponse.success(
      "Catalogs data fetched successfully.",
      data,
      Status.Ok
    );
  } catch (err) {
    return NxResponse.fail(
      "Unable to retrieve user catalogs.",
      {
        code: AppErrorCodes.GET_USER_CATALOG_FAILED,
        details:
          err instanceof Error
            ? err.message
            : "Unable to retrieve user catalogs.",
      },
      Status.InternalServerError
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdHeader();

  const body = await request.json();

  const { success, error, data } = CatalogMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const catalogId = await createCatalog(userId, data);
    return NxResponse.success<{ catalogId: string }>(
      "Catalog created successfully.",
      { catalogId },
      Status.Created
    );
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: AppErrorCodes.INVALID_DATA_PROVIDED, details: error.message },
    Status.UnprocessableEntity
  );
}
