import { ArrowRight, Pencil, Trash2 } from "lucide-preact"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Toggle } from "../ui/toggle"
import type { RedirectRule } from "../../lib/types"

interface RuleCardProps {
  rule: RedirectRule
  selected: boolean
  onSelect: (id: string) => void
  onEdit: (rule: RedirectRule) => void
  onDelete: (rule: RedirectRule) => void
  onToggle: (rule: RedirectRule) => void
}

export function RuleCard({ rule, selected, onSelect, onEdit, onDelete, onToggle }: RuleCardProps) {
  return (
    <Card class={`flex flex-col gap-2 ${selected ? "ring-2 ring-primary" : ""}`}>
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(rule.id)}
            class="h-4 w-4 rounded border-border"
          />
          <div class="min-w-0">
            <p class="truncate font-mono text-sm font-semibold">{rule.source}</p>
            <div class="flex items-center gap-1 text-xs text-muted-fg">
              <ArrowRight class="h-3 w-3 shrink-0" />
              <span class="truncate">{rule.target}</span>
            </div>
          </div>
        </div>
        <Toggle
          checked={rule.enabled}
          onChange={() => onToggle(rule)}
          label={`Toggle ${rule.source}`}
        />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex gap-1.5">
          <Badge variant="outline">{rule.type}</Badge>
          <Badge variant={rule.statusCode === 301 ? "warning" : "default"}>{rule.statusCode}</Badge>
          {rule.priority > 0 && <Badge variant="success">P{rule.priority}</Badge>}
        </div>
        <div class="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(rule)} aria-label="Edit rule">
            <Pencil class="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(rule)} aria-label="Delete rule">
            <Trash2 class="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
