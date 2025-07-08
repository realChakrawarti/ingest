import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { ZArchiveValid } from "~/entities/archives/models";
import type { ZCatalogValid } from "~/entities/catalogs/models";

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

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function Explore() {
  const catalogs = await fetchApi<ZCatalogValid[]>("/catalogs/valid");
  const archives = await fetchApi<ZArchiveValid[]>("/archives/valid");

  const catalogsData = catalogs?.data;
  const archivesData = archives?.data;

  const ENABLE_FEATURED = true;

  return (
    <PublicMainContainer className="space-y-4">
      {/* Continue Watching */}
      <ContinueWatching />
      {/* Featured Catalogs */}
      {catalogsData?.length && ENABLE_FEATURED ? (
        <section>
          <Title label="Featured Catalogs" type="catalogs" />
          <PublicContentContainer>
            <GridContainer>
              {catalogsData.slice(0, 4).map((catalog) => (
                <DetailsCard
                  path={`/c/${catalog.id}`}
                  key={catalog.id}
                  validData={catalog}
                />
              ))}
            </GridContainer>
          </PublicContentContainer>
        </section>
      ) : null}

      {/* Featured Archives */}
      {archivesData?.length && ENABLE_FEATURED ? (
        <section>
          <Title label="Featured Archives" type="archives" />
          <PublicContentContainer>
            <GridContainer>
              {archivesData.slice(0, 4).map((archive) => (
                <DetailsCard
                  path={`/a/${archive.id}`}
                  key={archive.id}
                  validData={archive}
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
      <h2 className=" flex items-end gap-2 justify-between" aria-label={label}>
        <div className="h-7 text-lg md:text-2xl tracking-wide flex gap-2">
          <PublicMarker />
          <div>
            <p>{label}</p>
          </div>
        </div>
        {type ? (
          <Link
            className="cursor-pointer hover:text-primary/80 flex gap-2 items-center"
            href={`/explore/${type}`}
          >
            <p className="text-sm">Explore {type}</p>
            <ArrowRight className="size-4 stroke-[3]" />
          </Link>
        ) : null}
      </h2>
    </PublicHeaderTitle>
  );
}
