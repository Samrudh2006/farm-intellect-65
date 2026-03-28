export type AiMessage = { role: "user" | "assistant" | "system"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

class AIStreamError extends Error {
  constructor(
    message: string,
    public status?: number,
    public retryable?: boolean
  ) {
    super(message);
    this.name = 'AIStreamError';
  }
}

function isRetryableError(status?: number): boolean {
  // 429: Too Many Requests, 502/503: Service Unavailable, 504: Gateway Timeout
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function buildErrorMessage(error: AIStreamError): string {
  switch (error.status) {
    case 429:
      return 'Rate limited — too many requests. Please wait a moment and try again.';
    case 402:
      return 'AI credits exhausted. Please add credits to continue.';
    case 401:
    case 403:
      return 'Authentication failed. Please log in again.';
    case 502:
    case 503:
      return 'AI service is temporarily unavailable. Please try again in a moment.';
    case 504:
      return 'Request timeout. Please try again with a shorter message.';
    default:
      return error.message || 'Failed to get AI response. Please try again.';
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function streamChat({
  messages,
  mode = "chat",
  onDelta,
  onDone,
  onError,
}: {
  messages: AiMessage[];
  mode?: "chat" | "disease" | "recommendation" | "yield";
  onDelta: (text: string) => void;
  onDone: () => void;
  onError?: (error: string) => void;
}) {
  let lastError: AIStreamError | null = null;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Get the user's session token for authenticated requests
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      console.log(`[v0] Streaming chat request (attempt ${retryCount + 1}/${MAX_RETRIES}, mode: ${mode})`);

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages, mode }),
      });

      if (!resp.ok) {
        let errMsg = `Request failed (${resp.status})`;
        try {
          const payload = await resp.json();
          errMsg = payload.error || errMsg;
        } catch { /* keep default */ }

        const retryable = isRetryableError(resp.status);
        const error = new AIStreamError(errMsg, resp.status, retryable);

        if (!retryable || retryCount >= MAX_RETRIES - 1) {
          console.error(`[v0] AI stream error (final attempt):`, error);
          lastError = error;
          break;
        }

        // Retry with exponential backoff
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, retryCount);
        console.log(`[v0] Retryable error, backing off ${backoffMs}ms before retry`);
        lastError = error;
        retryCount++;
        await sleep(backoffMs);
        continue;
      }

      if (!resp.body) {
        throw new AIStreamError("No response body from server");
      }

      // Successfully started streaming
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;
      let hasReceivedData = false;

      while (!streamDone) {
        try {
          const { done, value } = await reader.read();
          if (done) break;

          hasReceivedData = true;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) onDelta(content);
            } catch {
              // Incomplete JSON — put back and wait
              buffer = line + "\n" + buffer;
              break;
            }
          }
        } catch (streamErr) {
          // Handle stream read errors
          if (streamErr instanceof Error) {
            console.error(`[v0] Stream read error:`, streamErr.message);
            throw new AIStreamError(`Stream error: ${streamErr.message}`);
          }
          throw streamErr;
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch { /* ignore */ }
        }
      }

      if (!hasReceivedData) {
        console.warn(`[v0] No data received from stream`);
        throw new AIStreamError("No data received from AI service");
      }

      console.log(`[v0] Stream completed successfully`);
      onDone();
      return; // Success!
    } catch (e) {
      const error = e instanceof AIStreamError
        ? e
        : new AIStreamError(e instanceof Error ? e.message : "Connection failed");

      console.error(`[v0] Stream error:`, error);
      lastError = error;

      if (!error.retryable || retryCount >= MAX_RETRIES - 1) {
        break;
      }

      // Retry with exponential backoff
      const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, retryCount);
      console.log(`[v0] Backing off ${backoffMs}ms before retry`);
      retryCount++;
      await sleep(backoffMs);
    }
  }

  // All retries exhausted
  const finalErrorMsg = lastError ? buildErrorMessage(lastError) : "Failed to get AI response";
  console.error(`[v0] All retry attempts exhausted. Final error: ${finalErrorMsg}`);
  onError?.(finalErrorMsg);
  onDone();
}

/** Non-streaming call */
export async function invokeAI({
  messages,
  mode = "chat",
}: {
  messages: AiMessage[];
  mode?: "chat" | "disease" | "recommendation" | "yield";
}): Promise<string> {
  let result = "";
  await streamChat({
    messages,
    mode,
    onDelta: (t) => { result += t; },
    onDone: () => {},
    onError: (err) => { throw new Error(err); },
  });
  return result;
}
