/**
 * Query Analysis Utility
 * Analyzes user queries to detect type, intent, and extract context
 */

export type QueryType = 'disease' | 'recommendation' | 'yield' | 'weather' | 'soil' | 'fertilizer' | 'market' | 'general';
export type Intent = 'ask_for_info' | 'ask_for_advice' | 'report_problem' | 'request_calculation' | 'general';

export interface QueryAnalysis {
  type: QueryType;
  intent: Intent;
  confidence: number; // 0-100
  keywords: string[];
  crop?: string;
  location?: string;
  season?: string;
}

// Disease-related keywords
const DISEASE_KEYWORDS = [
  'disease', 'blight', 'rust', 'mildew', 'spot', 'wilt', 'rot', 'blast',
  'scorch', 'yellowing', 'lesion', 'fungal', 'bacterial', 'viral', 'infection',
  'epidemic', 'infestation', 'pest', 'bug', 'insect', 'affected', 'sick', 'dies',
  'brown', 'black', 'white', 'patches', 'holes', 'wilting', 'drooping'
];

// Recommendation-related keywords
const RECOMMENDATION_KEYWORDS = [
  'recommend', 'suggest', 'should', 'which crop', 'best crop', 'right crop',
  'suitable', 'appropriate', 'plant', 'grow', 'cultivate', 'kya ugau',
  'kaun sa', 'best farming', 'crop selection', 'what to grow'
];

// Yield-related keywords
const YIELD_KEYWORDS = [
  'yield', 'harvest', 'production', 'output', 'productivity', 'how much',
  'kitna hoga', 'expected', 'estimate', 'forecast', 'average', 'tonnes',
  'quintal', 'per hectare', 'per acre'
];

// Weather-related keywords
const WEATHER_KEYWORDS = [
  'weather', 'rain', 'rainfall', 'drought', 'heat', 'cold', 'frost',
  'flood', 'hailstorm', 'wind', 'monsoon', 'forecast', 'advisory'
];

// Soil-related keywords
const SOIL_KEYWORDS = [
  'soil', 'ph', 'alkaline', 'saline', 'mitti', 'fertility', 'organic',
  'carbon', 'nitrogen', 'health', 'compaction', 'drainage', 'texture'
];

// Fertilizer-related keywords
const FERTILIZER_KEYWORDS = [
  'fertilizer', 'npk', 'nitrogen', 'phosphorus', 'potassium', 'dose',
  'application', 'urea', 'dap', 'manure', 'compost', 'nutrition', 'nutrient'
];

// Market-related keywords
const MARKET_KEYWORDS = [
  'market', 'price', 'msp', 'mandi', 'enam', 'sell', 'sell', 'rate',
  'profit', 'earning', 'income', 'value', 'sell my crop'
];

// Crop names for context
const CROP_NAMES = [
  'tomato', 'wheat', 'rice', 'potato', 'cotton', 'maize', 'mustard',
  'onion', 'chickpea', 'apple', 'grape', 'sugarcane', 'cabbage', 'carrot',
  'broccoli', 'spinach', 'garlic', 'turmeric', 'ginger', 'chilli', 'pepper'
];

// Seasons
const SEASONS = ['rabi', 'kharif', 'zaid', 'summer', 'winter', 'monsoon'];

// Location hints
const LOCATIONS = [
  'punjab', 'haryana', 'uttar pradesh', 'maharashtra', 'karnataka', 'rajasthan',
  'madhya pradesh', 'west bengal', 'tamil nadu', 'telangana', 'andhra pradesh'
];

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  return words.filter(word => word.length > 3);
}

function detectCrop(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const crop of CROP_NAMES) {
    if (lower.includes(crop)) {
      return crop;
    }
  }
  return undefined;
}

function detectSeason(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const season of SEASONS) {
    if (lower.includes(season)) {
      return season;
    }
  }
  return undefined;
}

function detectLocation(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const location of LOCATIONS) {
    if (lower.includes(location)) {
      return location;
    }
  }
  return undefined;
}

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter(keyword => lower.includes(keyword)).length;
}

