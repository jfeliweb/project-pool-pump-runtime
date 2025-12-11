'use client';

import { getRecommendedPumps } from '@/data/affiliate-products';
import { ProductRecommendationCard } from './ProductRecommendationCard';

export type ProductRecommendationsProps = {
  poolVolume: number;
  currentAnnualCost: number;
  userId?: number;
};

export const ProductRecommendations = ({
  poolVolume,
  currentAnnualCost,
  userId,
}: ProductRecommendationsProps) => {
  const recommendedPumps = getRecommendedPumps(poolVolume, currentAnnualCost);

  if (recommendedPumps.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended Variable-Speed Pumps
        </h2>
        <p className="text-gray-600">
          Upgrade to one of these energy-efficient pumps and start saving money on your electricity bills.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6">
        {recommendedPumps.map(product => (
          <ProductRecommendationCard
            key={product.id}
            product={product}
            userId={userId}
          />
        ))}
      </div>

      {/* FTC Disclosure */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-xs text-gray-600">
          <strong>Affiliate Disclosure:</strong>
          {' '}
          We earn from qualifying purchases made through links on this page.
          {' '}
          This helps us keep our calculator free while providing you with trusted product recommendations.
        </p>
      </div>
    </section>
  );
};
