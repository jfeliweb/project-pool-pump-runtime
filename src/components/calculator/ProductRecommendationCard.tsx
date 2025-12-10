'use client';

import type { AffiliateProduct } from '@/data/affiliate-products';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { trackAffiliateClick } from '@/data/affiliate-products';

export type ProductRecommendationCardProps = {
  product: AffiliateProduct;
  userId?: number;
};

export const ProductRecommendationCard = ({ product, userId }: ProductRecommendationCardProps) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleAffiliateClick = async (url: string, productId: string) => {
    if (!isTracking) {
      setIsTracking(true);
      await trackAffiliateClick(productId, userId);
      setIsTracking(false);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (event: React.KeyboardEvent, url: string, productId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAffiliateClick(url, productId);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <div className="flex-1 space-y-4">
        {/* Product Image Placeholder */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex h-full items-center justify-center">
            <svg
              className="size-20 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {product.energyStar && (
            <div className="absolute top-2 right-2 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              ENERGY STAR
            </div>
          )}
        </div>

        {/* Brand and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{product.brand}</span>
          <div className="flex items-center gap-1">
            <svg className="size-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <h4 className="text-lg leading-tight font-semibold text-gray-900">
          {product.name}
        </h4>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-blue-50 p-3">
          <div>
            <p className="text-xs text-blue-600">Flow Rate</p>
            <p className="font-semibold text-blue-900">
              {product.flowRate}
              {' '}
              GPM
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-600">Pool Size</p>
            <p className="font-semibold text-blue-900">
              {(product.poolSize.min / 1000).toFixed(0)}
              K-
              {(product.poolSize.max / 1000).toFixed(0)}
              K gal
            </p>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-center">
          <p className="text-xs font-medium text-green-100">Estimated Annual Savings</p>
          <p className="text-2xl font-bold text-white">
            $
            {product.estimatedSavings.toLocaleString()}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            $
            {product.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => handleAffiliateClick(product.amazonUrl, product.id)}
          onKeyDown={e => handleKeyDown(e, product.amazonUrl, product.id)}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          aria-label={`View ${product.name} on Amazon`}
          tabIndex={0}
        >
          View on Amazon
        </button>

        {product.homeDepotUrl && (
          <button
            type="button"
            onClick={() => handleAffiliateClick(product.homeDepotUrl!, product.id)}
            onKeyDown={e => handleKeyDown(e, product.homeDepotUrl!, product.id)}
            className="w-full rounded-lg border-2 border-orange-500 bg-white px-6 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none"
            aria-label={`View ${product.name} on Home Depot`}
            tabIndex={0}
          >
            View on Home Depot
          </button>
        )}
      </div>
    </Card>
  );
};
