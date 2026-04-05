import type { ComponentChildren } from "preact"
import { Link } from "wouter"
import { ChevronRight } from "lucide-preact"

export interface Breadcrumb {
  label: string
  href?: string
}

interface HeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  action?: ComponentChildren
}

export function Header({ title, breadcrumbs, action }: HeaderProps) {
  return (
    <header class="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-3 sm:px-4 md:px-6">
      <div class="min-w-0">
        {/* Breadcrumbs (desktop only) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav class="mb-0.5 flex items-center gap-1 text-xs text-muted-fg max-md:hidden">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} class="flex items-center gap-1">
                {i > 0 && <ChevronRight class="h-3 w-3" />}
                {crumb.href ? (
                  <Link href={crumb.href} class="hover:text-primary hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span class="text-label">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 class="truncate text-lg font-semibold text-heading md:text-xl">{title}</h1>
      </div>
      {action && <div class="flex items-center gap-2">{action}</div>}
    </header>
  )
}
