import { Edit } from "lucide-react";
import type { FormEvent } from "react";
import type { KeyedMutator } from "swr";

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
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";

import { useMetaValidate } from "~/widgets/use-meta-validate";

interface UpdateArchiveMetaProps {
  revalidateArchive: KeyedMutator<ApiResponse>;
  archiveId: string;
  title: string;
  description: string;
}

export default function UpdateArchiveMeta({
  revalidateArchive,
  archiveId,
  title,
  description,
}: UpdateArchiveMetaProps) {
  const { handleOnChange, meta, metaError, submitDisabled } = useMetaValidate({
    description,
    title,
  });

  async function updateArchiveMeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await fetchApi(`/archives/${archiveId}/update`, {
      body: JSON.stringify({
        description: meta.description,
        title: meta.title,
      }),
      method: "PATCH",
    });

    if (!result.success) {
      toast({ title: result.message });
    } else {
      revalidateArchive();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Archive</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-2" onSubmit={updateArchiveMeta}>
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
                Update
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
