'use client';

import type { ScheduleBlock } from '@/types/calculator';
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

export type ScheduleTimelineProps = {
  schedule: ScheduleBlock[];
  peakHours?: Array<{ start: number; end: number }>;
};

export function ScheduleTimeline({ schedule, peakHours }: ScheduleTimelineProps) {
  // Create 24-hour timeline data
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data = hours.map((hour) => {
    const block = schedule.find(b => hour >= b.startHour && hour < b.endHour);
    return block ? 1 : 0;
  });

  // Determine speed settings for each hour
  const speedSettings = hours.map((hour) => {
    const block = schedule.find(b => hour >= b.startHour && hour < b.endHour);
    return block?.speedSetting || null;
  });

  // Determine if hour is in peak period
  const isPeakHour = hours.map((hour) => {
    if (!peakHours) {
      return false;
    }
    return peakHours.some(peak => hour >= peak.start && hour < peak.end);
  });

  const chartData = {
    labels: hours.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Pump Running',
        data,
        backgroundColor: hours.map((_hour, idx) => {
          if (!data[idx]) {
            return 'rgba(229, 231, 235, 0.5)';
          } // Off - gray

          const speed = speedSettings[idx];
          if (speed === 'low') {
            return '#10B981';
          } // Green
          if (speed === 'medium') {
            return '#3B82F6';
          } // Blue
          if (speed === 'high') {
            return '#2563EB';
          } // Darker blue

          return '#2563EB'; // Default blue
        }),
        borderRadius: 2,
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
            const hour = context.dataIndex;
            const running = data[hour];
            if (!running) {
              return 'Pump Off';
            }

            const speed = speedSettings[hour];
            const speedLabel = speed ? ` (${speed} speed)` : '';
            const peakLabel = isPeakHour[hour] ? ' - Peak Hours' : '';

            return `Pump On${speedLabel}${peakLabel}`;
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
          callback(_value: any, index: number, ticks: any[]) {
            // Show every 3 hours
            return index % 3 === 0 ? ticks[index].label : '';
          },
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: false,
        max: 1,
      },
    },
  };

  return (
    <div className="h-32 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
