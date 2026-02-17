"use client";

import { toast } from "sonner";
import useSWR from "swr";

import type { ZCatalogByUser } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { BookOpenIcon } from "~/shared/ui/icons";
import Log from "~/shared/utils/terminal-logger";
import { getTimeDifference } from "~/shared/utils/time-diff";

import GridContainer from "~/widgets/grid-container";
import CatalogCard from "~/widgets/item-card";
import NoItemCard from "~/widgets/no-item-card";
import Spinner from "~/widgets/spinner";

import CreateCatalogDialog from "./create-catalog-dialog";

export default function CatalogView() {
  const {
    data: catalogs,
    isLoading: isCatalogLoading,
    error: isCatalogError,
    mutate,
  } = useSWR("/catalogs", (url) => fetchApi<ZCatalogByUser[]>(url));

  const catalogsData = catalogs?.data;

  const handleCatalogDelete = async (catalogId: string) => {
    if (catalogId) {
      try {
        const result = await fetchApi(`/catalogs/${catalogId}/delete`, {
          method: "DELETE",
        });
        mutate();
        toast(result.message);
      } catch (err) {
        Log.fail(err);
      }
    }
  };

  return (
    <div className="px-3 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl flex items-center gap-3">
          <BookOpenIcon />
          <p>Catalogs</p>
          <Badge className="text-lg lg:text-xl text-primary" variant="outline">
            {catalogsData?.length ?? 0}/{appConfig.limitCatalogs}
          </Badge>
        </h1>
        <div className="flex items-center gap-3">
          <CreateCatalogDialog
            disabled={(catalogsData?.length ?? 0) >= appConfig.limitCatalogs}
            revalidateCatalogs={mutate}
          />
        </div>
      </div>
      {isCatalogError && <p>Error loading catalogs</p>}
      {isCatalogLoading ? (
        <Spinner className="size-8" />
      ) : (
        <section className="w-full">
          {/* TODO: Maybe add a skeleton? */}
          {catalogsData?.length ? (
            <GridContainer>
              {catalogsData.map((catalog) => {
                const [_, lastUpdated] = getTimeDifference(
                  catalog.updatedAt,
                  true,
                  false
                );
                return (
                  <CatalogCard
                    isPublic={catalog.isPublic}
                    type="catalog"
                    key={catalog.id}
                    onDelete={handleCatalogDelete}
                    id={catalog?.id}
                    title={catalog?.title}
                    description={catalog?.description}
                    lastUpdated={lastUpdated}
                  />
                );
              })}
            </GridContainer>
          ) : (
            <NoItemCard icon={BookOpenIcon} title="No catalogs added yet." />
          )}
        </section>
      )}
    </div>
  );
}
