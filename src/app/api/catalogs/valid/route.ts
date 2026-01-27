import { getValidCatalogIds } from "~/entities/catalogs";

import { NxResponse } from "~/shared/lib/next/nx-response";
import { Status } from "~/shared/utils/http-status";

export async function GET() {
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog identifiers fetched successfully.",
    pageListData,
    Status.Ok
  );
}
