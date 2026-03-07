# Farm Intellect — System Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                     │
│    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │
│    │   Farmer      │   │  Merchant    │   │   Expert     │          │
│    │   (Mobile)    │   │  (Desktop)   │   │   (Desktop)  │          │
│    └──────┬───────┘   └──────┬───────┘   └──────┬───────┘          │
│           │                  │                   │                   │
│           │           ┌──────────────┐           │                   │
│           │           │    Admin     │           │                   │
│           │           │  (Desktop)   │           │                   │
│           │           └──────┬───────┘           │                   │
└───────────┼──────────────────┼───────────────────┼──────────────────┘
            │                  │                   │
            ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│             FRONTEND — React 18 + Vite + TypeScript                  │
│                                                                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Landing │ │ Farmer   │ │ Merchant │ │ Expert   │ │ Admin    │  │
│  │ + Auth  │ │ Suite    │ │ Suite    │ │ Suite    │ │ Suite    │  │
│  │         │ │ (18 pg)  │ │ (6 pg)   │ │ (6 pg)   │ │ (5 pg)   │  │
│  └─────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                                       │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ AI Chat │ │ Voice    │ │ Forum    │ │ Calendar │ │ PWA      │  │
│  │ Widget  │ │ Assist   │ │ System   │ │ Planner  │ │ Shell    │  │
│  └─────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                                       │
│  UI: Radix UI + shadcn/ui │ State: TanStack Query + React Context   │
│  Hosting: Vercel (free)                                              │
└──────────┬──────────────────┬──────────────────┬────────────────────┘
           │ REST API          │ WebSocket         │ Supabase SDK
           ▼                  ▼                  ▼
┌─────────────────────────────┐  ┌──────────────────────────────────┐
│  BACKEND — Express + Node   │  │  SUPABASE PLATFORM               │
│                              │  │                                   │
│  ┌────────────────────────┐ │  │  ┌──────────┐  ┌──────────────┐ │
│  │     9 API Route Files  │ │  │  │ Auth     │  │ PostgreSQL   │ │
│  │                        │ │  │  │ Engine   │  │ (Profiles +  │ │
│  │  auth • users • ai    │ │  │  │          │  │  Roles)      │ │
│  │  chat • forum • docs  │ │  │  │ JWT      │  │              │ │
│  │  calendar • analytics │ │  │  │ Sessions │  │ RLS Policies │ │
│  │  notifications        │ │  │  │ OTP      │  │ Triggers     │ │
│  └────────────────────────┘ │  │  └──────────┘  └──────────────┘ │
│                              │  │                                   │
│  ┌────────────────────────┐ │  │  ┌──────────────────────────┐   │
│  │   Middleware Stack     │ │  │  │ Edge Functions            │   │
│  │                        │ │  │  │ (chat session handler)    │   │
│  │  Helmet → CORS →      │ │  │  └──────────────────────────┘   │
│  │  Rate Limit → JWT →   │ │  │                                   │
│  │  RBAC → Validator →   │ │  │  Free tier                       │
│  │  Error Handler        │ │  └──────────────────────────────────┘
│  └────────────────────────┘ │
│                              │  ┌──────────────────────────────────┐
│  ┌────────────────────────┐ │  │  AGRICULTURAL DATA LAYER         │
│  │   Core Services        │ │  │  (Frontend-bundled datasets)     │
│  │                        │ │  │                                   │
│  │  Sarvam AI Client     │ │  │  cropsData.ts    (60+ crops)     │
│  │  Socket.IO Server     │ │  │  cropDiseases.ts (50+ diseases)  │
│  │  Prisma ORM Client    │ │  │  pestData.ts     (30+ pests)     │
│  │  Winston Logger       │ │  │  cropCalendar.ts (1500+ items)   │
│  └────────────────────────┘ │  │  mandiPrices.ts  (50+ markets)  │
│                              │  │  soilHealth.ts   (12 params)    │
│  Hosting: Railway ($5/mo)   │  │  + 6 more datasets               │
└──────────┬───────────┬──────┘  └──────────────────────────────────┘
           │           │
           ▼           ▼
