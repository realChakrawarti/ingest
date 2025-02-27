import { Check, Clock, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

import { toast } from "~/shared/hooks/use-toast";
import { cn } from "~/shared/lib/tailwind-merge";
import { Button } from "~/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/shared/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { WarningIcon } from "~/shared/ui/icons";
import JustTip from "~/widgets/just-the-tip";

function CopyButton({ id, type }: any) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const exploreType = type === "catalog" ? "c" : "a";
    navigator.clipboard
      .writeText(`https://ytcatalog.707x.in/${exploreType}/${id}`)
      .then(() => {
        setCopied(true);
        toast({ title: "Catalog link has been copied to your clipboard." });
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <JustTip label={`Copy ${type} link`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 relative group"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="sr-only">{`Copy ${type} link`}</span>
      </Button>
    </JustTip>
  );
}

const cardContainerStyles = cn(
  "flex flex-col h-[200px]",
  "rounded-md group overflow-hidden"
);

const cardContentStyles = cn(
  "flex-grow outline-none ",
  "hover:-outline-offset-1 hover:outline-primary hover:outline-8",
  "focus:-outline-offset-1 focus:outline-primary focus:outline-8"
);

type ItemCardProps = {
  type: "archive" | "catalog";
  id: string;
  title: string;
  description: string;
  lastUpdated: number | string;
  onDelete: (_id: string) => Promise<void>;
};

export default function ItemCard({
  type,
  id,
  title,
  description,
  lastUpdated,
  onDelete,
}: ItemCardProps) {
  const editLink =
    type === "archive" ? `/archives/${id}/edit` : `/catalogs/${id}/edit`;

  return (
    <Card className={cardContainerStyles}>
      <Link className={cardContentStyles} href={editLink} prefetch>
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="flex items-start justify-between">
            <span className="text-lg line-clamp-2 flex-grow mr-2">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="justify-between items-center py-4 border-t h-[52px]">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate max-w-[100px]">{lastUpdated}</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <CopyButton id={id} type={type} />
          <DeleteModal handleDelete={() => onDelete(id)}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary/80 hover:text-primary"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete catalog</span>
            </Button>
          </DeleteModal>
        </div>
      </CardFooter>
    </Card>
  );
}

type DeleteModalProps = {
  handleDelete: () => void;
  children: ReactNode;
};

function DeleteModal({ children, handleDelete }: DeleteModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center md:justify-start">
            <WarningIcon className="h-5 w-5 text-primary" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            This action is irreversible. The catalog will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-3">
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
