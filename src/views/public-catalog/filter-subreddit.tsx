"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";

import { Button } from "~/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import { cn } from "~/shared/utils/tailwind-merge";

export function FilterSubreddit({ subreddits }: { subreddits: string[] }) {
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = useQueryState(
    "subreddit",
    parseAsString.withDefault("")
  );

  if (subreddits.length < 2) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? `r/${subreddits.find((framework) => framework === value)}`
            : "All"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Subreddits..." className="h-9" />
          <CommandList>
            <CommandEmpty>No subreddits found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key={"all"}
                value={"all"}
                onSelect={() => {
                  setValue("");
                  setOpen(false);
                }}
              >
                All
              </CommandItem>
              {subreddits.map((subreddit) => (
                <CommandItem
                  key={subreddit}
                  value={subreddit}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  r/{subreddit}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === subreddit ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
