/** Shared types mirroring server-side types for API responses */

export type RedirectType = "path" | "wildcard" | "subdomain"

export interface RedirectRule {
  id: string
  source: string
  target: string
  type: RedirectType
  statusCode: 301 | 302
  preserveQuery: boolean
  enabled: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

export interface DomainConfig {
  domain: string
  custom404Html?: string
  defaultUrl?: string
}

export interface RuleFormData {
  source: string
  target: string
  type: RedirectType
  statusCode: 301 | 302
  preserveQuery: boolean
  enabled: boolean
  priority: number
}

export interface AnalyticsData {
  totalClicks: number
  byRule: { redirectId: string; sourcePath: string; count: number }[]
  byCountry: { country: string; count: number }[]
  byReferrer: { referrer: string; count: number }[]
}
