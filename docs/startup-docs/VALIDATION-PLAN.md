# Farm Intellect — Validation & Testing Plan

## Testing Strategy Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                                    │
│                                                                       │
│                        ╱╲                                            │
│                       ╱  ╲        E2E Tests (5%)                    │
│                      ╱ E2E╲       • Playwright / Cypress            │
│                     ╱──────╲      • Critical user flows             │
│                    ╱        ╲                                        │
│                   ╱Integration╲   Integration Tests (25%)            │
│                  ╱────────────╲   • Supertest (API routes)           │
│                 ╱              ╲  • Prisma test client               │
│                ╱  Unit Tests    ╲ Unit Tests (70%)                    │
│               ╱──────────────────╲ • Vitest (frontend + backend)    │
│              ╱                    ╲• React Testing Library           │
│             ╱────────────────────────╲                               │
│                                                                       │
│  Test Frameworks:                                                    │
│  ├── Frontend: Vitest + @testing-library/react + jsdom              │
│  ├── Backend:  Vitest + Supertest                                   │
│  ├── E2E:     Playwright (planned)                                  │
│  └── CI:      GitHub Actions (planned)                              │
│                                                                       │
│  Config Files:                                                       │
│  ├── vite.config.ts (frontend Vitest config)                        │
│  ├── backend/vitest.config.js (backend Vitest config)               │
│  └── src/lib/utils.test.ts (example test file)                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Unit Testing Plan

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND UNIT TESTS                                                 │
│                                                                       │
│  ┌──────────────────────────┬──────────────────────┬──────────┐     │
│  │ Module                   │ Tests                 │ Priority │     │
│  ├──────────────────────────┼──────────────────────┼──────────┤     │
│  │ lib/utils.ts             │ cn() helper           │ P0       │     │
│  │ lib/error-handling.ts    │ Error formatting      │ P0       │     │
│  │ lib/phase1-storage.ts    │ Local storage ops     │ P0       │     │
│  │ lib/api.ts               │ API client methods    │ P0       │     │
│  │ contexts/AuthContext.tsx  │ Auth state + methods  │ P0       │     │
│  │ contexts/LanguageContext  │ Language switching    │ P1       │     │
│  │ hooks/use-toast.ts       │ Toast notifications   │ P1       │     │
│  │ hooks/useCurrentUser.ts  │ User data hook        │ P0       │     │
│  │ hooks/usePwaStatus.ts    │ PWA detection         │ P2       │     │
│  │ data/cropsData.ts        │ Crop data integrity   │ P1       │     │
│  │ data/cropDiseases.ts     │ Disease data format   │ P1       │     │
│  │ data/mandiPrices.ts      │ Price data structure  │ P1       │     │
│  │ components/ui/*          │ UI component render   │ P2       │     │
│  └──────────────────────────┴──────────────────────┴──────────┘     │
│                                                                       │
│  BACKEND UNIT TESTS                                                  │
│                                                                       │
│  ┌──────────────────────────┬──────────────────────┬──────────┐     │
│  │ Module                   │ Tests                 │ Priority │     │
│  ├──────────────────────────┼──────────────────────┼──────────┤     │
│  │ middleware/auth.js        │ JWT verify + roles    │ P0       │     │
│  │ middleware/errorHandler   │ Error formatting      │ P0       │     │
│  │ middleware/activity.js    │ Activity logging      │ P1       │     │
│  │ services/sarvam.js       │ AI API calls (mocked) │ P0       │     │
│  │ config/database.js       │ Prisma client init    │ P1       │     │
│  │ config/supabase.js       │ Supabase client init  │ P1       │     │
│  │ utils/* (if any)         │ Utility functions     │ P1       │     │
│  │ healthApp.js             │ Health endpoint       │ P0       │     │
│  └──────────────────────────┴──────────────────────┴──────────┘     │
│                                                                       │
│  EXISTING TESTS:                                                     │
│  ├── src/lib/utils.test.ts   → cn() utility test                    │
│  └── backend/test/health.test.js → /health endpoint test            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Integration Testing Plan

```
┌─────────────────────────────────────────────────────────────────────┐
│  API ROUTE INTEGRATION TESTS (Supertest + Vitest)                    │
│                                                                       │
│  ┌──────────────────────┬──────────────────────────────────────┐    │
│  │ Route                │ Test Cases                            │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ POST /api/auth/signup│ • Valid signup → 201 + token          │    │
│  │                      │ • Duplicate email → 409               │    │
│  │                      │ • Missing fields → 400                │    │
│  │                      │ • Invalid email format → 400          │    │
│  │                      │ • Weak password → 400                 │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ POST /api/auth/login │ • Valid login → 200 + token           │    │
│  │                      │ • Wrong password → 401                │    │
│  │                      │ • Nonexistent user → 401              │    │
│  │                      │ • Rate limit hit → 429                │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ GET /api/users/      │ • With valid token → 200 + profile    │    │
│  │     profile          │ • Without token → 401                 │    │
│  │                      │ • Expired token → 401                 │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ POST /api/ai/        │ • Valid request → 200 + crops         │    │
│  │   recommend-crops    │ • Missing fields → 400                │    │
│  │                      │ • AI service down → 503 (fallback)    │    │
│  │                      │ • Rate limit → 429                    │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ POST /api/chat/      │ • Text message → 200 + AI response    │    │
│  │     message          │ • Hindi input → response in Hindi     │    │
│  │                      │ • Rate limit (60/5min) → 429          │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ GET /api/forum/posts │ • Paginated results → 200             │    │
│  │                      │ • Category filter works               │    │
│  │                      │ • Search query filters                │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ POST /api/documents/ │ • Valid PDF upload → 201              │    │
│  │      upload          │ • File too large (>10MB) → 400        │    │
│  │                      │ • Invalid file type → 400             │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ RBAC Tests           │ • FARMER cannot access admin routes   │    │
│  │                      │ • MERCHANT cannot access expert API   │    │
│  │                      │ • ADMIN can access all routes         │    │
│  └──────────────────────┴──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## E2E Testing Plan

```
┌─────────────────────────────────────────────────────────────────────┐
│  CRITICAL USER FLOWS (Playwright)                                    │
│                                                                       │
│  Flow 1: Farmer Registration & Onboarding                           │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  1. Navigate to /signup                                        │ │
│  │  2. Fill form (name, email, password, role=FARMER)             │ │
│  │  3. Submit → redirect to OTP verification                      │ │
│  │  4. Enter OTP → redirect to /dashboard                         │ │
│  │  5. Complete farmer profile (farm size, crops, location)       │ │
│  │  6. Verify dashboard shows personalized content                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Flow 2: AI Chat Conversation                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  1. Login as farmer                                            │ │
│  │  2. Navigate to /chat                                          │ │
│  │  3. Type "Which crop should I plant in rabi season?"           │ │
│  │  4. Verify AI response appears within 5 seconds               │ │
│  │  5. Verify response contains crop recommendation               │ │
│  │  6. Verify message saved in chat history                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Flow 3: Disease Detection                                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  1. Login as farmer → Navigate to /ai-crop-scanner            │ │
│  │  2. Upload test crop image                                     │ │
│  │  3. Verify analysis results appear                             │ │
│  │  4. Verify treatment recommendations shown                     │ │
│  │  5. Verify severity rating displayed                           │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Flow 4: Forum Post Creation                                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  1. Login → Navigate to /forum                                 │ │
│  │  2. Click "New Post" → Fill title + content + category         │ │
│  │  3. Submit → Verify post appears in listing                    │ │
│  │  4. Navigate to post → Add comment                             │ │
│  │  5. Verify comment count increments                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Flow 5: Role-Based Access Control                                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  1. Login as FARMER → verify /admin* routes redirect           │ │
│  │  2. Login as MERCHANT → verify /expert* routes restricted     │ │
│  │  3. Login as ADMIN → verify all routes accessible              │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Validation Checklist

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRE-LAUNCH VALIDATION CHECKLIST                                     │
│                                                                       │
│  SECURITY                                                            │
│  ☐ All endpoints require authentication (except /health, /auth)     │
│  ☐ JWT expiry enforced (24 hours)                                   │
│  ☐ bcrypt password hashing verified                                 │
│  ☐ CORS whitelist tested (reject unknown origins)                   │
│  ☐ Rate limiting functional on all tiers                            │
│  ☐ SQL injection tests pass (Prisma parameterized queries)          │
│  ☐ XSS prevention tested (Helmet + React auto-escaping)            │
│  ☐ File upload type + size validation                               │
│  ☐ RLS policies tested on Supabase                                  │
│  ☐ OTP expiry and retry limits enforced                             │
│                                                                       │
│  FUNCTIONALITY                                                       │
│  ☐ All 4 roles can register and login                               │
│  ☐ AI chat responds in Hindi/Punjabi/English                        │
│  ☐ Voice input transcription works for 12+ languages               │
│  ☐ Voice output (TTS) plays correctly                               │
│  ☐ Disease detection returns results for uploaded images            │
│  ☐ Forum CRUD operations work for all roles                        │
│  ☐ Calendar entries create/update/delete correctly                  │
│  ☐ Mandi prices display for Punjab markets                         │
│  ☐ Notifications are delivered and marked read                      │
│  ☐ Document upload stores and retrieves files                       │
│  ☐ Socket.IO real-time messaging works                              │
│                                                                       │
│  PERFORMANCE                                                         │
│  ☐ Initial page load < 5s on 3G                                    │
│  ☐ AI response < 3s (p95)                                          │
│  ☐ API response < 500ms (p95) for non-AI endpoints                 │
│  ☐ 100 concurrent users supported without degradation               │
│  ☐ Lighthouse Performance score ≥ 80                                │
│  ☐ PWA installable and works offline for cached data                │
│                                                                       │
│  CROSS-DEVICE                                                        │
│  ☐ Works on Android Chrome (primary target)                         │
│  ☐ Works on iOS Safari                                              │
│  ☐ Works on desktop Chrome/Firefox                                  │
│  ☐ Responsive at 320px, 768px, 1024px+ widths                      │
│  ☐ Touch interactions work on mobile                                │
│  ☐ Voice button accessible on mobile browsers                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Test Data Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  SEED DATA FOR TESTING                                               │
│                                                                       │
│  ┌────────────────────┬──────────────────────────────────────┐      │
│  │ Entity             │ Seed Count  │  Source                 │      │
│  ├────────────────────┼─────────────┼────────────────────────┤      │
│  │ Users (Farmer)     │ 10          │ Prisma seed script     │      │
│  │ Users (Merchant)   │ 3           │ Prisma seed script     │      │
│  │ Users (Expert)     │ 3           │ Prisma seed script     │      │
│  │ Users (Admin)      │ 1           │ Prisma seed script     │      │
│  │ Forum Posts        │ 20          │ Prisma seed script     │      │
│  │ Comments           │ 50          │ Prisma seed script     │      │
│  │ Chat Messages      │ 30          │ Prisma seed script     │      │
│  │ Calendar Entries   │ 1500+       │ cropCalendar.ts data   │      │
│  │ Crop Data          │ 60+         │ cropsData.ts           │      │
│  │ Disease Data       │ 50+         │ cropDiseases.ts        │      │
│  │ Mandi Prices       │ 50+         │ mandiPrices.ts         │      │
│  │ Pest Data          │ 30+         │ pestData.ts            │      │
│  └────────────────────┴─────────────┴────────────────────────┘      │
│                                                                       │
│  Test User Credentials:                                              │
│  farmer@test.com / TestFarmer123!   (FARMER role)                   │
│  merchant@test.com / TestMerchant!  (MERCHANT role)                 │
│  expert@test.com / TestExpert123!   (EXPERT role)                   │
│  admin@test.com / TestAdmin123!     (ADMIN role)                    │
└─────────────────────────────────────────────────────────────────────┘
```
