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
    <header class="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:px-6">
      <div>
        {/* Breadcrumbs (desktop only) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav class="mb-0.5 flex items-center gap-1 text-xs text-slate-500 max-md:hidden">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} class="flex items-center gap-1">
                {i > 0 && <ChevronRight class="h-3 w-3" />}
                {crumb.href ? (
                  <Link href={crumb.href} class="hover:text-primary hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span class="text-slate-700">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 class="text-lg font-semibold text-slate-900 md:text-xl">{title}</h1>
      </div>
      {action && <div class="flex items-center gap-2">{action}</div>}
    </header>
  )
}
