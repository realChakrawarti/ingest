import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { deleteChannel, updateCatalogChannels } from "~/entities/catalogs";
import { CatalogChannelSchema } from "~/entities/catalogs/models";

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

  const body = await request.json();

  const { success, error, data } = CatalogChannelSchema.safeParse(body);

  if (success) {
    await deleteChannel(userId, catalogId, data);
    revalidatePath(`/c/${catalogId}`);
    return NxResponse.success("Channel deleted successfully.", {}, 200);
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
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

  const body = await request.json();

  const { success, data, error } = CatalogChannelSchema.safeParse(body);

  if (success) {
    const message = await updateCatalogChannels(userId, catalogId, data);

    if (message) {
      return NxResponse.fail(
        message,
        { code: "CATALOG_UPDATE_FAILED", details: message },
        400
      );
    }

    return NxResponse.success("Channel list updated successfully.", {}, 201);
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}
