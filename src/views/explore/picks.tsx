import type { ZPickValid } from "~/entities/picks/models";

import fetchApi from "~/shared/lib/api/fetch";

import BackLink from "~/widgets/back-link";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";

export default async function Picks() {
  const picks = await fetchApi<ZPickValid[]>("/picks/valid");

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <div className="flex items-center gap-2">
          <BackLink href="/" />
          <h1 className="text-lg tracking-wide lg:text-xl">Picks</h1>
        </div>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {picks?.data?.length ? (
            picks?.data?.map((pageData) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/p/${pageData.id}`}
                    key={pageData.id}
                    validData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No picks found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}