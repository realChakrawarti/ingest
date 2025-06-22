import { getValidCatalogIds } from "~/entities/catalogs";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET() {
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog ids fetched successfully.",
    pageListData,
    200
  );
}
