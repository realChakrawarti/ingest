import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/shared/ui/sheet";

import MarkdownHTML from "~/widgets/markdown-html";

export function ShowNotesSheet({
  title,
  description,
  sheetOpen,
  handleSheetOpen,
}: {
  title: string;
  description: string;
  sheetOpen: boolean;
  handleSheetOpen: (isOpen: boolean) => void;
}) {
  return (
    <Sheet open={sheetOpen} onOpenChange={handleSheetOpen}>
      <SheetContent className="w-full overflow-y-auto md:max-w-112.5">
        <SheetHeader className="mb-5 text-left">
          <SheetTitle className="text-pretty">{title}</SheetTitle>
        </SheetHeader>
        <div className="my-4">
          <MarkdownHTML content={description} />
        </div>
      </SheetContent>
    </Sheet>
  );
}