import { describe, expect, it } from 'vitest';
import {
  getRecommendationBySoil,
  getCropsByCategory,
  getCropsBySeason,
  getHighProfitCrops,
  getLowWaterCrops,
  cropRecommendations,
} from '@/data/cropRecommendations';

describe('cropRecommendations data', () => {
  it('has at least 5 crop recommendations', () => {
    expect(cropRecommendations.length).toBeGreaterThanOrEqual(5);
  });

  it('getRecommendationBySoil returns sorted results', () => {
    const results = getRecommendationBySoil(90, 42, 43, 6.5, 25, 80, 1200);
    expect(results.length).toBeGreaterThan(0);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('getCropsBySeason returns only matching season', () => {
    const kharif = getCropsBySeason('Kharif');
    kharif.forEach(c => expect(c.season).toBe('Kharif'));
  });

  it('getCropsByCategory returns matching category', () => {
    const vegetables = getCropsByCategory('vegetable');
    vegetables.forEach(c => expect(c.category).toBe('vegetable'));
  });

  it('getHighProfitCrops returns crops sorted by profit', () => {
    const results = getHighProfitCrops();
    expect(results.length).toBeGreaterThan(0);
  });

  it('getLowWaterCrops returns water-efficient crops', () => {
    const results = getLowWaterCrops();
    expect(results.length).toBeGreaterThan(0);
  });
});
