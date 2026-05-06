import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { parseAsString, useQueryState } from "nuqs";

import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { cn } from "~/shared/utils/tailwind-merge";

interface BadgeScrollProps extends PropsWithChildren {
  queryParam: string;
  values: { id: string; label: string }[];
}

export default function BadgeScroll({ queryParam, values }: BadgeScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ behavior: "smooth", left: -200 });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ behavior: "smooth", left: 200 });
    }
  };

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftScroll(scrollLeft > 10);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons);

      // Initial check after content loads
      setTimeout(checkScrollButtons, 100);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, []);

  const [queryId, setQueryId] = useQueryState(
    queryParam,
    parseAsString
      .withDefault("")
      .withOptions({ history: "replace", shallow: false })
  );

  const handleSelectionChange = (key: string) => {
    if (!key) {
      return;
    }
    return setQueryId(key);
  };

  const handleOnClear = () => {
    setQueryId(null);
  };

  return (
    <div className="relative flex grow items-center overflow-hidden">
      {showLeftScroll && (
        <Button
          variant="ghost"
          size="icon"
          className="from-background absolute top-0 bottom-0 left-0 z-10 flex w-8 items-center rounded-lg bg-linear-to-r to-transparent backdrop-blur-xs"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}

      {showRightScroll && (
        <Button
          variant="ghost"
          size="icon"
          className="from-background absolute top-0 right-0 bottom-0 z-10 flex items-center rounded-lg bg-linear-to-r to-transparent backdrop-blur-xs"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        className={cn(
          "grid gap-3 grid-flow-col overflow-x-scroll scrollbar-hide"
        )}
      >
        <Badge
          onClick={handleOnClear}
          className="h-8 cursor-pointer p-0 px-3 text-sm font-normal tracking-normal text-nowrap select-none"
          variant={!queryId ? "default" : "outline"}
        >
          All
        </Badge>
        {values.map((value) => (
          <Badge
            key={value.id}
            variant={value.id === queryId ? "default" : "outline"}
            onClick={() => handleSelectionChange(value.id)}
            className="h-8 cursor-pointer p-0 px-3 text-sm font-normal tracking-normal text-nowrap select-none"
          >
            {value.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
