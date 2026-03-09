import { describe, expect, it } from 'vitest';
import { isModelReady } from '@/lib/diseaseModel';

describe('diseaseModel', () => {
  it('model is not ready before loading', () => {
    expect(isModelReady()).toBe(false);
  });
});
