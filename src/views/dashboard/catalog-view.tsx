"use client";

import useSWR from "swr";

import appConfig from "~/shared/app-config";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { getTimeDifference } from "~/shared/lib/date-time/time-diff";
import { Badge } from "~/shared/ui/badge";
import { BookOpenIcon } from "~/shared/ui/icons";
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
  } = useSWR("/catalogs", (url) => fetchApi(url, { cache: "no-store" }));

  const handleCatalogDelete = async (catalogId: string) => {
    if (catalogId) {
      try {
        const result = await fetchApi(`/catalogs/${catalogId}/delete`, {
          method: "DELETE",
        });
        mutate();
        toast({ title: result.message });
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl flex items-center gap-3">
          <BookOpenIcon />
          <p>Catalogs</p>
          <Badge className="text-lg lg:text-xl text-primary" variant="outline">
            {catalogs?.data.length}/{appConfig.limitCatalogs}
          </Badge>
        </h1>
        <div className="flex items-center gap-3">
          <CreateCatalogDialog
            disabled={catalogs?.data.length >= appConfig.limitCatalogs}
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
          {catalogs?.data.length ? (
            <GridContainer>
              {catalogs?.data.map((catalog: any) => {
                const [_, lastUpdated] = getTimeDifference(
                  catalog?.videoData?.updatedAt,
                  true,
                  false
                );
                return (
                  <CatalogCard
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
