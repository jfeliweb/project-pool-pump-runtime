import type { CalculationResult, EnergyCostData } from '@/types/calculator';
import type { CalculatorInput } from '@/validations/calculator';

/**
 * Storage key for temporary calculation data
 */
const STORAGE_KEY = 'poolcalc_pending_calculation';

/**
 * Type for stored calculation data
 */
export type StoredCalculation = {
  formData: CalculatorInput;
  results: CalculationResult;
  energyData: EnergyCostData;
  currentRuntime: number;
  timestamp: number;
  action: 'save' | 'download';
};

/**
 * Stores calculation data temporarily in localStorage
 * Used to preserve data across authentication flow
 */
export const storeCalculation = (
  formData: CalculatorInput,
  results: CalculationResult,
  energyData: EnergyCostData,
  currentRuntime: number,
  action: 'save' | 'download',
): void => {
  try {
    const data: StoredCalculation = {
      formData,
      results,
      energyData,
      currentRuntime,
      timestamp: Date.now(),
      action,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store calculation data:', error);
  }
};

/**
 * Clears stored calculation data from localStorage
 */
export const clearStoredCalculation = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear stored calculation data:', error);
  }
};

/**
 * Retrieves stored calculation data from localStorage
 * Returns null if no data exists or if data is expired (> 1 hour old)
 */
export const getStoredCalculation = (): StoredCalculation | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: StoredCalculation = JSON.parse(stored);

    // Check if data is expired (older than 1 hour)
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - data.timestamp > oneHour) {
      clearStoredCalculation();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to retrieve stored calculation data:', error);
    return null;
  }
};

/**
 * Checks if there is a stored calculation
 */
export const hasStoredCalculation = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check stored calculation data:', error);
    return false;
  }
};
