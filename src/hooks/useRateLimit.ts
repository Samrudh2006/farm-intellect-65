import { useCallback, useRef, useState } from 'react';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  backoffMs?: number;
}

/**
 * Custom hook for client-side rate limiting with exponential backoff
 * Provides visual feedback for rate limit status
 */
export const useRateLimit = (config: RateLimitConfig) => {
  const { maxRequests, windowMs, backoffMs = 1000 } = config;

  const requestTimesRef = useRef<number[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const backoffRef = useRef(0);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove expired entries
    requestTimesRef.current = requestTimesRef.current.filter(
      (time) => time > windowStart
    );

    if (requestTimesRef.current.length >= maxRequests) {
      const oldestRequest = Math.min(...requestTimesRef.current);
      const timeUntilReset = Math.max(
        0,
        oldestRequest + windowMs - now
      );

      setIsRateLimited(true);
      setRemainingRequests(0);
      setResetTime(new Date(now + timeUntilReset));

      // Exponential backoff
      backoffRef.current = Math.min(
        30000,
        (backoffRef.current || backoffMs) * 2
      );

      return false;
    }

    // Reset backoff on successful request
    backoffRef.current = 0;

    setIsRateLimited(false);
    setRemainingRequests(maxRequests - requestTimesRef.current.length);
    setResetTime(null);

    return true;
  }, [maxRequests, windowMs]);

  const recordRequest = useCallback(() => {
    if (checkRateLimit()) {
      requestTimesRef.current.push(Date.now());
      return true;
    }
    return false;
  }, [checkRateLimit]);

  const getWaitTime = useCallback(() => {
    if (!resetTime) return 0;
    return Math.max(0, resetTime.getTime() - Date.now());
  }, [resetTime]);

  const retry = useCallback(async <T,>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> => {
    let lastError: Error | null = null;
    let currentBackoff = backoffRef.current || backoffMs;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (!recordRequest()) {
          const waitTime = getWaitTime();
          console.log(`[v0] Rate limited, waiting ${waitTime}ms before retry`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
        return await fn();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries - 1) {
          console.log(
            `[v0] Request failed (attempt ${attempt + 1}), retrying in ${currentBackoff}ms`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, currentBackoff)
          );
          currentBackoff *= 2;
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }, [recordRequest, getWaitTime, backoffMs]);

  return {
    isRateLimited,
    remainingRequests,
    resetTime,
    recordRequest,
    checkRateLimit,
    getWaitTime,
    retry,
  };
};
