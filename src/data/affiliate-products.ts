export type AffiliateProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  poolSize: { min: number; max: number }; // gallons
  flowRate: number; // GPM
  energyStar: boolean;
  amazonUrl: string;
  homeDepotUrl?: string;
  imageUrl: string;
  estimatedSavings: number; // annual $ savings
  description: string;
};

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'pentair-superflo-vs',
    name: 'Pentair SuperFlo VS Variable Speed Pump',
    brand: 'Pentair',
    price: 849,
    rating: 4.7,
    poolSize: { min: 10000, max: 30000 },
    flowRate: 230,
    energyStar: true,
    amazonUrl: `https://amazon.com/dp/B00PNJKMUQ?tag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'poolcalc-20'}`,
    homeDepotUrl: 'https://www.homedepot.com/p/Pentair-SuperFlo-VS-Variable-Speed-Pool-Pump-342001/312504477',
    imageUrl: '/images/products/pentair-superflo.jpg',
    estimatedSavings: 1200,
    description: 'Best value for medium-sized pools. Whisper-quiet operation and 90% energy reduction.',
  },
  {
    id: 'hayward-tristar-vs',
    name: 'Hayward TriStar VS Variable Speed Pump',
    brand: 'Hayward',
    price: 1099,
    rating: 4.8,
    poolSize: { min: 15000, max: 40000 },
    flowRate: 280,
    energyStar: true,
    amazonUrl: `https://amazon.com/dp/B00GAFMTZ2?tag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'poolcalc-20'}`,
    imageUrl: '/images/products/hayward-tristar.jpg',
    estimatedSavings: 1400,
    description: 'Premium choice for larger pools. Ultra-efficient and virtually silent.',
  },
  {
    id: 'intex-variable-speed',
    name: 'Intex Variable Speed Pump',
    brand: 'Intex',
    price: 449,
    rating: 4.3,
    poolSize: { min: 5000, max: 15000 },
    flowRate: 150,
    energyStar: false,
    amazonUrl: `https://amazon.com/dp/B08XXXXX?tag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'poolcalc-20'}`,
    imageUrl: '/images/products/intex-variable.jpg',
    estimatedSavings: 600,
    description: 'Budget-friendly option for smaller pools. Good for above-ground pools.',
  },
  {
    id: 'pentair-intelliflo-vs3050',
    name: 'Pentair IntelliFlo VS+SVRS Variable Speed Pump',
    brand: 'Pentair',
    price: 1299,
    rating: 4.9,
    poolSize: { min: 20000, max: 50000 },
    flowRate: 300,
    energyStar: true,
    amazonUrl: `https://amazon.com/dp/B07YZ2XYYY?tag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'poolcalc-20'}`,
    homeDepotUrl: 'https://www.homedepot.com/p/Pentair-IntelliFlo-VS-SVRS-Variable-Speed-Pool-Pump-011057/312504478',
    imageUrl: '/images/products/pentair-intelliflo.jpg',
    estimatedSavings: 1600,
    description: 'Top-tier performance for large pools. Advanced safety features and maximum efficiency.',
  },
  {
    id: 'harris-proforce-vs',
    name: 'Harris ProForce VS Variable Speed Pump',
    brand: 'Harris',
    price: 649,
    rating: 4.5,
    poolSize: { min: 8000, max: 25000 },
    flowRate: 200,
    energyStar: true,
    amazonUrl: `https://amazon.com/dp/B09XXXXX?tag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'poolcalc-20'}`,
    imageUrl: '/images/products/harris-proforce.jpg',
    estimatedSavings: 900,
    description: 'Great mid-range option with excellent energy savings and reliable performance.',
  },
];

export const getRecommendedPumps = (poolVolume: number, _currentCost: number): AffiliateProduct[] => {
  return AFFILIATE_PRODUCTS
    .filter(product =>
      poolVolume >= product.poolSize.min
      && poolVolume <= product.poolSize.max,
    )
    .sort((a, b) => {
      // Prioritize by potential savings
      return b.estimatedSavings - a.estimatedSavings;
    })
    .slice(0, 3); // Top 3 recommendations
};

export const trackAffiliateClick = async (productId: string, userId?: number) => {
  try {
    await fetch('/api/analytics/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId }),
    });
  } catch (error) {
    console.error('Failed to track affiliate click:', error);
  }
};
