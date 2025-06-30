import type { ZArchiveValid } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";

import BackLink from "~/widgets/back-link";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";

export default async function Archives() {
  const archives = await fetchApi<ZArchiveValid[]>("/archives/valid");

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <div className="flex items-center gap-2">
          <BackLink href="/explore" />
          <h1 className="text-lg lg:text-xl font-semibold tracking-tight">
            Archives
          </h1>
        </div>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {archives?.data?.length ? (
            archives?.data?.map((pageData) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/a/${pageData.id}`}
                    key={pageData.id}
                    validData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No archives found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}
