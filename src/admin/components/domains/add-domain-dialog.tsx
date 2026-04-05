import { useState } from "preact/hooks"
import { Dialog } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { api, getErrorMessage } from "../../lib/api"
import { toast } from "../ui/toast"

interface AddDomainDialogProps {
  open: boolean
  onClose: () => void
  onAdded: () => void
}

export function AddDomainDialog({ open, onClose, onAdded }: AddDomainDialogProps) {
  const [domain, setDomain] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const trimmed = domain.trim().toLowerCase()
    if (!trimmed) {
      setError("Domain is required")
      return
    }
    // Basic domain format validation
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i.test(trimmed)) {
      setError("Enter a valid domain (e.g. example.com)")
      return
    }

    setSaving(true)
    setError("")
    try {
      await api("/domains", {
        method: "POST",
        body: JSON.stringify({ domain: trimmed }),
      })
      toast(`${trimmed} added`, "success")
      setDomain("")
      onAdded()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add domain"))
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setDomain("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Add Domain">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="example.com"
          value={domain}
          onInput={(e) => {
            setDomain((e.target as HTMLInputElement).value)
            setError("")
          }}
          error={error}
          autofocus
        />
        <div class="mt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Add Domain
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
