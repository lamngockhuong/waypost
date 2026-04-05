import type { JSX } from "preact"

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Card({ class: cls = "", children, ...props }: CardProps) {
  return (
    <div
      class={`rounded-xl border border-border bg-surface p-4 shadow-sm ${cls}`}
      {...props}
    >
      {children}
    </div>
  )
}
