import type { RedirectRule, DomainConfig } from '../types'

export async function getRulesForDomain(
  kv: KVNamespace,
  domain: string,
): Promise<RedirectRule[]> {
  const data = await kv.get(`rules:${domain}`, 'json')
  return (data as RedirectRule[]) ?? []
}

export async function setRulesForDomain(
  kv: KVNamespace,
  domain: string,
  rules: RedirectRule[],
): Promise<void> {
  await kv.put(`rules:${domain}`, JSON.stringify(rules))
}

export async function getDomains(kv: KVNamespace): Promise<string[]> {
  const data = await kv.get('domains', 'json')
  return (data as string[]) ?? []
}

export async function setDomains(
  kv: KVNamespace,
  domains: string[],
): Promise<void> {
  await kv.put('domains', JSON.stringify(domains))
}

export async function getDomainConfig(
  kv: KVNamespace,
  domain: string,
): Promise<DomainConfig | null> {
  return await kv.get(`config:${domain}`, 'json')
}

export async function setDomainConfig(
  kv: KVNamespace,
  domain: string,
  config: DomainConfig,
): Promise<void> {
  await kv.put(`config:${domain}`, JSON.stringify(config))
}
