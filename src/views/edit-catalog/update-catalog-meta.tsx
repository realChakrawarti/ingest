import { Edit, Loader2 } from "lucide-react";
import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { toast } from "sonner";
import type { KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";

import type { ZCatalogByID } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
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
import { getTimeDifference, timeDelta } from "~/shared/utils/time-diff";

import { useMetaValidate } from "~/widgets/use-meta-validate";

interface UpdateCatalogMetaProps {
  revalidateCatalog: KeyedMutator<ApiResponse<ZCatalogByID>>;
  catalogId: string;
  title: string;
  description: string;
  isPublic: boolean;
  lastUpdatedAt: string | undefined;
}

export default function UpdateCatalogMeta({
  revalidateCatalog,
  catalogId,
  title,
  description,
  isPublic,
  lastUpdatedAt,
}: UpdateCatalogMetaProps) {
  const { meta, metaError, handleOnChange, submitDisabled } = useMetaValidate({
    description,
    isPublic,
    title,
  });

  const [open, setOpen] = useState(false);

  const { isMutating: isSubmitting, trigger: updateCatalogMeta } =
    useSWRMutation(
      `/catalogs/${catalogId}/update`,
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
        onSuccess(data) {
          revalidateCatalog();
          toast(data.message || "Catalog details updated successfully.");
          setOpen(false);
        },
      }
    );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    updateCatalogMeta();
  };

  const buttonDisabled =
    Boolean(submitDisabled) ||
    isSubmitting ||
    // Check if metadata has been updated recently
    (lastUpdatedAt
      ? timeDelta(lastUpdatedAt) <= appConfig.metadataUpdateCooldown
      : false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Catalog</DialogTitle>
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
                Public Catalog
              </Label>
              <p className="text-xs text-muted-foreground">
                Make this catalog visible to everyone
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
                disabled={Boolean(isSubmitting)}
                className="data-[state=checked]:bg-[#A81434] data-[state=unchecked]:bg-input"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button disabled={buttonDisabled} type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update"
              )}
            </Button>
            <p className="text-xs text-primary/60">
              You could only update once every 4 hours
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
