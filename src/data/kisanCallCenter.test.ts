import { describe, expect, it } from 'vitest';
import {
  searchKCCQueries,
  getQueriesByCategory,
  getQueriesByCrop,
  getHighPriorityQueries,
  getKCCCategories,
  kisanCallCenterData,
} from '@/data/kisanCallCenter';

describe('kisanCallCenter data', () => {
  it('has KCC query entries', () => {
    expect(kisanCallCenterData.length).toBeGreaterThan(0);
  });

  it('searchKCCQueries finds relevant queries', () => {
    const results = searchKCCQueries('wheat');
    expect(results.length).toBeGreaterThan(0);
  });

  it('getQueriesByCategory returns matching category', () => {
    const categories = getKCCCategories();
    expect(categories.length).toBeGreaterThan(0);

    const results = getQueriesByCategory(categories[0]);
    expect(results.length).toBeGreaterThan(0);
  });

  it('getQueriesByCrop returns crop-specific queries', () => {
    const results = getQueriesByCrop('Rice');
    expect(results.length).toBeGreaterThan(0);
  });

  it('getHighPriorityQueries returns important queries', () => {
    const results = getHighPriorityQueries();
    expect(results.length).toBeGreaterThan(0);
  });
});
