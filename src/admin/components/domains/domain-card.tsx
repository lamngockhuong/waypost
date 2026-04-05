import { Link } from "wouter"
import { Trash2 } from "lucide-preact"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

interface DomainCardProps {
  domain: string
  ruleCount: number
  clickCount: number
  onDelete: (domain: string) => void
}

export function DomainCard({ domain, ruleCount, clickCount, onDelete }: DomainCardProps) {
  return (
    <Card class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <Link
          href={`/domains/${encodeURIComponent(domain)}`}
          class="truncate text-lg font-mono font-semibold text-primary hover:underline"
        >
          {domain}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(domain)}
          aria-label={`Delete ${domain}`}
        >
          <Trash2 class="h-4 w-4 text-slate-400" />
        </Button>
      </div>
      <div class="flex gap-4 text-sm text-slate-500">
        <span>{ruleCount} {ruleCount === 1 ? "rule" : "rules"}</span>
        <span>{clickCount} {clickCount === 1 ? "click" : "clicks"}</span>
      </div>
    </Card>
  )
}