┌──────────────────┐ ┌─────────────────┐  ┌────────────────────────┐
│  SQLite/Prisma   │ │  Sarvam AI API  │  │  External Services     │
│  (13 tables)     │ │                 │  │                        │
│                  │ │  Chat: sarvam-  │  │  Twilio (SMS)          │
│  Users + Roles   │ │    30b          │  │  Nodemailer (Email)    │
│  Documents       │ │  STT: saaras:v3 │  │  OpenWeatherMap        │
│  Chat + Forum    │ │  TTS: bulbul:v3 │  │                        │
│  Calendar + AI   │ │                 │  │  All pay-per-use       │
│  Notifications   │ │  Pay-per-use    │  │  or free tier          │
│  Activities      │ │  ~$0.001/req    │  │                        │
└──────────────────┘ └─────────────────┘  └────────────────────────┘
```

---

## Architecture Principles

```
┌─────────────────────────────────────────────────────────────────────┐
│                  ARCHITECTURE PRINCIPLES                             │
│                                                                       │
│  1. MONOLITH-FIRST                                                   │
│     Single Express server handles all business logic.               │
│     Split into microservices only when hitting 10K+ users.          │
│                                                                       │
│  2. HYBRID DATA STRATEGY                                            │
│     Identity → Supabase (managed auth + RLS)                        │
│     Business data → Prisma + SQLite/PostgreSQL                      │
│     Domain knowledge → Frontend-bundled datasets                    │
│     AI responses → Sarvam API (stateless)                           │
│                                                                       │
│  3. API-FIRST AI                                                     │
│     No self-hosted models. Use Sarvam AI API for LLM + voice.      │
│     Fallback to curated datasets if API is unavailable.             │
│                                                                       │
│  4. VOICE-FIRST UX                                                   │
│     Every AI interaction supports voice input + output.             │
│     12+ Indian languages via Sarvam STT/TTS models.                │
│                                                                       │
│  5. PROGRESSIVE ENHANCEMENT                                         │
│     Core features work on low-end devices + slow networks.          │
│     Rich features (animations, charts) load progressively.          │
│     PWA shell provides basic offline capability.                    │
│                                                                       │
│  6. DEFENSE IN DEPTH                                                 │
│     Transport: HTTPS + Helmet                                       │
│     Auth: Dual JWT (Supabase + backend)                             │
│     Access: RBAC middleware                                         │
│     Input: express-validator + Zod                                  │
│     Rate: 4-tier rate limiting                                      │
│     Logging: Winston structured logs                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Layer Breakdown

