import { useState, useEffect } from "preact/hooks"
import { Input, Textarea } from "../ui/input"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { toast } from "../ui/toast"
import { api, getErrorMessage } from "../../lib/api"
import type { DomainConfig } from "../../lib/types"

interface SettingsFormProps {
  domain: string
}

export function SettingsForm({ domain }: SettingsFormProps) {
  const [defaultUrl, setDefaultUrl] = useState("")
  const [custom404Html, setCustom404Html] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api<DomainConfig>(`/config/${encodeURIComponent(domain)}`)
      .then((c) => {
        setDefaultUrl(c?.defaultUrl ?? "")
        setCustom404Html(c?.custom404Html ?? "")
      })
      .catch(() => toast("Failed to load settings", "error"))
      .finally(() => setLoading(false))
  }, [domain])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api(`/config/${encodeURIComponent(domain)}`, {
        method: "PUT",
        body: JSON.stringify({ defaultUrl: defaultUrl || undefined, custom404Html: custom404Html || undefined }),
      })
      toast("Settings saved", "success")
    } catch (err) {
      toast(getErrorMessage(err, "Failed to save settings"), "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div class="max-w-2xl space-y-4" aria-busy="true">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-10 w-32" />
      </div>
    )
  }

  return (
    <div class="max-w-2xl space-y-6">
      <div>
        <Input
          label="Default URL"
          placeholder="https://example.com"
          value={defaultUrl}
          onInput={(e) => setDefaultUrl((e.target as HTMLInputElement).value)}
        />
        <p class="mt-1 text-xs text-muted-fg">Redirect root path to this URL when no rule matches</p>
      </div>
      <div>
        <Textarea
          label="Custom 404 HTML"
          class="font-mono text-sm"
          rows={8}
          placeholder="<h1>Page not found</h1>"
          value={custom404Html}
          onInput={(e) => setCustom404Html((e.target as HTMLTextAreaElement).value)}
        />
        <p class="mt-1 text-xs text-muted-fg">Max 50KB. Shown when no rule matches and no default URL is set.</p>
      </div>
      <Button onClick={handleSave} loading={saving}>
        Save Settings
      </Button>
    </div>
  )
}
