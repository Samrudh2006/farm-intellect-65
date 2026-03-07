import { logger } from '../utils/logger.js';

const SARVAM_API_BASE_URL = (process.env.SARVAM_API_BASE_URL || 'https://api.sarvam.ai').replace(/\/$/, '');
const DEFAULT_CHAT_MODEL = process.env.SARVAM_CHAT_MODEL || 'sarvam-30b';
const DEFAULT_STT_MODEL = process.env.SARVAM_STT_MODEL || 'saaras:v3';
const DEFAULT_TTS_MODEL = process.env.SARVAM_TTS_MODEL || 'bulbul:v3';
const DEFAULT_TTS_SPEAKER = process.env.SARVAM_TTS_SPEAKER;

const getSarvamApiKey = () => {
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) {
    throw new Error('Sarvam API key is not configured on the backend.');
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

    return (await response.text()) || `Sarvam request failed with status ${response.status}`;
  } catch {
    return `Sarvam request failed with status ${response.status}`;
  }
};

const requestSarvam = async (path, { method = 'POST', headers: customHeaders, body } = {}) => {
  const apiKey = getSarvamApiKey();
  const headers = new Headers(customHeaders || {});

  headers.set('api-subscription-key', apiKey);
  headers.set('Accept', headers.get('Accept') || 'application/json');

  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${apiKey}`);
  }

  const response = await fetch(`${SARVAM_API_BASE_URL}${path}`, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const details = await parseErrorPayload(response);
    logger.error('Sarvam API request failed', {
      path,
      status: response.status,
      details,
    });
    throw new Error(details);
  }

  return response.json();
};

export const createSarvamChatCompletion = async ({
  messages,
  model = DEFAULT_CHAT_MODEL,
  temperature = 0.3,
  maxTokens = 700,
}) => {
  const payload = await requestSarvam('/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  const content = payload?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('Sarvam returned an empty chat response.');
  }

  return {
    content,
    raw: payload,
  };
};

export const transcribeSarvamAudio = async ({
  buffer,
  fileName = 'voice-query.webm',
  mimeType = 'audio/webm',
  languageCode,
  mode = 'transcribe',
}) => {
  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: mimeType }), fileName);
  formData.append('model', DEFAULT_STT_MODEL);
  formData.append('mode', mode);

  if (languageCode) {
    formData.append('language_code', languageCode);
  }

  return requestSarvam('/speech-to-text', {
    body: formData,
  });
};

export const synthesizeSarvamSpeech = async ({
  text,
  targetLanguageCode = 'en-IN',
  speaker = DEFAULT_TTS_SPEAKER,
  pace = 1,
}) => {
  const payload = await requestSarvam('/text-to-speech', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_TTS_MODEL,
      text,
      target_language_code: targetLanguageCode,
      ...(speaker ? { speaker } : {}),
      pace,
    }),
  });

  const audioBase64 = payload?.audios?.[0];

  if (!audioBase64) {
    throw new Error('Sarvam did not return synthesized audio.');
  }

  return {
    audioBase64,
    raw: payload,
  };
};
