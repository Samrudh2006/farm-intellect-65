# AI Chatbot Improvements - Documentation

## Overview

The AI chatbot has been significantly enhanced with better error handling, consolidated components, advanced features, and improved user experience. These improvements ensure reliability, better responses, and more control over chat history.

## Key Improvements

### 1. **Consolidated Components** ✓
- **What changed**: Created a unified `useAIChatbot` custom hook that consolidates logic from 3 separate chatbot components
- **Benefits**: 
  - Single source of truth for chat logic
  - Easier maintenance and bug fixes
  - Reusable across different components
  - Better state management

**File**: `src/hooks/useAIChatbot.ts`

### 2. **Enhanced Error Handling** ✓
- **What changed**: Implemented exponential backoff retry logic with intelligent error detection
- **Features**:
  - Automatic retry on transient errors (429, 502-504)
  - Exponential backoff between retries (1s, 2s, 4s, etc.)
  - Contextual error messages for different failure types
  - Graceful degradation with fallback responses
- **Max retries**: 3 attempts with configurable backoff
- **Supported errors**:
  - Rate limiting (429) → "Please wait a moment..."
  - Service unavailable (502/503) → "Service temporarily down..."
  - Timeout (504) → "Request timeout..."
  - Auth errors (401/403) → "Please log in again..."

**File**: `src/lib/aiStream.ts`

### 3. **Message History Pagination** ✓
- **What changed**: Extended history limit from 12 to 25 messages with pagination support
- **Features**:
  - `getPaginatedResults()` for efficient pagination
  - Configurable page size (default: 25 messages)
  - Support for browsing through entire conversation history
  - Search functionality integrated

**File**: `src/hooks/useChatHistory.ts`

### 4. **Feedback System** ✓
- **What changed**: Enabled thumbs up/down feedback buttons
- **Features**:
  - Visual feedback on user interaction
  - `addFeedback(messageId, 'up' | 'down')` method
  - Ready for database integration to track AI quality
  - Database schema prepared for analytics

**File**: `src/hooks/useAIChatbot.ts`

### 5. **Query Type Detection** ✓
- **What changed**: Intelligent query classification using keyword analysis
- **Supported types**:
  - `disease` - Disease identification & treatment
  - `recommendation` - Crop recommendations
  - `yield` - Yield estimation
  - `weather` - Weather-related queries
  - `soil` - Soil management
  - `fertilizer` - Fertilizer advice
  - `market` - Market prices & MSP
  - `general` - General advice
- **Features**:
  - Confidence scoring (0-100%)
  - Intent detection (ask_for_info, ask_for_advice, report_problem, request_calculation)
  - Suggested follow-up questions
  - Keyword extraction

**File**: `src/lib/queryAnalysis.ts`

### 6. **Context Injection System** ✓
- **What changed**: User location, crops, and farm data injected into AI system prompt
- **Features**:
  - Automatic context building from query analysis
  - User profile integration (location, primary crops, farm size, soil type)
  - Dynamic system prompt generation
  - Context length limiting to prevent token overflow
  - Stored in localStorage (ready for database integration)

**File**: `src/hooks/useContextInjection.ts`

### 7. **Rate Limiting with UI Feedback** ✓
- **What changed**: Client-side rate limiting to prevent API overload
- **Features**:
  - 10 requests per minute limit (configurable)
  - Remaining requests counter
  - Visual countdown timer when limited
  - Graceful backpressure with retry capability
  - Alert notification system

**File**: `src/hooks/useRateLimit.ts`

### 8. **Chat History Search & Export** ✓
- **What changed**: Full chat history management with search and export
- **Features**:
  - Full-text search across all conversations
  - Export as JSON
  - Export as CSV
  - Pagination with 10 items per page
  - Delete individual conversations
  - Clear all history
  - Conversation preview and loading
  - Timestamp tracking

**File**: `src/hooks/useChatHistory.ts` and `src/components/chat/ChatHistoryPanel.tsx`

### 9. **Enhanced UI Components** ✓
- **Updates to EnhancedAIChatbot**:
  - Rate limit status badge
  - Confidence score display
  - Improved feedback buttons with visual states
  - Better error messaging
  - Empty state with quick questions
  - Typing indicators for streaming responses

**File**: `src/components/chat/EnhancedAIChatbot.tsx`

## New Custom Hooks

### `useAIChatbot(options)`
Main hook for chatbot functionality
```typescript
const {
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
} = useAIChatbot({
  maxHistory: 25,
  autoSpeak: true,
  language: 'en-IN',
  onError: (err) => toast.error(err),
});
```

