import { API_BASE_URL } from '../api/config';
import { calculateDoseRange } from '../logic/dosing';
import type { CalculatedDoseRange } from '../logic/dosing';
import type { VeterinaryDrug } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CalculationResult {
  drugName: string;
  species: 'canine' | 'feline';
  weight: number;
  calculation: CalculatedDoseRange;
  notes?: string;
  contraindications: string[];
}

// ─── Fetch Functions ──────────────────────────────────────────────────────────
// These are plain async functions — TanStack Query will call them as queryFn.

/**
 * Fetches all veterinary drugs from the JSON Server API.
 * Endpoint: GET /api/medicines
 */
export async function fetchAllDrugs(): Promise<VeterinaryDrug[]> {
  const response = await fetch(`${API_BASE_URL}/medicines`);

  if (!response.ok) {
    throw new Error(`Failed to fetch drugs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches a single veterinary drug by its numeric ID.
 * Endpoint: GET /api/medicines/:id
 */
export async function fetchDrugById(id: number): Promise<VeterinaryDrug> {
  const response = await fetch(`${API_BASE_URL}/medicines/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch drug ${id}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Calculates the dose range for a given drug, species, and patient weight.
 *
 * NOTE: This stays client-side because JSON Server cannot execute custom logic.
 * In a future real backend, this would be a POST /api/calculate endpoint.
 */
export function calculateDose(
  drug: VeterinaryDrug,
  species: 'canine' | 'feline',
  weight: number
): CalculationResult | { error: string } {
  const speciesData = drug.dosage[species];

  if (!speciesData) {
    return {
      error: `"${drug.drug_name}" is not applicable for ${species}.`,
    };
  }

  if (weight <= 0) {
    return { error: 'Body weight must be greater than 0 kg.' };
  }

  const calculation = calculateDoseRange(weight, speciesData);

  return {
    drugName: drug.drug_name,
    species,
    weight,
    calculation,
    notes: speciesData.notes,
    contraindications: drug.contraindications,
  };
}
