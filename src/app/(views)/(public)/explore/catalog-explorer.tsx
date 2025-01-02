"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Clock8 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "~/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { Tabs, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import DetailsCard from "~/components/shared/details-card";
import GridContainer from "~/components/shared/grid-container";
import {
  ArchiveIcon,
  BookOpenIcon,
  HeartListIcon,
  StarIcon,
} from "~/components/shared/icons";
import JustTip from "~/components/shared/just-the-tip";
import { db } from "~/utils/db";

import WatchLater from "./watch-later";

// TODO: A compact list for catalogs w/ toggle button
export function CatalogExplorer({ validCatalogs, validArchives }: any) {
  const favoriteCatalogs = useLiveQuery(() => db["favorites"].toArray(), []) ?? [];

  const [activeTab, setActiveTab] = useState<string>("catalog");

  function renderCurrentTab(activeTab: string) {
    if (activeTab === "catalog") {
      return <Catalogs catalogs={validCatalogs} />;
    } else if (activeTab === "archive") {
      return <Archives archives={validArchives} />;
    } else {
      return <WatchLater />;
    }
  }

  return (
    <div className="w-full pt-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger className="text-xs sm:text-sm" value="catalog">
                <div className="flex gap-2 items-center">
                  <BookOpenIcon className="size-4" />
                  Catalogs
                </div>
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="archive">
                <div className="flex gap-2 items-center">
                  <ArchiveIcon className="size-4" />
                  Archives
                </div>
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="watch-later">
                <div className="flex gap-2 items-center">
                  <Clock8 className="size-4" />
                  Watch Later
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Sheet>
            <JustTip label="Favorite Catalogs">
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <HeartListIcon size={32} />
                </Button>
              </SheetTrigger>
            </JustTip>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5" />
                  Favorite Catalogs
                </SheetTitle>
                <SheetDescription>
                  Your collection of favorite catalogs
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="grid gap-4">
                  <div className="grid gap-4"></div>
                  {favoriteCatalogs.map((favCatalog: any) => {
                    return (
                      <Link
                        className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
                        href={`/c/${favCatalog.id}`}
                        key={favCatalog.id}
                      >
                        <section>
                          <h3 className="font-semibold">{favCatalog.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {favCatalog.description}
                          </p>
                        </section>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div>{renderCurrentTab(activeTab)}</div>
    </div>
  );
}

function Archives({ archives }: any) {
  return (
    <GridContainer>
      {archives?.data?.length ? (
        archives?.data?.map((pageData: any) => {
          if (pageData?.id) {
            return (
              <DetailsCard
                path={`a/${pageData.id}`}
                key={pageData.id}
                pageData={pageData}
              />
            );
          }
        })
      ) : (
        <div>No archives found.</div>
      )}
    </GridContainer>
  );
}

function Catalogs({ catalogs }: any) {
  return (
    <GridContainer>
      {catalogs?.data?.length ? (
        catalogs?.data?.map((pageData: any) => {
          if (pageData?.id) {
            return (
              <DetailsCard
                path={`c/${pageData.id}`}
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
  );
}
