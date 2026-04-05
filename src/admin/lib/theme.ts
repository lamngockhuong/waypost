/** Read a CSS custom property from :root, with fallback */
export function getCssVar(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}
