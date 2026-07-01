/**
 * generate-db.mjs
 *
 * Reads the TypeScript mockDb and strips the TS-specific parts,
 * then writes a clean db.json for json-server.
 *
 * Usage: node scripts/generate-db.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(__dirname, '../src/database/mockDb.ts');

// Read the raw TypeScript source
let source = readFileSync(srcPath, 'utf8');

// Strip the TS import and the export/type declaration, leaving just the array literal
source = source
  .replace(/import type[^\n]*\n/, '')
  .replace('export const drugDatabase: VeterinaryDrug[] = ', '')
  .trimEnd();

// Remove trailing semicolon if present
if (source.endsWith(';')) {
  source = source.slice(0, -1);
}

// The file may be missing the closing ] for the outer array — add it if needed
if (!source.trimEnd().endsWith(']')) {
  source = source + '\n]';
}

// Parse as JSON
let rawData;
try {
  rawData = JSON.parse(source);
} catch (e) {
  console.error('Failed to parse mockDb as JSON:', e.message);
  process.exit(1);
}

// The structure is [{ "": [ ...drugs ] }]
// We want a flat array of medicines with numeric ids
let medicines = [];
for (const category of rawData) {
  for (const drugs of Object.values(category)) {
    if (Array.isArray(drugs)) {
      medicines = medicines.concat(drugs);
    }
  }
}

// Add sequential numeric id to each medicine
const medicinesWithId = medicines.map((drug, index) => ({
  id: index + 1,
  ...drug,
}));

const db = {
  medicines: medicinesWithId,
};

const outputPath = resolve(__dirname, '../db.json');
writeFileSync(outputPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`✅ db.json generated with ${medicinesWithId.length} medicines at ${outputPath}`);
