import { z } from 'zod';

export const poolSpecsSchema = z.object({
  length: z.number().min(10, 'Pool length must be at least 10 feet').max(100, 'Pool length cannot exceed 100 feet'),
  width: z.number().min(5, 'Pool width must be at least 5 feet').max(50, 'Pool width cannot exceed 50 feet'),
  depth: z.object({
    shallow: z.number().min(2, 'Shallow end must be at least 2 feet').max(6, 'Shallow end cannot exceed 6 feet'),
    deep: z.number().min(4, 'Deep end must be at least 4 feet').max(12, 'Deep end cannot exceed 12 feet'),
  }),
  shape: z.enum(['rectangular', 'kidney', 'freeform', 'oval', 'round']),
  type: z.enum(['in-ground', 'above-ground']),
  surfaceArea: z.number().optional(),
});

export const pumpSpecsSchema = z.object({
  type: z.enum(['single-speed', 'two-speed', 'variable-speed']),
  horsepower: z.number().refine(val => [0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0].includes(val), {
    message: 'Horsepower must be 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, or 3.0',
  }),
  ageYears: z.number().min(0, 'Age cannot be negative').max(30, 'Age cannot exceed 30 years'),
  variableSpeedSettings: z.object({
    lowRPM: z.number().min(1000).max(2000),
    mediumRPM: z.number().min(2000).max(3000),
    highRPM: z.number().min(3000).max(3450),
  }).optional(),
  twoSpeedSettings: z.object({
    lowHP: z.number(),
    highHP: z.number(),
  }).optional(),
  flowRateGPM: z.number().optional(),
});

export const locationDataSchema = z.object({
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  state: z.string().length(2, 'State must be 2 characters'),
  city: z.string().min(1),
  climateZone: z.enum(['hot-humid', 'hot-dry', 'mixed-humid', 'mixed-dry', 'cold', 'very-cold', 'marine']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  avgTemperatures: z.object({
    jan: z.number(),
    feb: z.number(),
    mar: z.number(),
    apr: z.number(),
    may: z.number(),
    jun: z.number(),
    jul: z.number(),
    aug: z.number(),
    sep: z.number(),
    oct: z.number(),
    nov: z.number(),
    dec: z.number(),
  }),
  avgSunlightHours: z.object({
    winter: z.number().min(0).max(24),
    spring: z.number().min(0).max(24),
    summer: z.number().min(0).max(24),
    fall: z.number().min(0).max(24),
  }),
});

export const usageFactorsSchema = z.object({
  usageLevel: z.enum(['light', 'moderate', 'heavy']),
  averageSwimmers: z.number().min(0).max(20),
  landscaping: z.enum(['minimal', 'moderate', 'heavy']),
  screenEnclosure: z.boolean(),
  hasWaterfall: z.boolean(),
  hasHeater: z.boolean(),
  hasSaltSystem: z.boolean(),
  waterClarity: z.enum(['crystal-clear', 'slightly-cloudy', 'cloudy']),
});

export const energyCostDataSchema = z.object({
  electricityRate: z.number().min(0).max(1),
  hasTimeOfUsePricing: z.boolean(),
  timeOfUseRates: z.object({
    peakRate: z.number().min(0).max(1),
    offPeakRate: z.number().min(0).max(1),
    peakHours: z.array(z.object({
      start: z.number().min(0).max(23),
      end: z.number().min(0).max(23),
    })),
  }).optional(),
  currentDailyRuntime: z.number().min(1).max(24),
});

export const calculatorInputSchema = z.object({
  poolSpecs: poolSpecsSchema,
  pumpSpecs: pumpSpecsSchema,
  locationData: locationDataSchema,
  usageFactors: usageFactorsSchema,
  energyCostData: energyCostDataSchema,
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
