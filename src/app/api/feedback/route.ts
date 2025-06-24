import type { NextRequest } from "next/server";

import { createGitHubIssue } from "~/entities/feedback";

import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();

  try {
    const issueUrl = await createGitHubIssue(title, description);
    return NxResponse.success(
      "Feedback shared successfully.",
      { data: issueUrl },
      201
    );
  } catch (err) {
    Log.fail(err);
    return NxResponse.fail(
      "Unable to share feedback.",
      {
        code: "FEEDBACK_FAILED",
        details: "Unable to share feedback.",
      },
      400
    );
  }
}
