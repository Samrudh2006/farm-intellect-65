# Quick Start: Using the Improved AI Chatbot

## Installation

The improvements are automatically available. No additional dependencies needed beyond what you already have:
- React 18+
- TypeScript
- Supabase client
- Sonner (for toasts)

## Basic Usage

### 1. Simple Chat Component

```typescript
import { EnhancedAIChatbot } from '@/components/chat/EnhancedAIChatbot';

export default function ChatPage() {
  return (
    <div className="p-4">
      <EnhancedAIChatbot />
    </div>
  );
}
```

### 2. Custom Chat with Hooks

```typescript
import { useAIChatbot } from '@/hooks/useAIChatbot';

export function MyCustomChat() {
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  } = useAIChatbot({
    maxHistory: 25,
    autoSpeak: true,
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello!')}>Send</button>
      <button onClick={clearChat}>Clear</button>
    </div>
  );
}
```

### 3. With Chat History

```typescript
import { useChatHistory } from '@/hooks/useChatHistory';

export function ChatWithHistory() {
  const { 
    history,
    searchHistory,
    exportAsJSON,
    deleteEntry,
  } = useChatHistory();

  return (
    <div>
      <input 
        onChange={(e) => searchHistory(e.target.value)}
        placeholder="Search..."
      />
      {history.map((entry) => (
        <div key={entry.id}>
          <p>{entry.title}</p>
          <button onClick={() => deleteEntry(entry.id)}>Delete</button>
          <button onClick={exportAsJSON}>Export JSON</button>
        </div>
      ))}
    </div>
  );
}
```

### 4. With Context Injection

```typescript
import { useContextInjection } from '@/hooks/useContextInjection';
import { useAIChatbot } from '@/hooks/useAIChatbot';

export function SmartChat() {
  const { updateUserContext, enrichMessage } = useContextInjection();
  const { sendMessage } = useAIChatbot();

  const handleSetupContext = () => {
    updateUserContext({
      location: 'Punjab',
      primaryCrops: ['wheat', 'rice'],
      farmSize: 5,
      soilType: 'loamy',
    });
  };

  const handleSendWithContext = async (text: string) => {
    const { enrichedMessage } = enrichMessage(text);
    await sendMessage(enrichedMessage);
  };

  return (
    <div>
      <button onClick={handleSetupContext}>Setup Context</button>
      <button onClick={() => handleSendWithContext('How to improve soil?')}>
        Send
      </button>
    </div>
  );
}
```

### 5. With Rate Limiting

```typescript
import { useRateLimit } from '@/hooks/useRateLimit';

export function RateLimitedChat() {
  const { recordRequest, isRateLimited, remainingRequests } = useRateLimit({
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  });

  const handleSend = async () => {
    if (!recordRequest()) {
      alert('Too many requests. Please wait.');
      return;
    }
    // Send message...
  };

  return (
    <div>
      <p>Requests remaining: {remainingRequests}/10</p>
      {isRateLimited && <p>Please wait before sending another message</p>}
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### 6. Query Analysis

```typescript
import { analyzeQuery, getSuggestedFollowUps } from '@/lib/queryAnalysis';

export function AnalyzedChat() {
  const handleAnalyze = (query: string) => {
    const analysis = analyzeQuery(query);
    console.log(`Query type: ${analysis.type} (${analysis.confidence}%)`);
    console.log(`Crops detected: ${analysis.crop}`);
    console.log(`Suggested follow-ups:`, getSuggestedFollowUps(analysis));
  };

  return (
    <input 
      onChange={(e) => handleAnalyze(e.target.value)}
      placeholder="Type a question..."
    />
  );
}
```

## File Structure

```
src/
├── hooks/
│   ├── useAIChatbot.ts           # Main chat logic
│   ├── useChatHistory.ts         # History management
│   ├── useRateLimit.ts           # Rate limiting
│   └── useContextInjection.ts    # Context building
├── lib/
│   ├── aiStream.ts               # Enhanced streaming with retry
│   └── queryAnalysis.ts          # Query classification
└── components/
    └── chat/
        ├── EnhancedAIChatbot.tsx # Main component
        └── ChatHistoryPanel.tsx  # History UI
