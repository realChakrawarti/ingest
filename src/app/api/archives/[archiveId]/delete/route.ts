import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { deleteArchive } from "~/entities/archives";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { archiveId } = ctx.params;

  try {
    await deleteArchive(userId, archiveId);
    revalidatePath("/explore");
    revalidatePath("/explore/archives");
    return NxResponse.success("Archive deleted successfully.", {}, 200);
  } catch (err) {
    Log.fail(err);
    return NxResponse.fail(
      "Failed to delete Archive. Try again.",
      {
        code: "UNABLE_DELETE_ARCHIVE",
        details: "Failed to delete Archive. Try again.",
      },
      401
    );
  }
}
