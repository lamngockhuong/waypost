import type { JSX } from "preact"

interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ class: cls = "", ...props }: SkeletonProps) {
  return (
    <div
      class={`animate-pulse rounded bg-slate-200 ${cls}`}
      aria-hidden="true"
      {...props}
    />
  )
}
