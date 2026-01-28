import { ArrowLeftSquare } from "lucide-react";
import Link from "next/link";

import { cn } from "~/shared/utils/tailwind-merge";

export default function BackLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <div className={cn("cursor-pointer", className)}>
      <Link href={href} replace>
        <ArrowLeftSquare className="size-full" />
      </Link>
    </div>
  );
}
