import { completeAssistantPrompt } from '@/lib/assistantApi';

export type AiMessage = { role: "user" | "assistant" | "system"; content: string };

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
  try {
    const response = await completeAssistantPrompt({ messages, mode });
    onDelta(response.content);
    onDone();
  } catch (e) {
    onError?.(e instanceof Error ? e.message : "Connection failed");
    onDone();
  }
}

/** Non-streaming call for structured responses */
export async function invokeAI({
  messages,
  mode = "chat",
}: {
  messages: AiMessage[];
  mode?: "chat" | "disease" | "recommendation" | "yield";
}): Promise<string> {
  const response = await completeAssistantPrompt({ messages, mode });
  return response.content;
}
