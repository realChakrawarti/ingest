import fetchApi from "~/shared/lib/api/fetch";
import { ValidMetadata } from "~/shared/types-schema/types";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";

export default async function Catalogs() {
  const catalogs = await fetchApi<ValidMetadata[]>("/catalogs/valid");

  const sortedByPageviews = catalogs.data?.sort(
    (a, b) => (b.pageviews || 0) - (a.pageviews || 0)
  );

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight flex gap-2 items-start">
        <p>Catalogs</p>
      </h1>
      <div className="w-full pt-7">
        <GridContainer>
          {sortedByPageviews?.length ? (
            sortedByPageviews?.map((pageData: any) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/c/${pageData.id}`}
                    key={pageData.id}
                    pageData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No catalogs found.</div>
          )}
        </GridContainer>
      </div>
    </div>
  );
}
