import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { healthApp } from '../src/healthApp.js';

describe('GET /health', () => {
  it('returns service health status', async () => {
    const response = await request(healthApp).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.timestamp).toBeTypeOf('string');
  });
});
