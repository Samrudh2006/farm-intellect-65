import { useCallback, useState, useEffect } from 'react';
import { analyzeQuery, buildContextMessage, type QueryAnalysis } from '@/lib/queryAnalysis';

export interface UserContext {
  userId?: string;
  location?: string;
  primaryCrops?: string[];
  farmSize?: number;
  soilType?: string;
  irrigationType?: string;
  region?: string;
  languagePreference?: string;
}

interface ContextInjectionOptions {
  enableQueryAnalysis?: boolean;
  enableUserContext?: boolean;
  maxContextLength?: number;
}

/**
 * Custom hook for managing context injection into AI conversations
 * Enriches queries with user data and analysis for better AI responses
 */
export const useContextInjection = (options: ContextInjectionOptions = {}) => {
  const {
    enableQueryAnalysis = true,
    enableUserContext = true,
    maxContextLength = 500,
  } = options;

  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user context from localStorage (temporary - will integrate with DB)
  useEffect(() => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('user_context');
      if (stored) {
        setUserContext(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load user context:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user context
  const updateUserContext = useCallback((context: Partial<UserContext>) => {
    setUserContext((prev) => {
      const updated = { ...prev, ...context };
      try {
        localStorage.setItem('user_context', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save user context:', err);
      }
      return updated;
    });
  }, []);

  // Build enriched message with context
  const enrichMessage = useCallback(
    (message: string): { enrichedMessage: string; analysis: QueryAnalysis | null } => {
      let enrichedMessage = message;
      let analysis: QueryAnalysis | null = null;

      if (enableQueryAnalysis) {
        analysis = analyzeQuery(message);

        if (enableUserContext && userContext) {
          const contextMsg = buildContextMessage(analysis, userContext);
          if (contextMsg) {
            // Limit context length to avoid token overflow
            if (contextMsg.length > maxContextLength) {
              enrichedMessage = `${message}\n\n${contextMsg.substring(0, maxContextLength)}...`;
            } else {
              enrichedMessage = `${message}\n\n${contextMsg}`;
            }
          }
        }
      }

      return { enrichedMessage, analysis };
    },
    [enableQueryAnalysis, enableUserContext, userContext, maxContextLength]
  );

  // Get context-aware system prompt
  const getSystemPrompt = useCallback((): string => {
    const basePrompt = 'You are Krishi AI, a practical agricultural assistant for Indian farmers. Provide accurate, actionable, farmer-friendly advice grounded in agronomy, soil health, weather risks, pest management, irrigation, crop calendars, mandi realities, and government schemes.';

    if (!enableUserContext || !userContext) {
      return basePrompt;
    }

    const contextParts: string[] = [basePrompt];

    if (userContext.location) {
      contextParts.push(`The farmer is based in ${userContext.location}.`);
    }

    if (userContext.primaryCrops?.length) {
      contextParts.push(`Primary crops: ${userContext.primaryCrops.join(', ')}.`);
    }

    if (userContext.farmSize) {
      contextParts.push(`Farm size: ${userContext.farmSize} hectares.`);
    }

    if (userContext.soilType) {
      contextParts.push(`Soil type: ${userContext.soilType}.`);
    }

    if (userContext.irrigationType) {
      contextParts.push(`Irrigation: ${userContext.irrigationType}.`);
    }

    contextParts.push('Tailor recommendations to their specific situation. If you need more information to provide accurate advice, ask clarifying questions.');

    return contextParts.join(' ');
  }, [enableUserContext, userContext]);

  // Clear all context
  const clearContext = useCallback(() => {
    setUserContext(null);
    try {
      localStorage.removeItem('user_context');
    } catch (err) {
      console.error('Failed to clear context:', err);
    }
  }, []);

  return {
    userContext,
    isLoading,
    updateUserContext,
    enrichMessage,
    getSystemPrompt,
    clearContext,
  };
};
