import { describe, expect, it } from 'vitest';
import {
  mandiPrices,
  getMandiPricesByCommodity,
  getMandiPricesByState,
  getMSPCrops,
  getPriceTrendByCommodity,
  getHighVolatilityCommodities,
  getCommoditiesByCategory,
} from '@/data/mandiPrices';

describe('mandiPrices data', () => {
  it('has at least 5 commodity price entries', () => {
    expect(mandiPrices.length).toBeGreaterThanOrEqual(5);
  });

  it('getMandiPricesByCommodity finds wheat', () => {
    const wheat = getMandiPricesByCommodity('Wheat');
    expect(wheat).toBeDefined();
    expect(wheat?.commodity).toBe('Wheat');
    expect(wheat?.marketPrices.length).toBeGreaterThan(0);
  });

  it('returns undefined for unknown commodity', () => {
    const result = getMandiPricesByCommodity('Avocado');
    expect(result).toBeUndefined();
  });

  it('getMandiPricesByState returns entries for Punjab', () => {
    const results = getMandiPricesByState('Punjab');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(e => expect(e.state).toBe('Punjab'));
  });

  it('getMSPCrops returns crops with MSP', () => {
    const mspCrops = getMSPCrops();
    expect(mspCrops.length).toBeGreaterThan(0);
    mspCrops.forEach(c => expect(c.msp).toBeGreaterThan(0));
  });

  it('getPriceTrendByCommodity returns trend data', () => {
    const trend = getPriceTrendByCommodity('Wheat');
    expect(trend).toBeDefined();
    expect(trend?.monthlyAvg.length).toBeGreaterThan(0);
  });

  it('getHighVolatilityCommodities returns volatile commodities', () => {
    const results = getHighVolatilityCommodities();
    expect(results.length).toBeGreaterThan(0);
  });

  it('getCommoditiesByCategory filters correctly', () => {
    const cereals = getCommoditiesByCategory('cereal');
    cereals.forEach(c => expect(c.category).toBe('cereal'));
  });
});
