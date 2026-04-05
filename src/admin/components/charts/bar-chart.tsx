import { useRef, useEffect } from "preact/hooks"
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js"

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

interface BarChartProps {
  labels: string[]
  data: number[]
  color?: string
}

export function BarChart({ labels, data, color = "#2563eb" }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      // Update existing chart instead of destroying and recreating
      chartRef.current.data.labels = labels
      chartRef.current.data.datasets[0].data = data
      chartRef.current.data.datasets[0].backgroundColor = color
      chartRef.current.update()
      return
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ data, backgroundColor: color, borderRadius: 4 }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { display: false }, ticks: { precision: 0 } },
          y: { grid: { display: false } },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [labels, data, color])

  return <canvas ref={canvasRef} class="h-64 w-full" />
}
