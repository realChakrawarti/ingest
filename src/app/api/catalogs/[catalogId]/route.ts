import type { NextRequest } from "next/server";

import { getCatalogById } from "~/entities/catalogs";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  try {
    const userId = getUserIdHeader();
    const data = await getCatalogById(catalogId, userId);

    return NxResponse.success<any>(
      `${catalogId} catalog data fetched successfully.`,
      data,
      200
    );
  } catch (err) {
    Log.fail(err);
    return NxResponse.fail(
      "Unable to fetch catalog details.",
      {
        code: "GET_CATALOG",
        details: "Unable to fetch catalog details.",
      },
      400
    );
  }
}
