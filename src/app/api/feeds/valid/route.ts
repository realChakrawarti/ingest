import { getValidFeedIds } from "~/entities/feeds";

import { NxResponse } from "~/shared/lib/next/nx-response";
import { Status } from "~/shared/utils/http-status";

export async function GET() {
  const pageListData = await getValidFeedIds();
  return NxResponse.success(
    "Valid feed identifiers fetched successfully.",
    pageListData,
    Status.Ok
  );
}