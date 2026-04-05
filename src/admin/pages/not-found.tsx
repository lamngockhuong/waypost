import { Link } from "wouter"
import { FileQuestion } from "lucide-preact"

export function NotFoundPage() {
  return (
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <FileQuestion class="mb-4 h-12 w-12 text-slate-300" />
      <h1 class="text-xl font-semibold text-slate-900">Page not found</h1>
      <p class="mt-1 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        class="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Back to Domains
      </Link>
    </div>
  )
}
