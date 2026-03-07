# Farm Intellect — AI Integration Architecture

## AI Provider Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SARVAM AI INTEGRATION                              │
│                                                                       │
│  Provider: Sarvam AI (https://sarvam.ai)                            │
│  Purpose: Indic-language-native LLM for Indian agriculture          │
│  API Base: https://api.sarvam.ai                                    │
│  Auth: api-subscription-key header                                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    SARVAM AI SUITE                            │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │  sarvam-30b  │  │  saaras:v3   │  │  bulbul:v3   │      │   │
│  │  │  (Chat LLM)  │  │  (STT)       │  │  (TTS)       │      │   │
│  │  │              │  │              │  │              │      │   │
│  │  │ • Hindi      │  │ • 12+ Indian │  │ • 12+ Indian │      │   │
│  │  │ • Punjabi    │  │   languages  │  │   languages  │      │   │
│  │  │ • English    │  │ • Audio→Text │  │ • Text→Audio │      │   │
│  │  │ • 12+ langs  │  │ • Code-mix   │  │ • 6 speakers │      │   │
│  │  │ • Code-mix   │  │   support    │  │ • Natural    │      │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │   │
│  │         │                 │                 │                │   │
│  │         └─────────────────┴─────────────────┘                │   │
│  │                          │                                   │   │
│  │               ┌──────────┴──────────┐                       │   │
│  │               │  backend/src/       │                       │   │
│  │               │  services/sarvam.js │                       │   │
│  │               └─────────────────────┘                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  WHY SARVAM (not OpenAI/Google):                                    │
│  ├── Native Indic language support (not translated English)         │
│  ├── 10x cheaper ($0.001 vs $0.01 per call)                        │
│  ├── Integrated STT+TTS (no 3rd party needed)                      │
│  ├── Hindi/Punjabi code-mixing handles natural farmer speech        │
│  ├── India-trained model understands local agricultural context     │
│  └── Data sovereignty (no data leaving India)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Chat LLM Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI CHAT FLOW                                                        │
│                                                                       │
│  User Input                                                          │
│    │                                                                 │
│    ▼                                                                 │
│  ┌──────────────────┐                                               │
│  │ Frontend         │  React Chat UI (src/components/chat/)         │
│  │ • Captures text  │  or voice (via STT first)                     │
│  │ • Adds language  │  from LanguageContext                         │
│  │ • Adds mode      │  "recommend" | "disease" | "general"         │
│  └───────┬──────────┘                                               │
│          │ POST /api/chat/message                                    │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Backend Router   │  authenticate() → rate limit (60/5min)        │
│  │ routes/chat.js   │  validates: message, mode, language           │
│  └───────┬──────────┘                                               │
│          │                                                           │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Build System     │  SYSTEM PROMPT (agricultural context):        │
│  │ Prompt           │  "You are Farm Intellect, an AI assistant     │
│  │                  │   for Indian farmers. Provide advice on       │
│  │                  │   crops, diseases, weather, soil, markets.    │
│  │                  │   Respond in the user's language.             │
│  │                  │   Keep responses practical and actionable."   │
│  └───────┬──────────┘                                               │
│          │                                                           │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Sarvam API Call  │  createSarvamChatCompletion({                  │
│  │ services/        │    model: "sarvam-30b",                       │
│  │   sarvam.js      │    messages: [system, ...history, user],      │
│  │                  │    temperature: 0.3,                           │
│  │                  │    max_tokens: 700                             │
│  │                  │  })                                            │
│  └───────┬──────────┘                                               │
│          │                                                           │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Save to DB       │  ChatMessage.create({                         │
│  │ (Prisma)         │    userId, message, type: "AI_ASSISTANT",     │
│  │                  │    context: { mode, language }                 │
│  │                  │  })                                            │
│  └───────┬──────────┘                                               │
│          │                                                           │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Socket.IO emit   │  Broadcasted to user's room for real-time    │
│  └───────┬──────────┘                                               │
│          │                                                           │
│          ▼                                                           │
│  Response to frontend → displayed in chat bubble                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI Configuration Parameters

```
┌─────────────────────────────────────────────────────────────────────┐
│  SARVAM CHAT PARAMETERS                                              │
│                                                                       │
│  ┌──────────────────┬──────────┬──────────────────────────────────┐ │
│  │ Parameter        │ Value    │ Rationale                         │ │
│  ├──────────────────┼──────────┼──────────────────────────────────┤ │
│  │ model            │sarvam-30b│ Best Indic multilingual model    │ │
│  │ temperature      │ 0.3      │ Low = consistent, factual output │ │
│  │ max_tokens       │ 700      │ Concise but complete advice      │ │
│  │ top_p            │ 0.9      │ Nucleus sampling for quality     │ │
│  │ frequency_penalty│ 0.1      │ Slight diversity in vocabulary   │ │
│  │ presence_penalty │ 0.0      │ Allow repetition for emphasis    │ │
│  └──────────────────┴──────────┴──────────────────────────────────┘ │
│                                                                       │
│  WHY temperature=0.3:                                                │
│  • Agricultural advice must be accurate, not creative               │
│  • Same question → similar answer (cacheable)                       │
│  • Reduces hallucination risk for crop recommendations              │
│  • Farmers need reliable, repeatable information                    │
│                                                                       │
│  WHY max_tokens=700:                                                 │
│  • Average response: 200-400 tokens (1-2 paragraphs)               │
│  • Cap prevents runaway responses (cost control)                    │
│  • Sufficient for: crop name + reasoning + yield + price            │
│  • At $0.001/call: 700 tokens is ~$0.0007 per response             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI Use Cases

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI FEATURE MATRIX                                                   │
│                                                                       │
│  ┌──────────────────────┬──────────┬────────────────────────────┐   │
│  │ Feature              │ Endpoint │ AI Model / Technique        │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ General Chat         │ /chat/   │ sarvam-30b (system prompt) │   │
│  │                      │ message  │                            │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ Crop Recommendation  │ /ai/     │ sarvam-30b + curated data  │   │
│  │                      │recommend │ (60+ crops, soil, season)  │   │
│  │                      │ -crops   │                            │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ Disease Detection    │ /ai/     │ sarvam-30b + image context │   │
│  │                      │ detect-  │ (50+ disease database)     │   │
│  │                      │ disease  │                            │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ Yield Prediction     │ /ai/     │ sarvam-30b + farm params   │   │
│  │                      │ predict- │ (soil, irrigation, area)   │   │
│  │                      │ yield    │                            │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ Voice Transcription  │ /chat/   │ saaras:v3 (Sarvam STT)    │   │
│  │                      │ voice/   │ 12+ Indian languages       │   │
│  │                      │transcribe│                            │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ Voice Response       │ /chat/   │ bulbul:v3 (Sarvam TTS)    │   │
│  │                      │ voice/   │ 6 speaker presets          │   │
│  │                      │ speak    │                            │   │
│  ├──────────────────────┼──────────┼────────────────────────────┤   │
│  │ Preventive Tips      │ /ai/     │ sarvam-30b + seasonal data │   │
│  │                      │preventive│ (expert-curated advice)    │   │
│  │                      │ -tips    │                            │   │
│  └──────────────────────┴──────────┴────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supported Languages

```
┌─────────────────────────────────────────────────────────────────────┐
│  LANGUAGE SUPPORT (Sarvam AI + LanguageContext)                       │
│                                                                       │
│  ┌──────┬──────────────┬──────┬──────┬───────────────────────────┐  │
│  │ Code │ Language     │ Chat │ STT  │ TTS   │ UI Translation   │  │
│  ├──────┼──────────────┼──────┼──────┼───────┼──────────────────┤  │
│  │ hi   │ Hindi        │ ✅   │ ✅   │ ✅   │ ✅              │  │
│  │ pa   │ Punjabi      │ ✅   │ ✅   │ ✅   │ ✅              │  │
│  │ en   │ English      │ ✅   │ ✅   │ ✅   │ ✅ (default)    │  │
│  │ bn   │ Bengali      │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ ta   │ Tamil        │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ te   │ Telugu       │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ mr   │ Marathi      │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ gu   │ Gujarati     │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ kn   │ Kannada      │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ ml   │ Malayalam    │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ or   │ Odia         │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  │ as   │ Assamese     │ ✅   │ ✅   │ ✅   │ Planned         │  │
│  └──────┴──────────────┴──────┴──────┴───────┴──────────────────┘  │
│                                                                       │
│  CODE-MIXING SUPPORT:                                                │
│  Sarvam natively handles mixed-language input like:                 │
│  "Meri wheat ki fasal mein yellowing ho rahi hai kya karoon?"       │
│  (Hindi + English + Punjabi words mixed naturally)                  │
│                                                                       │
│  This is critical because Indian farmers rarely speak pure          │
│  Hindi or pure Punjabi — they code-mix naturally.                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fallback Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI FAILURE HANDLING                                                  │
│                                                                       │
│  Sarvam API Down?                                                    │
│    │                                                                 │
│    ├── Chat: Return curated response from local crop database       │
│    │         (src/data/cropsData.ts — 60+ crops with full details)  │
│    │                                                                 │
│    ├── Disease: Match against cropDiseases.ts (50+ entries)         │
│    │            Return closest match with treatment info            │
│    │                                                                 │
│    ├── Recommendation: Use cropRecommendations.ts logic             │
│    │                    (soil type + season → crop suggestion)      │
│    │                                                                 │
│    ├── STT: Show text input fallback + keyboard                     │
│    │                                                                 │
│    └── TTS: Display text response (no audio)                        │
│                                                                       │
│  CURATED OFFLINE DATA (no API call needed):                          │
│  ├── cropsData.ts           → 60+ crops with yields, seasons       │
│  ├── cropDiseases.ts        → 50+ crop diseases + treatments       │
│  ├── cropRecommendations.ts → Soil/season → crop mapping           │
│  ├── cropCalendar.ts        → 1500+ farming activities             │
│  ├── mandiPrices.ts         → 50+ mandi market prices              │
│  ├── pestData.ts            → 30+ pest profiles + control          │
│  ├── soilHealth.ts          → 12 soil parameter reference          │
│  ├── satelliteData.ts       → Sample satellite imagery data        │
│  ├── indianLocations.ts     → State/district hierarchy             │
│  └── kisanCallCenter.ts     → Helpline numbers by state            │
│                                                                       │
│  These files serve as both:                                          │
│  1. Context for AI prompts (enriches LLM responses)                 │
│  2. Fallback when AI is unavailable (works offline in PWA)          │
└─────────────────────────────────────────────────────────────────────┘
```
