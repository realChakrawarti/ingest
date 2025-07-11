import { SiReddit } from "@icons-pack/react-simple-icons";
import { Check, Loader2, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import useSWR, { type KeyedMutator } from "swr";

import type { ZCatalogSubreddit } from "~/entities/catalogs/models";

import useDebounce from "~/shared/hooks/use-debounce";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { Checkbox } from "~/shared/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Separator } from "~/shared/ui/separator";
import formatLargeNumber from "~/shared/utils/format-large-number";
import Log from "~/shared/utils/terminal-logger";

import useCatalogStore from "./catalog-store";

async function getSubreddits(query: string) {
  const response = await fetch(
    `https://www.reddit.com/subreddits/search.json?q=${query}&limit=25&include_over_18=0`
  );
  const data = await response.json();
  const results = data.data.children.map((child: any) => child.data);
  return results;
}

function formatSubredditIcon(link: string) {
  if (!link) return "";
  return link.replace(/&amp;/g, "&");
}

export default function AddSubredditDialog({
  revalidateCatalog,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
}) {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 1000);
  const { selectedSubreddits, setSelectedSubreddits, resetTempData } =
    useCatalogStore();

  const { catalogId } = useParams<{ catalogId: string }>();

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleSubredditSelection = (subreddit: any) => {
    // Check if subreddit already added
    const subredditExists = selectedSubreddits.find(
      (item) => item.subredditId === subreddit.id
    );

    // Remove subreddit when already added
    if (subredditExists) {
      const filteredSubreddit = selectedSubreddits.filter(
        (item) => item.subredditId !== subreddit.id
      );
      setSelectedSubreddits(filteredSubreddit);
      // Add subreddit to the local subreddit
    } else {
      const subredditFormatted: ZCatalogSubreddit = {
        subredditDescription: subreddit.public_description,
        subredditIcon:
          formatSubredditIcon(subreddit.icon_img) ||
          formatSubredditIcon(subreddit.community_icon) ||
          "",
        subredditId: subreddit.id,
        subredditName: subreddit.display_name,
        subredditTitle: subreddit.title,
        subredditUrl: subreddit.url,
        type: "subreddit",
      };

      setSelectedSubreddits([...selectedSubreddits, subredditFormatted]);
    }
  };

  const { data, isLoading } = useSWR(
    debouncedSearch?.length > 2 ? `subreddits-${debouncedSearch}` : null,
    () => getSubreddits(searchInput)
  );

  function _onSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setSearchInput(input);
  }

  async function _handleAddSubreddit() {
    setIsLoadingUpdate(true);
    try {
      const result = await fetchApi(`/catalogs/${catalogId}/subreddit`, {
        body: JSON.stringify(selectedSubreddits),
        method: "PATCH",
      });

      if (result.success) {
        toast({ title: "Catalog has been updated with new subreddits." });
        revalidateCatalog();
        resetTempData();
      } else {
        toast({ title: "Something went wrong!" });
      }
      setIsDialogOpen(false);
    } catch (err) {
      Log.fail(err);
    } finally {
      setIsLoadingUpdate(true);
    }
  }

  function _handleDialogClose(open: boolean) {
    if (!open) {
      resetTempData();
    }
    setIsDialogOpen(open);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={_handleDialogClose}>
      <DialogTrigger asChild>
        <Button>
          <span className="flex items-center gap-1">
            <SiReddit className="size-8" />
            Subreddit
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col px-3 py-6">
        <DialogHeader className="px-3">
          <DialogTitle>Add Subreddit</DialogTitle>
        </DialogHeader>
        <div className="px-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 input-search-icon"
              type="search"
              id="subreddit-search"
              placeholder="Search subreddits..."
              value={searchInput}
              onChange={_onSearchInputChange}
              autoFocus
            />
          </div>

          {selectedSubreddits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSubreddits.map((subreddit) => {
                return (
                  <Badge
                    key={subreddit.subredditId}
                    variant="secondary"
                    className="gap-1 bg-primary/60 hover:bg-primary/40 font-normal"
                  >
                    r/{subreddit.subredditName}
                    <button
                      type="button"
                      onClick={() => toggleSubredditSelection(subreddit)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          <Separator />

          {searchInput ? (
            <SearchDropdown
              isLoading={isLoading}
              subreddits={data}
              toggleSubredditSelection={toggleSubredditSelection}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">Search for subreddits to get started</p>
              <p className="text-sm">
                Try searching for topics like "technology", "gaming", or "news"
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={_handleAddSubreddit}
              disabled={selectedSubreddits.length === 0 || isLoadingUpdate}
              className="flex-1"
            >
              <div className="flex items-center gap-2">
                {isLoadingUpdate ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <p>
                      Adding {selectedSubreddits.length} Subreddit
                      {selectedSubreddits.length !== 1 ? "s..." : "..."}
                    </p>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    <p>
                      Add {selectedSubreddits.length} Subreddit
                      {selectedSubreddits.length !== 1 ? "s" : ""}
                    </p>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchDropdown({
  isLoading,
  subreddits,
  toggleSubredditSelection,
}: {
  isLoading: boolean;
  subreddits: any;
  toggleSubredditSelection: (subreddit: any) => void;
}) {
  const { selectedSubreddits } = useCatalogStore();

  function subredditAlreadySelected(id: string) {
    return Boolean(selectedSubreddits.find((item) => item.subredditId === id));
  }

  return (
    <div className="mt-1 bg-card border border-border rounded-md max-h-96 overflow-y-auto z-50">
      {isLoading ? (
        <div className="p-4 text-center text-muted-foreground">
          Searching...
        </div>
      ) : subreddits?.length > 0 ? (
        subreddits.map((subreddit: any) => {
          return (
            <div
              key={subreddit.id}
              className="p-3 hover:bg-accent cursor-pointer flex items-start justify-between gap-2 transition-colors border-b border-border last:border-b-0"
              onClick={() => toggleSubredditSelection(subreddit)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={
                      formatSubredditIcon(subreddit.community_icon) ||
                      formatSubredditIcon(subreddit.icon_img)
                    }
                    alt={`r/${subreddit.display_name} icon`}
                  />
                  <AvatarFallback className="bg-primary/80 text-white text-sm">
                    r/
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-primary/80 dark:text-white text-sm">
                      r/{subreddit.display_name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs text-primary/80 dark:text-white"
                    >
                      {formatLargeNumber(subreddit.subscribers)} members
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {subreddit.public_description || subreddit.title}
                  </p>
                </div>
              </div>
              <Checkbox
                checked={subredditAlreadySelected(subreddit.id)}
                onChange={() => toggleSubredditSelection(subreddit)}
              />
            </div>
          );
        })
      ) : null}
    </div>
  );
}
