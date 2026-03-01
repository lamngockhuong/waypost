import { Hono } from 'hono'
import type { Bindings, RedirectRule } from '../types'
import {
  getDomains,
  setDomains,
  getRulesForDomain,
  setRulesForDomain,
  getDomainConfig,
  setDomainConfig,
} from '../services/kv-store'
import { getAnalytics, getAnalyticsByRule } from '../services/analytics'

const api = new Hono<{ Bindings: Bindings }>()

// --- Validation helpers ---

function validateRule(body: Record<string, unknown>): string | null {
  if (!body.source || typeof body.source !== 'string') return 'source is required'
  if (!body.target || typeof body.target !== 'string') return 'target is required'
  if (!['path', 'wildcard', 'subdomain'].includes(body.type as string))
    return 'type must be path, wildcard, or subdomain'
  if (body.statusCode !== undefined && body.statusCode !== 301 && body.statusCode !== 302)
    return 'statusCode must be 301 or 302'

  // Validate target URL format
  try {
    new URL(body.target as string)
  } catch {
    return 'target must be a valid URL'
  }

  return null
}

// --- Domain endpoints ---

api.get('/domains', async (c) => {
  const domains = await getDomains(c.env.REDIRECTS_KV)
  return c.json(domains)
})

api.post('/domains', async (c) => {
  const body = await c.req.json<{ domain: string }>()
  const domain = body.domain?.toLowerCase().trim()
  if (!domain) return c.json({ error: 'domain is required' }, 400)

  const domains = await getDomains(c.env.REDIRECTS_KV)
  if (domains.includes(domain)) return c.json({ error: 'domain already exists' }, 409)

  domains.push(domain)
  await setDomains(c.env.REDIRECTS_KV, domains)
  return c.json({ domain }, 201)
})

api.delete('/domains/:domain', async (c) => {
  const domain = c.req.param('domain')
  const domains = await getDomains(c.env.REDIRECTS_KV)
  const filtered = domains.filter((d) => d !== domain)

  if (filtered.length === domains.length) return c.json({ error: 'domain not found' }, 404)

  await setDomains(c.env.REDIRECTS_KV, filtered)
  // Cascade: remove rules and config
  await c.env.REDIRECTS_KV.delete(`rules:${domain}`)
  await c.env.REDIRECTS_KV.delete(`config:${domain}`)
  return c.json({ deleted: domain })
})

// --- Domain config endpoints ---

api.get('/config/:domain', async (c) => {
  const domain = c.req.param('domain')
  const config = await getDomainConfig(c.env.REDIRECTS_KV, domain)
  return c.json(config ?? { domain })
})

api.put('/config/:domain', async (c) => {
  const domain = c.req.param('domain')
  const body = await c.req.json<{ custom404Html?: string; defaultUrl?: string }>()

  // C3 fix: validate defaultUrl
  if (body.defaultUrl) {
    try {
      const u = new URL(body.defaultUrl)
      if (!['http:', 'https:'].includes(u.protocol)) {
        return c.json({ error: 'defaultUrl must use http(s) protocol' }, 400)
      }
    } catch {
      return c.json({ error: 'defaultUrl must be a valid URL' }, 400)
    }
  }

  // M3 fix: limit custom404Html size
  if (body.custom404Html && body.custom404Html.length > 50_000) {
    return c.json({ error: 'custom404Html must be under 50KB' }, 400)
  }

  const config = { domain, custom404Html: body.custom404Html, defaultUrl: body.defaultUrl }
  await setDomainConfig(c.env.REDIRECTS_KV, domain, config)
  return c.json(config)
})

// --- Rule endpoints ---

api.get('/rules/:domain', async (c) => {
  const domain = c.req.param('domain')
  const rules = await getRulesForDomain(c.env.REDIRECTS_KV, domain)
  return c.json(rules)
})

api.post('/rules/:domain', async (c) => {
  const domain = c.req.param('domain')
  const body = await c.req.json<Record<string, unknown>>()

  const error = validateRule(body)
  if (error) return c.json({ error }, 400)

  const now = new Date().toISOString()
  const rule: RedirectRule = {
    id: crypto.randomUUID(),
    source: body.source as string,
    target: body.target as string,
    type: body.type as RedirectRule['type'],
    statusCode: (body.statusCode as 301 | 302) ?? 302,
    preserveQuery: (body.preserveQuery as boolean) ?? false,
    enabled: (body.enabled as boolean) ?? true,
    priority: (body.priority as number) ?? 0,
    createdAt: now,
    updatedAt: now,
  }

  const rules = await getRulesForDomain(c.env.REDIRECTS_KV, domain)
  rules.push(rule)
  await setRulesForDomain(c.env.REDIRECTS_KV, domain, rules)
  return c.json(rule, 201)
})

