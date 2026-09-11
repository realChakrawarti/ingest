import type { ZFeedValid } from "~/entities/feeds/models";

import fetchApi from "~/shared/lib/api/fetch";

import BackLink from "~/widgets/back-link";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";

export default async function Feeds() {
  const feeds = await fetchApi<ZFeedValid[]>("/feeds/valid");

  const sortedByPageviews = feeds?.data?.sort(
    (a, b) => (b.pageviews || 0) - (a.pageviews || 0)
  );

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <h1 className="flex items-center gap-2 text-lg tracking-wide lg:text-xl">
          <BackLink href="/" />
          <p>Feeds</p>
        </h1>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {sortedByPageviews?.length ? (
            sortedByPageviews?.map((pageData) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/f/${pageData.id}`}
                    key={pageData.id}
                    validData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No feeds found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}