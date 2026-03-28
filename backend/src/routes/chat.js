import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activity.js';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';
import {
  createSarvamChatCompletion,
  synthesizeSarvamSpeech,
  transcribeSarvamAudio,
} from '../services/sarvam.js';
import {
  createNvidiaChatCompletion,
  streamNvidiaChatCompletion,
  checkNvidiaHealth,
} from '../services/nvidia.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const CHAT_HISTORY_LIMIT = 12;

// Helper function to get chat completion with fallback: NVIDIA -> Sarvam
const getChatCompletion = async (messages, options = {}) => {
  const { mode = 'chat', context, languageCode, user } = options;
  
  try {
    console.log(`[v0] Attempting NVIDIA chat completion (mode: ${mode})`);
    const result = await createNvidiaChatCompletion({
      messages,
      temperature: 0.3,
      maxTokens: 1024,
    });
    console.log(`[v0] ✓ NVIDIA provided response`);
    return { content: result.content, provider: 'nvidia' };
  } catch (nvidiaError) {
    console.warn(`[v0] NVIDIA failed, falling back to Sarvam:`, nvidiaError.message);
    try {
      const result = await createSarvamChatCompletion({
        messages,
        temperature: 0.3,
        maxTokens: 700,
      });
      console.log(`[v0] ✓ Sarvam provided fallback response`);
      return { content: result.content, provider: 'sarvam' };
    } catch (sarvamError) {
      console.error(`[v0] Both NVIDIA and Sarvam failed:`, sarvamError.message);
      throw new Error(`Failed to get AI response from both providers: ${sarvamError.message}`);
    }
  }
};

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const nvidiaHealth = await checkNvidiaHealth();
    console.log(`[v0] Health check - NVIDIA:`, nvidiaHealth);
    
    res.json({
      status: 'healthy',
      providers: {
        nvidia: nvidiaHealth.healthy ? 'active' : 'inactive',
        sarvam: 'active',
      },
      details: nvidiaHealth,
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
});

const MODE_PROMPTS = {
  chat: 'You are Krishi AI, a practical agricultural assistant for Indian farmers. Give accurate, concise, farmer-friendly advice. Prefer actionable bullet points when useful and stay grounded in agronomy, weather risk, pests, soil health, irrigation, crop calendars, mandi realities, and government schemes.',
  disease: 'You are an agricultural plant-pathology assistant. Diagnose likely crop disease causes from symptoms only and never pretend you visually inspected an image unless the user explicitly described it. Always include likely disease, confidence, severity, treatment, prevention, and a short markdown analysis.',
  recommendation: 'You are an Indian crop planning advisor. Recommend crops based on season, soil, location, water access, and farmer goals. Explain trade-offs, expected risks, and next steps.',
  yield: 'You are an agricultural forecasting assistant. Estimate yield carefully, explain assumptions, list risk factors, and avoid false precision.',
};

const getRoleLabel = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'platform administrator';
    case 'EXPERT':
      return 'agriculture expert';
    case 'MERCHANT':
      return 'merchant';
    default:
      return 'farmer';
  }
};

const getLanguageInstruction = (languageCode) => (
  languageCode
    ? `Reply in the same language as the user whenever possible. Preferred response language code: ${languageCode}.`
    : 'Reply in the same language as the user whenever possible. If the user switches language, adapt naturally.'
);

const buildAssistantMessages = ({ user, mode = 'chat', messages, context, languageCode }) => {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const systemPrompt = [
    MODE_PROMPTS[mode] || MODE_PROMPTS.chat,
    `The authenticated user is a ${getRoleLabel(user.role)} on Farm Intellect.`,
    getLanguageInstruction(languageCode),
    'If information is uncertain, say so clearly and suggest the best next action instead of making up facts.',
  ].join(' ');

  const normalizedMessages = safeMessages
    .filter((message) => message?.content)
    .map((message) => ({
      role: message.role === 'assistant' || message.role === 'system' ? message.role : 'user',
      content: String(message.content).trim(),
    }))
    .filter((message) => message.content.length > 0);

  const contextMessage = context && Object.keys(context).length
    ? {
        role: 'system',
        content: `Conversation context:\n${JSON.stringify(context, null, 2)}`,
      }
    : null;

  return [
    { role: 'system', content: systemPrompt },
    ...(contextMessage ? [contextMessage] : []),
    ...normalizedMessages,
  ];
};

