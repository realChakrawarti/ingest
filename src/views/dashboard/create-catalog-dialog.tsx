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

interface CreateCatalogDialogProps {
  disabled: boolean;
  revalidateCatalogs: KeyedMutator<ApiResponse<any>>;
}

export default function CreateCatalogDialog({
  revalidateCatalogs,
  disabled,
}: CreateCatalogDialogProps) {
  const triggerConfetti = useConfetti();

  const { meta, metaError, handleOnChange, resetState, submitDisabled } =
    useMetaValidate({});

  const createNewCatalog = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetchApi("/catalogs", {
      body: JSON.stringify({
        description: meta.description,
        title: meta.title,
      }),
      method: "POST",
    });

    if (result.success) {
      revalidateCatalogs();
      toast({ title: result.message });
      resetState();
      triggerConfetti();
    } else {
      toast({ title: "Failed to create catalog." });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <span className="flex items-center gap-1">
            <PlusIcon size={24} />
            Catalog
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add catalog</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => createNewCatalog(e)}
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
