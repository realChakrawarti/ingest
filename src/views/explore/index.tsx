import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ZFeedValid } from "~/entities/feeds/models";
import type { ZPickValid } from "~/entities/picks/models";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";

import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
  PublicMarker,
} from "~/widgets/public-layout";

import ContinueWatching from "./continue-watching";

export default async function Explore() {
  const [feeds, picks] = await Promise.all([
    fetchApi<ZFeedValid[]>("/feeds/valid"),
    fetchApi<ZPickValid[]>("/picks/valid"),
  ]);

  const feedsData = feeds?.data;
  const picksData = picks?.data;

  return (
    <PublicMainContainer className="space-y-4">
      {/* Continue Watching */}
      <ContinueWatching />
      {/* Featured Feeds */}
      {feedsData?.length && appConfig.exploreFeatured ? (
        <section>
          <Title label="Featured Feeds" type="feeds" />
          <PublicContentContainer>
            <GridContainer>
              {feedsData.slice(0, 4).map((feed) => (
                <DetailsCard
                  path={`/c/${feed.id}`}
                  key={feed.id}
                  validData={feed}
                />
              ))}
            </GridContainer>
          </PublicContentContainer>
        </section>
      ) : null}

      {/* Featured Picks */}
      {picksData?.length && appConfig.exploreFeatured ? (
        <section>
          <Title label="Featured Picks" type="picks" />
          <PublicContentContainer>
            <GridContainer>
              {picksData.slice(0, 4).map((pick) => (
                <DetailsCard
                  path={`/p/${pick.id}`}
                  key={pick.id}
                  validData={pick}
                />
              ))}
            </GridContainer>
          </PublicContentContainer>
        </section>
      ) : null}
    </PublicMainContainer>
  );
}

function Title({ label, type }: { label: string; type?: string }) {
  return (
    <PublicHeaderTitle>
      <h2 className="flex items-end justify-between gap-2" aria-label={label}>
        <div className="flex h-7 gap-2 text-lg tracking-wide">
          <PublicMarker />
          <div>
            <p>{label}</p>
          </div>
        </div>
        {type ? (
          <Link
            className="hover:text-primary/80 flex cursor-pointer items-center gap-2"
            href={`/explore/${type}`}
          >
            <p className="text-sm">Explore {type}</p>
            <ArrowRight className="size-4 stroke-3" />
          </Link>
        ) : null}
      </h2>
    </PublicHeaderTitle>
  );
}