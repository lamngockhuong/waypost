import { describe, it, expect } from 'vitest'
import { matchRule, matchAllRules, buildTargetUrl } from '../../src/services/rule-matcher'
import type { RedirectRule } from '../../src/types'

function makeRule(overrides: Partial<RedirectRule> = {}): RedirectRule {
  return {
    id: 'test-id',
    source: '/github',
    target: 'https://github.com/user',
    type: 'path',
    statusCode: 301,
    preserveQuery: false,
    enabled: true,
    priority: 0,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeUrl(path: string, host = 'example.com'): URL {
  return new URL(`https://${host}${path}`)
}

function makeRequest(path: string, host = 'example.com'): Request {
  return new Request(`https://${host}${path}`)
}

describe('matchRule', () => {
  it('matches exact path', () => {
    const rule = makeRule({ source: '/github', target: 'https://github.com/user' })
    const result = matchRule(makeUrl('/github'), rule)
    expect(result).not.toBeNull()
    expect(result!.targetUrl).toBe('https://github.com/user')
  })

  it('does not match different path', () => {
    const rule = makeRule({ source: '/github', target: 'https://github.com/user' })
    const result = matchRule(makeUrl('/gitlab'), rule)
    expect(result).toBeNull()
  })

  it('matches wildcard path', () => {
    const rule = makeRule({
      source: '/blog/:slug',
      target: 'https://blog.example.com/:slug',
      type: 'wildcard',
    })
    const result = matchRule(makeUrl('/blog/my-post'), rule)
    expect(result).not.toBeNull()
    expect(result!.targetUrl).toBe('https://blog.example.com/my-post')
  })

  it('does not match wildcard on wrong prefix', () => {
    const rule = makeRule({
      source: '/blog/:slug',
      target: 'https://blog.example.com/:slug',
      type: 'wildcard',
    })
    const result = matchRule(makeUrl('/about'), rule)
    expect(result).toBeNull()
  })

  it('matches subdomain type', () => {
    const rule = makeRule({
      source: 'blog',
      target: 'https://blog.example.com',
      type: 'subdomain',
    })
    const result = matchRule(makeUrl('/', 'blog.example.com'), rule)
    expect(result).not.toBeNull()
    expect(result!.targetUrl).toBe('https://blog.example.com')
  })

  it('does not match subdomain when no subdomain present', () => {
    const rule = makeRule({
      source: 'blog',
      target: 'https://blog.example.com',
      type: 'subdomain',
    })
    const result = matchRule(makeUrl('/', 'example.com'), rule)
    expect(result).toBeNull()
  })

  it('strips trailing slash before matching', () => {
    const rule = makeRule({ source: '/github', target: 'https://github.com/user' })
    const result = matchRule(makeUrl('/github/'), rule)
    expect(result).not.toBeNull()
  })

  it('prevents infinite redirect (source === target)', () => {
    const rule = makeRule({ source: '/loop', target: '/loop' })
    const result = matchRule(makeUrl('/loop'), rule)
    expect(result).toBeNull()
  })
})

describe('matchAllRules', () => {
  it('returns first match by priority (higher wins)', () => {
    const rules = [
      makeRule({ id: 'low', source: '/test', target: 'https://low.com', priority: 1 }),
      makeRule({ id: 'high', source: '/test', target: 'https://high.com', priority: 10 }),
    ]
    const result = matchAllRules(makeRequest('/test'), rules)
    expect(result).not.toBeNull()
    expect(result!.targetUrl).toBe('https://high.com')
  })

  it('skips disabled rules', () => {
    const rules = [
      makeRule({ id: 'disabled', source: '/test', target: 'https://disabled.com', enabled: false, priority: 10 }),
      makeRule({ id: 'enabled', source: '/test', target: 'https://enabled.com', enabled: true, priority: 1 }),
    ]
    const result = matchAllRules(makeRequest('/test'), rules)
    expect(result).not.toBeNull()
    expect(result!.targetUrl).toBe('https://enabled.com')
  })

  it('returns null when no rules match', () => {
    const rules = [makeRule({ source: '/github', target: 'https://github.com' })]
    const result = matchAllRules(makeRequest('/about'), rules)
    expect(result).toBeNull()
  })
})

describe('buildTargetUrl', () => {
  it('preserves query string when enabled', () => {
    const rule = makeRule({
      source: '/search',
      target: 'https://google.com/search',
      preserveQuery: true,
    })
    const url = makeUrl('/search?q=test')
    const result = buildTargetUrl(rule, {}, url)
    expect(result).toBe('https://google.com/search?q=test')
  })

  it('does not preserve query string when disabled', () => {
    const rule = makeRule({
      source: '/search',
      target: 'https://google.com/search',
      preserveQuery: false,
    })
    const url = makeUrl('/search?q=test')
    const result = buildTargetUrl(rule, {}, url)
    expect(result).toBe('https://google.com/search')
  })

  it('replaces named groups in target', () => {
    const rule = makeRule({
      source: '/blog/:slug',
      target: 'https://blog.example.com/:slug',
    })
    const result = buildTargetUrl(rule, { slug: 'my-post', '0': 'my-post' }, makeUrl('/blog/my-post'))
    expect(result).toBe('https://blog.example.com/my-post')
  })
})
