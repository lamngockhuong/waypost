import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

interface KpiCardProps {
  label: string
  value: number | string
  loading: boolean
}

function KpiCard({ label, value, loading }: KpiCardProps) {
  return (
    <Card class="min-w-0">
      <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-muted-fg truncate">{label}</p>
      {loading
        ? <Skeleton class="mt-1 h-7 w-12" />
        : <p class="mt-1 text-xl sm:text-2xl font-mono font-bold text-heading">{value}</p>}
    </Card>
  )
}

interface DomainStats {
  rules: number
  clicks: number
}

interface KpiRowProps {
  domains: string[] | null
  stats: Map<string, DomainStats> | null
  loading: boolean
}

export function KpiRow({ domains, stats, loading }: KpiRowProps) {
  const totalDomains = domains?.length ?? 0
  const totalRules = stats ? Array.from(stats.values()).reduce((sum, s) => sum + s.rules, 0) : 0
  const totalClicks = stats ? Array.from(stats.values()).reduce((sum, s) => sum + s.clicks, 0) : 0

  return (
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 mt-4" aria-busy={loading}>
      <KpiCard label="Domains" value={totalDomains} loading={loading} />
      <KpiCard label="Total Rules" value={totalRules} loading={loading} />
      <KpiCard label="Clicks (24h)" value={totalClicks} loading={loading} />
    </div>
  )
}
