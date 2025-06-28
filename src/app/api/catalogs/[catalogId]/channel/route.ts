import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { deleteChannel, updateCatalogChannels } from "~/entities/catalogs";
import type { CatalogList } from "~/entities/catalogs/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdHeader();
  const { catalogId } = ctx.params;

  const channelToDelete = await request.json();

  await deleteChannel(userId, catalogId, channelToDelete);

  revalidatePath(`/c/${catalogId}`);

  return NxResponse.success<any>("Channel deleted successfully.", {}, 200);
}

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdHeader();
  const { catalogId } = ctx.params;

  if (!catalogId) {
    return NxResponse.fail(
      "Catalog ID is missing from request params.",
      {
        code: "BAD_REQUEST",
        details: "Catalog ID is missing from request params.",
      },
      400
    );
  }

  const payload: { channel: CatalogList<"channel"> } = await request.json();

  const message = await updateCatalogChannels(
    userId,
    catalogId,
    payload.channel
  );

  if (message) {
    return NxResponse.fail(
      message,
      { code: "CATALOG_UPDATE_FAILED", details: message },
      400
    );
  }

  return NxResponse.success<any>("Channel list updated successfully.", {}, 201);
}
