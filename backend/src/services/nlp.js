/**
 * NLP Service
 * Leverages Sarvam AI for text classification, sentiment analysis,
 * forum auto-tagging, document summarization, and scheme matching.
 */

import { createSarvamChatCompletion } from './sarvam.js';
import { logger } from '../utils/logger.js';

// ─── Forum Post Auto-Tagging ──────────────────────────────────────────────────

const FORUM_CATEGORIES = [
  'pest-management', 'disease-diagnosis', 'soil-health', 'irrigation',
  'fertilizer', 'government-scheme', 'market-price', 'organic-farming',
  'seed-selection', 'harvest-technique', 'weather-advisory', 'equipment',
  'livestock', 'general-discussion',
];

/**
 * Classify a forum post into agricultural categories and extract entities.
 */
export async function classifyForumPost(title, body) {
  try {
    const result = await createSarvamChatCompletion({
      messages: [
        {
          role: 'system',
          content: `You are an Indian agricultural text classifier. Given a farmer's forum post, respond ONLY in JSON:
{
  "primary_category": "one of: ${FORUM_CATEGORIES.join(', ')}",
  "secondary_categories": ["optional additional categories"],
  "crops_mentioned": ["crop1", "crop2"],
  "urgency": "low|medium|high",
  "sentiment": "positive|neutral|negative|distressed",
  "language_detected": "en|hi|pa|ta|te|bn|mr|gu|kn|ml",
  "keywords": ["key1", "key2", "key3"],
  "suggested_experts": ["soil-scientist", "entomologist", "agronomist", "horticulturist"]
}`,
        },
        { role: 'user', content: `Title: ${title}\n\nBody: ${body}` },
      ],
      temperature: 0.1,
      maxTokens: 300,
    });

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return { source: 'sarvam-nlp', ...JSON.parse(jsonMatch[0]) };
  } catch (err) {
    logger.warn('Sarvam classification unavailable:', err.message);
  }

  // Fallback: keyword-based classification
  return keywordClassify(title + ' ' + body);
}

function keywordClassify(text) {
  const lower = text.toLowerCase();
  const rules = [
    { keywords: ['pest', 'insect', 'worm', 'borer', 'aphid', 'whitefly', 'bollworm', 'armyworm', 'keet', 'kira'], category: 'pest-management' },
    { keywords: ['disease', 'blight', 'rust', 'mildew', 'rot', 'wilt', 'blast', 'spot', 'fungus', 'rog', 'bimari'], category: 'disease-diagnosis' },
    { keywords: ['soil', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'organic carbon', 'mitti', 'bhumi'], category: 'soil-health' },
    { keywords: ['water', 'irrigation', 'drip', 'sprinkler', 'canal', 'paani', 'sinchai'], category: 'irrigation' },
    { keywords: ['fertilizer', 'urea', 'dap', 'npk', 'manure', 'compost', 'khad'], category: 'fertilizer' },
    { keywords: ['scheme', 'subsidy', 'pm-kisan', 'pmfby', 'kcc', 'yojana', 'sarkar'], category: 'government-scheme' },
    { keywords: ['price', 'mandi', 'msp', 'market', 'bazaar', 'rate', 'sell', 'bhav', 'daam'], category: 'market-price' },
    { keywords: ['organic', 'natural', 'jeevamrit', 'vermicompost', 'jaivik'], category: 'organic-farming' },
    { keywords: ['seed', 'variety', 'hybrid', 'bij', 'beej'], category: 'seed-selection' },
    { keywords: ['weather', 'rain', 'drought', 'hail', 'heat', 'mausam', 'barish'], category: 'weather-advisory' },
  ];

  const matches = rules
    .map(r => ({ category: r.category, score: r.keywords.filter(k => lower.includes(k)).length }))
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    source: 'keyword-fallback',
    primary_category: matches[0]?.category || 'general-discussion',
    secondary_categories: matches.slice(1, 3).map(m => m.category),
    crops_mentioned: [],
    urgency: 'medium',
    sentiment: 'neutral',
    language_detected: 'en',
    keywords: [],
    suggested_experts: ['agronomist'],
  };
}


// ─── Sentiment Analysis ───────────────────────────────────────────────────────

/**
 * Analyze sentiment of farmer feedback/forum posts.
 */
