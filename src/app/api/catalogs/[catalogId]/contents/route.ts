import type { NextRequest } from "next/server";

import { getCatalogMeta, getContentsByCatalog } from "~/entities/catalogs";

import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;
  const onlyMeta = request.nextUrl.searchParams.get("meta") ?? false;

  if (catalogId) {
    try {
      if (onlyMeta) {
        const data = await getCatalogMeta(catalogId);

        if (typeof data === "string") {
          return NxResponse.fail(data, { code: "UNKNOWN", details: data }, 400);
        }

        return NxResponse.success(
          `Catalog: ${catalogId} meta fetched successfully.`,
          data,
          200
        );
      } else {
        const data = await getContentsByCatalog(catalogId);

        if (typeof data === "string") {
          return NxResponse.fail(data, { code: "UNKNOWN", details: data }, 400);
        }

        return NxResponse.success(
          `Catalog: ${catalogId} contents fetched successfully.`,
          data,
          200
        );
      }
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to fetch catalog contents.",
        {
          code: "FAILED_CATALOG_VIDEOS",
          details: "Unable to fetch catalog contents.",
        },
        404
      );
    }
  }
}
