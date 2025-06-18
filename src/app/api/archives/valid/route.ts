import { NextRequest } from "next/server";

import { getValidArchiveIds } from "~/entities/archives";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(_request: NextRequest) {
  try {
    const pageListData = await getValidArchiveIds();
    return NxResponse.success(
      "Valid archive ids fetched successfully.",
      pageListData,
      200
    );
  } catch (err) {
    return NxResponse.fail(
      "Unable to parse valid archive ids.",
      { code: "ARCHIVE_VALID", details: "Unable to parse valid archive ids." },
      400
    );
  }
}
