'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export type UsageLineChartProps = {
  data: number[]; // Monthly kWh values for 12 months
  labels?: string[];
};

export function UsageLineChart({ data, labels }: UsageLineChartProps) {
  const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = {
    labels: labels || defaultLabels,
    datasets: [
      {
        label: 'kWh Usage',
        data,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(1)} kWh`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
          callback(value: any) {
            return `${value} kWh`;
          },
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
