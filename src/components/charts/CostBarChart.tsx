'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export type CostBarChartProps = {
  currentCost: number;
  optimizedCost: number;
  period?: 'daily' | 'monthly' | 'annual';
};

export function CostBarChart({
  currentCost,
  optimizedCost,
  period = 'monthly',
}: CostBarChartProps) {
  const periodLabels = {
    daily: 'Daily Cost',
    monthly: 'Monthly Cost',
    annual: 'Annual Cost',
  };

  const chartData = {
    labels: ['Current', 'Optimized'],
    datasets: [
      {
        label: periodLabels[period],
        data: [currentCost, optimizedCost],
        backgroundColor: ['#EF4444', '#10B981'],
        borderRadius: 8,
        barThickness: 60,
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
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 13,
            weight: 600 as any,
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
      <Bar data={chartData} options={options} />
    </div>
  );
}
