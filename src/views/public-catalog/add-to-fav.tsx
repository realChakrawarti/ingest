"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";

import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";

import { useIsMobile } from "~/shared/hooks/use-mobile";
import { indexedDB } from "~/shared/lib/api/dexie";
import { cn } from "~/shared/utils/tailwind-merge";

export default function AddToFavorites({
  catalogId,
  catalogTitle,
  catalogDescription,
}: {
  catalogId: string;
  catalogTitle: string;
  catalogDescription: string;
}) {
  const isMobile = useIsMobile();

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
      className={cn(
        "flex items-center gap-2 w-full",
        isMobile ? "text-base" : "text-sm"
      )}
      onClick={addToFav}
    >
      <StarIcon
        className={cn(
          isMobile ? "size-6" : "size-4",
          catalogExists ? "fill-primary text-primary" : ""
        )}
      />
      {catalogExists ? "Remove from favorites" : "Add to favorites"}
    </button>
  );
}