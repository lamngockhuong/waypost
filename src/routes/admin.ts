import { Hono } from 'hono'
import type { Bindings } from '../types'
import { getAdminHTML } from '../admin/html'

const admin = new Hono<{ Bindings: Bindings }>()

admin.get('/', (c) => {
  return c.html(getAdminHTML())
})

// Serve admin for any sub-path (SPA hash routing)
admin.get('/*', (c) => {
  return c.html(getAdminHTML())
})

export { admin }
