import type { ComponentChildren, FunctionComponent } from "preact"
import type { LucideProps } from "lucide-preact"

interface EmptyStateProps {
  icon: FunctionComponent<LucideProps>
  title: string
  description?: string
  action?: ComponentChildren
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon class="h-6 w-6 text-slate-400" />
      </div>
      <h3 class="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p class="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div class="mt-4">{action}</div>}
    </div>
  )
}
