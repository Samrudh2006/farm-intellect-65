# Farm Intellect — Metrics & Risk Assessment

## Key Performance Indicators

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KPI DASHBOARD                                      │
│                                                                       │
│  ACQUISITION METRICS                                                 │
│  ┌────────────────────────────────┬─────────┬────────┬───────────┐  │
│  │ Metric                         │ Target  │ 30-day │ Frequency │  │
│  ├────────────────────────────────┼─────────┼────────┼───────────┤  │
│  │ New signups                    │ 100/mo  │ Track  │ Daily     │  │
│  │ Signup → verified rate         │ ≥ 80%   │ Track  │ Weekly    │  │
│  │ Onboarding completion          │ ≥ 70%   │ Track  │ Weekly    │  │
│  │ Role distribution (F/M/E/A)   │ 70/15/10/5% │ Track │ Monthly │  │
│  │ Geographic spread (districts)  │ 5+      │ Track  │ Monthly   │  │
│  └────────────────────────────────┴─────────┴────────┴───────────┘  │
│                                                                       │
│  ENGAGEMENT METRICS                                                  │
│  ┌────────────────────────────────┬─────────┬────────┬───────────┐  │
│  │ Metric                         │ Target  │ 30-day │ Frequency │  │
│  ├────────────────────────────────┼─────────┼────────┼───────────┤  │
│  │ Daily Active Users (DAU)       │ 30%     │ Track  │ Daily     │  │
│  │ Weekly Active Users (WAU)      │ 60%     │ Track  │ Weekly    │  │
│  │ AI chat sessions/user/week     │ ≥ 3     │ Track  │ Weekly    │  │
│  │ Voice interactions/user/week   │ ≥ 1     │ Track  │ Weekly    │  │
│  │ Forum posts/week               │ ≥ 10    │ Track  │ Weekly    │  │
│  │ Average session duration       │ ≥ 5 min │ Track  │ Weekly    │  │
│  │ 7-day retention                │ ≥ 40%   │ Track  │ Weekly    │  │
│  │ 30-day retention               │ ≥ 25%   │ Track  │ Monthly   │  │
│  └────────────────────────────────┴─────────┴────────┴───────────┘  │
│                                                                       │
│  TECHNICAL METRICS                                                   │
│  ┌────────────────────────────────┬─────────┬────────┬───────────┐  │
│  │ Metric                         │ Target  │ 30-day │ Frequency │  │
│  ├────────────────────────────────┼─────────┼────────┼───────────┤  │
│  │ API uptime                     │ ≥ 99%   │ Track  │ Daily     │  │
│  │ API response time (p95)        │ < 500ms │ Track  │ Daily     │  │
│  │ AI response time (p95)         │ < 3s    │ Track  │ Daily     │  │
│  │ Error rate (5xx)               │ < 1%    │ Track  │ Daily     │  │
│  │ Page load time (3G)            │ < 5s    │ Track  │ Weekly    │  │
│  │ Lighthouse score               │ ≥ 80    │ Track  │ Sprint    │  │
│  │ PWA install rate               │ ≥ 20%   │ Track  │ Monthly   │  │
│  └────────────────────────────────┴─────────┴────────┴───────────┘  │
│                                                                       │
│  AGRICULTURAL IMPACT METRICS                                         │
│  ┌────────────────────────────────┬─────────┬────────┬───────────┐  │
│  │ Metric                         │ Target  │ 30-day │ Frequency │  │
│  ├────────────────────────────────┼─────────┼────────┼───────────┤  │
│  │ Crop recommendations acted on  │ ≥ 30%   │ Survey │ Monthly   │  │
│  │ Disease detections/month       │ 100+    │ Track  │ Monthly   │  │
│  │ Mandi prices checked/user      │ ≥ 4/mo  │ Track  │ Monthly   │  │
│  │ Calendar activities completed   │ ≥ 50%   │ Track  │ Seasonal  │  │
│  │ Farmer-reported yield impact   │ +10%    │ Survey │ Seasonal  │  │
│  │ Cost reduction (input costs)    │ -15%    │ Survey │ Annual    │  │
│  └────────────────────────────────┴─────────┴────────┴───────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Risk Register

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RISK MATRIX                                       │
│                                                                       │
│    Likelihood →   LOW          MEDIUM         HIGH                   │
│  Impact ↓                                                            │
│  ┌─────────────┬──────────────┬──────────────┬──────────────────┐   │
│  │             │              │              │                  │   │
│  │   HIGH      │  R6: Data    │  R3: Sarvam  │  R1: Low farmer │   │
│  │             │  breach      │  API downtime│  digital literacy│   │
│  │             │              │              │                  │   │
│  ├─────────────┼──────────────┼──────────────┼──────────────────┤   │
│  │             │              │              │                  │   │
│  │   MEDIUM    │  R7: Team    │  R4: 3G/2G   │  R2: Hindi/     │   │
│  │             │  member loss │  connectivity│  Punjabi AI error│   │
│  │             │              │              │                  │   │
│  ├─────────────┼──────────────┼──────────────┼──────────────────┤   │
│  │             │              │              │                  │   │
│  │   LOW       │  R8: Domain  │  R5: Railway │  R9: Legal      │   │
│  │             │  competition │  downtime    │  compliance      │   │
│  │             │              │              │                  │   │
│  └─────────────┴──────────────┴──────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Risk Analysis

