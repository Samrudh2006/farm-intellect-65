# Farm Intellect — MVP Plan

## MVP Scope Definition

```
┌─────────────────────────────────────────────────────────────────────┐
│                       MVP STRATEGY                                    │
│                                                                       │
│  Vision: "AI-powered agriculture intelligence for Indian farmers"   │
│  Target MVP: 12-week sprint (3 phases × 4 weeks)                   │
│  Core Audience: Punjabi farmers (Rabi + Kharif cycles)             │
│                                                                       │
│  MVP PRINCIPLE: Ship the smallest feature set that delivers         │
│  real farming value with voice-first, multilingual access.          │
│                                                                       │
│  ┌─────────────┐                                                    │
│  │  MUST HAVE  │  Core features for viable product                  │
│  │  Phase 1    │  Auth + Profile + AI Chat + Voice                  │
│  ├─────────────┤                                                    │
│  │  SHOULD HAVE│  Engagement + utility features                     │
│  │  Phase 2    │  Forum + Calendar + Disease Detection              │
│  ├─────────────┤                                                    │
│  │  NICE TO    │  Advanced features for completeness                │
│  │  HAVE Ph 3  │  Analytics + Documents + Notifications             │
│  └─────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — Foundation (Weeks 1–4)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: CORE PLATFORM                                              │
│                                                                       │
│  Sprint 1.1 (Week 1–2): Authentication + Infrastructure            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ☑ Supabase project setup (auth + database)                    │ │
│  │  ☑ Backend Express server with Prisma ORM                      │ │
│  │  ☑ Dual auth system (Supabase Auth + local JWT)                │ │
│  │  ☑ User signup/login with email + OTP verification             │ │
│  │  ☑ Role-based registration (Farmer/Merchant/Expert/Admin)      │ │
│  │  ☑ Profile creation flows per role                             │ │
│  │  ☑ Protected route middleware + RBAC                           │ │
│  │  ☑ Helmet, CORS, rate limiting security layer                  │ │
│  │  ☑ Auto-provisioning middleware for Supabase users             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Sprint 1.2 (Week 3–4): AI Chat + Voice                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ☑ Sarvam AI integration (sarvam-30b model)                    │ │
│  │  ☑ AI chat interface with agricultural context                 │ │
│  │  ☑ Voice input via Sarvam STT (saaras:v3)                     │ │
│  │  ☑ Voice output via Sarvam TTS (bulbul:v3)                    │ │
│  │  ☑ 12+ Indian language support                                 │ │
│  │  ☑ Chat history persistence (ChatMessage model)                │ │
│  │  ☑ AI crop recommendation endpoint                             │ │
│  │  ☑ Socket.IO real-time message delivery                        │ │
│  │  ☑ Frontend chat UI with voice button                          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Deliverables:                                                       │
│  • Working auth flow (signup → OTP → login → dashboard)             │
│  • AI chat with voice I/O in Punjabi/Hindi/English                  │
│  • Role-specific dashboard shells                                    │
│  • API rate limiting operational                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 2 — Engagement (Weeks 5–8)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: COMMUNITY + UTILITY                                        │
│                                                                       │
│  Sprint 2.1 (Week 5–6): Forum + Disease Detection                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ☑ Community forum with posts + comments (Post, Comment)       │ │
│  │  ☑ Category-based browsing + search                            │ │
│  │  ☑ Expert-verified answers with badge system                   │ │
│  │  ☑ Post moderation workflow (auto-approve for experts)         │ │
│  │  ☑ AI crop disease detection from image upload                 │ │
│  │  ☑ Disease treatment recommendations (chemical + organic)      │ │
│  │  ☑ Frontend disease scanner UI with camera integration         │ │
│  │  ☑ Curated disease database (50+ crops × diseases)             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Sprint 2.2 (Week 7–8): Calendar + Mandi Prices                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ☑ Crop calendar with activity tracking                        │ │
│  │  ☑ Seasonal reminders (Rabi Oct–Mar, Kharif Jun–Oct)           │ │
│  │  ☑ 1500+ pre-populated calendar activities                     │ │
│  │  ☑ Mandi price dashboard (50+ markets, real-time)              │ │
│  │  ☑ Market comparison & historical trends                       │ │
│  │  ☑ Weather integration for planning                            │ │
│  │  ☑ Crop recommendation from soil + season data                 │ │
│  │  ☑ Punjab-specific local data (mandis, crops, schemes)         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Deliverables:                                                       │
│  • Active community forum with expert contributions                 │
│  • Camera-based disease detection with treatment advice             │
│  • Seasonal crop calendar with automated reminders                  │
│  • Live mandi prices for Punjab markets                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 3 — Intelligence (Weeks 9–12)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: ADVANCED FEATURES + POLISH                                 │
│                                                                       │
│  Sprint 3.1 (Week 9–10): Analytics + Documents                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ☑ Dashboard analytics (role-specific KPIs)                    │ │
│  │  ☑ Activity tracking (Activity model, 10+ activity types)      │ │
│  │  ☑ Yield prediction AI endpoint                                │ │
│  │  ☑ Document upload + verification (Aadhaar, land records)      │ │
│  │  ☑ Admin moderation dashboard                                  │ │
│  │  ☑ Merchant-specific marketplace analytics                     │ │
│  │  ☑ Recharts visualization (line, bar, pie, area charts)        │ │
│  │  ☑ Soil health analysis from curated database                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Sprint 3.2 (Week 11–12): Notifications + PWA + Polish             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  ☑ Multi-channel notifications (in-app + push)                 │ │
│  │  ☑ PWA with service worker + offline support                   │ │
│  │  ☑ manifest.json + installable app                             │ │
│  │  ☑ Government scheme browser                                   │ │
│  │  ☑ Kisan Call Center directory integration                     │ │
│  │  ☑ Satellite data visualization (field map)                    │ │
│  │  ☑ End-to-end testing + security audit                         │ │
│  │  ☑ Performance optimization (lazy loading, code splitting)     │ │
│  │  ☑ Deployment (Vercel + Railway + Supabase)                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Deliverables:                                                       │
│  • Full analytics dashboards per role                               │
│  • Installable PWA for low-connectivity areas                       │
│  • Government scheme discovery & Kisan Call Center access           │
│  • Production-ready deployment                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Feature Prioritization Matrix

```
┌──────────────────────────────┬────────┬────────┬───────┬──────────┐
│ Feature                      │ Impact │ Effort │ Risk  │ Priority │
├──────────────────────────────┼────────┼────────┼───────┼──────────┤
│ Auth + Role Registration     │ HIGH   │ MED    │ LOW   │ P0       │
│ AI Chat (Sarvam LLM)        │ HIGH   │ MED    │ MED   │ P0       │
│ Voice I/O (STT + TTS)       │ HIGH   │ MED    │ MED   │ P0       │
│ Multilingual UI (12 langs)  │ HIGH   │ LOW    │ LOW   │ P0       │
│ Crop Recommendation Engine   │ HIGH   │ LOW    │ LOW   │ P0       │
│ Disease Detection (Image AI) │ HIGH   │ MED    │ MED   │ P1       │
│ Community Forum              │ MED    │ MED    │ LOW   │ P1       │
│ Crop Calendar + Reminders    │ MED    │ LOW    │ LOW   │ P1       │
│ Mandi Price Dashboard        │ MED    │ LOW    │ LOW   │ P1       │
│ Dashboard Analytics          │ MED    │ MED    │ LOW   │ P2       │
│ Document Upload/Verify       │ LOW    │ MED    │ LOW   │ P2       │
│ Notification System          │ MED    │ MED    │ LOW   │ P2       │
│ PWA + Offline Support        │ MED    │ LOW    │ LOW   │ P2       │
│ Admin Moderation Panel       │ LOW    │ MED    │ LOW   │ P2       │
│ Satellite Field Map          │ LOW    │ HIGH   │ MED   │ P3       │
│ Soil Health Lab Integration  │ LOW    │ HIGH   │ HIGH  │ P3       │
│ Payment Gateway (Mandis)     │ MED    │ HIGH   │ HIGH  │ P3       │
└──────────────────────────────┴────────┴────────┴───────┴──────────┘

