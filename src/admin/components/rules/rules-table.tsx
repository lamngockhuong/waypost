import { ArrowRight, Pencil, Trash2 } from "lucide-preact"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Toggle } from "../ui/toggle"
import { RuleCard } from "./rule-card"
import type { RedirectRule } from "../../lib/types"

interface RulesTableProps {
  rules: RedirectRule[]
  selectedIds: Set<string>
  onSelect: (id: string) => void
  onSelectAll: () => void
  onEdit: (rule: RedirectRule) => void
  onDelete: (rule: RedirectRule) => void
  onToggle: (rule: RedirectRule) => void
}

export function RulesTable({ rules, selectedIds, onSelect, onSelectAll, onEdit, onDelete, onToggle }: RulesTableProps) {
  const allSelected = rules.length > 0 && selectedIds.size === rules.length

  return (
    <>
      {/* Desktop table */}
      <div class="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  class="h-4 w-4 rounded border-border"
                />
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Target</TableHead>
              <TableHead class="w-24">Type</TableHead>
              <TableHead class="w-16">Code</TableHead>
              <TableHead class="w-16">Prio</TableHead>
              <TableHead class="w-20">Enabled</TableHead>
              <TableHead class="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} class={selectedIds.has(rule.id) ? "bg-primary/5" : ""}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(rule.id)}
                    onChange={() => onSelect(rule.id)}
                    class="h-4 w-4 rounded border-border"
                  />
                </TableCell>
                <TableCell class="font-mono text-xs max-w-[200px] truncate">{rule.source}</TableCell>
                <TableCell class="max-w-[200px]">
                  <span class="flex items-center gap-1 text-xs text-slate-500 truncate">
                    <ArrowRight class="h-3 w-3 shrink-0" />
                    <span class="truncate">{rule.target}</span>
                  </span>
                </TableCell>
                <TableCell><Badge variant="outline">{rule.type}</Badge></TableCell>
                <TableCell><Badge variant={rule.statusCode === 301 ? "warning" : "default"}>{rule.statusCode}</Badge></TableCell>
                <TableCell class="text-center">{rule.priority}</TableCell>
                <TableCell>
                  <Toggle checked={rule.enabled} onChange={() => onToggle(rule)} label={`Toggle ${rule.source}`} />
                </TableCell>
                <TableCell>
                  <div class="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(rule)} aria-label="Edit">
                      <Pencil class="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(rule)} aria-label="Delete">
                      <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div class="flex flex-col gap-3 md:hidden">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            selected={selectedIds.has(rule.id)}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </div>
    </>
  )
}
