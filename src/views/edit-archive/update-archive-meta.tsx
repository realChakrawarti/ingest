import { Edit, Loader2 } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";

import type { ZArchiveByID } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { Switch } from "~/shared/ui/switch";
import { getTimeDifference } from "~/shared/utils/time-diff";

import { useMetaValidate } from "~/widgets/use-meta-validate";

interface UpdateArchiveMetaProps {
  revalidateArchive: KeyedMutator<ApiResponse<ZArchiveByID>>;
  archiveId: string;
  title: string;
  description: string;
  isPublic?: boolean;
  lastUpdatedAt: string | undefined;
}

export default function UpdateArchiveMeta({
  revalidateArchive,
  archiveId,
  title,
  description,
  isPublic = true,
  lastUpdatedAt,
}: UpdateArchiveMetaProps) {
  const { handleOnChange, meta, metaError, submitDisabled } = useMetaValidate({
    description,
    isPublic,
    title,
  });

  const [open, setOpen] = useState(false);

  const { isMutating: isSubmitting, trigger: updateArchiveMeta } =
    useSWRMutation(
      `/archives/${archiveId}/update`,
      (url) =>
        fetchApi(url, {
          body: JSON.stringify({
            description: meta.description,
            isPublic: meta.isPublic,
            title: meta.title,
          }),
          method: "PATCH",
        }),
      {
        async onError(err) {
          const error = await err.cause;
          toast(error.message);
        },
        onSuccess(result) {
          revalidateArchive();
          toast(result.message || "Catalog details updated successfully.");
          setOpen(false);
        },
      }
    );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateArchiveMeta();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Archive</DialogTitle>
          {lastUpdatedAt && (
            <DialogDescription>
              Last updated: {getTimeDifference(lastUpdatedAt)[1]}
            </DialogDescription>
          )}
        </DialogHeader>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={meta.title}
              name="title"
              onChange={handleOnChange}
            />
            {metaError.title ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {metaError.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={meta.description}
              name="description"
              onChange={handleOnChange}
            />
            {metaError.description ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {metaError.description}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between space-y-2 pt-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="visibility" className="text-sm font-medium">
                Public Archive
              </Label>
              <p className="text-xs text-muted-foreground">
                Make this archive visible to everyone
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="visibility"
                checked={meta.isPublic}
                onCheckedChange={(data) => {
                  const fakeEvent = {
                    target: {
                      name: "isPublic",
                      value: data,
                    },
                  } as unknown as ChangeEvent<HTMLInputElement>;

                  return handleOnChange(fakeEvent);
                }}
                className="data-[state=checked]:bg-[#A81434] data-[state=unchecked]:bg-input"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={Boolean(submitDisabled) || isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
