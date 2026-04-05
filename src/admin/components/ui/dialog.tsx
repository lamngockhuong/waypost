import { Dialog as HDialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react"
import type { ComponentChildren } from "preact"
import { X } from "lucide-preact"

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ComponentChildren
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  return (
    <HDialog open={open} onClose={onClose} class="relative z-50">
      <DialogBackdrop class="fixed inset-0 bg-black/30 transition-opacity duration-150 data-closed:opacity-0" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl transition-all duration-200 data-closed:scale-95 data-closed:opacity-0">
          {title && (
            <div class="mb-4 flex items-center justify-between">
              <DialogTitle class="text-lg font-semibold text-slate-900">{title}</DialogTitle>
              <button
                type="button"
                onClick={onClose}
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close dialog"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          )}
          {children}
        </DialogPanel>
      </div>
    </HDialog>
  )
}
