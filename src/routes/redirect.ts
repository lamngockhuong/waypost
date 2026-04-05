import { Hono } from 'hono'
import type { Context } from 'hono'
import type { Bindings } from '../types'
import { getRulesForDomain, getDomainConfig } from '../services/kv-store'
import { matchAllRules } from '../services/rule-matcher'
import { extractClickData, recordClick } from '../services/analytics'
import { getLandingHTML } from '../admin/landing-html'

const redirect = new Hono<{ Bindings: Bindings }>()
const LANDING_HTML = getLandingHTML()

// C2 fix: CSP header to prevent XSS in custom 404 HTML
async function handleNotFound(c: Context<{ Bindings: Bindings }>, hostname: string) {
  const config = await getDomainConfig(c.env.REDIRECTS_KV, hostname)
  if (config?.defaultUrl) return c.redirect(config.defaultUrl, 302)
  if (config?.custom404Html) {
    return new Response(config.custom404Html, {
      status: 404,
      headers: {
        'Content-Type': 'text/html',
        'Content-Security-Policy': "default-src 'self'; script-src 'none'; style-src 'unsafe-inline'",
      },
    })
  }
  return c.notFound()
}

// Root path: check domain config for defaultUrl, otherwise show landing page
redirect.get('/', async (c) => {
  const hostname = new URL(c.req.url).hostname
  const config = await getDomainConfig(c.env.REDIRECTS_KV, hostname)
  if (config?.defaultUrl) return c.redirect(config.defaultUrl, 302)
  return c.html(LANDING_HTML)
})

redirect.all('*', async (c) => {
  const url = new URL(c.req.url)
  const hostname = url.hostname

  const rules = await getRulesForDomain(c.env.REDIRECTS_KV, hostname)
  if (!rules.length) return handleNotFound(c, hostname)

  const result = matchAllRules(c.req.raw, rules)
  if (!result) return handleNotFound(c, hostname)

  // Non-blocking analytics write
  const clickData = extractClickData(c.req.raw, result, hostname)
  c.executionCtx.waitUntil(recordClick(c.env.ANALYTICS_DB, clickData))

  return c.redirect(result.targetUrl, result.rule.statusCode)
})

export { redirect }
