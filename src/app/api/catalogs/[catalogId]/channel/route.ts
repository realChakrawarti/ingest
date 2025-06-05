import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  deleteChannel,
  getVideosByCatalog,
  updateCatalogChannels,
} from "~/entities/catalogs";
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

  const catalogPayload = await request.json();

  await updateCatalogChannels(userId, catalogId, catalogPayload);

  // Update the catalog
  getVideosByCatalog(catalogId);

  // Revalidate the /explore route
  revalidatePath("/explore/catalogs");
  revalidatePath(`/c/${catalogId}`);

  return NxResponse.success<any>("Channel list updated successfully.", {}, 201);
}
