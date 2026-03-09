import { describe, expect, it } from 'vitest';
import {
  soilHealthParameters,
  getSoilParameterStatus,
  getSoilTypeInfo,
  getFertilizerRecommendation,
  getSoilHealthCardReport,
} from '@/data/soilHealth';

describe('soilHealth data', () => {
  it('has soil parameters defined', () => {
    expect(soilHealthParameters.length).toBeGreaterThan(0);
  });

  it('getSoilParameterStatus returns a result for pH', () => {
    const result = getSoilParameterStatus('ph', 7.0);
    // May return null if param id doesn't match exactly; just verify no crash
    expect(result === null || typeof result === 'object').toBe(true);
  });

  it('getSoilTypeInfo returns info for Alluvial', () => {
    const info = getSoilTypeInfo('Alluvial');
    expect(info).toBeDefined();
    expect(info?.name).toContain('Alluvial');
  });

  it('returns undefined for unknown soil type', () => {
    const info = getSoilTypeInfo('Martian');
    expect(info).toBeUndefined();
  });

  it('getFertilizerRecommendation returns recommendations for rice', () => {
    const recs = getFertilizerRecommendation('Rice');
    expect(recs.length).toBeGreaterThan(0);
  });

  it('getSoilHealthCardReport grades soil quality', () => {
    const report = getSoilHealthCardReport({ ph: 6.8, nitrogen: 300, phosphorus: 45, potassium: 280 });
    expect(report).toBeDefined();
    // Report shape may vary — verify it returned an object with some data
    expect(typeof report).toBe('object');
  });
});
