import type { ClickData, AnalyticsOptions, MatchResult } from '../types'

export async function recordClick(
  db: D1Database,
  data: ClickData,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO click_events (domain, redirect_id, source_path, target_url, country, device, referrer, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      data.domain,
      data.redirectId,
      data.sourcePath,
      data.targetUrl,
      data.country,
      data.device,
      data.referrer,
      data.userAgent,
    )
    .run()
}

export function extractClickData(
  request: Request,
  result: MatchResult,
  hostname: string,
): ClickData {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') ?? ''
  return {
    domain: hostname,
    redirectId: result.rule.id,
    sourcePath: url.pathname,
    targetUrl: result.targetUrl,
    country: (request as unknown as { cf?: { country?: string } }).cf?.country ?? 'unknown',
    device: parseDevice(ua),
    referrer: request.headers.get('referer') ?? '',
    userAgent: ua,
  }
}

function parseDevice(ua: string): string {
  if (/bot|crawler|spider/i.test(ua)) return 'bot'
  if (/mobile|android|iphone/i.test(ua)) return 'mobile'
  return 'desktop'
}

function buildWhereClause(
  domain: string,
  opts: AnalyticsOptions,
  ruleId?: string,
): { clause: string; params: unknown[] } {
  const conditions = ['domain = ?']
  const params: unknown[] = [domain]

  if (ruleId) {
    conditions.push('redirect_id = ?')
    params.push(ruleId)
  }
  if (opts.from) {
    conditions.push('timestamp >= ?')
    params.push(opts.from)
  }
  if (opts.to) {
    conditions.push('timestamp <= ?')
    params.push(opts.to)
  }

  return { clause: conditions.join(' AND '), params }
}

export async function getAnalytics(
  db: D1Database,
  domain: string,
  opts: AnalyticsOptions,
) {
  const { clause, params } = buildWhereClause(domain, opts)

  const [total, byRule, byCountry, byReferrer, recent] = await Promise.all([
    db
      .prepare(`SELECT COUNT(*) as count FROM click_events WHERE ${clause}`)
      .bind(...params)
      .first<{ count: number }>(),
    db
      .prepare(
        `SELECT redirect_id, source_path, COUNT(*) as count FROM click_events WHERE ${clause} GROUP BY redirect_id ORDER BY count DESC`,
      )
      .bind(...params)
      .all(),
    db
      .prepare(
        `SELECT country, COUNT(*) as count FROM click_events WHERE ${clause} GROUP BY country ORDER BY count DESC LIMIT 10`,
      )
      .bind(...params)
      .all(),
    db
      .prepare(
        `SELECT referrer, COUNT(*) as count FROM click_events WHERE ${clause} GROUP BY referrer ORDER BY count DESC LIMIT 10`,
      )
      .bind(...params)
      .all(),
    db
      .prepare(
        `SELECT * FROM click_events WHERE ${clause} ORDER BY timestamp DESC LIMIT 50`,
      )
      .bind(...params)
      .all(),
  ])

  return {
    totalClicks: total?.count ?? 0,
    byRule: byRule.results,
    byCountry: byCountry.results,
    byReferrer: byReferrer.results,
    recentClicks: recent.results,
  }
}

export async function getAnalyticsByRule(
  db: D1Database,
  domain: string,
  ruleId: string,
  opts: AnalyticsOptions,
) {
  const { clause, params } = buildWhereClause(domain, opts, ruleId)

  const [total, byCountry, byReferrer, byDevice, recent] = await Promise.all([
    db
      .prepare(`SELECT COUNT(*) as count FROM click_events WHERE ${clause}`)
      .bind(...params)
      .first<{ count: number }>(),
    db
      .prepare(
        `SELECT country, COUNT(*) as count FROM click_events WHERE ${clause} GROUP BY country ORDER BY count DESC LIMIT 10`,
      )
      .bind(...params)
      .all(),
    db
      .prepare(
        `SELECT referrer, COUNT(*) as count FROM click_events WHERE ${clause} GROUP BY referrer ORDER BY count DESC LIMIT 10`,
      )
      .bind(...params)
      .all(),
    db
      .prepare(
        `SELECT device, COUNT(*) as count FROM click_events WHERE ${clause} GROUP BY device ORDER BY count DESC`,
      )
      .bind(...params)
      .all(),
    db
      .prepare(
        `SELECT * FROM click_events WHERE ${clause} ORDER BY timestamp DESC LIMIT 50`,
      )
      .bind(...params)
      .all(),
  ])

  return {
    totalClicks: total?.count ?? 0,
    byCountry: byCountry.results,
    byReferrer: byReferrer.results,
    byDevice: byDevice.results,
    recentClicks: recent.results,
  }
}
