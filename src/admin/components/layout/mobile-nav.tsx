import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react"
import { useLocation, Link } from "wouter"
import { Globe, LayoutDashboard, Menu, X } from "lucide-preact"
import { useState } from "preact/hooks"

const navItems = [
  { href: "/admin/", icon: LayoutDashboard, label: "Domains" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [location] = useLocation()

  return (
    <>
      {/* Sticky mobile header */}
      <header class="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-surface px-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu class="h-5 w-5" />
        </button>
        <Link href="/admin/" class="flex items-center gap-2">
          <Globe class="h-5 w-5 text-primary" />
          <span class="text-lg font-bold font-mono text-primary">Waypost</span>
        </Link>
      </header>

      {/* Slide-over dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} class="relative z-50 md:hidden">
        <DialogBackdrop class="fixed inset-0 bg-black/30 transition-opacity duration-150 data-closed:opacity-0" />
        <DialogPanel class="fixed inset-y-0 left-0 w-[280px] bg-surface shadow-xl transition-transform duration-250 data-closed:-translate-x-full">
          <div class="flex h-14 items-center justify-between border-b border-border px-4">
            <span class="flex items-center gap-2">
              <Globe class="h-5 w-5 text-primary" />
              <span class="text-lg font-bold font-mono text-primary">Waypost</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <nav class="space-y-1 p-2">
            {navItems.map((item) => {
              const isActive = location === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  class={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <item.icon class="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  )
}
