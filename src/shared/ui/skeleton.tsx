import { cn } from "~/shared/utils/tailwind-merge"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("motion-safe:animate-pulse motion-reduce:animate-none rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
