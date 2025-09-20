import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activity.js';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Simple AI response function (placeholder for actual AI integration)
const generateAIResponse = async (message, context) => {
  // This would integrate with actual AI services like OpenAI, Gemini, etc.
  // For now, return mock responses based on keywords
  const responses = {
    'crop': 'Based on your location and soil conditions, I recommend considering wheat or rice cultivation. Would you like specific planting guidelines?',
    'disease': 'I can help identify crop diseases. Please describe the symptoms you\'re observing, or upload an image for analysis.',
    'fertilizer': 'For optimal crop growth, consider soil testing first. Generally, NPK fertilizers work well for most crops. What crop are you planning?',
    'weather': 'Weather conditions are crucial for farming decisions. Check local weather forecasts and plan irrigation accordingly.',
    'pest': 'Pest control requires integrated management. Can you describe the pests you\'re seeing? I can suggest organic and chemical solutions.',
    'price': 'Market prices fluctuate based on demand and season. I can provide current market trends for your crops.',
    'default': 'I\'m here to help with your farming questions! You can ask me about crops, diseases, fertilizers, weather, pests, or market prices.'
  };

  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return responses.default;
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

// Send message to AI chatbot
router.post('/message', authenticate, logActivity, async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId: req.user.id,
        message: message.trim(),
        type: 'USER',
        context: context ? JSON.stringify(context) : null
      }
    });

    // Generate AI response
    const aiResponseText = await generateAIResponse(message, context);

    // Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: {
        userId: req.user.id,
        message: aiResponseText,
        type: 'AI_ASSISTANT',
        context: JSON.stringify({
          originalMessage: message,
          ...context
        })
      }
    });

    res.json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    logger.error('Chat message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
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