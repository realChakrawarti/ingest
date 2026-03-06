"use client";

import { useIsMobile } from "~/shared/hooks/use-mobile";
import { Button } from "~/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/shared/ui/dropdown-menu";
import { ThreeDotIcon } from "~/shared/ui/icons";
import { Sheet, SheetContent, SheetTrigger } from "~/shared/ui/sheet";

import AddToFavorites from "./add-to-fav";
import ShareCatalog from "./share-catalog";

type CatalogActionProps = {
  catalogId: string;
  catalogTitle: string;
  catalogDescription: string;
};

export function CatalogAction({
  catalogId,
  catalogTitle,
  catalogDescription,
}: CatalogActionProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <ThreeDotIcon className="size-5" />
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[50vh] min-h-20 rounded-t-2xl [&>button]:hidden p-3 pt-6"
        >
          <div className="flex flex-col gap-4">
            <Button variant="ghost" className="p-2 rounded-lg justify-start">
              <ShareCatalog
                catalogId={catalogId}
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
              />
            </Button>
            <Button variant="ghost" className="p-2 rounded-lg justify-start">
              <AddToFavorites
                catalogId={catalogId}
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
              />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ThreeDotIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="border-none flex flex-col gap-2 w-auto rounded-lg"
      >
        <DropdownMenuItem className="p-2 rounded-lg">
          <ShareCatalog
            catalogId={catalogId}
            catalogTitle={catalogTitle}
            catalogDescription={catalogDescription}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2 rounded-lg text-nowrap">
          <AddToFavorites
            catalogId={catalogId}
            catalogTitle={catalogTitle}
            catalogDescription={catalogDescription}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
