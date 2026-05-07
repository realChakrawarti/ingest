import { type ReactNode, useState } from "react";
import Link from "next/link";
import { Check, Clock, Copy, Globe, GlobeLock, Trash2 } from "lucide-react";

import { toast } from "sonner";

import appConfig from "~/shared/app-config";
import { Badge } from "~/shared/ui/badge";
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
import { cn } from "~/shared/utils/tailwind-merge";

import JustTip from "~/widgets/just-the-tip";

function CopyButton({ id, type }: { id: string; type: "catalog" | "archive" }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const exploreType = type === "catalog" ? "c" : "a";
    const exploreName = type === "catalog" ? "Catalog" : "Archive";
    navigator.clipboard
      .writeText(`${appConfig.url}/${exploreType}/${id}`)
      .then(() => {
        setCopied(true);
        toast(`${exploreName} link has been copied to your clipboard.`);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <JustTip label={`Copy ${type} link`}>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/5 text-primary/80 hover:text-primary relative h-8 w-8"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">{`Copy ${type} link`}</span>
      </Button>
    </JustTip>
  );
}

const cardContainerStyles = cn(
  "flex flex-col h-50",
  "overflow-hidden border-none",
  "hover:bg-primary/10 bg-primary/5 transition-colors"
);

const cardContentStyles = cn(
  "grow clickable outline-hidden ",
  "rounded-b-none"
);

type ItemCardProps = {
  type: "archive" | "catalog";
  id: string;
  title: string;
  description: string;
  lastUpdated: number | string;
  onDelete: (_id: string) => Promise<void>;
  isPublic?: boolean;
};

export default function ItemCard({
  type,
  id,
  title,
  description,
  lastUpdated,
  onDelete,
  isPublic = true,
}: ItemCardProps) {
  const editLink =
    type === "archive" ? `/archives/${id}/edit` : `/catalogs/${id}/edit`;

  return (
    <div className="group/card-item hover-lift shadow-primary/20 relative rounded-md shadow-sm">
      <Card className={cardContainerStyles}>
        <Link className={cardContentStyles} href={editLink} prefetch>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="flex items-start justify-between">
              <span className="group-hover/card-item:text-primary mr-2 line-clamp-2 grow text-lg font-normal tracking-wide">
                {title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grow overflow-hidden">
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {description}
            </p>
          </CardContent>
        </Link>
        <CardFooter
          className={cn(
            "justify-between items-center py-4 h-13",
            "border border-x-0 border-y-0 border-t-2 border-t-primary/30"
          )}
        >
          <div className="text-muted-foreground flex items-center text-xs">
            <Clock className="mr-1 h-3 w-3 shrink-0" />
            <span className="max-w-25 truncate">{lastUpdated}</span>
          </div>
          <div className="flex shrink-0 gap-1">
            <CopyButton id={id} type={type} />
            <DeleteModal handleDelete={() => onDelete(id)}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/5 text-primary/80 hover:text-primary h-8 w-8"
              >
                <Trash2 className="bg-primary/5 h-4 w-4" />
                <span className="sr-only">Delete catalog</span>
              </Button>
            </DeleteModal>
          </div>
        </CardFooter>
      </Card>
      <div className="absolute top-0 right-0 flex items-center justify-center">
        <Badge
          className="bg-primary/70 group-hover/card-item:bg-primary/90 flex items-center gap-1 text-[13px]"
          variant="default"
        >
          {isPublic ? (
            <>
              <Globe className="size-5" />
              <p>Public</p>
            </>
          ) : (
            <>
              <GlobeLock className="size-5" />
              <p>Private</p>
            </>
          )}
        </Badge>
      </div>
    </div>
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
          <DialogTitle className="flex items-center justify-center gap-2 md:justify-start">
            <WarningIcon className="text-primary h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            This action is irreversible. The catalog will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:justify-start">
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