import { logger } from '../utils/logger.js';

const NVIDIA_API_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_CHAT_MODEL = 'meta/llama-2-70b-chat-v1';
const DEFAULT_MAX_TOKENS = 1024;

const getNvidiaApiKey = () => {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    logger.warn('NVIDIA API key is not configured. Falls back to Sarvam.');
    return null;
  }

  return apiKey;
};

const parseErrorPayload = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const payload = await response.json();
      return payload?.error?.message || payload?.error || payload?.message || JSON.stringify(payload);
    }

    return (await response.text()) || `NVIDIA request failed with status ${response.status}`;
  } catch {
    return `NVIDIA request failed with status ${response.status}`;
  }
};

const requestNvidia = async (path, { method = 'POST', headers: customHeaders, body } = {}) => {
  const apiKey = getNvidiaApiKey();

  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is not configured');
  }

  const headers = new Headers(customHeaders || {});
  headers.set('Authorization', `Bearer ${apiKey}`);
  headers.set('Accept', headers.get('Accept') || 'application/json');

  if (method === 'POST' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${NVIDIA_API_BASE_URL}${path}`;
  console.log(`[v0] Sending request to NVIDIA at: ${url}`);

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const details = await parseErrorPayload(response);
    logger.error('NVIDIA API request failed', {
      path,
      status: response.status,
      details,
    });
    console.error(`[v0] NVIDIA API error: ${details}`);
    throw new Error(details);
  }

  return response.json();
};

/**
 * Create a chat completion using NVIDIA's LLaMA 2 70B model for superior responses
 */
export const createNvidiaChatCompletion = async ({
  messages,
  temperature = 0.3,
  maxTokens = DEFAULT_MAX_TOKENS,
  topP = 0.9,
}) => {
  try {
    const apiKey = getNvidiaApiKey();
    if (!apiKey) {
      throw new Error('NVIDIA_API_KEY not configured');
    }

    console.log(`[v0] Creating NVIDIA chat completion with ${messages.length} messages`);

    const payload = await requestNvidia('/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: NVIDIA_CHAT_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stream: false,
      }),
    });

    const content = payload?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('NVIDIA returned an empty chat response.');
    }

    console.log(`[v0] NVIDIA response generated successfully (${content.length} chars)`);

    return {
      content,
      raw: payload,
      provider: 'nvidia',
    };
  } catch (error) {
    console.error(`[v0] NVIDIA chat completion error:`, error.message);
    throw error;
  }
};

/**
 * Stream chat completions from NVIDIA API
 */
export const streamNvidiaChatCompletion = async ({
  messages,
  temperature = 0.3,
  maxTokens = DEFAULT_MAX_TOKENS,
  topP = 0.9,
  onChunk,
}) => {
  try {
    const apiKey = getNvidiaApiKey();
    if (!apiKey) {
      throw new Error('NVIDIA_API_KEY not configured');
    }

    console.log(`[v0] Starting NVIDIA streaming chat completion`);

    const response = await fetch(`${NVIDIA_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: NVIDIA_CHAT_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stream: true,
      }),
    });

    if (!response.ok) {
      const details = await parseErrorPayload(response);
      throw new Error(details);
    }

    if (!response.body) {
      throw new Error('No response body from NVIDIA streaming API');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          if (!line || line === ':' || line.startsWith(':')) continue;
          if (line === '[DONE]') {
            console.log(`[v0] NVIDIA stream completed`);
            onChunk?.(null);
            return;
          }

          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (content) {
                onChunk?.(content);
              }
            } catch (e) {
              console.error(`[v0] Failed to parse NVIDIA stream chunk:`, e.message);
            }
          }
        }
      }

      // Flush remaining buffer
      if (buffer.trim() && buffer !== '[DONE]') {
        if (buffer.startsWith('data: ')) {
          const jsonStr = buffer.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (content) {
              onChunk?.(content);
            }
          } catch (e) {
            console.error(`[v0] Failed to parse final NVIDIA stream chunk:`, e.message);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error(`[v0] NVIDIA streaming error:`, error.message);
    throw error;
  }
};

/**
 * Health check for NVIDIA API
 */
export const checkNvidiaHealth = async () => {
  try {
    const apiKey = getNvidiaApiKey();
    if (!apiKey) {
      return { healthy: false, reason: 'NVIDIA_API_KEY not configured' };
    }

    // Simple request to verify credentials
    await requestNvidia('/chat/completions', {
      body: JSON.stringify({
        model: NVIDIA_CHAT_MODEL,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 10,
      }),
    });

    return { healthy: true, provider: 'nvidia' };
  } catch (error) {
    return { healthy: false, reason: error.message };
  }
};
