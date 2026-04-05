import { useRef, useEffect } from "preact/hooks"
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js"

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const COLORS = [
  "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe",
  "#ea580c", "#f97316", "#fb923c", "#fdba74", "#94a3b8",
]

interface DoughnutChartProps {
  labels: string[]
  data: number[]
}

export function DoughnutChart({ labels, data }: DoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.data.labels = labels
      chartRef.current.data.datasets[0].data = data
      chartRef.current.data.datasets[0].backgroundColor = COLORS.slice(0, labels.length)
      chartRef.current.update()
      return
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: COLORS.slice(0, labels.length),
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [labels, data])

  return <canvas ref={canvasRef} class="h-64 w-full" />
}
