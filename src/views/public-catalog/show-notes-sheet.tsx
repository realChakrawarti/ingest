import { ExternalLink } from "lucide-react";

import { Badge } from "~/shared/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/shared/ui/sheet";

import MarkdownHTML from "~/widgets/markdown-html";
import { OutLink } from "~/widgets/out-link";

export function ShowNotesSheet({
  title,
  description,
  sheetOpen,
  handleSheetOpen,
  link,
}: {
  title: string;
  description: string;
  link: string;
  sheetOpen: boolean;
  handleSheetOpen: (isOpen: boolean) => void;
}) {
  return (
    <Sheet open={sheetOpen} onOpenChange={handleSheetOpen}>
      <SheetContent className="w-full overflow-y-auto md:max-w-112.5">
        <SheetHeader className="mb-5 flex flex-col text-left">
          {link ? (
            <OutLink href={link}>
              <Badge className="mb-2 cursor-pointer space-x-2">
                <ExternalLink className="size-4" />
                <p className="text-md">Open on Link</p>
              </Badge>
            </OutLink>
          ) : null}
          <SheetTitle className="text-pretty">{title}</SheetTitle>
        </SheetHeader>
        <div className="my-4">
          <MarkdownHTML content={description} />
        </div>
      </SheetContent>
    </Sheet>
  );
}