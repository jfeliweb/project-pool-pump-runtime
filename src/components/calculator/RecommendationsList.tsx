import { Card } from '@/components/ui/Card';

export type RecommendationsListProps = {
  recommendations: string[];
};

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Personalized Recommendations</h3>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={rec}
            className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {index + 1}
            </div>
            <p className="text-sm text-blue-900">{rec}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
