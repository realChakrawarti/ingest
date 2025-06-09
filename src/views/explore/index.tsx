import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import fetchApi from "~/shared/lib/api/fetch";
import type { ValidMetadata } from "~/shared/types-schema/types";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
  PublicMarker,
} from "~/widgets/public-layout";

import LastWatched from "./last-watched";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function Explore() {
  const catalogs = await fetchApi<ValidMetadata[]>("/catalogs/valid");
  const archives = await fetchApi<Omit<ValidMetadata, "pageviews">[]>(
    "/archives/valid"
  );

  const catalogsData = catalogs?.data;
  const archivesData = archives?.data;

  const ENABLE_FEATURED = true;

  return (
    <PublicMainContainer className="space-y-4">
      {/* Last watched */}
      <LastWatched />
      {/* Featured Catalogs */}
      {catalogsData?.length && ENABLE_FEATURED ? (
        <section>
          <Title label="Featured catalogs" link="/explore/catalogs" />
          <PublicContentContainer>
            <GridContainer>
              {catalogsData.slice(0, 4).map((catalog) => (
                <DetailsCard
                  path={`/c/${catalog.id}`}
                  key={catalog.id}
                  pageData={catalog}
                />
              ))}
            </GridContainer>
          </PublicContentContainer>
        </section>
      ) : null}

      {/* Featured Archives */}
      {archivesData?.length && ENABLE_FEATURED ? (
        <section>
          <Title label="Featured archives" link="/explore/archives" />
          <PublicContentContainer>
            <GridContainer>
              {archivesData.slice(0, 4).map((archive) => (
                <DetailsCard
                  path={`/a/${archive.id}`}
                  key={archive.id}
                  pageData={archive}
                />
              ))}
            </GridContainer>
          </PublicContentContainer>
        </section>
      ) : null}
    </PublicMainContainer>
  );
}

function Title({ label, link }: { label: string; link?: string }) {
  return (
    <PublicHeaderTitle>
      <h1
        className="h-7 text-2xl font-semibold tracking-tight text-primary flex items-center gap-2"
        aria-label={label}
      >
        <PublicMarker />
        <div className="flex items-end gap-2">
          <p>{label}</p>
          {link ? (
            <Link className="cursor-pointer" href={link}>
              <ChevronRightIcon className="size-7 text-primary stroke-[3]" />
            </Link>
          ) : null}
        </div>
      </h1>
    </PublicHeaderTitle>
  );
}
