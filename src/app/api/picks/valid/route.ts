import { getValidPickIds } from "~/entities/picks";

import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

export async function GET() {
  try {
    const pageListData = await getValidPickIds();
    return NxResponse.success(
      "Valid pick ids fetched successfully.",
      pageListData,
      200
    );
  } catch (err) {
    Log.fail(err);
    return NxResponse.fail(
      "Unable to parse valid pick ids.",
      { code: "PICK_VALID", details: "Unable to parse valid pick ids." },
      400
    );
  }
}
