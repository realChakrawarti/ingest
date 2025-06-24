import type { NextRequest } from "next/server";

import { createCatalog, getCatalogByUser } from "~/entities/catalogs";
import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET() {
  const userId = getUserIdHeader();
  const data = await getCatalogByUser(userId);
  return NxResponse.success("Catalogs data fetched successfully.", data, 200);
}

export async function POST(request: NextRequest) {
  const userId = getUserIdHeader();

  const catalogMeta = await request.json();

  const catalogId = await createCatalog(userId, catalogMeta);

  return NxResponse.success<{ catalogId: string }>(
    "Catalog created successfully.",
    { catalogId },
    201
  );
}
