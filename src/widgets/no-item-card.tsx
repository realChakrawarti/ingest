import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "~/shared/ui/card";

type NoItemCardProps = {
  icon: LucideIcon;
  title: string;
  subTitle?: string | undefined;
};
export default function NoItemCard({
  icon: Icon,
  title,
  subTitle,
}: NoItemCardProps) {
  return (
    <Card className="flex h-50 justify-center rounded-md border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Icon className="text-muted-foreground mb-4 h-12 w-12" />
        <p className="text-muted-foreground mb-2">{title}</p>
        {subTitle ? (
          <p className="text-muted-foreground text-sm">{subTitle}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}