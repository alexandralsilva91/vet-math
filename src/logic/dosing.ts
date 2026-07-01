import type { Dosage } from '../types';

export interface CalculatedDoseRange {
  min: number; // Total minimum dose in local unit (e.g., 50 ug)
  max: number; // Total maximum dose in local unit
  unit: 'mg' | 'ug' | 'ml';
  minInMg: number; // Standardized minimum dose in milligrams (e.g., 0.05 mg)
  maxInMg: number; // Standardized maximum dose in milligrams
}

/**
 * Calculates the total dose range for a given animal weight and dosage instructions.
 * Converts microgram (ug) inputs to milligrams (mg) for safety verification.
 */
export function calculateDoseRange(weight: number, dosage: Dosage): CalculatedDoseRange {
  if (weight <= 0) {
    throw new Error('Weight must be greater than 0');
  }

  const rawMin = weight * dosage.min_mg_kg;
  const rawMax = weight * dosage.max_mg_kg;

  let unit: 'mg' | 'ug' | 'ml';
  let minInMg: number;
  let maxInMg: number;

  switch (dosage.unit) {
    case 'ug/kg':
      unit = 'ug';
      minInMg = rawMin / 1000;
      maxInMg = rawMax / 1000;
      break;
    case 'ml/kg':
      unit = 'ml';
      // ml cannot be directly converted to mg without density; keep as 0 or equal to ml for simplicity
      minInMg = rawMin;
      maxInMg = rawMax;
      break;
    case 'mg/kg':
    default:
      unit = 'mg';
      minInMg = rawMin;
      maxInMg = rawMax;
      break;
  }

  // To prevent floating point rounding issues (e.g., 0.010000000000000002), round to 4 decimal places
  const roundToFourDecimals = (num: number) => Math.round((num + Number.EPSILON) * 10000) / 10000;

  return {
    min: roundToFourDecimals(rawMin),
    max: roundToFourDecimals(rawMax),
    unit,
    minInMg: roundToFourDecimals(minInMg),
    maxInMg: roundToFourDecimals(maxInMg),
  };
}
