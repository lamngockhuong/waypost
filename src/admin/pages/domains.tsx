import { useState, useEffect, useCallback } from "preact/hooks"
import { Globe, Plus, Search, AlertCircle } from "lucide-preact"
import { Header } from "../components/layout/header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Skeleton } from "../components/ui/skeleton"
import { EmptyState } from "../components/ui/empty-state"
import { Card } from "../components/ui/card"
import { Dialog } from "../components/ui/dialog"
import { toast } from "../components/ui/toast"
import { KpiRow } from "../components/domains/kpi-row"
import { DomainCard } from "../components/domains/domain-card"
import { AddDomainDialog } from "../components/domains/add-domain-dialog"
import { api, getErrorMessage } from "../lib/api"

interface DomainStats {
  rules: number
  clicks: number
}

interface AnalyticsRow {
  totalClicks: number
}

export function DomainsPage() {
  const [domains, setDomains] = useState<string[] | null>(null)
  const [stats, setStats] = useState<Map<string, DomainStats> | null>(null)
  const [query, setQuery] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loading = domains === null

  const fetchDomains = useCallback(async () => {
    try {
      setError(null)
      const list = await api<string[]>("/domains")
      setDomains(list)

      // Fetch stats for each domain in parallel
      const statsMap = new Map<string, DomainStats>()
      const now = new Date()
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

      await Promise.all(
        list.map(async (domain) => {
          try {
            const [rules, analytics] = await Promise.all([
              api<unknown[]>(`/rules/${encodeURIComponent(domain)}`),
              api<AnalyticsRow>(`/analytics/${encodeURIComponent(domain)}?from=${from}`),
            ])
            statsMap.set(domain, {
              rules: rules.length,
              clicks: analytics?.totalClicks ?? 0,
            })
          } catch {
            statsMap.set(domain, { rules: 0, clicks: 0 })
          }
        }),
      )
      setStats(statsMap)
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load domains"))
    }
  }, [])

  useEffect(() => { fetchDomains() }, [fetchDomains])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api(`/domains/${encodeURIComponent(deleteTarget)}`, { method: "DELETE" })
      toast(`${deleteTarget} deleted`, "success")
      setDeleteTarget(null)
      fetchDomains()
    } catch (err) {
      toast(getErrorMessage(err, "Failed to delete domain"), "error")
    } finally {
      setDeleting(false)
    }
  }

  const filtered = domains?.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <Header
        title="Domains"
        action={
          <Button onClick={() => setShowAdd(true)} size="sm">
            <Plus class="h-4 w-4" />
            <span class="max-sm:hidden">Add Domain</span>
          </Button>
        }
      />

      <div class="p-3 sm:p-4 md:p-6">
        {/* KPI cards */}
        <KpiRow domains={domains} stats={stats} loading={loading} />

        {/* Error state */}
        {error && (
          <div class="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" role="alert">
            <AlertCircle class="h-4 w-4 shrink-0" />
            <span>{error}</span>
            <Button variant="outline" size="sm" class="ml-auto" onClick={fetchDomains}>
              Retry
            </Button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <>
            <div class="mt-4">
              <Skeleton class="h-10 w-64" />
            </div>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} class="h-24 w-full rounded-xl" />
              ))}
            </div>
          </>
        )}

        {/* Loaded content */}
        {!loading && !error && (
          <>
            {/* Search bar */}
            {domains.length > 0 && (
              <div class="relative mt-4">
                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
                <Input
                  class="pl-10"
                  placeholder="Search domains..."
                  value={query}
                  onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                />
              </div>
            )}

            {/* Domain grid or empty state */}
            {domains.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="No domains yet"
                description="Add your first domain to start managing redirects."
                action={
                  <Button onClick={() => setShowAdd(true)}>
                    <Plus class="h-4 w-4" /> Add Domain
                  </Button>
                }
              />
            ) : filtered && filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title={`No matches for "${query}"`}
                description="Try a different search term."
              />
            ) : (
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered?.map((domain) => (
                  <DomainCard
                    key={domain}
                    domain={domain}
                    ruleCount={stats?.get(domain)?.rules ?? 0}
                    clickCount={stats?.get(domain)?.clicks ?? 0}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add domain dialog */}
      <AddDomainDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={fetchDomains}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Domain"
      >
        <p class="text-sm text-subtle">
          Are you sure you want to delete <strong class="font-mono">{deleteTarget}</strong>?
          This will remove all rules, config, and analytics for this domain.
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}
