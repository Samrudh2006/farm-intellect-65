# Farm Intellect — Cost Optimization

## Current Infrastructure Costs

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COST BREAKDOWN (MVP Phase)                         │
│                                                                       │
│  ┌──────────────────────┬───────────┬───────────┬────────────────┐  │
│  │ Service              │ Tier      │ Monthly   │ Notes          │  │
│  ├──────────────────────┼───────────┼───────────┼────────────────┤  │
│  │ Vercel (Frontend)    │ Free      │ $0        │ 100GB BW       │  │
│  │ Railway (Backend)    │ Starter   │ $5        │ 512MB RAM      │  │
│  │ Supabase (DB+Auth)   │ Free      │ $0        │ 500MB DB       │  │
│  │ Sarvam AI (LLM)     │ Pay-as-go │ ~$3       │ ~3000 calls/mo │  │
│  │ Sarvam STT/TTS      │ Pay-as-go │ ~$2       │ ~2000 calls/mo │  │
│  │ Domain (optional)    │ Annual    │ ~$1       │ .in domain     │  │
│  │ Twilio SMS           │ Pay-as-go │ ~$2       │ OTP only       │  │
│  ├──────────────────────┼───────────┼───────────┼────────────────┤  │
│  │ TOTAL                │           │ ~$13/mo   │ Pre-revenue    │  │
│  └──────────────────────┴───────────┴───────────┴────────────────┘  │
│                                                                       │
│  COMPARATIVE (if using paid alternatives):                           │
│  ┌──────────────────────┬───────────┬───────────────────────────┐   │
│  │ Alternative          │ Monthly   │ What we'd lose            │   │
│  ├──────────────────────┼───────────┼───────────────────────────┤   │
│  │ OpenAI GPT-4         │ ~$50      │ 10x more expensive        │   │
│  │ AWS EC2 + RDS        │ ~$40      │ Massive overkill for MVP  │   │
│  │ Firebase (full)      │ ~$25      │ No Prisma, vendor lock-in │   │
│  │ Google Cloud Run     │ ~$15      │ More complex deployment   │   │
│  └──────────────────────┴───────────┴───────────────────────────┘   │
│                                                                       │
│  SAVINGS vs. typical indie stack: ~80% ($13 vs ~$60/mo)             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Free Tier Maximization Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  VERCEL FREE TIER (Frontend Hosting)                                 │
│                                                                       │
│  Limits:                                                             │
│  • 100 GB bandwidth/month            → ~50K page loads              │
│  • 100 deployments/day               → Sufficient for dev           │
│  • Serverless function timeout: 10s  → Not used (separate backend)  │
│  • 1 team member                     → OK for MVP                   │
│                                                                       │
│  Optimization:                                                       │
│  ├── Aggressive code splitting (36 lazy-loaded pages)               │
│  ├── Asset compression (vite build + gzip)                          │
│  ├── CDN-cached static assets (images, fonts)                       │
│  ├── SPA routing via vercel.json rewrites                           │
│  └── No server-side rendering needed (all client-rendered)          │
│                                                                       │
│  Upgrade Trigger: > 50K users/month → Vercel Pro ($20/mo)          │
├─────────────────────────────────────────────────────────────────────┤
│  SUPABASE FREE TIER (Auth + Database)                                │
│                                                                       │
│  Limits:                                                             │
│  • 500 MB database storage           → ~200K rows                   │
│  • 50,000 monthly active users       → More than enough             │
│  • 1 GB file storage                 → Document uploads             │
│  • 2 million auth requests/month     → Unlimited for MVP           │
│  • 500 MB bandwidth/day              → API responses                │
│                                                                       │
│  Optimization:                                                       │
│  ├── Only auth + profiles in Supabase (not bulk data)               │
│  ├── Bulk agri data in Prisma/SQLite (backend, no Supabase cost)    │
│  ├── RLS policies minimize over-fetching                            │
│  ├── Indexed queries on user_id, role                               │
│  └── Edge functions for lightweight auth checks                     │
│                                                                       │
│  Upgrade Trigger: > 500 MB DB → Supabase Pro ($25/mo)              │
├─────────────────────────────────────────────────────────────────────┤
│  RAILWAY STARTER ($5/mo — Backend Hosting)                           │
│                                                                       │
│  Allocation:                                                         │
│  • 512 MB RAM, shared CPU                                           │
│  • 1 GB persistent disk (SQLite DB)                                 │
│  • Custom domain support                                            │
│  • Automatic deploys from GitHub                                    │
│                                                                       │
│  Optimization:                                                       │
│  ├── Express server with clustering (future)                        │
│  ├── In-memory rate limiter (no Redis needed)                       │
│  ├── SQLite for read-heavy workloads (zero network latency)         │
│  ├── Winston file logging (no log service cost)                     │
│  └── Efficient Prisma queries with select/include                   │
│                                                                       │
│  Upgrade Trigger: > 100 concurrent users → Railway Pro ($20/mo)    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI Cost Optimization

