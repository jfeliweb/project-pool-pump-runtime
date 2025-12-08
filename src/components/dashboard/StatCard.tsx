import { Card } from '@/components/ui/Card';

export type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
};

export function StatCard({
  label,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  badge,
  badgeColor = 'text-green-600',
}: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {badge && (
            <p className={`mt-2 text-xs font-semibold ${badgeColor}`}>{badge}</p>
          )}
        </div>
        <div className={`rounded-lg ${iconBgColor} p-3`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}
