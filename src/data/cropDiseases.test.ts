import { describe, expect, it } from 'vitest';
import {
  getDiseasesByCrop,
  getDiseasesByCategory,
  getDiseasesBySeverity,
  searchDiseases,
  getCriticalDiseases,
  getAllCropsWithDiseases,
  getPlantVillageClasses,
  cropDiseases,
} from '@/data/cropDiseases';

describe('cropDiseases data', () => {
  it('has disease entries', () => {
    expect(cropDiseases.length).toBeGreaterThan(0);
  });

  it('getDiseasesByCrop returns correct crop diseases', () => {
    const tomatoDiseases = getDiseasesByCrop('Tomato');
    expect(tomatoDiseases.length).toBeGreaterThan(0);
    tomatoDiseases.forEach(d => expect(d.crop.toLowerCase()).toBe('tomato'));
  });

  it('getDiseasesByCategory filters by category', () => {
    const fungal = getDiseasesByCategory('fungal');
    fungal.forEach(d => expect(d.category).toBe('fungal'));
  });

  it('getDiseasesBySeverity returns matching severity', () => {
    const critical = getDiseasesBySeverity('critical');
    critical.forEach(d => expect(d.severity).toBe('critical'));
  });

  it('searchDiseases finds diseases by keyword', () => {
    const results = searchDiseases('blight');
    expect(results.length).toBeGreaterThan(0);
  });

  it('getCriticalDiseases returns high-severity entries', () => {
    const critical = getCriticalDiseases();
    expect(critical.length).toBeGreaterThan(0);
  });

  it('getAllCropsWithDiseases returns crop names', () => {
    const crops = getAllCropsWithDiseases();
    expect(crops).toContain('Tomato');
    expect(crops).toContain('Rice');
  });

  it('getPlantVillageClasses returns PlantVillage class labels', () => {
    const classes = getPlantVillageClasses();
    expect(classes.length).toBeGreaterThan(0);
  });
});
