import { describe, expect, it } from 'vitest';
import { predictYield, forecastPrice, assessPestRisk, recommendCrops, analyzeSoilHealth } from '../src/services/ml.js';

// ─── Yield Prediction Tests ──────────────────────────────────────────────────

describe('predictYield', () => {
  it('returns polynomial-regression algorithm label', () => {
    const result = predictYield({ cropType: 'rice', farmSize: '2' });
    expect(result.algorithm).toBe('polynomial-regression');
  });

  it('predicts rice yield within realistic range', () => {
    const result = predictYield({
      cropType: 'rice',
      farmSize: '1',
      soilParams: { ph: 6.5, nitrogen: 280, phosphorus: 40, potassium: 300, organicCarbon: 0.8 },
      irrigationMethod: 'drip',
      irrigation: 'adequate',
      fertilizer: 'optimal',
      fertilizerTiming: 'correct',
      weather: { temperature: 28, rainfall: 1200, humidity: 75 },
      pestPressure: 'low',
    });
    expect(result.yieldPerHectare).toBeGreaterThan(2000);
    expect(result.yieldPerHectare).toBeLessThan(6000);
    expect(result.confidence).toBeGreaterThanOrEqual(60);
    expect(result.predictionInterval).toBeDefined();
    expect(result.predictionInterval.lower).toBeLessThan(result.yieldPerHectare);
    expect(result.predictionInterval.upper).toBeGreaterThan(result.yieldPerHectare);
  });

  it('returns prediction interval based on RMSE', () => {
    const result = predictYield({ cropType: 'wheat', farmSize: '5' });
    expect(result.predictionInterval).toBeDefined();
    expect(result.predictionInterval.upper - result.predictionInterval.lower).toBeGreaterThan(0);
  });

  it('returns model metrics with R² and RMSE', () => {
    const result = predictYield({ cropType: 'maize', farmSize: '1' });
    expect(result.modelMetrics).toBeDefined();
    expect(result.modelMetrics.rmse).toBeGreaterThan(0);
    expect(result.modelMetrics.r2).toBeGreaterThan(0);
    expect(result.modelMetrics.r2).toBeLessThanOrEqual(1);
  });

  it('poor conditions yield less than optimal', () => {
    const goodResult = predictYield({
      cropType: 'wheat',
      farmSize: '1',
      soilQuality: 'good',
      irrigation: 'adequate',
      fertilizer: 'optimal',
      pestPressure: 'low',
    });
    const poorResult = predictYield({
      cropType: 'wheat',
      farmSize: '1',
      soilQuality: 'poor',
      irrigation: 'scarce',
      fertilizer: 'low',
      pestPressure: 'severe',
    });
    expect(goodResult.yieldPerHectare).toBeGreaterThan(poorResult.yieldPerHectare);
  });

  it('falls back gracefully for unknown crop', () => {
    const result = predictYield({ cropType: 'dragonfruit', farmSize: '1' });
    expect(result.algorithm).toBe('heuristic-fallback');
    expect(result.confidence).toBeLessThan(60);
  });

  it('computes interaction terms (irrigation × fertilizer synergy)', () => {
    const result = predictYield({
      cropType: 'cotton',
      farmSize: '1',
      irrigationMethod: 'drip',
      fertilizer: 'optimal',
    });
    expect(result.factors.synergies).toBeDefined();
    expect(result.factors.synergies.irrigFert).toBeDefined();
  });

  it('scales total yield by farm size', () => {
    const small = predictYield({ cropType: 'rice', farmSize: '1' });
    const large = predictYield({ cropType: 'rice', farmSize: '10' });
    expect(large.totalYield).toBeGreaterThan(small.totalYield * 5);
  });
});


// ─── Price Forecast Tests ────────────────────────────────────────────────────

describe('forecastPrice', () => {
  it('uses Holt-Winters algorithm', () => {
    const result = forecastPrice({ commodity: 'wheat', months: 3 });
    expect(result.algorithm).toBe('holt-winters-triple-exponential-smoothing');
  });

  it('returns correct number of monthly forecasts', () => {
    const result = forecastPrice({ commodity: 'rice', months: 6 });
    expect(result.forecasts).toHaveLength(6);
  });

  it('provides smoothing parameters', () => {
    const result = forecastPrice({ commodity: 'onion', months: 1 });
    expect(result.smoothingParams).toBeDefined();
    expect(result.smoothingParams.alpha).toBeGreaterThan(0);
    expect(result.smoothingParams.gamma).toBeGreaterThan(0);
  });

  it('prediction intervals widen with horizon', () => {
    const result = forecastPrice({ commodity: 'potato', months: 6 });
    const first = result.forecasts[0];
    const last = result.forecasts[5];
    const firstWidth = first.upperBound - first.lowerBound;
    const lastWidth = last.upperBound - last.lowerBound;
    expect(lastWidth).toBeGreaterThan(firstWidth);
  });

  it('confidence decays with forecast horizon', () => {
    const result = forecastPrice({ commodity: 'tomato', months: 6 });
    expect(result.forecasts[0].confidence).toBeGreaterThan(result.forecasts[5].confidence);
  });

  it('produces deterministic output (no Math.random)', () => {
    const r1 = forecastPrice({ commodity: 'wheat', months: 3 });
    const r2 = forecastPrice({ commodity: 'wheat', months: 3 });
    expect(r1.forecasts[0].forecastedPrice).toBe(r2.forecasts[0].forecastedPrice);
  });

  it('returns error for unknown commodity', () => {
    const result = forecastPrice({ commodity: 'avocado' });
    expect(result.error).toBeDefined();
  });

  it('uses currentPrice override when provided', () => {
    const result = forecastPrice({ commodity: 'wheat', months: 1, currentPrice: 5000 });
    expect(result.currentPrice).toBe(5000);
    expect(result.forecasts[0].forecastedPrice).toBeGreaterThan(3000);
  });
});


