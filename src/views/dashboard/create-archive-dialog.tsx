import type { FormEvent } from "react";
import type { KeyedMutator } from "swr";

import { useConfetti } from "~/shared/hooks/use-confetti";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { PlusIcon } from "~/shared/ui/icons";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { useMetaValidate } from "~/widgets/use-meta-validate";

interface CreateArchiveDialogProps {
  disabled: boolean;
  revalidateArchives: KeyedMutator<ApiResponse<any>>;
}

// TODO: Consider using reducer to handle state updates, revalidate and show notification
export default function CreateArchiveDialog({
  revalidateArchives,
  disabled,
}: CreateArchiveDialogProps) {
  const { meta, metaError, handleOnChange, submitDisabled, resetState } =
    useMetaValidate({});

  const triggerConfetti = useConfetti();

  const createNewArchive = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetchApi("/archives", {
      method: "POST",
      body: JSON.stringify({
        title: meta.title,
        description: meta.description,
      }),
    });

    if (result.success) {
      revalidateArchives();
      toast({ title: result.message });
      resetState();
      triggerConfetti();
    } else {
      toast({ title: "Failed to create archive." });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <span className="flex items-center gap-2">
            <PlusIcon size={24} />
            Create Archive
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add archive</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => createNewArchive(e)}
        >
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

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={Boolean(submitDisabled)} type="submit">
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
