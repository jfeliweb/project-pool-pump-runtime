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

export type SavingsAreaChartProps = {
  monthlySavings: number;
  months?: number;
};

export function SavingsAreaChart({ monthlySavings, months = 12 }: SavingsAreaChartProps) {
  // Calculate cumulative savings
  const cumulativeSavings = Array.from({ length: months }, (_, i) => monthlySavings * (i + 1));
  const labels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cumulative Savings',
        data: cumulativeSavings,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
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
          label: (context: any) => {
            return `Total Saved: $${context.parsed.y.toFixed(2)}`;
          },
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
          callback(_value: any, index: number, ticks: any[]) {
            // Show every 2 months for clarity
            return index % 2 === 0 ? ticks[index].label : '';
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
            return `$${value}`;
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
