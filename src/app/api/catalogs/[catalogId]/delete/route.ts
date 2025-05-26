import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { deleteCatalog } from "~/entities/catalogs";
import { getUserIdCookie } from "~/shared/lib/next/get-cookie";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  const result = await deleteCatalog(userId, catalogId);
  if (result) {
    return NxResponse.fail(
      result,
      { code: "CATALOG_DELETE", details: result },
      400
    );
  }
  revalidatePath("/explore");

  return NxResponse.success("Catalog deleted successfully.", {}, 200);
}
