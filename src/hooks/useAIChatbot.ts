import { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat, type AiMessage } from '@/lib/aiStream';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  feedback?: 'up' | 'down';
  queryType?: 'disease' | 'recommendation' | 'yield' | 'general';
  confidence?: number;
}

interface UseAIChatbotOptions {
  maxHistory?: number;
  autoSpeak?: boolean;
  language?: string;
  onError?: (error: string) => void;
}

/**
 * Custom hook for AI chatbot functionality
 * Consolidates message management, streaming, and feedback
 */
export const useAIChatbot = (options: UseAIChatbotOptions = {}) => {
  const {
    maxHistory = 25,
    autoSpeak = false,
    language = 'en',
    onError,
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(autoSpeak);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect query type from user input
  const detectQueryType = useCallback((text: string): Message['queryType'] => {
    const lower = text.toLowerCase();
    if (lower.includes('disease') || lower.includes('blight') || lower.includes('rust')) {
      return 'disease';
    }
    if (lower.includes('recommend') || lower.includes('which crop') || lower.includes('best crop')) {
      return 'recommendation';
    }
    if (lower.includes('yield') || lower.includes('harvest') || lower.includes('production')) {
      return 'yield';
    }
    return 'general';
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Text-to-speech
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !window.speechSynthesis || !text) return;

    stopSpeaking();

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const langCode = language.split('-')[0];
    const matchingVoice =
      voices.find((v) => v.lang === language) ||
      voices.find((v) => v.lang.startsWith(langCode)) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, language, stopSpeaking]);

  // Send message with streaming
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        content: trimmed,
        type: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Cancel any previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Build history
      const history: AiMessage[] = messages
        .filter((m) => !m.isTyping)
        .slice(-maxHistory)
        .map((m) => ({
          role: m.type === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }));
      history.push({ role: 'user', content: trimmed });

      let assistantSoFar = '';
      const queryType = detectQueryType(trimmed);

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.type === 'assistant' && last.id === 'streaming') {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
            );
          }
          return [
            ...prev,
            {
              id: 'streaming',
              content: assistantSoFar,
              type: 'assistant',
              timestamp: new Date(),
              queryType,
            },
          ];
        });
      };

      try {
        await streamChat({
          messages: history,
          mode: queryType === 'general' ? 'chat' : queryType,
          onDelta: upsertAssistant,
          onDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === 'streaming'
                  ? { ...m, id: Date.now().toString(), confidence: 90 }
                  : m
              )
            );
            setIsLoading(false);

            if (voiceEnabled && assistantSoFar) {
              setTimeout(() => speakText(assistantSoFar), 300);
            }
          },
          onError: (err) => {
            const errorMsg = err || 'Failed to get response';
            onError?.(errorMsg);
            toast.error(errorMsg);
            setMessages((prev) =>
              prev.filter((m) => m.id !== 'streaming')
            );
            setIsLoading(false);
          },
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Connection failed';
        onError?.(errorMsg);
        toast.error(errorMsg);
        setMessages((prev) => prev.filter((m) => m.id !== 'streaming'));
        setIsLoading(false);
      }
    },
    [messages, isLoading, maxHistory, detectQueryType, onError, voiceEnabled, speakText]
  );

  // Add feedback to message
  const addFeedback = useCallback((messageId: string, feedback: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
    );
    // TODO: Save feedback to database
    toast.success(feedback === 'up' ? 'Thanks for the feedback!' : 'We&apos;ll improve this');
  }, []);

  // Copy message to clipboard
  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    stopSpeaking();
    setMessages([]);
  }, [stopSpeaking]);

  // Export messages to history with pagination support
  const getMessageHistory = useCallback(
    (page: number = 1, pageSize: number = 25) => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        messages: messages.slice(start, end),
        total: messages.length,
        hasMore: end < messages.length,
        page,
      };
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    isSpeaking,
    voiceEnabled,
    messagesEndRef,
    sendMessage,
    addFeedback,
    copyMessage,
    clearChat,
    speakText,
    stopSpeaking,
    setVoiceEnabled,
    getMessageHistory,
    detectQueryType,
  };
};
