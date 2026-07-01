import { drugDatabase } from '../database/mockDb';
import { calculateDoseRange } from '../logic/dosing';
import type { CalculatedDoseRange } from '../logic/dosing';
import type { VeterinaryDrug } from '../types';

export interface CalculationResult {
  drugName: string;
  species: 'canine' | 'feline';
  weight: number;
  calculation: CalculatedDoseRange;
  notes?: string;
  contraindications: string[];
}

export class DrugApiService {
  /**
   * Simulates fetching all veterinary drugs from the database.
   * Resolves after a simulated 500ms network delay.
   */
  static async getAllDrugs(): Promise<VeterinaryDrug[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(drugDatabase), 500);
    });
  }

  /**
   * Simulates fetching a single drug by its ID.
   */
  static async getDrugById(id: string): Promise<VeterinaryDrug | undefined> {
    return new Promise((resolve) => {
      const drug = drugDatabase.find((d) => d.id === id);
      setTimeout(() => resolve(drug), 200);
    });
  }

  /**
   * Simulates a server-side calculation for a given drug, species, and body weight.
   * Handles species exclusions and returns dosing ranges, converted values, and relevant notes.
   */
  static async getCalculation(
    drugId: string,
    species: 'canine' | 'feline',
    weight: number
  ): Promise<CalculationResult | { error: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const drug = drugDatabase.find((d) => d.id === drugId);
          if (!drug) {
            return resolve({ error: `Drug with ID ${drugId} not found` });
          }

          const speciesData = drug.dosage[species];
          if (!speciesData) {
            return resolve({
              error: `Drug "${drug.drug_name}" is not applicable/avoided for ${species} species.`,
            });
          }

          if (weight <= 0) {
            return resolve({ error: 'Body weight must be greater than 0 kg' });
          }

          const calculation = calculateDoseRange(weight, speciesData);

          resolve({
            drugName: drug.drug_name,
            species,
            weight,
            calculation,
            notes: speciesData.notes,
            contraindications: drug.contraindications,
          });
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }
}
