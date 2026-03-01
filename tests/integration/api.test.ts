import { describe, it, expect, beforeEach } from 'vitest'
import { env, SELF } from 'cloudflare:test'

// Helper to make authenticated requests
function authFetch(path: string, options: RequestInit = {}) {
  return SELF.fetch(`https://test.example.com${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cf-Access-Jwt-Assertion': 'test-token',
      ...options.headers,
    },
  })
}

describe('API endpoints', () => {
  beforeEach(async () => {
    // Clean up KV state
    await env.REDIRECTS_KV.delete('domains')
  })

  describe('Domain CRUD', () => {
    it('returns empty domains list initially', async () => {
      const res = await authFetch('/api/domains')
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([])
    })

    it('creates a domain', async () => {
      const res = await authFetch('/api/domains', {
        method: 'POST',
        body: JSON.stringify({ domain: 'test.com' }),
      })
      expect(res.status).toBe(201)
      const data = await res.json() as { domain: string }
      expect(data.domain).toBe('test.com')
    })

    it('lists created domains', async () => {
      await authFetch('/api/domains', { method: 'POST', body: JSON.stringify({ domain: 'a.com' }) })
      await authFetch('/api/domains', { method: 'POST', body: JSON.stringify({ domain: 'b.com' }) })

      const res = await authFetch('/api/domains')
      const data = await res.json()
      expect(data).toEqual(['a.com', 'b.com'])
    })

    it('deletes a domain', async () => {
      await authFetch('/api/domains', { method: 'POST', body: JSON.stringify({ domain: 'del.com' }) })
      const res = await authFetch('/api/domains/del.com', { method: 'DELETE' })
      expect(res.status).toBe(200)

      const listRes = await authFetch('/api/domains')
      const data = await listRes.json()
      expect(data).toEqual([])
    })

    it('returns 409 for duplicate domain', async () => {
      await authFetch('/api/domains', { method: 'POST', body: JSON.stringify({ domain: 'dup.com' }) })
      const res = await authFetch('/api/domains', { method: 'POST', body: JSON.stringify({ domain: 'dup.com' }) })
      expect(res.status).toBe(409)
    })
  })

  describe('Rule CRUD', () => {
    const domain = 'rules-test.com'

    beforeEach(async () => {
      await env.REDIRECTS_KV.delete(`rules:${domain}`)
    })

    it('returns empty rules initially', async () => {
      const res = await authFetch(`/api/rules/${domain}`)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual([])
    })

    it('creates a rule', async () => {
      const res = await authFetch(`/api/rules/${domain}`, {
        method: 'POST',
        body: JSON.stringify({
          source: '/github',
          target: 'https://github.com/user',
          type: 'path',
          statusCode: 301,
        }),
      })
      expect(res.status).toBe(201)
      const data = await res.json() as { id: string; source: string }
      expect(data.source).toBe('/github')
      expect(data.id).toBeTruthy()
    })

    it('updates a rule', async () => {
      const createRes = await authFetch(`/api/rules/${domain}`, {
        method: 'POST',
        body: JSON.stringify({ source: '/old', target: 'https://old.com', type: 'path' }),
      })
      const created = await createRes.json() as { id: string }

      const updateRes = await authFetch(`/api/rules/${domain}/${created.id}`, {
        method: 'PUT',
        body: JSON.stringify({ target: 'https://new.com' }),
      })
      expect(updateRes.status).toBe(200)
      const updated = await updateRes.json() as { target: string }
      expect(updated.target).toBe('https://new.com')
    })

    it('deletes a rule', async () => {
      const createRes = await authFetch(`/api/rules/${domain}`, {
        method: 'POST',
        body: JSON.stringify({ source: '/del', target: 'https://del.com', type: 'path' }),
      })
      const created = await createRes.json() as { id: string }

      const delRes = await authFetch(`/api/rules/${domain}/${created.id}`, { method: 'DELETE' })
      expect(delRes.status).toBe(200)

      const listRes = await authFetch(`/api/rules/${domain}`)
      const data = await listRes.json()
      expect(data).toEqual([])
    })

    it('returns 400 for invalid rule', async () => {
      const res = await authFetch(`/api/rules/${domain}`, {
        method: 'POST',
        body: JSON.stringify({ source: '/test' }), // missing target, type
      })
      expect(res.status).toBe(400)
    })
  })

  describe('Auth', () => {
    it('returns 401 without JWT header', async () => {
      const res = await SELF.fetch('https://test.example.com/api/domains')
      expect(res.status).toBe(401)
    })

    it('allows access with JWT header', async () => {
      const res = await authFetch('/api/domains')
      expect(res.status).toBe(200)
    })
  })

  describe('Health check', () => {
    it('returns ok without auth', async () => {
      const res = await SELF.fetch('https://test.example.com/_health')
      expect(res.status).toBe(200)
      const data = await res.json() as { status: string }
      expect(data.status).toBe('ok')
    })
  })
})