```
┌─────────────────────────────────────────────────────────────────────┐
│  R1: LOW FARMER DIGITAL LITERACY                                     │
│  Likelihood: HIGH  │  Impact: HIGH  │  Priority: CRITICAL            │
│                                                                       │
│  Description: 65% of target farmers have limited smartphone skills. │
│  Many are first-time app users. Complex UI will cause abandonment.  │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── Voice-first interface (Sarvam STT/TTS in native language)      │
│  ├── Minimal UI with large touch targets + icons                    │
│  ├── Punjabi/Hindi as default language (not English)                 │
│  ├── Onboarding tutorial with visual guides                         │
│  ├── PWA for one-tap home screen install (no Play Store friction)   │
│  ├── WhatsApp integration (familiar interface) in Phase 2           │
│  └── Field demonstrations through extension workers                  │
│                                                                       │
│  Residual Risk: MEDIUM (voice mitigates but doesn't eliminate)      │
├─────────────────────────────────────────────────────────────────────┤
│  R2: AI INACCURACY IN INDIAN LANGUAGES                               │
│  Likelihood: HIGH  │  Impact: MEDIUM  │  Priority: HIGH              │
│                                                                       │
│  Description: Sarvam model may misunderstand regional dialects,     │
│  code-mixed speech (Hindi + Punjabi), or agricultural terminology.  │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── Agricultural system prompt with domain glossary                │
│  ├── Low temperature (0.3) for consistent responses                 │
│  ├── Curated fallback data (60+ crops, 50+ diseases offline)        │
│  ├── Expert verification layer for AI-generated advice              │
│  ├── User feedback mechanism (thumbs up/down on AI responses)       │
│  └── Disclaimer on all AI advice ("consult local expert")           │
│                                                                       │
│  Residual Risk: MEDIUM                                               │
├─────────────────────────────────────────────────────────────────────┤
│  R3: SARVAM AI API DOWNTIME / PRICING CHANGE                        │
│  Likelihood: MEDIUM  │  Impact: HIGH  │  Priority: HIGH              │
│                                                                       │
│  Description: Single AI provider dependency. API outage or          │
│  sudden pricing increase would break core functionality.            │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── Graceful degradation: show curated data when AI is down        │
│  ├── Client-side crop/disease database as fallback                  │
│  ├── Cache frequent AI responses (TanStack Query, 5 min stale)     │
│  ├── Rate limiting prevents unexpected cost spikes                  │
│  ├── Budget alerts on API spend (>$10/month trigger)                │
│  ├── Abstracted AI service layer (easy provider swap)               │
│  └── Evaluate backup: Bhashini API, AI4Bharat models               │
│                                                                       │
│  Residual Risk: MEDIUM                                               │
├─────────────────────────────────────────────────────────────────────┤
│  R4: POOR CONNECTIVITY (2G/3G RURAL INDIA)                           │
│  Likelihood: HIGH  │  Impact: MEDIUM  │  Priority: HIGH              │
│                                                                       │
│  Description: Rural Punjab has patchy 3G/4G. Average speed          │
│  may be 1-5 Mbps. Voice/image uploads will be slow.                │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── PWA with service worker caching (sw.js)                        │
│  ├── Lazy loading of all 36 pages (code splitting)                  │
│  ├── Compressed images + WebP format                                │
│  ├── Skeleton UI for perceived performance                          │
│  ├── Offline-first for curated data (crop info, calendar)           │
│  ├── Audio compression before STT upload                            │
│  ├── Text-only mode fallback when image upload times out            │
│  └── Target: < 5 seconds initial load on 3G                         │
│                                                                       │
│  Residual Risk: LOW (with PWA + offline-first)                      │
├─────────────────────────────────────────────────────────────────────┤
│  R5: RAILWAY BACKEND DOWNTIME                                        │
│  Likelihood: MEDIUM  │  Impact: LOW  │  Priority: MEDIUM             │
│                                                                       │
│  Description: Railway starter tier has no SLA. Cold starts          │
│  possible after inactivity periods.                                 │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── Health check endpoint (/health) with uptime monitoring         │
│  ├── Supabase handles auth independently (no backend needed)        │
│  ├── Frontend curated data works without backend                    │
│  ├── Cron ping to prevent cold starts                               │
│  └── Scale trigger: move to Railway Pro or Render at 100+ DAU       │
│                                                                       │
│  Residual Risk: LOW                                                  │
├─────────────────────────────────────────────────────────────────────┤
│  R6: DATA BREACH / SECURITY INCIDENT                                 │
│  Likelihood: LOW  │  Impact: HIGH  │  Priority: HIGH                 │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── Helmet.js HTTP security headers                                │
│  ├── bcrypt password hashing (salt rounds: 10)                      │
│  ├── JWT tokens with expiry (24h)                                   │
│  ├── Supabase RLS policies on all user data                         │
│  ├── Input validation (express-validator on all endpoints)           │
│  ├── Rate limiting (4-tier protection)                              │
│  ├── CORS whitelist (origin-restricted)                             │
│  ├── No PII in logs (Winston configured)                            │
│  └── OTP verification for sensitive operations                      │
│                                                                       │
│  Residual Risk: LOW                                                  │
├─────────────────────────────────────────────────────────────────────┤
│  R7: TEAM MEMBER DEPARTURE                                          │
│  Likelihood: LOW  │  Impact: MEDIUM  │  Priority: MEDIUM             │
│                                                                       │
│  MITIGATIONS:                                                        │
│  ├── Comprehensive documentation (this 22-doc set)                  │
│  ├── Standard tech stack (React + Express, easy to hire for)        │
│  ├── Clean code architecture with separation of concerns            │
│  ├── Version control with meaningful commit history                 │
│  └── No proprietary or obscure dependencies                         │
│                                                                       │
│  Residual Risk: LOW                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Success Metrics by Phase

```
┌─────────────────────────────────────────────────────────────────────┐
│  Phase 1 (MVP):     │  Phase 2 (Growth):   │  Phase 3 (Scale):     │
│  ──────────────     │  ────────────────    │  ───────────────      │
│  50 users           │  500 users           │  5,000 users          │
│  90% auth rate      │  60% WAU             │  40% 30d retention    │
│  3s AI response     │  10 posts/week       │  100 disease scans/mo │
│  99% uptime         │  WhatsApp: 200 users │  5+ states            │
│  NPS ≥ 40           │  NPS ≥ 50            │  Revenue trigger      │
│  0 critical bugs    │  < 0.5% error rate   │  < 0.1% error rate    │
└─────────────────────────────────────────────────────────────────────┘
```
