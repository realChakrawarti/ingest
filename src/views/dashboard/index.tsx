"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import fetchApi from "~/shared/lib/api/fetch";
import { Button } from "~/shared/ui/button";
import { Separator } from "~/shared/ui/separator";
import { Skeleton } from "~/shared/ui/skeleton";

import Spinner from "~/widgets/spinner";

import ArchiveView from "./archive-view";
import CatalogView from "./catalog-view";

export default function Dashboard() {
  const { data, trigger, isMutating } = useSWRMutation("/session", (url) =>
    fetchApi(url, { cache: "no-store", method: "POST" })
  );

  const {
    data: userSyncID,
    isLoading,
    mutate,
  } = useSWR("/session/user", (url) => fetchApi(url, { cache: "no-store" }), {
    revalidateOnFocus: false,
  });

  const [copied, setCopied] = useState<boolean>(false);

  async function createSyncID() {
    await trigger();
    mutate();

    if (data?.success) {
      toast("Created SyncID successfuly.");
    }
  }

  function handleCopy(syncId: string) {
    navigator.clipboard.writeText(syncId).then(() => {
      setCopied(true);
      toast(`SyncID has been copied to your clipboard.`);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex first:pt-3 last:pb-3 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="px-3 text-2xl tracking-wide">Dashboard</h1>
        {isLoading && <Skeleton className="w-40 h-7 mx-3" />}
        {userSyncID && !isLoading && (
          <div className="mx-3 flex items-center gap-2">
            <p>
              <span className="text-primary">SyncID</span>:{" "}
              {userSyncID.data.syncId}
            </p>
            {copied ? (
              <Check className="text-green-600" size={16} />
            ) : (
              <Copy
                onClick={() => handleCopy(userSyncID.data.syncId)}
                className="cursor-pointer text-primary"
                size={16}
              />
            )}
          </div>
        )}
        {!userSyncID && !isLoading && (
          <Button onClick={createSyncID} className="mx-3" variant="outline">
            {isMutating ? (
              <span className="flex items-center gap-2">
                Creating SyncID
                <Spinner className="size-4" />
              </span>
            ) : (
              "Create SyncID"
            )}
          </Button>
        )}
      </div>
      <Separator />
      <CatalogView />
      <Separator />
      <ArchiveView />
    </div>
  );
}
