import type { JSX } from "preact"

interface InputProps {
  label?: string
  error?: string
  class?: string
  id?: string
  placeholder?: string
  value?: string | number
  disabled?: boolean
  autofocus?: boolean
  type?: string
  name?: string
  required?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  onInput?: JSX.GenericEventHandler<HTMLInputElement>
  onChange?: JSX.GenericEventHandler<HTMLInputElement>
}

export function Input({ label, error, class: cls = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
  return (
    <div class="space-y-1">
      {label && (
        <label for={inputId} class="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        class={`block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 ${
          error ? "border-destructive" : ""
        } ${cls}`}
        {...props}
      />
      {error && <p class="text-xs text-destructive" role="alert">{error}</p>}
    </div>
  )
}

interface TextareaProps {
  label?: string
  error?: string
  class?: string
  id?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  rows?: number
  name?: string
  onInput?: JSX.GenericEventHandler<HTMLTextAreaElement>
  onChange?: JSX.GenericEventHandler<HTMLTextAreaElement>
}

export function Textarea({ label, error, class: cls = "", id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
  return (
    <div class="space-y-1">
      {label && (
        <label for={inputId} class="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        class={`block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 ${
          error ? "border-destructive" : ""
        } ${cls}`}
        {...props}
      />
      {error && <p class="text-xs text-destructive" role="alert">{error}</p>}
    </div>
  )
}
