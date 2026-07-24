import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

async function testSarvamDirect() {
  const apiKey = process.env.SARVAM_API_KEY;
  console.log('Testing Sarvam Direct API...');
  
  const headers = new Headers();
  headers.set('api-subscription-key', apiKey);
  headers.set('Authorization', `Bearer ${apiKey}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'sarvam-30b',
      messages: [{ role: 'user', content: 'Hello, are you working?' }],
      temperature: 0.3,
      max_tokens: 700
    })
  });

  const payload = await response.json();
  console.log('Status:', response.status);
  console.log('Payload:', JSON.stringify(payload, null, 2));
}

testSarvamDirect();
