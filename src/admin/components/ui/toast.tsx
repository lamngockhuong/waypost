import { useState, useEffect, useCallback } from "preact/hooks"
import { CheckCircle, AlertCircle, X } from "lucide-preact"

type ToastType = "success" | "error"

interface Toast {
  id: number
  message: string
  type: ToastType
}

let addToast: (message: string, type: ToastType) => void = () => {}

/** Show a toast notification */
export function toast(message: string, type: ToastType = "success") {
  addToast(message, type)
}

/** Toast container — mount once in app root */
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          class={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-slide-in-right ${
            t.type === "success" ? "bg-success" : "bg-destructive"
          }`}
          role="alert"
        >
          {t.type === "success" ? <CheckCircle class="h-4 w-4" /> : <AlertCircle class="h-4 w-4" />}
          <span class="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            class="ml-2 flex h-5 w-5 items-center justify-center rounded hover:bg-white/20"
            aria-label="Dismiss"
          >
            <X class="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
