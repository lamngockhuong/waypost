import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react"
import { X } from "lucide-preact"
import { RuleForm } from "./rule-form"
import type { RedirectRule, RuleFormData } from "../../lib/types"

interface RulePanelProps {
  open: boolean
  rule?: RedirectRule | null
  onClose: () => void
  onSubmit: (data: RuleFormData) => Promise<void>
}

export function RulePanel({ open, rule, onClose, onSubmit }: RulePanelProps) {
  const title = rule ? "Edit Rule" : "Add Rule"

  return (
    <Dialog open={open} onClose={onClose} class="relative z-50">
      <DialogBackdrop class="fixed inset-0 bg-black/30 transition-opacity duration-150 data-closed:opacity-0" />

      {/* Desktop: slide-over from right. Mobile: full-screen from bottom */}
      <div class="fixed inset-0 flex justify-end max-md:items-end max-md:justify-stretch">
        <DialogPanel class="h-full w-full overflow-y-auto bg-surface shadow-xl transition-all duration-250 md:max-w-[480px] data-closed:max-md:translate-y-full data-closed:md:translate-x-full">
          <div class="flex h-14 items-center justify-between border-b border-border px-4">
            <DialogTitle class="text-lg font-semibold">{title}</DialogTitle>
            <button
              type="button"
              onClick={onClose}
              class="flex h-8 w-8 items-center justify-center rounded-lg text-placeholder hover:bg-muted"
              aria-label="Close panel"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <div class="p-4">
            <RuleForm rule={rule} onSubmit={onSubmit} onCancel={onClose} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
