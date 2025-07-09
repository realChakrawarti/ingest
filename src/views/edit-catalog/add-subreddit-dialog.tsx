import { SiReddit } from "@icons-pack/react-simple-icons";
import { Search } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";

import useDebounce from "~/shared/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";

async function getSubreddits(query: string) {
  const response = await fetch(
    `https://www.reddit.com/subreddits/search.json?q=${query}&limit=25&include_over_18=0`
  );
  const data = await response.json();
  const results = data.data.children.map((child: any) => child.data);
  return results;
}

export default function AddSubredditDialog() {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 1000);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { data, isLoading } = useSWR(
    debouncedSearch?.length > 2 ? `subreddits-${debouncedSearch}` : null,
    () => getSubreddits(searchInput)
  );

  function _onSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setSearchInput(input);
  }

  useEffect(() => {
    if (!searchInput) setShowDropdown(false);
  }, [searchInput]);

  return (
    <Dialog>
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
        <div className="px-3">
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
          {searchInput ? (
            <SearchDropdown isLoading={isLoading} subreddits={data} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">Search for subreddits to get started</p>
              <p className="text-sm">
                Try searching for topics like "technology", "gaming", or "news"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchDropdown({ isLoading, subreddits }: any) {
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
              key={subreddit.display_name}
              className="p-3 hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-b-0"
              // onClick={() => onSubredditClick(subreddit.display_name)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={
                      subreddit.community_icon.replace(/&amp;/g, "&") ||
                      subreddit.icon_img.replace(/&amp;/g, "&")
                    }
                    alt={`r/${subreddit.display_name} icon`}
                  />
                  <AvatarFallback className="bg-primary/80 text-white text-sm">
                    r/
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-primary/80 dark:text-white text-sm">
                      r/{subreddit.display_name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs text-primary/80 dark:text-white"
                    >
                      {subreddit.subscribers?.toLocaleString()} members
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {subreddit.public_description || subreddit.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : null}
    </div>
  );
}
