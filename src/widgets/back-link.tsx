import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "~/shared/utils/tailwind-merge";

export default function BackLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <div className={cn("clickable", className)}>
      <Link href={href} replace>
        <ArrowLeft className="size-full" />
      </Link>
    </div>
  );
}