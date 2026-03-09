import { describe, expect, it } from 'vitest';
import { diagnoseDiseaseFromText } from '../src/services/cv.js';

// Note: detectDiseaseFromImage requires actual image files + Sarvam API.
// We test the text-based diagnosis and the knowledge-base path which don't need external deps.

describe('diagnoseDiseaseFromText', () => {
  it('returns a diagnosis object with disease name and treatment', async () => {
    // Without Sarvam API key, falls back to knowledge-base
    const result = await diagnoseDiseaseFromText('leaves turning brown with spots', 'tomato');
    expect(result).toBeDefined();
    expect(result.disease).toBeTruthy();
    expect(result.treatment).toBeDefined();
  });

  it('includes severity and confidence fields', async () => {
    const result = await diagnoseDiseaseFromText('yellow patches on leaves', 'wheat');
    expect(result.severity).toBeTruthy();
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('returns inconclusive for unknown crop type', async () => {
    const result = await diagnoseDiseaseFromText('wilting', 'dragonfruit');
    expect(result.disease).toBeTruthy(); // should return something, even "Analysis Inconclusive"
  });

  it('handles empty crop type gracefully', async () => {
    const result = await diagnoseDiseaseFromText('black spots on fruit', '');
    expect(result).toBeDefined();
    expect(result.source).toBeTruthy();
  });
});