api.put('/rules/:domain/:id', async (c) => {
  const domain = c.req.param('domain')
  const id = c.req.param('id')
  const body = await c.req.json<Record<string, unknown>>()

  const rules = await getRulesForDomain(c.env.REDIRECTS_KV, domain)
  const index = rules.findIndex((r) => r.id === id)
  if (index === -1) return c.json({ error: 'rule not found' }, 404)

  // Validate if changing core fields
  if (body.target && typeof body.target === 'string') {
    try {
      new URL(body.target)
    } catch {
      return c.json({ error: 'target must be a valid URL' }, 400)
    }
  }
  if (body.type && !['path', 'wildcard', 'subdomain'].includes(body.type as string)) {
    return c.json({ error: 'type must be path, wildcard, or subdomain' }, 400)
  }

  const existing = rules[index]
  rules[index] = {
    ...existing,
    ...(body.source !== undefined && { source: body.source as string }),
    ...(body.target !== undefined && { target: body.target as string }),
    ...(body.type !== undefined && { type: body.type as RedirectRule['type'] }),
    ...(body.statusCode !== undefined && { statusCode: body.statusCode as 301 | 302 }),
    ...(body.preserveQuery !== undefined && { preserveQuery: body.preserveQuery as boolean }),
    ...(body.enabled !== undefined && { enabled: body.enabled as boolean }),
    ...(body.priority !== undefined && { priority: body.priority as number }),
    updatedAt: new Date().toISOString(),
  }

  await setRulesForDomain(c.env.REDIRECTS_KV, domain, rules)
  return c.json(rules[index])
})

api.delete('/rules/:domain/:id', async (c) => {
  const domain = c.req.param('domain')
  const id = c.req.param('id')

  const rules = await getRulesForDomain(c.env.REDIRECTS_KV, domain)
  const filtered = rules.filter((r) => r.id !== id)
  if (filtered.length === rules.length) return c.json({ error: 'rule not found' }, 404)

  await setRulesForDomain(c.env.REDIRECTS_KV, domain, filtered)
  return c.json({ deleted: id })
})

// --- Analytics endpoints ---

api.get('/analytics/:domain', async (c) => {
  const domain = c.req.param('domain')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const data = await getAnalytics(c.env.ANALYTICS_DB, domain, { from, to })
  return c.json(data)
})

api.get('/analytics/:domain/:id', async (c) => {
  const domain = c.req.param('domain')
  const id = c.req.param('id')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const data = await getAnalyticsByRule(c.env.ANALYTICS_DB, domain, id, { from, to })
  return c.json(data)
})

// --- Import/Export ---

api.get('/export/:domain', async (c) => {
  const domain = c.req.param('domain')
  const rules = await getRulesForDomain(c.env.REDIRECTS_KV, domain)
  c.header('Content-Disposition', `attachment; filename="${domain}-rules.json"`)
  return c.json(rules)
})

api.post('/import/:domain', async (c) => {
  const domain = c.req.param('domain')
  const body = await c.req.json<Record<string, unknown>[]>()

  if (!Array.isArray(body)) return c.json({ error: 'body must be a JSON array of rules' }, 400)

  // H2 fix: validate each imported rule
  for (const r of body) {
    const err = validateRule(r)
    if (err) return c.json({ error: `Invalid rule: ${err}` }, 400)
  }

  const mode = c.req.query('mode') ?? 'replace'
  const now = new Date().toISOString()
  const newRules: RedirectRule[] = body.map((r) => ({
    id: crypto.randomUUID(),
    source: r.source as string,
    target: r.target as string,
    type: r.type as RedirectRule['type'],
    statusCode: (r.statusCode as 301 | 302) ?? 302,
    preserveQuery: (r.preserveQuery as boolean) ?? false,
    enabled: (r.enabled as boolean) ?? true,
    priority: (r.priority as number) ?? 0,
    createdAt: now,
    updatedAt: now,
  }))

  if (mode === 'merge') {
    const existing = await getRulesForDomain(c.env.REDIRECTS_KV, domain)
    existing.push(...newRules)
    await setRulesForDomain(c.env.REDIRECTS_KV, domain, existing)
  } else {
    await setRulesForDomain(c.env.REDIRECTS_KV, domain, newRules)
  }

  return c.json({ imported: newRules.length, mode }, 201)
})

export { api }
