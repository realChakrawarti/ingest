"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";

import { Badge } from "~/components/shadcn/badge";
import GridContainer from "~/components/shared/grid-container";
import { BookOpenIcon } from "~/components/shared/icons";
import CatalogCard from "~/components/shared/item-card";
import NoItemCard from "~/components/shared/no-item-card";
import Spinner from "~/components/shared/spinner";
import { toast } from "~/hooks/use-toast";
import { getTimeDifference } from "~/utils/client-helper";
import fetchApi from "~/utils/fetch";

import CreateCatalogDialog from "./create-catalog-dialog";

const LIMIT_CATALOGS = 5;

export default function CatalogView() {
  const router = useRouter();

  const {
    data: catalogs,
    isLoading: isCatalogLoading,
    error: isCatalogError,
    mutate,
  } = useSWR("/catalogs", (url) => fetchApi(url, { cache: "no-store" }));

  // TODO: Normal navigation with pre-fetch catalog meta data on Link?
  const handleCatalogEdit = (catalogId: string) => {
    router.push(`/catalogs/${catalogId}/edit`);
  };

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
            {catalogs?.data.length}/{LIMIT_CATALOGS}
          </Badge>
        </h1>
        <div className="flex items-center gap-3">
          <CreateCatalogDialog
            disabled={catalogs?.data.length >= LIMIT_CATALOGS}
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
                    onEdit={handleCatalogEdit}
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
