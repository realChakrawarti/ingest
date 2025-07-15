"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { indexedDB } from "~/shared/lib/api/dexie";

export const AddToFavorites = ({
  catalogId,
  catalogTitle,
  catalogDescription,
}: {
  catalogId: string;
  catalogTitle: string;
  catalogDescription: string;
}) => {
  const favoriteCatalogs =
    useLiveQuery(() => indexedDB["favorites"].toArray(), []) ?? [];
  const [catalogExists, setCatalogExists] = useState<boolean>(false);

  useEffect(() => {
    const checkIfExists = () => {
      for (let i = 0; i < favoriteCatalogs?.length; i++) {
        if (favoriteCatalogs[i].id === catalogId) {
          setCatalogExists(true);
          return;
        }
      }
      setCatalogExists(false);
    };

    checkIfExists();
  }, [favoriteCatalogs, catalogId]);

  const addToFav = async () => {
    if (catalogExists) {
      toast("Catalog removed from favorites.");

      await indexedDB["favorites"].delete(catalogId);
    }
    // Add the catalogId to favorites
    else {
      const favCatalog = {
        description: catalogDescription,
        id: catalogId,
        title: catalogTitle,
      };
      await indexedDB["favorites"].add(favCatalog);
      toast("Catalog added to favorites.");
    }
  };

  return (
    <button
      type="button"
      className="flex items-center gap-2 text-xs"
      onClick={addToFav}
    >
      <StarIcon
        className={`h-4 w-4 ${
          catalogExists ? "fill-primary text-primary" : ""
        }`}
      />
      {catalogExists ? "Remove from favorites" : "Add to favorites"}
    </button>
  );
};
