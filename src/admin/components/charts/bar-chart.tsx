import { useRef, useEffect } from "preact/hooks"
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js"
import { getCssVar } from "../../lib/theme"

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

interface BarChartProps {
  labels: string[]
  data: number[]
  color?: string
}

export function BarChart({ labels, data, color }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const barColor = color || getCssVar("--color-primary", "#7c3aed")
    const textColor = getCssVar("--color-muted-fg", "#8b8598")
    const gridColor = getCssVar("--color-border", "#e5e2f0")

    if (chartRef.current) {
      chartRef.current.data.labels = labels
      chartRef.current.data.datasets[0].data = data
      chartRef.current.data.datasets[0].backgroundColor = barColor
      chartRef.current.update()
      return
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ data, backgroundColor: barColor, borderRadius: 4 }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { precision: 0, color: textColor } },
          y: { grid: { display: false }, ticks: { color: textColor } },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [labels, data, color])

  return <canvas ref={canvasRef} class="h-64 w-full" />
}
