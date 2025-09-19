import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { deletePlaylist, updateCatalogPlaylists } from "~/entities/catalogs";
import { CatalogPlaylistSchema } from "~/entities/catalogs/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

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

  const { success, data, error } = z
    .array(CatalogPlaylistSchema)
    .safeParse(body);

  if (success) {
    try {
      await updateCatalogPlaylists(userId, catalogId, data);
      return NxResponse.success("Playlist update successfully.", {}, 200);
    } catch (err) {
      if (err instanceof Error) {
        return NxResponse.fail(
          err.message,
          { code: "CATALOG_PLAYLIST_UPDATE", details: err.message },
          400
        );
      }
      return NxResponse.fail(
        "Unable to update catalog playlists.",
        {
          code: "CATALOG_PLAYLIST_UPDATE",
          details: "Unable to update catalog playlists.",
        },
        400
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdHeader();
  const { catalogId } = ctx.params;

  const body = await request.json();

  const { success, error, data } = CatalogPlaylistSchema.safeParse(body);

  if (success) {
    try {
      await deletePlaylist(userId, catalogId, data);
      revalidatePath(`/c/${catalogId}`);
      return NxResponse.success("Playlist deleted successfully.", {}, 200);
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to delete playlist from the catalog.",
        {
          code: "PLAYLIST_DELETE_FAILED",
          details: "Unable to delete playlist from the catalog.",
        },
        400
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}