// ─── Pest Risk Tests ─────────────────────────────────────────────────────────

describe('assessPestRisk', () => {
  it('uses logistic-regression-bayesian algorithm', () => {
    const result = assessPestRisk({ cropType: 'rice', temperature: 30, humidity: 85, season: 'Kharif' });
    expect(result.algorithm).toBe('logistic-regression-bayesian');
  });

  it('returns per-pest logistic scores and Bayesian posteriors', () => {
    const result = assessPestRisk({ cropType: 'wheat', temperature: 20, humidity: 70, season: 'Rabi' });
    expect(result.pests.length).toBeGreaterThan(0);
    result.pests.forEach(pest => {
      expect(pest.logisticScore).toBeGreaterThanOrEqual(0);
      expect(pest.logisticScore).toBeLessThanOrEqual(1);
      expect(pest.bayesianPosterior).toBeGreaterThanOrEqual(0);
    });
  });

  it('returns feature vector', () => {
    const result = assessPestRisk({ cropType: 'cotton', temperature: 33, humidity: 75, season: 'Kharif' });
    expect(result.featureVector).toBeDefined();
    expect(result.featureVector.tempSimilarity).toBeGreaterThan(0);
  });

  it('high-risk conditions produce higher scores', () => {
    const highRisk = assessPestRisk({ cropType: 'rice', temperature: 30, humidity: 90, season: 'Kharif', previousPestHistory: true });
    const lowRisk = assessPestRisk({ cropType: 'rice', temperature: 10, humidity: 30, season: 'Rabi', previousPestHistory: false });
    expect(highRisk.riskScore).toBeGreaterThan(lowRisk.riskScore);
  });

  it('pest history flag increases risk via Bayesian update', () => {
    const noHistory = assessPestRisk({ cropType: 'maize', temperature: 30, humidity: 75, season: 'Kharif', previousPestHistory: false });
    const withHistory = assessPestRisk({ cropType: 'maize', temperature: 30, humidity: 75, season: 'Kharif', previousPestHistory: true });
    expect(withHistory.riskScore).toBeGreaterThanOrEqual(noHistory.riskScore);
  });

  it('returns unknown for unsupported crop', () => {
    const result = assessPestRisk({ cropType: 'mango' });
    expect(result.overallRisk).toBe('unknown');
  });
});


// ─── Crop Recommendation Tests ───────────────────────────────────────────────

describe('recommendCrops', () => {
  it('uses gaussian-kernel-similarity algorithm', () => {
    const results = recommendCrops({ nitrogen: 90, ph: 6.5, temperature: 28, rainfall: 1100, season: 'Kharif' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].algorithm).toBe('gaussian-kernel-similarity');
  });

  it('returns max 6 recommendations sorted by suitability', () => {
    const results = recommendCrops({ nitrogen: 100, ph: 6.5, temperature: 25, rainfall: 800, season: 'all' });
    expect(results.length).toBeLessThanOrEqual(6);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].suitability).toBeGreaterThanOrEqual(results[i].suitability);
    }
  });

  it('filters by season', () => {
    const kharif = recommendCrops({ nitrogen: 90, season: 'Kharif' });
    const rabi = recommendCrops({ nitrogen: 90, season: 'Rabi' });
    const kharifCrops = kharif.map(r => r.crop.toLowerCase());
    const rabiCrops = rabi.map(r => r.crop.toLowerCase());
    // Wheat is Rabi-only, should not appear in Kharif
    expect(kharifCrops).not.toContain('wheat');
    // Cotton is Kharif-only, should not appear in Rabi
    expect(rabiCrops).not.toContain('cotton');
  });

  it('provides per-parameter Gaussian scores', () => {
    const results = recommendCrops({ nitrogen: 90, ph: 6.5, temperature: 28, rainfall: 1100 });
    expect(results[0].parameterScores).toBeDefined();
    expect(results[0].parameterScores.nitrogen).toBeGreaterThan(0);
  });
});


// ─── Soil Health Tests ───────────────────────────────────────────────────────

describe('analyzeSoilHealth', () => {
  it('returns grade A for optimal soil', () => {
    const result = analyzeSoilHealth({ ph: 6.8, nitrogen: 300, phosphorus: 42, potassium: 300, organicCarbon: 0.85, moisture: 30 });
    expect(result.grade).toBe('A');
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
  });

  it('returns low grade for poor soil', () => {
    const result = analyzeSoilHealth({ ph: 4.0, nitrogen: 50, phosphorus: 5, potassium: 50, organicCarbon: 0.1, moisture: 5 });
    expect(['C', 'D']).toContain(result.grade);
  });

  it('handles partial inputs gracefully', () => {
    const result = analyzeSoilHealth({ ph: 7.0 });
    expect(result.parameters).toHaveLength(1);
    expect(result.overallScore).toBeGreaterThan(0);
  });

  it('flags deficient parameters with recommendations', () => {
    const result = analyzeSoilHealth({ ph: 4.0, nitrogen: 50 });
    const deficient = result.parameters.filter(p => p.status === 'deficient');
    expect(deficient.length).toBeGreaterThan(0);
  });
});
