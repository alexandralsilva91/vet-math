import type { VeterinaryDrug } from '../types';

export const drugDatabase: VeterinaryDrug[] = [
  {
    id: '1',
    drug_name: 'Lidocaine',
    classifications: ['Emergency', 'Anesthetic (Local)', 'Clinical Use (Antiarrhythmic)'],
    description: 'A Class 1b antiarrhythmic and local anesthetic sodium-channel blocker [1, 2].',
    indications: [
      'Emergency control of ventricular tachycardia [1]',
      'Local or regional analgesia [3]',
    ],
    dosage: {
      canine: {
        min_mg_kg: 2.0,
        max_mg_kg: 8.0,
        unit: 'mg/kg',
        notes: 'Follow with constant rate infusion of 0.025-0.1 mg/kg/min [1].',
      },
      feline: {
        min_mg_kg: 0.25,
        max_mg_kg: 2.0,
        unit: 'mg/kg',
        notes: 'Administer slowly; cats are highly sensitive to toxic effects [1, 3].',
      },
    },
    onset_of_action: 'Rapid [1].',
    contraindications: [
      'Do not give i.v. to cats for perioperative analgesia [3]',
      'Do not use solutions with adrenaline for ring blocks [3]',
    ],
    side_effects: ['CNS toxicity (seizures)', 'Cardiovascular depression and hypotension [4]'],
    drug_interactions: ['Cimetidine and propranolol may prolong clearance [4]'],
  },
  {
    id: '2',
    drug_name: 'Adrenaline (Epinephrine)',
    classifications: ['Emergency'],
    description: 'A potent catecholamine acting on alpha and beta-receptors [5].',
    indications: ['Cardiac resuscitation', 'Anaphylaxis', 'Status asthmaticus [5]'],
    dosage: {
      canine: {
        min_mg_kg: 10, // 10 ug/kg
        max_mg_kg: 10,
        unit: 'ug/kg',
        notes: '10 µg/kg every 3-5 mins for CPA. Double dose if used intratracheally [6].',
      },
      feline: {
        min_mg_kg: 10, // 10 ug/kg
        max_mg_kg: 10,
        unit: 'ug/kg',
        notes: '10 µg/kg i.v. or i.m. for anaphylaxis [7, 8].',
      },
    },
    onset_of_action: 'Immediate (short duration 2-5 mins) [5].',
    contraindications: ['Direct intracardiac injection not recommended [5].'],
    side_effects: ['Ventricular fibrillation', 'Severe tachycardia [9].'],
    drug_interactions: [
      'Halothane or high-dose digoxin sensitizes the myocardium to arrhythmias [10].',
    ],
  },
  {
    id: '3',
    drug_name: 'Diazepam',
    classifications: ['Anesthetic', 'Clinical Use (Anticonvulsant)'],
    description: 'A benzodiazepine with anticonvulsant, muscle relaxant, and sedative properties.',
    indications: [
      'Emergency control of status epilepticus',
      'Pre-medication as part of anesthetic protocols',
    ],
    dosage: {
      canine: {
        min_mg_kg: 0.5,
        max_mg_kg: 1.0,
        unit: 'mg/kg',
        notes: 'Provides poor sedation alone in healthy dogs and can cause paradoxical excitation.',
      },
      feline: {
        min_mg_kg: 0.5,
        max_mg_kg: 1.0,
        unit: 'mg/kg',
        notes:
          'Provides poor sedation alone in healthy cats and can cause paradoxical excitation. Avoid repeated oral doses due to risk of idiosyncratic hepatic necrosis.',
      },
    },
    onset_of_action: 'Rapid (1-5 mins following i.v.).',
    contraindications: ['Avoid in animals with hepatic insufficiency.'],
    side_effects: ['Paradoxical excitation', 'Sedation', 'Ataxia'],
    drug_interactions: ['Cimetidine and erythromycin can inhibit metabolism.'],
  },
  {
    id: '4',
    drug_name: 'Afoxolaner',
    classifications: ['Clinical Use (Ectoparasiticide)'],
    description: 'An isoxazoline ectoparasiticide for treatment of flea and tick infestations.',
    indications: [
      'Treatment and prevention of flea (Ctenocephalides felis) infestations in dogs',
      'Treatment of tick infestations in dogs',
    ],
    dosage: {
      canine: {
        min_mg_kg: 2.5,
        max_mg_kg: 6.5,
        unit: 'mg/kg',
        notes: 'Administer orally. Minimum dose is 2.5 mg/kg. Safe for dogs only.',
      },
      // Feline: undefined (Dogs only)
    },
    onset_of_action: 'Starts killing fleas within 8 hours.',
    contraindications: ['Do not use in cats or other non-canine species.'],
    side_effects: ['Vomiting', 'Diarrhea', 'Lethargy'],
    drug_interactions: ['None reported.'],
  },
  {
    id: '5',
    drug_name: 'Acetazolamide',
    classifications: ['Clinical Use (Glaucoma / Diuretic)'],
    description: 'A carbonic anhydrase inhibitor used to reduce intraocular pressure.',
    indications: ['Reduction of intraocular pressure in glaucoma', 'Diuretic therapy'],
    dosage: {
      canine: {
        min_mg_kg: 5.0,
        max_mg_kg: 10.0,
        unit: 'mg/kg',
        notes: 'Administer orally or intravenously.',
      },
      // Feline: undefined (Avoid in cats)
    },
    onset_of_action: 'Moderate.',
    contraindications: ['Avoid in cats. Do not use in animals with hepatic or renal impairment.'],
    side_effects: ['Electrolyte depletion', 'Metabolic acidosis', 'Vomiting'],
    drug_interactions: ['May decrease renal clearance of quinidine and increase side effects.'],
  },
];
