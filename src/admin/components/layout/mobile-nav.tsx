import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react"
import { useLocation, Link } from "wouter"
import { Menu, X } from "lucide-preact"
import { WaypostLogo } from "../icons/waypost-logo"
import { useState } from "preact/hooks"
import { navItems } from "../../lib/nav-items"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [location] = useLocation()

  return (
    <>
      {/* Sticky mobile header */}
      <header class="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-surface px-3 sm:px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
          aria-label="Open navigation"
        >
          <Menu class="h-5 w-5" />
        </button>
        <Link href="/" class="flex items-center gap-2">
          <WaypostLogo class="h-5 w-5 text-primary" />
          <span class="text-lg font-bold font-mono text-primary">Waypost</span>
        </Link>
      </header>

      {/* Slide-over dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} class="relative z-50 lg:hidden">
        <DialogBackdrop class="fixed inset-0 bg-black/30 transition-opacity duration-150 data-closed:opacity-0" />
        <DialogPanel class="fixed inset-y-0 left-0 w-[280px] bg-surface shadow-xl transition-transform duration-250 data-closed:-translate-x-full">
          <div class="flex h-14 items-center justify-between border-b border-border px-4">
            <span class="flex items-center gap-2">
              <WaypostLogo class="h-5 w-5 text-primary" />
              <span class="text-lg font-bold font-mono text-primary">Waypost</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
              aria-label="Close navigation"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <nav class="space-y-1 p-2">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  class={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-subtle hover:bg-muted hover:text-heading"
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
