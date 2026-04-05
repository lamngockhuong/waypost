import { useState, useEffect } from "preact/hooks"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Toggle } from "../ui/toggle"
import type { RedirectRule, RedirectType, RuleFormData } from "../../lib/types"

interface RuleFormProps {
  rule?: RedirectRule | null
  onSubmit: (data: RuleFormData) => Promise<void>
  onCancel: () => void
}

const RULE_TYPES: { value: RedirectType; label: string }[] = [
  { value: "path", label: "Path" },
  { value: "wildcard", label: "Wildcard" },
  { value: "subdomain", label: "Subdomain" },
]

const STATUS_CODES: { value: 301 | 302; label: string }[] = [
  { value: 302, label: "302 (Temporary)" },
  { value: 301, label: "301 (Permanent)" },
]

export function RuleForm({ rule, onSubmit, onCancel }: RuleFormProps) {
  const [source, setSource] = useState(rule?.source ?? "")
  const [target, setTarget] = useState(rule?.target ?? "")
  const [type, setType] = useState<RedirectType>(rule?.type ?? "path")
  const [statusCode, setStatusCode] = useState<301 | 302>(rule?.statusCode ?? 302)
  const [preserveQuery, setPreserveQuery] = useState(rule?.preserveQuery ?? false)
  const [enabled, setEnabled] = useState(rule?.enabled ?? true)
  const [priority, setPriority] = useState(rule?.priority ?? 0)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when rule changes
  useEffect(() => {
    setSource(rule?.source ?? "")
    setTarget(rule?.target ?? "")
    setType(rule?.type ?? "path")
    setStatusCode(rule?.statusCode ?? 302)
    setPreserveQuery(rule?.preserveQuery ?? false)
    setEnabled(rule?.enabled ?? true)
    setPriority(rule?.priority ?? 0)
    setErrors({})
  }, [rule])

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!source.trim()) errs.source = "Source is required"
    if (!target.trim()) errs.target = "Target is required"
    else {
      try { new URL(target) } catch { errs.target = "Must be a valid URL" }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSubmit({ source, target, type, statusCode, preserveQuery, enabled, priority })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4">
      <Input
        label="Source Path"
        placeholder="/old-page"
        value={source}
        onInput={(e) => setSource((e.target as HTMLInputElement).value)}
        error={errors.source}
      />
      <Input
        label="Target URL"
        placeholder="https://example.com/new-page"
        value={target}
        onInput={(e) => setTarget((e.target as HTMLInputElement).value)}
        error={errors.target}
      />

      {/* Type selector */}
      <div class="space-y-1">
        <label class="block text-sm font-semibold text-label">Type</label>
        <select
          class="block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          value={type}
          onChange={(e) => setType((e.target as HTMLSelectElement).value as RedirectType)}
        >
          {RULE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Status code selector */}
      <div class="space-y-1">
        <label class="block text-sm font-semibold text-label">Status Code</label>
        <select
          class="block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          value={statusCode}
          onChange={(e) => setStatusCode(Number((e.target as HTMLSelectElement).value) as 301 | 302)}
        >
          {STATUS_CODES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <Input
        label="Priority"
        type="number"
        min={0}
        value={priority}
        onInput={(e) => setPriority(Number((e.target as HTMLInputElement).value))}
      />

      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-label">Preserve Query</span>
        <Toggle checked={preserveQuery} onChange={setPreserveQuery} label="Preserve query string" />
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-label">Enabled</span>
        <Toggle checked={enabled} onChange={setEnabled} label="Rule enabled" />
      </div>

      <div class="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={saving}>
          {rule ? "Update Rule" : "Add Rule"}
        </Button>
      </div>
    </form>
  )
}
