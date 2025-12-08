import type { PoolSpecs } from '@/types/calculator';

/**
 * Calculate pool volume in gallons based on dimensions and shape
 */
export function calculatePoolVolume(specs: PoolSpecs): number {
  const avgDepth = (specs.depth.shallow + specs.depth.deep) / 2;

  let volume: number;

  switch (specs.shape) {
    case 'rectangular':
      // Rectangular: length × width × avgDepth × 7.5
      volume = specs.length * specs.width * avgDepth * 7.5;
      break;

    case 'oval':
      // Oval: π/4 × length × width × avgDepth × 7.5
      volume = (Math.PI / 4) * specs.length * specs.width * avgDepth * 7.5;
      break;

    case 'round': {
      // Round: π × (diameter/2)² × avgDepth × 7.5
      const radius = specs.length / 2;
      volume = Math.PI * radius * radius * avgDepth * 7.5;
      break;
    }

    case 'kidney':
    case 'freeform':
      // Approximate as 0.85 of rectangular for irregular shapes
      volume = specs.length * specs.width * avgDepth * 7.5 * 0.85;
      break;

    default:
      volume = specs.length * specs.width * avgDepth * 7.5;
  }

  // Adjust for pool type
  if (specs.type === 'above-ground') {
    // Above-ground pools typically have more consistent depth
    volume = specs.length * specs.width * specs.depth.deep * 7.5;

    // For round above-ground pools
    if (specs.shape === 'round') {
      const radius = specs.length / 2;
      volume = Math.PI * radius * radius * specs.depth.deep * 7.5;
    }
  }

  return Math.round(volume);
}

/**
 * Calculate pool surface area in square feet
 */
export function calculateSurfaceArea(specs: PoolSpecs): number {
  let area: number;

  switch (specs.shape) {
    case 'rectangular':
      area = specs.length * specs.width;
      break;

    case 'oval':
      area = (Math.PI / 4) * specs.length * specs.width;
      break;

    case 'round': {
      const radius = specs.length / 2;
      area = Math.PI * radius * radius;
      break;
    }

    case 'kidney':
    case 'freeform':
      area = specs.length * specs.width * 0.85;
      break;

    default:
      area = specs.length * specs.width;
  }

  return Math.round(area);
}
