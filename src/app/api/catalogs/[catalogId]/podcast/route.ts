import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { deletePodcast, updateCatalogPodcasts } from "~/entities/catalogs";
import { CatalogPodcastSchema } from "~/entities/catalogs/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import { Status } from "~/shared/utils/http-status";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: Promise<{
    catalogId: string;
  }>;
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { catalogId } = await ctx.params;

  if (!catalogId) {
    return NxResponse.fail(
      "Catalog ID is missing from request params.",
      {
        code: "BAD_REQUEST",
        details: "Catalog ID is missing from request params.",
      },
      Status.BadRequest
    );
  }

  const body = await request.json();

  const { success, data, error } = z
    .array(CatalogPodcastSchema)
    .safeParse(body);

  if (success) {
    try {
      await updateCatalogPodcasts(userId, catalogId, data);
      return NxResponse.success("Podcast update successfully.", {}, 200);
    } catch (err) {
      if (err instanceof Error) {
        return NxResponse.fail(
          err.message,
          { code: "CATALOG_PODCAST_UPDATE", details: err.message },
          Status.BadRequest
        );
      }
      return NxResponse.fail(
        "Unable to update catalog podcasts.",
        {
          code: "CATALOG_PODCAST_UPDATE",
          details: "Unable to update catalog podcasts.",
        },
        Status.BadRequest
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      Status.UnprocessableEntity
    );
  }
}

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { catalogId } = await ctx.params;

  const body = await request.json();

  const { success, error, data } = CatalogPodcastSchema.safeParse(body);

  if (success) {
    try {
      await deletePodcast(userId, catalogId, data);
      revalidatePath(`/c/${catalogId}`);
      return NxResponse.success("Podcast deleted successfully.", {}, 200);
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to delete podcast from the catalog.",
        {
          code: "PODCAST_DELETE_FAILED",
          details: "Unable to delete podcast from the catalog.",
        },
        Status.BadRequest
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      Status.UnprocessableEntity
    );
  }
}