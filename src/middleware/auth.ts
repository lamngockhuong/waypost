import { createMiddleware } from 'hono/factory'
import type { Bindings } from '../types'

// Cache JWKS keys per isolate
let cachedKeys: CryptoKey[] | null = null
let cacheExpiry = 0

async function getPublicKeys(team: string): Promise<CryptoKey[]> {
  if (cachedKeys && Date.now() < cacheExpiry) return cachedKeys

  const resp = await fetch(
    `https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`,
  )
  const { keys } = await resp.json<{ keys: JsonWebKey[] }>()

  cachedKeys = await Promise.all(
    keys.map((k) =>
      crypto.subtle.importKey(
        'jwk',
        k,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      ),
    ),
  )
  cacheExpiry = Date.now() + 300_000 // 5 min cache
  return cachedKeys
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

export const accessAuth = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    // Skip auth entirely if ACCESS_TEAM is not configured (local dev)
    if (!c.env.ACCESS_TEAM) {
      await next()
      return
    }

    const jwt = c.req.header('Cf-Access-Jwt-Assertion')
    if (!jwt) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    try {
      const parts = jwt.split('.')
      if (parts.length !== 3) return c.json({ error: 'Invalid token' }, 401)

      const keys = await getPublicKeys(c.env.ACCESS_TEAM)
      const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
      const sig = base64UrlDecode(parts[2])

      let verified = false
      for (const key of keys) {
        if (await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig, data)) {
          verified = true
          break
        }
      }
      if (!verified) return c.json({ error: 'Invalid token' }, 401)

      // Verify audience
      if (c.env.ACCESS_AUD) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        if (!payload.aud?.includes(c.env.ACCESS_AUD)) {
          return c.json({ error: 'Invalid audience' }, 401)
        }
      }
    } catch {
      return c.json({ error: 'Authentication failed' }, 401)
    }

    await next()
  },
)