Priority:  P0 = Must-have (MVP)  │  P1 = Should-have (Phase 2)
           P2 = Nice-to-have     │  P3 = Future / Post-MVP
```

---

## Team Allocation (Assumed 3-Person Team)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ROLE MATRIX                                                         │
│                                                                       │
│  Dev 1 (Full-Stack Lead):                                           │
│    Phase 1: Backend API + Auth + Database + Prisma                  │
│    Phase 2: Forum API + Calendar API + Analytics                    │
│    Phase 3: Deployment + Performance + Security audit               │
│                                                                       │
│  Dev 2 (Frontend + AI):                                             │
│    Phase 1: React UI + Auth flows + AI Chat UI                      │
│    Phase 2: Disease Scanner + Mandi Dashboard + Calendar UI         │
│    Phase 3: PWA + Notifications + Recharts dashboards               │
│                                                                       │
│  Dev 3 (AI/ML + Data):                                              │
│    Phase 1: Sarvam AI integration + Voice pipeline                  │
│    Phase 2: Disease model + Recommendation engine                   │
│    Phase 3: Yield prediction + Satellite features                   │
│                                                                       │
│  WEEKLY CADENCE:                                                     │
│  Mon: Sprint planning  │  Wed: Standup  │  Fri: Demo + retrospective│
└─────────────────────────────────────────────────────────────────────┘
```

---

## MVP Success Criteria

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAUNCH CRITERIA (must pass before v1.0 release)                    │
│                                                                       │
│  ┌────────────────────────────────────┬─────────────────────────┐   │
│  │ Metric                             │ Target                   │   │
│  ├────────────────────────────────────┼─────────────────────────┤   │
│  │ Auth flow completion rate          │ ≥ 90%                   │   │
│  │ AI chat response time              │ < 3 seconds             │   │
│  │ Voice STT accuracy (Hindi/Punjabi) │ ≥ 85%                   │   │
│  │ Disease detection accuracy         │ ≥ 80%                   │   │
│  │ Page load time (3G India)          │ < 5 seconds             │   │
│  │ API uptime                         │ ≥ 99%                   │   │
│  │ Concurrent users supported         │ ≥ 100                   │   │
│  │ All P0 features functional         │ 100%                    │   │
│  │ Zero critical security issues      │ 0                       │   │
│  │ Lighthouse PWA score               │ ≥ 80                    │   │
│  └────────────────────────────────────┴─────────────────────────┘   │
│                                                                       │
│  POST-MVP VALIDATION:                                                │
│  • 50 farmers onboarded in Punjab (pilot villages)                  │
│  • 200+ AI conversations in first 30 days                           │
│  • NPS score ≥ 40 from farmer user group                            │
│  • ≥ 10 forum posts from community within 2 weeks                   │
└─────────────────────────────────────────────────────────────────────┘
```
