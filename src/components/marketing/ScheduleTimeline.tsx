'use client';

type TimeBlock = {
  start: number;
  end: number;
  type: 'on' | 'off' | 'peak' | 'offpeak';
  label: string;
};

type ScheduleTimelineProps = {
  traditional: TimeBlock[];
  optimized: TimeBlock[];
  touRates?: {
    peak: { start: number; end: number; rate: string };
    offpeak: { start: number; end: number; rate: string };
  };
};

export const ScheduleTimeline = ({
  traditional,
  optimized,
  touRates,
}: ScheduleTimelineProps) => {
  const renderTimeBlock = (block: TimeBlock, isOptimized: boolean) => {
    const width = ((block.end - block.start) / 24) * 100;
    const left = (block.start / 24) * 100;

    const colorMap = {
      on: isOptimized ? 'bg-green-500' : 'bg-red-500',
      off: 'bg-gray-200',
      peak: 'bg-yellow-400',
      offpeak: 'bg-blue-400',
    };

    return (
      <div
        key={`${block.start}-${block.end}`}
        className="absolute h-full rounded"
        style={{
          left: `${left}%`,
          width: `${width}%`,
        }}
      >
        <div className={`h-full ${colorMap[block.type]}`} />
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold text-gray-900">
        Optimized vs. Traditional Schedule
      </h3>

      {/* Traditional Schedule */}
      <div className="mb-6">
        <div className="mb-2 text-sm font-semibold text-gray-700">
          Traditional: Continuous 18+ hour runtime
        </div>
        <div className="relative h-12 w-full rounded bg-gray-100">
          {traditional.map(block => renderTimeBlock(block, false))}
        </div>
      </div>

      {/* Optimized Schedule */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">
          Optimized: Strategic 8-hour split runtime
        </div>
        <div className="relative h-12 w-full rounded bg-gray-100">
          {optimized.map(block => renderTimeBlock(block, true))}
        </div>
      </div>

      {/* TOU Rates Overlay */}
      {touRates && (
        <div className="mt-4 flex gap-4 text-xs text-gray-600">
          <div>
            <span className="mr-2 inline-block size-3 rounded bg-yellow-400" />
            Peak:
            {' '}
            {touRates.peak.rate}
          </div>
          <div>
            <span className="mr-2 inline-block size-3 rounded bg-blue-400" />
            Off-Peak:
            {' '}
            {touRates.offpeak.rate}
          </div>
        </div>
      )}
    </div>
  );
};
