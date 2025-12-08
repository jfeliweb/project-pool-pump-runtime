import type { EnergyCostData, ScheduleBlock } from '@/types/calculator';
import { ScheduleTimeline } from '@/components/charts/ScheduleTimeline';
import { Card } from '@/components/ui/Card';

export type ScheduleVisualizationProps = {
  schedule: ScheduleBlock[];
  energyData: EnergyCostData;
};

export function ScheduleVisualization({ schedule, energyData }: ScheduleVisualizationProps) {
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Optimized 24-Hour Schedule</h3>

      <ScheduleTimeline
        schedule={schedule}
        peakHours={energyData.hasTimeOfUsePricing ? energyData.timeOfUseRates?.peakHours : undefined}
      />

      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Schedule Details</h4>
        {schedule.map((block, index) => (
          <div
            key={`${block.startHour}-${block.endHour}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div>
              <div className="text-sm font-medium text-gray-900">
                Block
                {' '}
                {index + 1}
                {block.speedSetting && (
                  <span className="ml-2 text-xs text-blue-600">
                    (
                    {block.speedSetting}
                    {' '}
                    speed)
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {formatTime(block.startHour)}
                {' '}
                -
                {formatTime(block.endHour)}
              </div>
            </div>
            <div className="text-sm font-semibold text-blue-600">
              {(block.endHour - block.startHour).toFixed(1)}
              {' '}
              hrs
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-blue-600" />
          <span className="text-gray-600">Pump On</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-gray-300" />
          <span className="text-gray-600">Pump Off</span>
        </div>
        {energyData.hasTimeOfUsePricing && (
          <div className="flex items-center gap-2">
            <div className="size-3 rounded border-2 border-amber-500" />
            <span className="text-gray-600">Peak Hours</span>
          </div>
        )}
      </div>
    </Card>
  );
}
