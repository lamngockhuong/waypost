import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './types'
import { accessAuth } from './middleware/auth'
import { api } from './routes/api'
import { admin } from './routes/admin'
import { redirect } from './routes/redirect'

const app = new Hono<{ Bindings: Bindings }>()

// Health check
app.get('/_health', (c) => c.json({ status: 'ok' }))

// H1 fix: CORS restricted to same-origin only
app.use('/api/*', cors({
  origin: (origin, c) => {
    // Allow same-origin requests and localhost for dev
    const url = new URL(c.req.url)
    if (origin === url.origin || origin.startsWith('http://localhost')) return origin
    return ''
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type'],
}))

// Auth middleware for admin and API
app.use('/admin/*', accessAuth)
app.use('/api/*', accessAuth)

// Mount routes
app.route('/api', api)
app.route('/admin', admin)

// Catch-all redirect handler (no auth)
app.route('/', redirect)

export default app