const getStoredConversationMessages = async (userId) => {
  const history = await prisma.chatMessage.findMany({
    where: { userId },
    take: CHAT_HISTORY_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return history.reverse().map((message) => ({
    role: message.type === 'AI_ASSISTANT' ? 'assistant' : 'user',
    content: message.message,
  }));
};

// Get chat history
router.get('/messages', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.user.id },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'asc' }
    });

    res.json({ messages });
  } catch (error) {
    logger.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Generate a one-off assistant completion without storing the response
router.post('/complete', authenticate, logActivity, async (req, res) => {
  try {
    const { messages, context, languageCode, mode = 'chat' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'At least one message is required' });
    }

    const assistantMessages = buildAssistantMessages({
      user: req.user,
      mode,
      messages,
      context,
      languageCode,
    });

    const { content, provider } = await getChatCompletion(assistantMessages, {
      mode,
      context,
      languageCode,
      user: req.user,
    });

    console.log(`[v0] Completion via ${provider}`);
    res.json({ content, provider });
  } catch (error) {
    logger.error('Assistant completion error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to complete assistant request' });
  }
});

// Send message to AI chatbot
router.post('/message', authenticate, logActivity, async (req, res) => {
  try {
    const { message, context, languageCode, mode = 'chat' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedMessage = message.trim();

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId: req.user.id,
        message: trimmedMessage,
        type: 'USER',
        context: context ? JSON.stringify(context) : null
      }
    });

    const conversationMessages = [
      ...(await getStoredConversationMessages(req.user.id)),
      { role: 'user', content: trimmedMessage },
    ];

    const assistantMessages = buildAssistantMessages({
      user: req.user,
      mode,
      messages: conversationMessages,
      context,
      languageCode,
    });

    const { content, provider } = await getChatCompletion(assistantMessages, {
      mode,
      context,
      languageCode,
      user: req.user,
    });

    // Save AI response with provider info
    const aiMessage = await prisma.chatMessage.create({
      data: {
        userId: req.user.id,
        message: content,
        type: 'AI_ASSISTANT',
        context: JSON.stringify({
          originalMessage: trimmedMessage,
          mode,
          languageCode,
          provider,
          ...context
        })
      }
    });

    console.log(`[v0] Message handled via ${provider}`);
    res.json({
      userMessage,
      aiMessage,
      provider
    });
  } catch (error) {
    logger.error('Chat message error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to process message' });
  }
});

router.post('/voice/transcribe', authenticate, upload.single('audio'), logActivity, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const { languageCode, mode = 'transcribe' } = req.body;
    const transcription = await transcribeSarvamAudio({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      languageCode,
      mode,
    });

    res.json({
      transcript: transcription?.transcript || '',
      languageCode: transcription?.language_code || languageCode,
      requestId: transcription?.request_id,
    });
  } catch (error) {
    logger.error('Voice transcription error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to transcribe voice input' });
  }
});

router.post('/voice/speak', authenticate, logActivity, async (req, res) => {
  try {
    const { text, targetLanguageCode, speaker, pace } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const speech = await synthesizeSarvamSpeech({
      text: String(text).trim(),
      targetLanguageCode: targetLanguageCode || 'en-IN',
      speaker,
      pace: typeof pace === 'number' ? pace : 1,
    });

    res.json({
      audioBase64: speech.audioBase64,
      mimeType: 'audio/wav',
      requestId: speech.raw?.request_id,
    });
  } catch (error) {
    logger.error('Voice synthesis error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to synthesize speech' });
  }
});

// Clear chat history
router.delete('/messages', authenticate, logActivity, async (req, res) => {
  try {
    await prisma.chatMessage.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    logger.error('Clear chat error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

export default router;
