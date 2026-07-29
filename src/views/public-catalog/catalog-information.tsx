import { EyeIcon } from "lucide-react";

import { Separator } from "~/shared/ui/separator";

type CatalogInformationProps = {
  title: string;
  description: string;
  pageviews: number;
};

export default function CatalogInformation({
  title,
  description,
  pageviews,
}: CatalogInformationProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="flex items-center gap-2 text-lg tracking-wide lg:text-xl">
        <p>{title}</p>
        <Separator orientation="vertical" className="bg-primary/40 h-4 w-2" />
        <div className="text-muted-foreground flex items-end gap-2 text-sm">
          <div className="flex items-center gap-1">
            <EyeIcon className="size-4" />
            <span>{pageviews} views</span>
          </div>
        </div>
      </h1>
      <p className="text-md">{description}</p>
    </div>
  );
}