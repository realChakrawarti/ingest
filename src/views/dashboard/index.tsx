"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import fetchApi from "~/shared/lib/api/fetch";
import { Button } from "~/shared/ui/button";
import { ThreeDotIcon } from "~/shared/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import { Separator } from "~/shared/ui/separator";
import { Skeleton } from "~/shared/ui/skeleton";

import { DeleteModal } from "~/widgets/delete-modal";
import Spinner from "~/widgets/spinner";

import ArchiveView from "./archive-view";
import CatalogView from "./catalog-view";

export default function Dashboard() {
  const {
    data,
    trigger: generateSyncId,
    isMutating: isGenerating,
  } = useSWRMutation("/users/sync", (url) => fetchApi(url, { method: "POST" }));

  const {
    data: userSyncID,
    isLoading,
    mutate: revalidateSyncId,
  } = useSWR("/users/sync", (url) => fetchApi(url), {
    errorRetryCount: 0,
    revalidateOnFocus: false,
  });

  const { isMutating: isDeleting, trigger: deleteSyncId } = useSWRMutation(
    "/users/sync",
    (url, { arg }: { arg: { syncId: string } }) =>
      fetchApi(url, {
        body: JSON.stringify({ syncId: arg.syncId }),
        method: "DELETE",
      })
  );

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { setLocalUserSettingsField } = useLocalUserSettings(null);

  useEffect(() => {
    if (userSyncID?.data.syncId) {
      setLocalUserSettingsField("syncId", userSyncID.data.syncId);
    }
  }, [userSyncID, setLocalUserSettingsField]);

  async function createSyncID() {
    await generateSyncId();
    revalidateSyncId();

    if (data?.success) {
      toast("Created SyncID successfully.");
    }
  }

  async function handleDelete(syncId: string) {
    await deleteSyncId(
      { syncId },
      {
        optimisticData: { data: { syncId: "" } },
      }
    );
    setLocalUserSettingsField("syncId", "");
    setDialogOpen(false);
    toast("SyncID associated with the account has been deleted.");
  }

  const handleDeleteClick = () => {
    setDropdownOpen(false); // Close popover first
    setDialogOpen(true); // Then open dialog
  };

  return (
    <div className="flex first:pt-3 last:pb-3 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="px-3 text-2xl tracking-wide">Dashboard</h1>
        {isLoading && <Skeleton className="w-40 h-7 mx-3" />}
        {userSyncID?.data.syncId && !isLoading && (
          <div className="mx-3 flex items-center gap-2 relative">
            <p>
              <span className="text-foreground-muted">
                {userSyncID.data.syncId}
              </span>
            </p>
            <div className="relative">
              <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-6">
                    <ThreeDotIcon className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="end"
                  className="w-[200px] border-none rounded-lg p-1"
                >
                  <Button
                    variant="ghost"
                    onClick={handleDeleteClick}
                    className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-sm cursor-pointer w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-red-700 hover:text-red-500" />
                    Delete SyncID
                  </Button>
                </PopoverContent>
              </Popover>
            </div>

            <DeleteModal
              isDeleting={isDeleting}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              label={
                <>
                  This action cannot be undone. This will permanently delete
                  Sync ID{" "}
                  <span className="text-primary">{userSyncID.data.syncId}</span>{" "}
                  from your account?
                </>
              }
              onDelete={() => handleDelete(userSyncID.data.syncId)}
            />
          </div>
        )}
        {!userSyncID?.data.syncId && !isLoading && (
          <Button onClick={createSyncID} className="mx-3" variant="outline">
            {isGenerating ? (
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
