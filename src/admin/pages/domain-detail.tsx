import { useState, useEffect, useCallback, useRef } from "preact/hooks"
import { FileText, Search } from "lucide-preact"
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react"
import { Header } from "../components/layout/header"
import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton"
import { EmptyState } from "../components/ui/empty-state"
import { Dialog } from "../components/ui/dialog"
import { toast } from "../components/ui/toast"
import { RulesToolbar } from "../components/rules/rules-toolbar"
import { RulesTable } from "../components/rules/rules-table"
import { RulePanel } from "../components/rules/rule-panel"
import { SettingsForm } from "../components/settings/settings-form"
import { AnalyticsDashboard } from "../components/analytics/analytics-dashboard"
import { api, getErrorMessage } from "../lib/api"
import type { RedirectRule, RuleFormData } from "../lib/types"

interface DomainDetailProps {
  params: { domain: string }
}

const tabClass = "border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-fg transition-colors hover:text-label focus-visible:outline-none data-selected:border-primary data-selected:text-primary"

export function DomainDetailPage({ params }: DomainDetailProps) {
  const domain = decodeURIComponent(params.domain)
  const encodedDomain = encodeURIComponent(domain)

  // Rules state
  const [rules, setRules] = useState<RedirectRule[] | null>(null)
  const [query, setQueryRaw] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const setQuery = (q: string) => { setQueryRaw(q); setSelectedIds(new Set()) }
  const [panelOpen, setPanelOpen] = useState(false)
  const [editRule, setEditRule] = useState<RedirectRule | null>(null)
  const [deleteRule, setDeleteRule] = useState<RedirectRule | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [importData, setImportData] = useState<unknown[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loading = rules === null

  const fetchRules = useCallback(async () => {
    try {
      const data = await api<RedirectRule[]>(`/rules/${encodedDomain}`)
      setRules(data.sort((a, b) => b.priority - a.priority))
    } catch {
      toast("Failed to load rules", "error")
    }
  }, [encodedDomain])

  useEffect(() => { fetchRules() }, [fetchRules])

  const filteredRules = rules?.filter((r) =>
    r.source.toLowerCase().includes(query.toLowerCase()) ||
    r.target.toLowerCase().includes(query.toLowerCase()),
  ) ?? []

  // CRUD handlers
  const handleAddOrEdit = async (data: RuleFormData) => {
    try {
      if (editRule) {
        await api(`/rules/${encodedDomain}/${editRule.id}`, { method: "PUT", body: JSON.stringify(data) })
        toast("Rule updated", "success")
      } else {
        await api(`/rules/${encodedDomain}`, { method: "POST", body: JSON.stringify(data) })
        toast("Rule added", "success")
      }
      setPanelOpen(false)
      setEditRule(null)
      fetchRules()
    } catch (err) {
      toast(getErrorMessage(err, "Failed to save rule"), "error")
    }
  }

  const handleDelete = async () => {
    if (!deleteRule) return
    setDeleting(true)
    try {
      await api(`/rules/${encodedDomain}/${deleteRule.id}`, { method: "DELETE" })
      toast("Rule deleted", "success")
      setDeleteRule(null)
      fetchRules()
    } catch (err) {
      toast(getErrorMessage(err, "Failed to delete rule"), "error")
    } finally {
      setDeleting(false)
    }
  }

  const handleToggle = async (rule: RedirectRule) => {
    try {
      await api(`/rules/${encodedDomain}/${rule.id}`, {
        method: "PUT",
        body: JSON.stringify({ enabled: !rule.enabled }),
      })
      fetchRules()
    } catch {
      toast("Failed to toggle rule", "error")
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredRules.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredRules.map((r) => r.id)))
    }
  }

  const handleBulkDelete = async () => {
    const results = await Promise.allSettled(
      Array.from(selectedIds).map((id) =>
        api(`/rules/${encodedDomain}/${id}`, { method: "DELETE" }),
      ),
    )
    const failed = results.filter((r) => r.status === "rejected").length
    if (failed > 0) {
      toast(`Deleted ${selectedIds.size - failed} of ${selectedIds.size} rules (${failed} failed)`, "error")
    } else {
      toast(`${selectedIds.size} rules deleted`, "success")
    }
    setSelectedIds(new Set())
    fetchRules()
  }

  const handleBulkToggle = async () => {
    const results = await Promise.allSettled(
      Array.from(selectedIds).map((id) => {
        const rule = rules?.find((r) => r.id === id)
        if (!rule) return Promise.resolve()
        return api(`/rules/${encodedDomain}/${id}`, {
          method: "PUT",
          body: JSON.stringify({ enabled: !rule.enabled }),
        })
      }),
    )
    const failed = results.filter((r) => r.status === "rejected").length
    if (failed > 0) {
      toast(`Toggled ${selectedIds.size - failed} of ${selectedIds.size} rules (${failed} failed)`, "error")
    } else {
      toast(`${selectedIds.size} rules toggled`, "success")
    }
    setSelectedIds(new Set())
    fetchRules()
  }

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/export/${encodedDomain}`)
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${domain}-rules.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast("Failed to export rules", "error")
    }
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!Array.isArray(data)) throw new Error("Invalid format")
      setImportData(data)
    } catch {
      toast("Invalid JSON file", "error")
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const doImport = async (mode: "replace" | "merge") => {
    if (!importData) return
    try {
      await api(`/import/${encodedDomain}?mode=${mode}`, { method: "POST", body: JSON.stringify(importData) })
      toast(`Imported ${importData.length} rules (${mode})`, "success")
      setImportData(null)
      fetchRules()
    } catch (err) {
      toast(getErrorMessage(err, "Failed to import rules"), "error")
    }
  }

  return (
    <>
      <Header
        title={domain}
        breadcrumbs={[
          { label: "Domains", href: "/" },
          { label: domain },
        ]}
      />

      <TabGroup class="p-3 sm:p-4 md:p-6">
        <TabList class="flex gap-1 border-b border-border">
          <Tab class={tabClass}>Rules</Tab>
          <Tab class={tabClass}>Settings</Tab>
          <Tab class={tabClass}>Analytics</Tab>
        </TabList>
        <TabPanels class="mt-4">
          {/* Rules tab */}
          <TabPanel>
            {loading ? (
              <div class="space-y-3" aria-busy="true">
                <Skeleton class="h-10 w-full" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} class="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <RulesToolbar
                  query={query}
                  onQueryChange={setQuery}
                  selectedCount={selectedIds.size}
                  onAdd={() => { setEditRule(null); setPanelOpen(true) }}
                  onBulkDelete={handleBulkDelete}
                  onBulkToggle={handleBulkToggle}
                  onImport={handleImport}
                  onExport={handleExport}
                />

                {filteredRules.length === 0 ? (
                  query ? (
                    <EmptyState icon={Search} title={`No rules matching "${query}"`} />
                  ) : (
                    <EmptyState
                      icon={FileText}
                      title="No rules yet"
                      description={`Add your first redirect rule for ${domain}.`}
                      action={
                        <Button onClick={() => { setEditRule(null); setPanelOpen(true) }}>
                          Add Rule
                        </Button>
                      }
                    />
                  )
                ) : (
                  <div class="mt-4">
                    <RulesTable
                      rules={filteredRules}
                      selectedIds={selectedIds}
                      onSelect={handleSelect}
                      onSelectAll={handleSelectAll}
                      onEdit={(r) => { setEditRule(r); setPanelOpen(true) }}
                      onDelete={setDeleteRule}
                      onToggle={handleToggle}
                    />
                  </div>
                )}

                {/* Hidden file input for import */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  class="hidden"
                  onChange={handleFileSelected}
                />
              </>
            )}
          </TabPanel>

          {/* Settings tab */}
          <TabPanel>
            <SettingsForm domain={domain} />
          </TabPanel>

          {/* Analytics tab */}
          <TabPanel>
            <AnalyticsDashboard domain={domain} />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Rule add/edit panel */}
      <RulePanel
        open={panelOpen}
        rule={editRule}
        onClose={() => { setPanelOpen(false); setEditRule(null) }}
        onSubmit={handleAddOrEdit}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteRule !== null}
        onClose={() => setDeleteRule(null)}
        title="Delete Rule"
      >
        <p class="text-sm text-subtle">
          Delete the rule for <strong class="font-mono">{deleteRule?.source}</strong>? This cannot be undone.
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteRule(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Dialog>

      {/* Import mode dialog */}
      <Dialog
        open={importData !== null}
        onClose={() => setImportData(null)}
        title="Import Rules"
      >
        <p class="text-sm text-subtle">
          Import <strong>{importData?.length ?? 0}</strong> rules. Choose how to handle existing rules:
        </p>
        <div class="mt-4 flex flex-col gap-2">
          <Button variant="outline" onClick={() => doImport("merge")}>
            Merge — keep existing rules, add new ones
          </Button>
          <Button variant="danger" onClick={() => doImport("replace")}>
            Replace — remove existing rules first
          </Button>
          <Button variant="ghost" onClick={() => setImportData(null)}>Cancel</Button>
        </div>
      </Dialog>
    </>
  )
}