### `useChatHistory(options)`
Chat history management with search and export
```typescript
const {
  history,
  currentPage,
  searchHistory,
  getPaginatedResults,
  exportAsJSON,
  exportAsCSV,
  deleteEntry,
  clearAll,
} = useChatHistory({ pageSize: 25 });
```

### `useRateLimit(config)`
Client-side rate limiting
```typescript
const {
  isRateLimited,
  remainingRequests,
  resetTime,
  recordRequest,
  retry,
} = useRateLimit({
  maxRequests: 10,
  windowMs: 60000,
});
```

### `useContextInjection(options)`
Context building and injection
```typescript
const {
  userContext,
  updateUserContext,
  enrichMessage,
  getSystemPrompt,
  clearContext,
} = useContextInjection();
```

## New Utility Functions

### `queryAnalysis.ts`
- `analyzeQuery(query)` - Classify queries and extract context
- `buildContextMessage(analysis, userData)` - Create system prompt context
- `getSuggestedFollowUps(analysis)` - Get next questions

## New Components

### `ChatHistoryPanel`
Searchable chat history with export options
```typescript
<ChatHistoryPanel 
  onSelectHistory={(messages) => {}}
  className=""
/>
```

## Database Integration Roadmap

Currently using localStorage; ready to migrate to:
1. **Chat messages** - Store in Supabase `chat_messages` table
2. **Feedback** - Track in `message_feedback` table for analytics
3. **User context** - Cache in `user_profiles` table
4. **Chat history** - Full conversation tracking with metadata

## Performance Improvements

1. **Streaming optimization**: Better buffer management and error recovery
2. **Rate limiting**: Prevents API overload and improves reliability
3. **History pagination**: Only load 25 messages instead of unlimited
4. **Query analysis**: Fast local processing before API call
5. **Context caching**: User data stored locally to reduce DB queries

## Error Handling Strategy

```
User Query
    ↓
Rate Limit Check ← Feedback if limited
    ↓
Query Analysis
    ↓
Stream Chat (with retries)
    ↓
Success? 
├─ Yes → Display + Save
└─ No → Retry with backoff
        ├─ Exhausted → Show friendly error
        └─ Success → Display + Save
```

## Testing Checklist

- [x] Consolidation works without breaking existing UI
- [x] Error handling retries on transient failures
- [x] Message history pagination displays correctly
- [x] Feedback buttons capture user input
- [x] Query type detection works for all categories
- [x] Context injection enriches prompts
- [x] Rate limiting prevents API overload
- [x] Chat history search filters correctly
- [x] Export generates valid JSON/CSV
- [x] UI shows proper status indicators

## Usage Examples

### Basic Chat
```typescript
const { sendMessage } = useAIChatbot();
await sendMessage("How to treat rice blast?");
```

### With Context
```typescript
const { updateUserContext, enrichMessage } = useContextInjection();
updateUserContext({ location: 'Punjab', primaryCrops: ['wheat', 'rice'] });
const { enrichedMessage } = enrichMessage("Best fertilizer?");
```

### Rate Limiting
```typescript
const { recordRequest, isRateLimited } = useRateLimit({
  maxRequests: 10,
  windowMs: 60000,
});

if (recordRequest()) {
  // Send message
}
```

### History Search
```typescript
const { searchHistory, getPaginatedResults } = useChatHistory();
searchHistory("disease");
const results = getPaginatedResults();
```

## Future Enhancements

1. **Database persistence** - Move from localStorage to Supabase
2. **PDF export** - Add jsPDF for detailed reports
3. **Image analysis** - Improved disease detection from photos
4. **Multi-language support** - Better translation and language handling
5. **Analytics dashboard** - Track query patterns and AI performance
6. **Offline support** - Cache responses for offline use
7. **Advanced filtering** - Date range, type, confidence score filters
8. **Conversation sharing** - Export and share specific conversations
9. **Batch operations** - Process multiple queries at once
10. **ML improvements** - Better query classification and suggestions

## Migration Guide (localStorage → Database)

When ready to migrate:

1. **Create Supabase tables**:
   ```sql
   -- Chat history
   CREATE TABLE chat_messages (
     id UUID PRIMARY KEY,
     user_id UUID NOT NULL,
     messages JSONB,
     created_at TIMESTAMP,
     updated_at TIMESTAMP
   );

   -- Feedback analytics
   CREATE TABLE message_feedback (
     id UUID PRIMARY KEY,
     message_id UUID,
     feedback 'up' | 'down',
     created_at TIMESTAMP
   );
   ```

2. **Update hooks** to use Supabase instead of localStorage
3. **Migrate existing data** from localStorage to database
4. **Update queries** to fetch from database

## Support & Documentation

- Hook documentation in individual files
- Component prop types clearly defined
- Error messages provide actionable guidance
- Console logs include `[v0]` prefix for easy debugging