```
┌─────────────────────────────────────────────────────────────────────┐
│  SARVAM AI COST MODEL                                                │
│                                                                       │
│  Chat (sarvam-30b):                                                  │
│  • ~$0.001 per request                                              │
│  • Max 700 tokens/response (capped in config)                       │
│  • Temperature: 0.3 (deterministic, fewer retries)                  │
│  • System prompt: ~150 tokens (cached per session)                  │
│                                                                       │
│  STT (saaras:v3):                                                    │
│  • ~$0.0005 per minute of audio                                     │
│  • Max recording: 30 seconds per input                              │
│  • Average: 10 seconds per voice input                              │
│                                                                       │
│  TTS (bulbul:v3):                                                    │
│  • ~$0.0005 per 100 characters                                      │
│  • Average response: ~200 characters                                │
│                                                                       │
│  MONTHLY PROJECTION (500 active users):                              │
│  ┌────────────────────┬────────┬──────────┬──────────────────────┐  │
│  │ API                │ Calls  │ Cost     │ Calculation           │  │
│  ├────────────────────┼────────┼──────────┼──────────────────────┤  │
│  │ Chat completions   │ 3,000  │ $3.00    │ 6 calls/user × 500  │  │
│  │ Voice STT          │ 1,000  │ $0.50    │ 2 voice/user × 500  │  │
│  │ Voice TTS          │ 1,500  │ $1.50    │ 3 listen/user × 500 │  │
│  │ Disease detection   │ 500    │ $0.50    │ 1 scan/user × 500   │  │
│  ├────────────────────┼────────┼──────────┼──────────────────────┤  │
│  │ TOTAL              │ 6,000  │ $5.50    │                      │  │
│  └────────────────────┴────────┴──────────┴──────────────────────┘  │
│                                                                       │
│  COST REDUCTION TECHNIQUES:                                          │
│  ├── Rate limiting: 40 AI calls/15 min (prevents abuse)             │
│  ├── Chat rate limit: 60 msgs/5 min (per user)                     │
│  ├── Token cap: 700 max output tokens (concise responses)           │
│  ├── Low temperature: 0.3 (consistent, cacheable answers)           │
│  ├── Curated fallback data (offline crop info, no API call)         │
│  └── Client-side caching of repeated queries (TanStack Query)       │
│                                                                       │
│  vs. OpenAI GPT-4:                                                   │
│  • Same 6,000 calls → ~$60/mo (10x more expensive)                 │
│  • No native Indian language support                                │
│  • No integrated STT/TTS (need separate Whisper + ElevenLabs)      │
│  • Sarvam total: $5.50 vs OpenAI equivalent: ~$120/mo              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Scale-Up Cost Projections

```
┌─────────────────────────────────────────────────────────────────────┐
│  COST AT SCALE                                                       │
│                                                                       │
│  Users:      50      500      5,000     25,000    100,000           │
│  ──────────────────────────────────────────────────────────────      │
│  Vercel:     $0      $0       $20       $20       $150              │
│  Railway:    $5      $5       $20       $50       $200              │
│  Supabase:   $0      $0       $25       $25       $75               │
│  Sarvam AI:  $1      $6       $55       $275      $1,100            │
│  Twilio:     $1      $5       $25       $100      $400              │
│  Redis:      $0      $0       $10       $30       $50               │
│  CDN:        $0      $0       $0        $20       $50               │
│  Monitoring: $0      $0       $0        $30       $100              │
│  ──────────────────────────────────────────────────────────────      │
│  TOTAL:      $7      $16      $155      $550      $2,125            │
│  Per user:   $0.14   $0.03    $0.031    $0.022    $0.021            │
│                                                                       │
│  REVENUE OFFSET (at scale with premium):                             │
│  • 25K users × 5% premium × ₹99/mo = ₹1.24L/mo (~$1,480)          │
│  • 25K users × 2% merchant × ₹299/mo = ₹1.49L/mo (~$1,790)        │
│  • TOTAL REVENUE: ~$3,270/mo vs COST: $550/mo → 6x margin          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Cost Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  DUAL DATABASE COST OPTIMIZATION                                     │
│                                                                       │
│  Current Architecture:                                               │
│  ┌────────────────────┐    ┌───────────────────────┐                │
│  │  Supabase PG       │    │  Prisma + SQLite      │                │
│  │  (Auth only)       │    │  (All app data)       │                │
│  │  Cost: $0          │    │  Cost: $0 (Railway)   │                │
│  │  Tables: 3         │    │  Tables: 13           │                │
│  │  Size: < 10 MB     │    │  Size: < 50 MB        │                │
│  └────────────────────┘    └───────────────────────┘                │
│                                                                       │
│  WHY THIS SAVES MONEY:                                               │
│  ├── Supabase free tier used only for auth overhead                 │
│  ├── SQLite has zero connection cost (embedded)                     │
│  ├── No connection pooling needed (no PgBouncer)                    │
│  ├── Read queries are local disk I/O (microsecond latency)          │
│  ├── Prisma schema portable: npm run db:push to PostgreSQL later    │
│  └── 12 curated data files embedded in frontend (zero API calls)    │
│                                                                       │
│  MIGRATION PATH (at 5000+ users):                                   │
│  SQLite → PostgreSQL on Supabase Pro ($25/mo total for both)        │
│  Change: datasource db { provider = "postgresql" }                  │
│  Run: npx prisma migrate deploy                                     │
│  Zero application code changes needed                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Cost Monitoring & Alerts

```
┌─────────────────────────────────────────────────────────────────────┐
│  MONITORING STRATEGY                                                 │
│                                                                       │
│  ┌──────────────┬──────────────────┬────────────────────────────┐   │
│  │ Metric       │ Alert Threshold  │ Action                      │   │
│  ├──────────────┼──────────────────┼────────────────────────────┤   │
│  │ AI API calls │ > 5000/month     │ Review rate limits          │   │
│  │ Bandwidth    │ > 80 GB (Vercel) │ Optimize assets             │   │
│  │ DB size      │ > 400 MB (Supa)  │ Plan migration              │   │
│  │ Railway RAM  │ > 450 MB         │ Optimize queries            │   │
│  │ Error rate   │ > 5% of requests │ Debug + fix                 │   │
│  │ SMS cost     │ > $10/month      │ Batch OTPs, add cooldowns   │   │
│  └──────────────┴──────────────────┴────────────────────────────┘   │
│                                                                       │
│  Tools: Vercel Analytics (free), Railway metrics (built-in),        │
│         Supabase dashboard, Winston logs on Railway disk             │
└─────────────────────────────────────────────────────────────────────┘
```
