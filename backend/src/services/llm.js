import { logger } from '../utils/logger.js';

const AI_API_BASE_URL = (process.env.AI_API_BASE_URL || 'https://api.openai.com').replace(/\/$/, '');
const DEFAULT_CHAT_MODEL = process.env.AI_CHAT_MODEL || 'gpt-4o-mini';

const getAiApiKey = () => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key is not configured on the backend.');
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

    return (await response.text()) || `AI request failed with status ${response.status}`;
  } catch {
    return `AI request failed with status ${response.status}`;
  }
};

/**
 * Standard Chat Completion using OpenAI-compatible endpoints
 */
export const createChatCompletion = async ({
  messages,
  model = DEFAULT_CHAT_MODEL,
  temperature = 0.3,
  maxTokens = 700,
}) => {
  const apiKey = getAiApiKey();

  const response = await fetch(`${AI_API_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const details = await parseErrorPayload(response);
    logger.error('AI API request failed', {
      status: response.status,
      details,
    });
    throw new Error(details);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('AI provider returned an empty chat response.');
  }

  return {
    content,
    raw: payload,
  };
};

/**
 * Streaming Chat Completion using OpenAI-compatible endpoints
 */
export const createChatCompletionStream = async ({
  messages,
  model = DEFAULT_CHAT_MODEL,
  temperature = 0.3,
  maxTokens = 700,
  onChunk,
}) => {
  const apiKey = getAiApiKey();

  const response = await fetch(`${AI_API_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const details = await parseErrorPayload(response);
    logger.error('AI streaming chat failed', { details });
    throw new Error(details);
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().slice(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              const deltaContent = data?.choices?.[0]?.delta?.content || '';
              if (deltaContent) {
                content += deltaContent;
                onChunk(deltaContent);
              }
            } catch (e) {
              // Skip parsing errors for partial chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      content: content.trim(),
      raw: { streaming: true },
    };
  }

  // Non-streaming fallback
  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('AI provider returned an empty chat response.');
  }
  
  return {
    content,
    raw: payload,
  };
};
