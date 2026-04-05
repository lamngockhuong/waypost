import type { JSX } from "preact"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline"

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  outline: "border border-border text-subtle",
}

export function Badge({ variant = "default", class: cls = "", children, ...props }: BadgeProps) {
  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${cls}`}
      {...props}
    >
      {children}
    </span>
  )
}
