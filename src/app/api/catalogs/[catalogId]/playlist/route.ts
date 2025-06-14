import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { deletePlaylist, updateCatalogPlaylists } from "~/entities/catalogs";
import { ChannelPlaylist } from "~/entities/youtube/models";
import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

/**
 * Updates playlists for a specific catalog.
 *
 * @param request - The incoming HTTP request containing playlist update data
 * @param ctx - Context parameters including the catalog identifier
 * @returns A response indicating the result of the playlist update operation
 *
 * @throws Will return a 400 error if the catalog ID is missing
 * @throws Will propagate any errors from playlist update process
 *
 * @remarks
 * This endpoint requires a valid user session and expects a JSON payload
 * of playlist items to update for the specified catalog.
 */
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

  const payload: { playlists: ChannelPlaylist[] } = await request.json();

  await updateCatalogPlaylists(userId, catalogId, payload.playlists);

  return NxResponse.success<any>("Playlist update successfully.", {}, 200);
}

/**
 * Deletes specified playlists from a catalog.
 *
 * @param request - The incoming HTTP request containing playlists to delete
 * @param ctx - Context parameters containing the catalog identifier
 * @returns A success response indicating playlist deletion
 *
 * @remarks
 * This function requires an authenticated user and performs the following steps:
 * 1. Retrieves the user ID from request headers
 * 2. Extracts the catalog ID from the context
 * 3. Parses the request body to get playlists to delete
 * 4. Calls the delete playlist service method
 * 5. Revalidates the catalog path to refresh cache
 *
 * @throws Will throw an error if playlist deletion fails
 */
export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdHeader();
  const { catalogId } = ctx.params;

  const playlistToDelete = await request.json();

  try {
    await deletePlaylist(userId, catalogId, playlistToDelete);
    revalidatePath(`/c/${catalogId}`);
    return NxResponse.success<any>("Playlist deleted successfully.", {}, 200);
  } catch (err) {
    return NxResponse.fail(
      "Unable to delete playlist from the catalog.",
      {
        code: "PLAYLIST_DELETE_FAILED",
        details: "Unable to delete playlist from the catalog.",
      },
      400
    );
  }
}
