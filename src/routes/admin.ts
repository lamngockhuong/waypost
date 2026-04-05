import { Hono } from 'hono'
import type { Bindings } from '../types'
import { getLandingHTML } from '../admin/landing-html'

const admin = new Hono<{ Bindings: Bindings }>()
const LANDING_HTML = getLandingHTML()

// Landing page (no SPA)
admin.get('/', (c) => {
  return c.html(LANDING_HTML)
})

// SPA fallback — serve index.html for all /admin/* routes
admin.get('/*', async (c) => {
  const url = new URL('/admin/index.html', c.req.url)
  const response = await c.env.ASSETS.fetch(url)
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
})

export { admin }