/**
 * Analyze a user query to determine type, intent, and extract context
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const lower = query.toLowerCase();
  const keywords = extractKeywords(query);

  const diseaseMatches = countMatches(query, DISEASE_KEYWORDS);
  const recommendMatches = countMatches(query, RECOMMENDATION_KEYWORDS);
  const yieldMatches = countMatches(query, YIELD_KEYWORDS);
  const weatherMatches = countMatches(query, WEATHER_KEYWORDS);
  const soilMatches = countMatches(query, SOIL_KEYWORDS);
  const fertilizerMatches = countMatches(query, FERTILIZER_KEYWORDS);
  const marketMatches = countMatches(query, MARKET_KEYWORDS);

  // Determine primary type
  let type: QueryType = 'general';
  let confidence = 0;

  const scores = [
    { type: 'disease' as const, score: diseaseMatches },
    { type: 'recommendation' as const, score: recommendMatches },
    { type: 'yield' as const, score: yieldMatches },
    { type: 'weather' as const, score: weatherMatches },
    { type: 'soil' as const, score: soilMatches },
    { type: 'fertilizer' as const, score: fertilizerMatches },
    { type: 'market' as const, score: marketMatches },
  ];

  const topScore = scores.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  );

  if (topScore.score > 0) {
    type = topScore.type;
    confidence = Math.min(100, 50 + topScore.score * 10);
  } else {
    confidence = 30; // Low confidence for general query
  }

  // Determine intent
  let intent: Intent = 'general';
  if (lower.includes('?') || lower.match(/how|what|when|where|why|which/)) {
    intent = 'ask_for_info';
  } else if (lower.match(/recommend|suggest|should|better|best/)) {
    intent = 'ask_for_advice';
  } else if (lower.match(/problem|issue|help|sick|dying|affected|damaged/)) {
    intent = 'report_problem';
  } else if (lower.match(/calculate|estimate|how much|expected/)) {
    intent = 'request_calculation';
  }

  return {
    type,
    intent,
    confidence: Math.round(confidence),
    keywords,
    crop: detectCrop(query),
    location: detectLocation(query),
    season: detectSeason(query),
  };
}

/**
 * Build context message from query analysis and user data
 * Can be injected into AI system prompt
 */
export function buildContextMessage(
  analysis: QueryAnalysis,
  userData?: {
    location?: string;
    primaryCrops?: string[];
    farmSize?: number;
    soilType?: string;
  }
): string {
  const contextParts: string[] = [];

  if (userData?.location) {
    contextParts.push(`User location: ${userData.location}`);
  }

  if (analysis.location) {
    contextParts.push(`Query location hint: ${analysis.location}`);
  }

  if (analysis.crop) {
    contextParts.push(`Crop mentioned: ${analysis.crop}`);
  }

  if (userData?.primaryCrops?.length) {
    contextParts.push(`Known crops: ${userData.primaryCrops.join(', ')}`);
  }

  if (analysis.season) {
    contextParts.push(`Season: ${analysis.season}`);
  }

  if (userData?.farmSize) {
    contextParts.push(`Farm size: ${userData.farmSize} hectares`);
  }

  if (userData?.soilType) {
    contextParts.push(`Soil type: ${userData.soilType}`);
  }

  if (analysis.type !== 'general') {
    contextParts.push(`Query type: ${analysis.type}`);
  }

  return contextParts.length > 0
    ? `Context:\n${contextParts.map(p => `- ${p}`).join('\n')}`
    : '';
}

/**
 * Get recommended follow-up questions based on query analysis
 */
export function getSuggestedFollowUps(analysis: QueryAnalysis): string[] {
  const suggestions: string[] = [];

  switch (analysis.type) {
    case 'disease':
      suggestions.push(
        'What are the preventive measures?',
        'Can I use organic treatment?',
        'How severe is the infection?'
      );
      break;
    case 'recommendation':
      suggestions.push(
        'What is the expected yield?',
        'What fertilizers should I use?',
        'When is the best planting time?'
      );
      break;
    case 'yield':
      suggestions.push(
        'What are the risk factors?',
        'How to improve productivity?',
        'What is current market rate?'
      );
      break;
    case 'weather':
      suggestions.push(
        'How should I protect my crops?',
        'What is the forecast duration?',
        'Are there any schemes for this?'
      );
      break;
    case 'soil':
      suggestions.push(
        'How to improve soil health?',
        'What fertilizer is recommended?',
        'Should I do soil testing?'
      );
      break;
    case 'fertilizer':
      suggestions.push(
        'When is the best time to apply?',
        'What is the cost?',
        'Are there organic alternatives?'
      );
      break;
    case 'market':
      suggestions.push(
        'What is today\'s MSP?',
        'How to get better prices?',
        'Which mandi is best?'
      );
      break;
  }

  return suggestions.slice(0, 3);
}
