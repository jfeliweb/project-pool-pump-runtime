import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export type RuntimeMetricCardProps = {
  optimalRuntime: number;
  currentRuntime: number;
  percentReduction: number;
};

export function RuntimeMetricCard({
  optimalRuntime,
  currentRuntime,
  percentReduction,
}: RuntimeMetricCardProps) {
  return (
    <Card>
      <div className="text-center">
        <Badge variant="optimized" className="mb-4">
          Optimal for Pool Health & Efficiency
        </Badge>

        <div className="mb-2">
          <div className="text-6xl font-bold text-blue-600">
            {optimalRuntime.toFixed(1)}
          </div>
          <div className="text-lg font-medium text-gray-600">
            hours/day
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3">
          <div className="text-sm font-medium text-green-800">
            {percentReduction.toFixed(1)}
            % reduction from current
          </div>
          <div className="text-xs text-green-600">
            Currently running
            {' '}
            {currentRuntime}
            {' '}
            hours/day
          </div>
        </div>
      </div>
    </Card>
  );
}