```

## API Reference

### useAIChatbot()

**Parameters**:
```typescript
{
  maxHistory?: number;      // Default: 25
  autoSpeak?: boolean;      // Default: false
  language?: string;        // Default: 'en'
  onError?: (err: string) => void;
}
```

**Returns**:
```typescript
{
  messages: Message[];
  isLoading: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (text: string) => Promise<void>;
  addFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  copyMessage: (content: string) => void;
  clearChat: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
  getMessageHistory: (page: number, pageSize: number) => {
    messages: Message[];
    total: number;
    hasMore: boolean;
    page: number;
  };
  detectQueryType: (text: string) => QueryType;
}
```

### useChatHistory()

**Parameters**:
```typescript
{
  pageSize?: number;       // Default: 25
  storageKey?: string;     // Default: 'chatbot_history'
}
```

**Returns**:
```typescript
{
  history: ChatHistoryEntry[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
  searchQuery: string;
  addEntry: (messages: Message[], title?: string) => ChatHistoryEntry;
  deleteEntry: (id: string) => void;
  searchHistory: (query: string) => ChatHistoryEntry[];
  getPaginatedResults: () => {
    entries: ChatHistoryEntry[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  };
  exportAsJSON: () => void;
  exportAsCSV: () => void;
  exportAsPDF: () => void;
  clearAll: () => void;
}
```

### useRateLimit()

**Parameters**:
```typescript
{
  maxRequests: number;     // Required
  windowMs: number;        // Required (ms)
  backoffMs?: number;      // Default: 1000
}
```

**Returns**:
```typescript
{
  isRateLimited: boolean;
  remainingRequests: number;
  resetTime: Date | null;
  recordRequest: () => boolean;
  checkRateLimit: () => boolean;
  getWaitTime: () => number;
  retry: <T,>(fn: () => Promise<T>, maxRetries?: number) => Promise<T>;
}
```

### useContextInjection()

**Parameters**:
```typescript
{
  enableQueryAnalysis?: boolean;    // Default: true
  enableUserContext?: boolean;      // Default: true
  maxContextLength?: number;        // Default: 500
}
```

**Returns**:
```typescript
{
  userContext: UserContext | null;
  isLoading: boolean;
  updateUserContext: (context: Partial<UserContext>) => void;
  enrichMessage: (message: string) => {
    enrichedMessage: string;
    analysis: QueryAnalysis | null;
  };
  getSystemPrompt: () => string;
  clearContext: () => void;
}
```

## Common Patterns

### Pattern 1: Error Handling
```typescript
const { sendMessage } = useAIChatbot({
  onError: (err) => {
    console.error('Chat error:', err);
    // Show user-friendly message
  },
});
```

### Pattern 2: Rate Limit + Send
```typescript
const { recordRequest } = useRateLimit({ maxRequests: 10, windowMs: 60000 });
const { sendMessage } = useAIChatbot();

const safeSend = async (text: string) => {
  if (!recordRequest()) {
    toast.error('Please wait before sending another message');
    return;
  }
  await sendMessage(text);
};
```

### Pattern 3: Context-Aware Chat
```typescript
const { enrichMessage } = useContextInjection();
const { sendMessage } = useAIChatbot();

const sendWithContext = async (text: string) => {
  const { enrichedMessage } = enrichMessage(text);
  await sendMessage(enrichedMessage);
};
```

### Pattern 4: History Management
```typescript
const { addEntry, exportAsJSON } = useChatHistory();

const saveAndExport = (messages: Message[]) => {
  const entry = addEntry(
    messages.map(m => ({
      role: m.type,
      content: m.content
    })),
    'My conversation'
  );
  exportAsJSON();
};
```

## Debugging

All console logs use the `[v0]` prefix for easy filtering:

```bash
# Show all v0 logs
console.log("[v0] ...")

# Filter in DevTools
[v0]
```

Check the browser console for:
- Stream connection status
- Retry attempts and backoff
- Rate limit status
- Query analysis results
- Error details

## Troubleshooting

### Chat not responding
1. Check rate limit status in header
2. Check browser console for errors
3. Verify Supabase connection
4. Check network tab for API calls

### History not saving
1. Check localStorage quota
2. Try clearing old history
3. Verify localStorage is enabled
4. Check browser console errors

### Rate limiting too strict
1. Adjust `maxRequests` parameter
2. Increase `windowMs` time window
3. Check remaining requests counter

## Next Steps

1. **Integrate with database** - Migrate from localStorage to Supabase
2. **Add analytics** - Track query types and AI performance
3. **Enhance UI** - Add more customization options
4. **Improve accuracy** - Fine-tune query detection
5. **Add features** - Conversation sharing, batch operations

## Support

For issues or questions:
1. Check the console logs (filter for `[v0]`)
2. Review the detailed documentation in `CHATBOT_IMPROVEMENTS.md`
3. Check the error messages - they provide actionable guidance
4. Verify your configuration matches your use case
