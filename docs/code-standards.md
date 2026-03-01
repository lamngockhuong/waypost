# Waypost - Code Standards

## Language & Tooling

- **Language**: TypeScript strict mode (tsconfig.json: `strict: true`)
- **Module System**: ES Modules (ESM)
- **Runtime**: Cloudflare Workers (Node.js compat mode)
- **Package Manager**: pnpm 10.29.3+
- **Testing**: Vitest 3.2.4 + @cloudflare/vitest-pool-workers

## File Organization

```bash
src/
├── index.ts                    # App entry, Hono router setup
├── types.ts                    # Shared type definitions
├── middleware/
│   └── auth.ts                 # JWT verification, JWKS caching
├── routes/
│   ├── redirect.ts             # Catch-all redirect handler
│   ├── api.ts                  # REST API endpoints (domain, rule, config, analytics)
│   └── admin.ts                # Admin UI route
├── services/
│   ├── kv-store.ts             # KV read/write operations
│   ├── rule-matcher.ts         # URLPattern matching logic
│   └── analytics.ts            # D1 queries, click data extraction
└── admin/
    └── html.ts                 # Inline Preact+HTM SPA

tests/
└── *.test.ts                   # Vitest test files

migrations/
└── 0001_create_click_events.sql # D1 schema
```

## File Naming Conventions

- **Source files**: kebab-case (e.g., `rule-matcher.ts`, `kv-store.ts`)
- **Directories**: kebab-case (e.g., `middleware/`, `services/`)
- **Test files**: `{module-name}.test.ts` (collocated or in `tests/`)
- **Avoid**: UPPER_CASE, PascalCase, camelCase for filenames

## Type System

### Strict Mode Requirements

All TypeScript files must pass `tsc --noEmit --strict`:

- `noImplicitAny: true` - No `any` without explicit annotation
- `strictNullChecks: true` - Null/undefined propagated through types
- `strictFunctionTypes: true` - Function parameter variance checked
- `noImplicitThis: true` - `this` context explicit

### Type Definitions

- Define all types in `src/types.ts` (shared) or module-local
- Export interfaces with clear names (e.g., `RedirectRule`, `DomainConfig`)
- Use discriminated unions for runtime type safety (e.g., `RedirectType = 'path' | 'wildcard' | 'subdomain'`)
- Avoid generic catch-all types; use specific union types

### Example

```typescript
export type RedirectType = "path" | "wildcard" | "subdomain";

export interface RedirectRule {
  id: string;
  source: string;
  target: string;
  type: RedirectType; // Discriminated union
  statusCode: 301 | 302;
  preserveQuery: boolean;
  enabled: boolean;
  priority: number;
}
```

## Code Style

### Imports

```typescript
// Absolute imports from module entry points
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

// Relative imports within src/
import type { Bindings } from "../types";
import { getRulesForDomain } from "../services/kv-store";
```

### Function Declarations

```typescript
// Named exports preferred for tree-shaking
export async function getRulesForDomain(
  kv: KVNamespace,
  domain: string,
): Promise<RedirectRule[]> {
  // Logic
}

// Type parameter placement
export function buildTargetUrl(
  rule: RedirectRule,
  groups: Record<string, string>,
  requestUrl: URL,
): string {
  // Logic
}
```

### Error Handling

```typescript
// Use try-catch for external calls (fetch, URLPattern, etc.)
try {
  const pattern = new URLPattern({ pathname: rule.source });
} catch {
  return null; // Graceful degradation
}

// Use type guards for validation
if (!body.source || typeof body.source !== "string") {
  return c.json({ error: "source is required" }, 400);
}
```

### Constants

```typescript
// Export constants for reuse
const MAX_CACHE_SIZE = 500;
const CACHE_TTL_MS = 300_000; // 5 minutes

// Use _ for readability in large numbers
const SIZE_LIMIT = 50_000; // 50KB
```

### Naming Patterns

- Variables/functions: `camelCase`
- Constants: `UPPER_CASE` (when module-level and immutable)
- Classes/interfaces: `PascalCase`
- Type unions: `'value' | 'otherValue'` (lowercase strings)
- Functions returning boolean: `is*`, `has*`, `can*` (e.g., `isBot()`)

## Module Structure

### Services (reusable logic)

```typescript
// kv-store.ts: Pure KV operations
export async function getDomains(kv: KVNamespace): Promise<string[]>;
export async function setDomains(
  kv: KVNamespace,
  domains: string[],
): Promise<void>;

// rule-matcher.ts: URL matching algorithms
export function matchAllRules(
  request: Request,
  rules: RedirectRule[],
): MatchResult | null;

// analytics.ts: D1 queries and data extraction
export async function recordClick(
  db: D1Database,
  data: ClickData,
): Promise<void>;
```

### Middleware (Hono middleware)

```typescript
// auth.ts: JWT verification with JWKS caching
export const accessAuth = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    // Middleware implementation
    await next();
  },
);
```

### Routes (HTTP handlers)

```typescript
// api.ts: REST endpoint definitions
const api = new Hono<{ Bindings: Bindings }>()
api.get('/domains', async (c) => { ... })
api.post('/domains', async (c) => { ... })
export { api }
```

## Testing Standards

### Test File Structure

```typescript
// rules.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { matchRule, buildTargetUrl } from "../services/rule-matcher";

describe("rule-matcher", () => {
  describe("matchRule", () => {
    it("should match path patterns with capture groups", () => {
      const rule: RedirectRule = {
        id: "1",
        source: "/blog/(.*)",
        target: "https://blog.example.com/$1",
        type: "path",
        statusCode: 301,
        preserveQuery: false,
        enabled: true,
        priority: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const url = new URL("https://example.com/blog/my-post");
      const result = matchRule(url, rule);
      expect(result).not.toBeNull();
      expect(result?.targetUrl).toContain("my-post");
    });
  });
});
```

