import type { NextRequest } from "next/server";

import { getFeedMeta, getContentsByFeed } from "~/entities/feeds";

import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: Promise<{
    feedId: string;
  }>;
};

export async function GET(request: NextRequest, ctx: ContextParams) {
  const { feedId } = await ctx.params;
  const onlyMeta = request.nextUrl.searchParams.get("meta") === "true";

  if (feedId) {
    try {
      if (onlyMeta) {
        const data = await getFeedMeta(feedId);

        if (typeof data === "string") {
          return NxResponse.fail(data, { code: "UNKNOWN", details: data }, 400);
        }

        return NxResponse.success(
          `Feed: ${feedId} meta fetched successfully.`,
          data,
          200
        );
      }
      const data = await getContentsByFeed(feedId);

      if (typeof data === "string") {
        return NxResponse.fail(data, { code: "UNKNOWN", details: data }, 400);
      }

      return NxResponse.success(
        `Feed: ${feedId} contents fetched successfully.`,
        data,
        200
      );
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to fetch feed contents.",
        {
          code: "FAILED_CATALOG_VIDEOS",
          details: "Unable to fetch feed contents.",
        },
        500
      );
    }
  }
}