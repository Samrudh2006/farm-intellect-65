import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

async function testLlm() {
  const baseUrl = process.env.AI_API_BASE_URL || 'https://api.hcnsec.cn/v1';
  const url = `${baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_CHAT_MODEL || 'gpt-4o-mini';

  console.log('Testing LLM API:', url);
  console.log('Model:', model);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Hello, are you working?' }],
        max_tokens: 10
      })
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Time taken:', Date.now() - startTime, 'ms');
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testLlm();
