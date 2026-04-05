import { useLocation, Link } from "wouter"
import { Globe, LayoutDashboard } from "lucide-preact"

const navItems = [
  { href: "/admin/", icon: LayoutDashboard, label: "Domains" },
]

export function Sidebar() {
  const [location] = useLocation()

  return (
    <aside class="fixed left-0 top-0 z-30 flex h-dvh flex-col border-r border-border bg-surface max-md:hidden md:w-16 lg:w-60 transition-[width] duration-200">
      {/* Logo */}
      <Link href="/admin/" class="flex h-14 items-center gap-2 border-b border-border px-4">
        <Globe class="h-6 w-6 shrink-0 text-primary" />
        <span class="text-lg font-bold font-mono text-primary max-lg:hidden">Waypost</span>
      </Link>

      {/* Navigation */}
      <nav class="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/admin/" && location.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              class={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon class="h-5 w-5 shrink-0" />
              <span class="max-lg:hidden">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
