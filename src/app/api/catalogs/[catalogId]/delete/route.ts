import { doc, writeBatch } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { getUserIdCookie } from "~/shared/lib/next/get-cookie";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
  const userCatalogRef = doc(
    db,
    COLLECTION.users,
    userId,
    COLLECTION.catalogs,
    catalogId
  );

  const batch = writeBatch(db);
  batch.delete(catalogRef);
  batch.delete(userCatalogRef);

  await batch.commit();

  revalidatePath("/explore");

  return NxResponse.success("Catalog deleted successfully.", {}, 200);
}
