import type { ZCatalogValid } from "~/entities/catalogs/models";

import fetchApi from "~/shared/lib/api/fetch";

import BackLink from "~/widgets/back-link";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";

export default async function Catalogs() {
  const catalogs = await fetchApi<ZCatalogValid[]>("/catalogs/valid");

  const sortedByPageviews = catalogs.data?.sort(
    (a, b) => (b.pageviews || 0) - (a.pageviews || 0)
  );

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <h1 className="text-lg lg:text-xl tracking-wide flex gap-2 items-center">
          <BackLink href="/explore" />
          <p>Catalogs</p>
        </h1>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {sortedByPageviews?.length ? (
            sortedByPageviews?.map((pageData) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/c/${pageData.id}`}
                    key={pageData.id}
                    validData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No catalogs found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}
