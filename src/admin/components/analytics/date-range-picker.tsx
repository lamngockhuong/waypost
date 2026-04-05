import { Button } from "../ui/button"

interface DateRangePickerProps {
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onPreset: (days: number) => void
  activePreset: number | null
}

const presets = [
  { days: 7, label: "7d" },
  { days: 30, label: "30d" },
  { days: 90, label: "90d" },
]

export function DateRangePicker({ from, to, onFromChange, onToChange, onPreset, activePreset }: DateRangePickerProps) {
  return (
    <div class="flex flex-wrap items-center gap-2">
      {/* Preset buttons */}
      {presets.map((p) => (
        <Button
          key={p.days}
          variant={activePreset === p.days ? "primary" : "outline"}
          size="sm"
          onClick={() => onPreset(p.days)}
        >
          {p.label}
        </Button>
      ))}

      {/* Custom date inputs */}
      <div class="flex items-center gap-1.5 text-sm">
        <input
          type="date"
          class="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
          value={from}
          onChange={(e) => onFromChange((e.target as HTMLInputElement).value)}
        />
        <span class="text-slate-400">to</span>
        <input
          type="date"
          class="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
          value={to}
          onChange={(e) => onToChange((e.target as HTMLInputElement).value)}
        />
      </div>
    </div>
  )
}
