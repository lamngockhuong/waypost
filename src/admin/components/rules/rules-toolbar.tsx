import { Search, Plus, Download, Upload, Trash2 } from "lucide-preact"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface RulesToolbarProps {
  query: string
  onQueryChange: (q: string) => void
  selectedCount: number
  onAdd: () => void
  onBulkDelete: () => void
  onBulkToggle: () => void
  onImport: () => void
  onExport: () => void
}

export function RulesToolbar({
  query,
  onQueryChange,
  selectedCount,
  onAdd,
  onBulkDelete,
  onBulkToggle,
  onImport,
  onExport,
}: RulesToolbarProps) {
  return (
    <div class="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
        <Input
          class="pl-10"
          placeholder="Search rules..."
          value={query}
          onInput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Bulk actions (visible when items selected) */}
      {selectedCount > 0 && (
        <div class="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-subtle">
          <span>{selectedCount} selected</span>
          <Button variant="ghost" size="sm" onClick={onBulkToggle}>Toggle</Button>
          <Button variant="ghost" size="sm" onClick={onBulkDelete}>
            <Trash2 class="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      )}

      {/* Actions */}
      <div class="flex gap-1.5">
        <Button variant="outline" size="sm" onClick={onImport} aria-label="Import rules">
          <Upload class="h-4 w-4" />
          <span class="max-sm:hidden">Import</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} aria-label="Export rules">
          <Download class="h-4 w-4" />
          <span class="max-sm:hidden">Export</span>
        </Button>
        <Button size="sm" onClick={onAdd}>
          <Plus class="h-4 w-4" />
          <span class="max-sm:hidden">Add Rule</span>
        </Button>
      </div>
    </div>
  )
}