### Layer 1: Client Layer

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                                       │
│                                                                       │
│  ENTRY POINT: App.tsx                                                │
│                                                                       │
│  Provider Stack (outer → inner):                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ QueryClientProvider (TanStack Query)                          │  │
│  │  └─ AppErrorBoundary                                          │  │
│  │     └─ LanguageProvider (i18n context)                        │  │
│  │        └─ AuthProvider (Supabase session + profile)           │  │
│  │           └─ TooltipProvider                                  │  │
│  │              └─ Toaster + Sonner (notifications)              │  │
│  │                 └─ BrowserRouter                              │  │
│  │                    └─ AnimatedRoutes (Framer Motion)          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ROUTING: 36+ pages across 4 role namespaces                        │
│                                                                       │
│  /                          → Landing page                           │
│  /login                     → Authentication                         │
│  /farmer/*   (18 routes)    → Farmer features                       │
│  /merchant/* (6 routes)     → Merchant features                     │
│  /expert/*   (6 routes)     → Expert features                       │
│  /admin/*    (5 routes)     → Admin features                        │
│  /*          (legacy)       → Backward-compatible routes            │
│                                                                       │
│  PROTECTION: ProtectedRoute component                               │
│    → Checks auth state via useAuth()                                │
│    → Redirects unauthenticated users to /login                      │
│    → Enforces role-based access per route                           │
│    → Shows loading spinner during auth resolution                   │
│    → Redirects unauthorized roles to their home dashboard           │
└─────────────────────────────────────────────────────────────────────┘
```

### Layer 2: API Layer

```
┌─────────────────────────────────────────────────────────────────────┐
│                    API LAYER (Express)                                │
│                                                                       │
│  REQUEST PIPELINE:                                                    │
│                                                                       │
│  Client Request                                                      │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────┐  ┌──────┐  ┌───────────┐  ┌──────┐  ┌───────────┐   │
│  │ Helmet  │→ │ CORS │→ │ Rate      │→ │ JSON │→ │ Route     │   │
│  │ Headers │  │      │  │ Limiter   │  │ Parse│  │ Handler   │   │
│  └─────────┘  └──────┘  └───────────┘  └──────┘  └─────┬─────┘   │
│                                                          │          │
│                                        ┌─────────────────┘          │
│                                        ▼                            │
│                          ┌──────────────────────┐                   │
│                          │ authenticate()       │                   │
│                          │  → Extract Bearer    │                   │
│                          │  → Try local JWT     │                   │
│                          │  → Try Supabase JWT  │                   │
│                          │  → Attach req.user   │                   │
│                          └──────────┬───────────┘                   │
│                                     ▼                               │
│                          ┌──────────────────────┐                   │
│                          │ authorize(roles[])   │                   │
│                          │  → Check req.user    │                   │
│                          │    .role ∈ allowed   │                   │
│                          └──────────┬───────────┘                   │
│                                     ▼                               │
│                          ┌──────────────────────┐                   │
│                          │ Route Handler Logic  │                   │
│                          │  → Validate input    │                   │
│                          │  → Business logic    │                   │
│                          │  → Database query    │                   │
│                          │  → Return response   │                   │
│                          └──────────┬───────────┘                   │
│                                     ▼                               │
│                          ┌──────────────────────┐                   │
│                          │ errorHandler()       │                   │
│                          │  → Log error         │                   │
│                          │  → Sanitize response │                   │
│                          │  → Return 4xx/5xx    │                   │
│                          └──────────────────────┘                   │
│                                                                       │
│  ROUTE MODULES:                                                      │
│  ┌──────────────┬──────────────────────────────────────────────┐    │
│  │ auth.js      │ signup, login, verify-otp, resend-otp        │    │
│  │ users.js     │ profile get/update, farmers list             │    │
│  │ ai.js        │ crop-recommend, disease-detect, yield-predict│    │
│  │ chat.js      │ messages, send, complete, voice STT/TTS      │    │
│  │ forum.js     │ posts CRUD, comments, moderation             │    │
│  │ documents.js │ upload (multer), delete, verification        │    │
│  │ calendar.js  │ crop calendar CRUD with reminders            │    │
│  │ analytics.js │ role-based dashboard, activity history       │    │
│  │ notif.js     │ list, mark-read, broadcast                   │    │
│  └──────────────┴──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Layer 3: Data Layer

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                         │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ PRISMA ORM (SQLite → PostgreSQL migration-ready)            │    │
│  │                                                               │    │
│  │ 13 Models:                                                    │    │
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │    │
│  │ │ User      │ │ Farmer    │ │ Merchant  │ │ Expert    │    │    │
│  │ │           │ │ Profile   │ │ Profile   │ │ Profile   │    │    │
│  │ └─────┬─────┘ └───────────┘ └───────────┘ └───────────┘    │    │
│  │       │ has many                                              │    │
│  │       ▼                                                       │    │
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │    │
│  │ │ Document  │ │ ChatMsg   │ │ Post      │ │ Comment   │    │    │
│  │ └───────────┘ └───────────┘ └───────────┘ └───────────┘    │    │
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │    │
│  │ │ Notif     │ │ Activity  │ │ CropCal   │ │ AIRec     │    │    │
│  │ └───────────┘ └───────────┘ └───────────┘ └───────────┘    │    │
│  │ ┌───────────┐                                                │    │
│  │ │ OtpCode   │                                                │    │
│  │ └───────────┘                                                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ SUPABASE PostgreSQL (Auth + Identity)                       │    │
│  │                                                               │    │
│  │  auth.users       → Managed by Supabase Auth                 │    │
│  │  public.profiles  → Display name, email, phone, avatar       │    │
│  │  public.user_roles → Role assignment (app_role enum)         │    │
│  │                                                               │    │
│  │  Triggers: handle_new_user() auto-creates profile + role     │    │
│  │  Functions: has_role(), get_user_role() for security checks  │    │
│  │  RLS: Users can only read/update their own data              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ FRONTEND DATASETS (Bundled in Vite build)                   │    │
│  │                                                               │    │
│  │  12 TypeScript data files in src/data/                       │    │
│  │  Total: ~200KB of curated agricultural intelligence          │    │
│  │  Coverage: Crops, diseases, pests, soil, markets,            │    │
│  │  calendar activities, locations, call centers                 │    │
│  │                                                               │    │
│  │  WHY CLIENT-SIDE: Zero latency, offline-capable,             │    │
│  │  reduces API calls, no database needed for lookups           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Decisions Record (ADR)

### ADR-1: Monolith over Microservices

```
Status: ACCEPTED
Context: Team of 2-3 developers, MVP timeline, $5-15/mo budget
Decision: Single Express server monolith
Rationale:
  - Faster development velocity (no inter-service communication)
  - Single deployment unit (1 container on Railway)
  - Single log stream (Winston)
  - Cost-effective ($5/mo vs $50+/mo for K8s)
  - Socket.IO embedded (no separate WS service)
Trade-offs:
  - All features share same process (no isolation)
  - Horizontal scaling requires full app replication
  - Cannot independently scale AI-heavy vs CRUD routes
Migration path: Extract AI service first when hitting 10K users
```

### ADR-2: Hybrid Auth (Supabase + Local JWT)

```
Status: ACCEPTED
Context: Need managed auth for frontend + protected backend APIs
Decision: Supabase for frontend auth, dual JWT resolution on backend
Rationale:
  - Supabase Auth: battle-tested, free, handles email/OTP/sessions
  - Backend JWT: needed for API-only access, WebSocket auth
  - Dual resolution: authenticate() tries local JWT first, then Supabase
  - Auto-provisioning: Supabase users get local User record on first API call
Trade-offs:
  - Two sources of truth for identity (mitigated by sync middleware)
  - Complexity in token management
  - Must handle both token expiry strategies
```

### ADR-3: SQLite for MVP, PostgreSQL for Production

```
Status: ACCEPTED
Context: Need zero-config dev setup, but production-ready data layer
Decision: SQLite via Prisma in dev, PostgreSQL in production
Rationale:
  - SQLite: file-based, no external dependency, instant setup
  - Prisma: abstracts database, migration requires only changing URL
  - PostgreSQL: ACID compliance, full-text search, concurrent writes
Trade-offs:
  - SQLite: no concurrent writes (fine for dev)
  - Some Prisma features differ between SQLite and PostgreSQL
  - Testing on SQLite while production runs PostgreSQL
```

### ADR-4: Sarvam AI over OpenAI

```
Status: ACCEPTED
Context: Need Indian language support (12+ languages + voice)
Decision: Sarvam AI as primary LLM + voice provider
Rationale:
  - Native Indian language support (no translation layer needed)
  - Combined LLM + STT + TTS from single provider
  - Code-mixing support (Hinglish, Punjlish)
  - Optimized for Indian agriculture domain
  - Single API key, single billing
Trade-offs:
  - Smaller ecosystem than OpenAI/Anthropic
  - Less documentation and community resources
  - Potential vendor lock-in for voice features
Fallback: OpenAI GPT-4o-mini for chat, curated datasets for emergency
```

### ADR-5: Client-Side Agricultural Data

```
Status: ACCEPTED
Context: 60+ crops, 50+ diseases, 1500+ calendar items need fast lookup
Decision: Bundle curated datasets as TypeScript files in frontend build
Rationale:
  - Zero latency (no API call for reference data)
  - Works offline (PWA service worker caches bundle)
  - Reduces backend load (no CRUD for reference data)
  - Easy to update (edit TS files, rebuild)
  - Type-safe (TypeScript enums and interfaces)
Trade-offs:
  - Increases bundle size (~200KB)
  - Data updates require rebuild + redeploy
  - Not suitable for frequently changing data
  - Duplicated if backend also needs same data
```
