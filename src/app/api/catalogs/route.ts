import type { NextRequest } from "next/server";

import { createCatalog, getCatalogByUser } from "~/entities/catalogs";
import { CatalogMetaSchema } from "~/entities/catalogs/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET() {
  const userId = getUserIdHeader();
  const data = await getCatalogByUser(userId);
  return NxResponse.success("Catalogs data fetched successfully.", data, 200);
}

export async function POST(request: NextRequest) {
  const userId = getUserIdHeader();

  const body = await request.json();

  const { success, error, data } = CatalogMetaSchema.safeParse(body);

  if (success) {
    const catalogId = await createCatalog(userId, data);
    return NxResponse.success<{ catalogId: string }>(
      "Catalog created successfully.",
      { catalogId },
      201
    );
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}
