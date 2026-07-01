export interface Dosage {
  min_mg_kg: number;
  max_mg_kg: number;
  unit: 'mg/kg' | 'ug/kg' | 'ml/kg';
  notes?: string;
}

export interface SpeciesSpecificData {
  canine?: Dosage;
  feline?: Dosage;
}

export interface VeterinaryDrug {
  id: string;
  drug_name: string;
  classifications: string[]; // e.g., ["Emergency", "Anesthetic", "Clinical Use"]
  description: string;
  indications: string[];
  dosage: SpeciesSpecificData;
  onset_of_action: string;
  contraindications: string[];
  side_effects: string[];
  drug_interactions: string[];
}
