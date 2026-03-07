import express from 'express';

export const healthApp = express();

healthApp.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
