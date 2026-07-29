"use client";

import AddToFavorites from "./add-to-fav";
import ShareCatalog from "./share-catalog";

type CatalogActionProps = {
  catalogId: string;
  catalogTitle: string;
  catalogDescription: string;
};

export function CatalogAction({
  catalogId,
  catalogTitle,
  catalogDescription,
}: CatalogActionProps) {
  return (
    <div className="flex justify-end gap-4">
      <ShareCatalog
        catalogId={catalogId}
        catalogTitle={catalogTitle}
        catalogDescription={catalogDescription}
      />
      <AddToFavorites
        catalogId={catalogId}
        catalogTitle={catalogTitle}
        catalogDescription={catalogDescription}
      />
    </div>
  );
}