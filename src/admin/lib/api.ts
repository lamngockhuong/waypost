export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

/** Typed fetch wrapper for /api/* endpoints */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body) headers["Content-Type"] = "application/json"

  const res = await fetch("/api" + path, {
    ...options,
    headers: { ...headers, ...options.headers },
    body: options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new ApiError(res.status, text || res.statusText)
  }

  // Handle empty/non-JSON responses (204, etc.)
  if (res.status === 204) return null as T
  const contentType = res.headers.get("content-type")
  if (!contentType?.includes("application/json")) return null as T
  return res.json() as Promise<T>
}

/** Extract user-friendly error message from caught errors */
export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback
}
