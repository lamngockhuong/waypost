import type { RedirectRule, MatchResult } from '../types'

const MAX_CACHE_SIZE = 500
const patternCache = new Map<string, URLPattern>()

function getPattern(rule: RedirectRule): URLPattern | null {
  const key = `${rule.type}:${rule.source}`
  if (patternCache.has(key)) return patternCache.get(key)!

  try {
    let pattern: URLPattern
    if (rule.type === 'path') {
      pattern = new URLPattern({ pathname: rule.source })
    } else if (rule.type === 'wildcard') {
      pattern = new URLPattern({ pathname: rule.source })
    } else {
      return null
    }
    // H5 fix: evict cache when size limit reached
    if (patternCache.size >= MAX_CACHE_SIZE) patternCache.clear()
    patternCache.set(key, pattern)
    return pattern
  } catch {
    return null
  }
}

function stripTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export function buildTargetUrl(
  rule: RedirectRule,
  groups: Record<string, string>,
  requestUrl: URL,
): string {
  let target = rule.target

  // Replace captured groups ($1, $2, etc. or named groups)
  for (const [key, value] of Object.entries(groups)) {
    if (/^\d+$/.test(key)) {
      target = target.replace(`$${key}`, value ?? '')
    } else {
      target = target.replace(`:${key}`, value ?? '')
    }
  }

  // H4 fix: wrap in try-catch for invalid URLs after group substitution
  if (rule.preserveQuery && requestUrl.search) {
    try {
      const targetUrl = new URL(target)
      const requestParams = new URLSearchParams(requestUrl.search)
      for (const [k, v] of requestParams) {
        if (!targetUrl.searchParams.has(k)) {
          targetUrl.searchParams.set(k, v)
        }
      }
      return targetUrl.toString()
    } catch {
      return target
    }
  }

  return target
}

export function matchRule(
  requestUrl: URL,
  rule: RedirectRule,
): MatchResult | null {
  // Infinite redirect guard
  if (rule.source === rule.target) return null

  const pathname = stripTrailingSlash(requestUrl.pathname)

  if (rule.type === 'subdomain') {
    const hostParts = requestUrl.hostname.split('.')
    if (hostParts.length < 3) return null
    const subdomain = hostParts[0]
    if (subdomain !== rule.source) return null
    const targetUrl = buildTargetUrl(rule, {}, requestUrl)
    return { rule, targetUrl }
  }

  const pattern = getPattern(rule)
  if (!pattern) return null

  // Test against both the original and trailing-slash-stripped pathname
  const testUrl = new URL(requestUrl.toString())
  testUrl.pathname = pathname

  const result = pattern.exec(testUrl.toString())
  if (!result) return null

  const groups: Record<string, string> = {}
  const pathnameGroups = result.pathname?.groups ?? {}
  let index = 0
  for (const [key, value] of Object.entries(pathnameGroups)) {
    if (value !== undefined) {
      groups[key] = value
      groups[String(index)] = value
      index++
    }
  }

  const targetUrl = buildTargetUrl(rule, groups, requestUrl)
  return { rule, targetUrl }
}

export function matchAllRules(
  request: Request,
  rules: RedirectRule[],
): MatchResult | null {
  const requestUrl = new URL(request.url)

  const activeRules = rules
    .filter((r) => r.enabled)
    .sort((a, b) => b.priority - a.priority)

  for (const rule of activeRules) {
    const result = matchRule(requestUrl, rule)
    if (result) return result
  }

  return null
}
