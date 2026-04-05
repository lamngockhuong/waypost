import { useState, useEffect } from "preact/hooks"
import { BarChart3 } from "lucide-preact"
import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { EmptyState } from "../ui/empty-state"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table"
import { toast } from "../ui/toast"
import { DateRangePicker } from "./date-range-picker"
import { BarChart } from "../charts/bar-chart"
import { DoughnutChart } from "../charts/doughnut-chart"
import { api } from "../../lib/api"
import type { AnalyticsData } from "../../lib/types"

interface AnalyticsDashboardProps {
  domain: string
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split("T")[0]
}

function today(): string {
  return new Date().toISOString().split("T")[0]
}

export function AnalyticsDashboard({ domain }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState(daysAgo(30))
  const [to, setTo] = useState(today())
  const [activePreset, setActivePreset] = useState<number | null>(30)

  useEffect(() => {
    setLoading(true)
    api<AnalyticsData>(`/analytics/${encodeURIComponent(domain)}?from=${from}&to=${to}`)
      .then(setData)
      .catch(() => toast("Failed to load analytics", "error"))
      .finally(() => setLoading(false))
  }, [domain, from, to])

  const handlePreset = (days: number) => {
    setFrom(daysAgo(days))
    setTo(today())
    setActivePreset(days)
  }

  const handleFromChange = (v: string) => {
    setFrom(v)
    setActivePreset(null)
  }

  const handleToChange = (v: string) => {
    setTo(v)
    setActivePreset(null)
  }

  if (loading) {
    return (
      <div class="space-y-4" aria-busy="true">
        <Skeleton class="h-10 w-64" />
        <Skeleton class="h-20 w-48" />
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton class="h-64 w-full rounded-xl" />
          <Skeleton class="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const isEmpty = !data || data.totalClicks === 0

  return (
    <div class="space-y-6">
      <DateRangePicker
        from={from}
        to={to}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onPreset={handlePreset}
        activePreset={activePreset}
      />

      {isEmpty ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics data"
          description="Check back after some redirects have been triggered."
        />
      ) : (
        <>
          {/* Total clicks KPI */}
          <Card class="inline-block">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted-fg">Total Clicks</p>
            <p class="mt-1 text-3xl font-mono font-bold text-heading">{data.totalClicks.toLocaleString()}</p>
          </Card>

          {/* Charts */}
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.byRule.length > 0 && (
              <Card>
                <h3 class="mb-3 text-sm font-semibold text-label">Clicks by Rule</h3>
                <BarChart
                  labels={data.byRule.slice(0, 10).map((r) => r.sourcePath || r.redirectId)}
                  data={data.byRule.slice(0, 10).map((r) => r.count)}
                />
              </Card>
            )}
            {data.byCountry.length > 0 && (
              <Card>
                <h3 class="mb-3 text-sm font-semibold text-label">Clicks by Country</h3>
                <DoughnutChart
                  labels={data.byCountry.slice(0, 10).map((c) => c.country || "Unknown")}
                  data={data.byCountry.slice(0, 10).map((c) => c.count)}
                />
              </Card>
            )}
          </div>

          {/* Referrers table */}
          {data.byReferrer.length > 0 && (
            <div>
              <h3 class="mb-3 text-sm font-semibold text-label">Top Referrers</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead class="w-24 text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byReferrer.slice(0, 20).map((r) => (
                    <TableRow key={r.referrer}>
                      <TableCell class="text-sm truncate max-w-[300px]">{r.referrer || "(direct)"}</TableCell>
                      <TableCell class="text-right font-mono text-sm">{r.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
