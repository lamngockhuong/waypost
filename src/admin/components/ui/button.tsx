import type { JSX, ComponentChildren } from "preact"

type Variant = "primary" | "outline" | "danger" | "ghost"
type Size = "sm" | "md" | "lg"

interface ButtonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  class?: string
  type?: string
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>
  children?: ComponentChildren
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
  outline: "border border-border bg-transparent text-slate-700 hover:bg-slate-50",
  danger: "bg-destructive text-white hover:bg-red-700 shadow-sm",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  class: cls = "",
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type as JSX.IntrinsicElements["button"]["type"]}
      class={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${cls}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