export async function analyzeSentiment(text) {
  try {
    const result = await createSarvamChatCompletion({
      messages: [
        {
          role: 'system',
          content: `Analyze the sentiment of this Indian farmer's message. Respond ONLY in JSON:
{
  "sentiment": "positive|neutral|negative|distressed",
  "confidence": 0-100,
  "emotion": "happy|hopeful|neutral|worried|frustrated|desperate",
  "topics": ["topic1"],
  "needs_attention": true/false,
  "summary": "one-line summary"
}`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
      maxTokens: 200,
    });

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.warn('Sentiment analysis error:', err.message);
  }

  // Basic fallback
  const lower = text.toLowerCase();
  const negative = ['problem', 'fail', 'loss', 'damage', 'die', 'dead', 'help', 'urgent', 'nuksan', 'barbad', 'madad'];
  const positive = ['good', 'great', 'harvest', 'profit', 'success', 'happy', 'achha', 'fasal', 'munafa'];
  const negCount = negative.filter(w => lower.includes(w)).length;
  const posCount = positive.filter(w => lower.includes(w)).length;

  return {
    sentiment: negCount > posCount ? 'negative' : posCount > negCount ? 'positive' : 'neutral',
    confidence: 55,
    emotion: negCount > 2 ? 'distressed' : 'neutral',
    needs_attention: negCount > 2,
    summary: 'Auto-classified based on keywords.',
  };
}


// ─── Document/Advisory Summarization ──────────────────────────────────────────

/**
 * Summarize long agricultural advisories for quick farmer consumption.
 */
export async function summarizeAdvisory(text, targetLanguage = 'en') {
  try {
    const langInstruction = targetLanguage !== 'en'
      ? `Respond in language code: ${targetLanguage}.`
      : 'Respond in English.';

    const result = await createSarvamChatCompletion({
      messages: [
        {
          role: 'system',
          content: `Summarize this agricultural advisory for a farmer in simple, actionable bullet points. ${langInstruction}
Respond in JSON:
{
  "title": "concise title",
  "summary": "2-3 sentence summary",
  "action_items": ["action1", "action2", "action3"],
  "urgency": "low|medium|high",
  "affected_crops": ["crop1"],
  "valid_until": "date or duration"
}`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
      maxTokens: 400,
    });

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.warn('Summarization error:', err.message);
  }

  return {
    title: 'Advisory Summary',
    summary: text.substring(0, 200) + '...',
    action_items: ['Read the full advisory for details'],
    urgency: 'medium',
  };
}


// ─── Government Scheme Matching ───────────────────────────────────────────────

/**
 * Match a farmer profile to eligible government schemes.
 */
export async function matchGovernmentSchemes({ landHolding, cropType, state, category, income }) {
  try {
    const result = await createSarvamChatCompletion({
      messages: [
        {
          role: 'system',
          content: `You are an expert on Indian agricultural government schemes (PM-KISAN, PMFBY, KCC, Soil Health Card, PKVY, RKVY, eNAM, MIDH, NMSA, PM-KUSUM, etc).
Given a farmer's profile, list all eligible schemes. Respond ONLY in JSON:
{
  "eligible_schemes": [
    {
      "name": "scheme name",
      "hindi_name": "Hindi name",
      "benefit": "what the farmer gets",
      "eligibility": "why they qualify",
      "how_to_apply": "brief steps",
      "deadline": "if applicable"
    }
  ],
  "total_potential_benefit": "estimated annual benefit in ₹"
}`,
        },
        {
          role: 'user',
          content: `Farmer Profile: Land: ${landHolding} acres, Crop: ${cropType}, State: ${state}, Category: ${category || 'General'}, Annual Income: ₹${income || 'Not specified'}`,
        },
      ],
      temperature: 0.2,
      maxTokens: 800,
    });

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.warn('Scheme matching error:', err.message);
  }

  // Fallback — universal schemes every farmer is eligible for
  return {
    eligible_schemes: [
      { name: 'PM-KISAN', hindi_name: 'पीएम-किसान', benefit: '₹6,000/year in 3 installments', eligibility: 'All landholding farmers', how_to_apply: 'Apply at pmkisan.gov.in or nearest CSC center' },
      { name: 'Soil Health Card', hindi_name: 'मृदा स्वास्थ्य कार्ड', benefit: 'Free soil testing and recommendations', eligibility: 'All farmers', how_to_apply: 'Contact nearest KVK or agriculture office' },
      { name: 'PMFBY', hindi_name: 'पीएम फसल बीमा', benefit: 'Crop insurance at subsidized premium', eligibility: 'All crop-growing farmers', how_to_apply: 'Apply through bank or CSC before sowing season deadline' },
      { name: 'KCC', hindi_name: 'किसान क्रेडिट कार्ड', benefit: 'Crop loan at 4% interest (with subvention)', eligibility: 'All landholding farmers', how_to_apply: 'Apply at any bank with land documents' },
    ],
    total_potential_benefit: '₹6,000+ (PM-KISAN) + subsidized loans and insurance',
  };
}


// ─── Crop Calendar Advisory (NLP-generated) ─────────────────────────────────

/**
 * Generate a personalized crop calendar advisory based on crop, location, and current date.
 */
export async function generateCropCalendar({ cropType, location, soilType, sowingDate }) {
  try {
    const result = await createSarvamChatCompletion({
      messages: [
        {
          role: 'system',
          content: `You are an ICAR agronomist. Generate a detailed crop calendar. Respond ONLY in JSON:
{
  "crop": "name",
  "location": "region",
  "total_duration_days": 120,
  "stages": [
    {
      "stage": "Land Preparation",
      "week": "Week 1-2",
      "activities": ["activity1", "activity2"],
      "inputs_needed": ["input1"],
      "critical_notes": "important note"
    }
  ],
  "key_dates": {
    "sowing_window": "date range",
    "first_irrigation": "timing",
    "harvest_window": "date range"
  }
}`,
        },
        {
          role: 'user',
          content: `Crop: ${cropType}, Location: ${location}, Soil: ${soilType || 'Alluvial'}, Planned sowing: ${sowingDate || 'Current season'}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 800,
    });

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.warn('Crop calendar generation error:', err.message);
  }

  return { error: 'Could not generate calendar. Please try again later.' };
}
