"use client";
import { ClockIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

import fetchApi from "~/shared/lib/api/fetch";
import { getTimeDifference } from "~/shared/lib/date-time/time-diff";
import isDevelopment from "~/shared/lib/is-development";
import { Button } from "~/shared/ui/button";
import { RefreshIcon } from "~/shared/ui/icons";
import { Skeleton } from "~/shared/ui/skeleton";

import useNextUpdateStore from "./next-update-store";

export function ShowNextUpdateBanner() {
  const { showBanner, setShowBanner } = useNextUpdateStore();
  const [bodyElement, setBodyElement] = useState<
    Element | DocumentFragment | null
  >(null);

  useEffect(() => {
    if (typeof document !== undefined) {
      setBodyElement(document.body);
    }
  }, []);

  if (!showBanner || !bodyElement) return null;

  return createPortal(
    <div className="absolute inset-0 top-4 z-50 max-h-[75px] w-4/5 mx-auto">
      <div className="bg-primary px-3 py-2 flex items-center justify-between rounded-lg">
        <div className="flex text-sm items-center space-x-2 text-white justify-between">
          <span>A new version of the catalog is available.</span>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            className="h-7 p-1.5 bg-transparent text-white dark:border-white group/button"
            onClick={() => window?.location?.reload()}
          >
            <p className="hidden group-hover/button:block">Refresh</p>
            <RefreshIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 p-1.5 bg-transparent text-white dark:border-white group/button"
            onClick={() => setShowBanner(false)}
          >
            <p className="hidden group-hover/button:block">Close</p>
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>,
    bodyElement
  );
}

const POLLING_INTERVAL = 5 * 60_000; // 5 minutes
const SHOW_BANNER = 10_000; // 10 seconds

export default function NextUpdate({ catalogId }: any) {
  const { setShowBanner } = useNextUpdateStore();

  const {
    data: nextUpdate,
    error,
    isLoading,
  } = useSWR(
    catalogId && !isDevelopment() ? `/catalogs/${catalogId}/next-update` : null,
    (url) => fetchApi<string>(url),
    {
      refreshInterval: POLLING_INTERVAL,
    }
  );

  useEffect(() => {
    const updateTime = () => {
      let timeoutId = null;
      const [when, _] = getTimeDifference(nextUpdate?.data as string);
      if ((when as number) < 0) {
        timeoutId = setTimeout(() => {
          setShowBanner(true);
        }, SHOW_BANNER);
      }

      return timeoutId;
    };

    let clearTimeoutId = null;
    if (nextUpdate?.data) {
      clearTimeoutId = updateTime();
    }

    return () => {
      clearTimeoutId && clearTimeout(clearTimeoutId);
    };
  }, [nextUpdate?.data, setShowBanner]);

  const [when, timeDiff] = getTimeDifference(nextUpdate?.data as string);
  const showTimeUpdate = () => {
    if (isDevelopment()) {
      return "Disabled";
    }

    if (error) {
      return "Refresh page";
    }

    if ((when as number) < 0) {
      return "Updating the catalog...";
    } else {
      return timeDiff;
    }
  };
  return (
    <div className="hover:text-primary cursor-wait px-2">
      {isLoading ? (
        <Skeleton className="w-full h-9" />
      ) : (
        <span className="py-2 flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <p className="text-sm">{showTimeUpdate()}</p>
        </span>
      )}
    </div>
  );
}
