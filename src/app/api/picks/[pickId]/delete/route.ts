import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { deletePick } from "~/entities/picks";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: Promise<{
    pickId: string;
  }>;
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { pickId } = await ctx.params;

  try {
    await deletePick(userId, pickId);
    revalidatePath("/");
    revalidatePath("/explore/picks");
    return NxResponse.success("Pick deleted successfully.", {}, 200);
  } catch (err) {
    Log.fail(err);
    return NxResponse.fail(
      "Failed to delete Pick. Try again.",
      {
        code: "UNABLE_DELETE_PICK",
        details: "Failed to delete Pick. Try again.",
      },
      401
    );
  }
}
