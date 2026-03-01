export type Bindings = {
  REDIRECTS_KV: KVNamespace
  ANALYTICS_DB: D1Database
  ACCESS_AUD: string
  ACCESS_TEAM: string
}

export type RedirectType = 'path' | 'wildcard' | 'subdomain'

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

export interface MatchResult {
  rule: RedirectRule
  targetUrl: string
}

export interface ClickData {
  domain: string
  redirectId: string
  sourcePath: string
  targetUrl: string
  country: string
  device: string
  referrer: string
  userAgent: string
}

export interface AnalyticsOptions {
  from?: string
  to?: string
}
