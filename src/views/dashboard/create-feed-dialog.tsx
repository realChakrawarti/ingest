import type { KeyedMutator } from "swr";

import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { Loader2, PlusIcon } from "lucide-react";

import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

import type { ZFeedByUser } from "~/entities/feeds/models";

import { useConfetti } from "~/shared/hooks/use-confetti";
import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { Switch } from "~/shared/ui/switch";

import { useMetaValidate } from "~/widgets/use-meta-validate";

interface CreateFeedDialogProps {
  disabled: boolean;
  revalidateFeeds: KeyedMutator<ApiResponse<ZFeedByUser[]>>;
}

export default function CreateFeedDialog({
  revalidateFeeds,
  disabled,
}: CreateFeedDialogProps) {
  const triggerConfetti = useConfetti();

  const [open, setOpen] = useState(false);

  const { meta, metaError, handleOnChange, resetState, submitDisabled } =
    useMetaValidate({ isPublic: true });

  const { isMutating: isSubmitting, trigger: createNewFeed } = useSWRMutation(
    "/feeds",
    (url) =>
      fetchApi(url, {
        body: JSON.stringify({
          description: meta.description,
          isPublic: meta.isPublic,
          title: meta.title,
        }),
        method: "POST",
      }),
    {
      async onError(err) {
        const error = await err.cause;
        toast(error.message || "Failed to create feed.");
      },
      onSuccess(data) {
        revalidateFeeds();
        toast(data.message);
        resetState();
        setOpen(false);
        triggerConfetti();
      },
    }
  );

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    createNewFeed();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <span className="flex items-center gap-1">
            <PlusIcon size={24} />
            Feed
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add feed</DialogTitle>
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
                Public Feed
              </Label>
              <p className="text-muted-foreground text-xs">
                Make this feed visible to everyone
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
                className="data-[state=unchecked]:bg-input data-[state=checked]:bg-[#A81434]"
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
                  Creating…
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}