### Test Coverage Requirements

- **Unit tests**: All service functions (kv-store, rule-matcher, analytics)
- **Integration tests**: Hono route handlers with mocked bindings
- **Edge cases**: Null values, invalid URLs, cache eviction, auth failures
- **No mocking**: Use real D1/KV via @cloudflare/vitest-pool-workers when possible

### Running Tests

```bash
pnpm test          # Run once
pnpm test:watch    # Development mode

# Vitest runs via cloudflare/vitest-pool-workers
# Simulates Worker bindings and CF metadata (cf.country, etc.)
```

## Validation & Linting

### TypeScript Compilation

```bash
pnpm typecheck     # tsc --noEmit (strict mode)
```

### Code Quality Rules

| Rule               | Enforcement | Notes                                            |
| ------------------ | ----------- | ------------------------------------------------ |
| No `any`           | Error       | Use explicit types or `unknown` with type guards |
| No implicit `this` | Error       | Bind or type `this` context                      |
| Null safety        | Error       | Check nullability before access                  |
| Unused variables   | Warning     | Clean up imports, local vars                     |
| Trailing commas    | Optional    | Use in multiline only                            |
| Semicolons         | Optional    | Use consistently                                 |
| Line length        | Soft 100    | Break at logical boundaries                      |

## API Validation

### Request Validation Pattern

```typescript
function validateRule(body: Record<string, unknown>): string | null {
  if (!body.source || typeof body.source !== "string")
    return "source is required";
  if (!body.target || typeof body.target !== "string")
    return "target is required";
  if (!["path", "wildcard", "subdomain"].includes(body.type as string))
    return "type must be path, wildcard, or subdomain";

  // URL validation
  try {
    new URL(body.target as string);
  } catch {
    return "target must be a valid URL";
  }

  return null; // Valid
}
```

### Response Format

```typescript
// Success responses
return c.json(data, 200); // GET
return c.json(data, 201); // POST (created)
return c.json(data, 204); // No content

// Error responses
return c.json({ error: "message" }, 400); // Bad request
return c.json({ error: "message" }, 401); // Unauthorized
return c.json({ error: "message" }, 404); // Not found
```

## Performance Guidelines

### KV & D1 Access

- Batch KV reads when possible (fetch all rules once, not per request)
- Use indexes in D1 (click_events has `idx_click_domain_time`, `idx_click_redirect`)
- Parallelize independent queries with `Promise.all()`

### Memory Management

- LRU cache in rule-matcher (MAX_CACHE_SIZE = 500 prevents unbounded growth)
- Clear cache when limit reached: `if (cache.size >= MAX_CACHE_SIZE) cache.clear()`
- Avoid keeping large objects in Worker memory

### Worker Timeout

- Redirect processing: <10ms (should be safe)
- Analytics writes: queued via `executionCtx.waitUntil()` (non-blocking)
- Admin queries: keep under Worker 30-second CPU limit

## Security Checklist

Before deployment:

- [ ] All sensitive vars (ACCESS_AUD, ACCESS_TEAM) in wrangler.toml, not hardcoded
- [ ] URL validation for redirects (prevent open redirects)
- [ ] Custom HTML sanitized (no inline scripts, CSP headers)
- [ ] Size limits enforced (custom404Html <50KB)
- [ ] JWT auth enabled for /admin and /api routes
- [ ] CORS restricted to same-origin
- [ ] No console.log() with sensitive data in production
- [ ] Error responses don't leak internal details

## Build & Deployment

### Local Development

```bash
pnpm install           # Install dependencies
pnpm dev               # Start wrangler dev server
pnpm test              # Run tests
pnpm typecheck         # Verify types
```

### Deployment Checklist

```bash
pnpm typecheck         # Must pass
pnpm test              # Must pass
pnpm deploy            # Deploys to Cloudflare
```

### Configuration (wrangler.toml)

```toml
name = "waypost"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "REDIRECTS_KV"
id = "<placeholder>"

[[d1_databases]]
binding = "ANALYTICS_DB"
database_name = "redirect-analytics"
```

## Documentation Standards

- Comment complex algorithms (rule matching, capture group replacement)
- Explain "why" in comments, not "what" (code is self-explanatory)
- Use JSDoc for exported functions (parameters, returns, throws)
- Keep comments up-to-date with code changes

### Example

### Configuration (wrangler.toml)

```toml
name = "waypost"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "REDIRECTS_KV"
id = "<placeholder>"

[[d1_databases]]
binding = "ANALYTICS_DB"
database_name = "redirect-analytics"
```

## Documentation Standards

- Comment complex algorithms (rule matching, capture group replacement)
- Explain "why" in comments, not "what" (code is self-explanatory)
- Use JSDoc for exported functions (parameters, returns, throws)
- Keep comments up-to-date with code changes

### Example

```typescript
/**
 * Matches a request URL against enabled redirect rules sorted by priority.
 * @param request - The incoming HTTP request
 * @param rules - Array of rules, any order (will be sorted internally)
 * @returns MatchResult with rule and target URL, or null if no match
 */
export function matchAllRules(
  request: Request,
  rules: RedirectRule[],
): MatchResult | null {
  // Implementation
}
```

## Breaking Changes & Versioning

- Increment version in `package.json` when making API changes
- Document breaking changes in CHANGELOG or deployment guide
- Maintain backward compatibility where possible
- Use feature flags for gradual rollouts
