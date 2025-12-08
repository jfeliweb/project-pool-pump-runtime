// Pool Pump Calculator Types

export type PoolSpecs = {
  length: number;
  width: number;
  depth: {
    shallow: number;
    deep: number;
  };
  shape: 'rectangular' | 'kidney' | 'freeform' | 'oval' | 'round';
  type: 'in-ground' | 'above-ground';
  surfaceArea?: number;
};

export type PumpSpecs = {
  type: 'single-speed' | 'two-speed' | 'variable-speed';
  horsepower: 0.5 | 0.75 | 1.0 | 1.5 | 2.0 | 2.5 | 3.0;
  ageYears: number;
  variableSpeedSettings?: {
    lowRPM: number;
    mediumRPM: number;
    highRPM: number;
  };
  twoSpeedSettings?: {
    lowHP: number;
    highHP: number;
  };
  flowRateGPM?: number;
};

export type LocationData = {
  zipCode: string;
  state: string;
  city: string;
  climateZone: 'hot-humid' | 'hot-dry' | 'mixed-humid' | 'mixed-dry' | 'cold' | 'very-cold' | 'marine';
  latitude: number;
  longitude: number;
  avgTemperatures: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
  avgSunlightHours: {
    winter: number;
    spring: number;
    summer: number;
    fall: number;
  };
};

export type UsageFactors = {
  usageLevel: 'light' | 'moderate' | 'heavy';
  averageSwimmers: number;
  landscaping: 'minimal' | 'moderate' | 'heavy';
  screenEnclosure: boolean;
  hasWaterfall: boolean;
  hasHeater: boolean;
  hasSaltSystem: boolean;
  waterClarity: 'crystal-clear' | 'slightly-cloudy' | 'cloudy';
};

export type EnergyCostData = {
  electricityRate: number;
  hasTimeOfUsePricing: boolean;
  timeOfUseRates?: {
    peakRate: number;
    offPeakRate: number;
    peakHours: Array<{ start: number; end: number }>;
  };
  currentDailyRuntime: number;
};

export type ScheduleBlock = {
  startHour: number;
  endHour: number;
  speedSetting?: 'low' | 'medium' | 'high';
};

export type EnergyCosts = {
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
};

export type SavingsResult = {
  currentCosts: EnergyCosts;
  optimizedCosts: EnergyCosts;
  savings: {
    dailySavings: number;
    monthlySavings: number;
    annualSavings: number;
    dailyKwhSaved: number;
    monthlyKwhSaved: number;
    annualKwhSaved: number;
    percentReduction: number;
  };
  roiMetrics?: {
    variableSpeedUpgradeCost: number;
    paybackMonths: number;
    fiveYearSavings: number;
  };
};

export type CalculationResult = {
  poolVolume: number;
  pumpFlowRate: number;
  requiredTurnovers: number;
  optimalRuntime: number;
  schedule: ScheduleBlock[];
  costs: SavingsResult;
  recommendations: string[];
};

export type CalculatorInput = {
  poolSpecs: PoolSpecs;
  pumpSpecs: PumpSpecs;
  locationData: LocationData;
  usageFactors: UsageFactors;
  energyCostData: EnergyCostData;
};
