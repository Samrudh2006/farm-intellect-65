# Farm Intellect — Deployment Architecture

## Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                            │
│                                                                       │
│  ┌─────────────────────────┐                                        │
│  │    VERCEL (Frontend)    │  React SPA + Static Assets             │
│  │    Free Tier            │  Auto-deploy from GitHub main branch   │
│  │    CDN: Edge Network    │  Custom domain: farmintelect.in        │
│  └──────────┬──────────────┘                                        │
│             │ HTTPS                                                  │
│             │                                                        │
│  ┌──────────┴──────────────┐                                        │
│  │  RAILWAY (Backend API)  │  Express + Node.js + Prisma            │
│  │  Starter Plan ($5/mo)   │  Auto-deploy from GitHub               │
│  │  512MB RAM, Shared CPU  │  Custom domain: api.farmintelect.in    │
│  │  1GB Persistent Disk    │  SQLite DB on disk                     │
│  └──────────┬──────────────┘                                        │
│             │                                                        │
│  ┌──────────┴──────────────┐                                        │
│  │  SUPABASE (Auth + DB)   │  PostgreSQL + Auth service             │
│  │  Free Tier              │  Triggers + RLS policies               │
│  │  500MB DB, 50K MAU      │  Edge functions (optional)             │
│  └──────────┬──────────────┘                                        │
│             │                                                        │
│  ┌──────────┴──────────────┐                                        │
│  │  SARVAM AI (AI APIs)    │  LLM + STT + TTS                      │
│  │  Pay-as-you-go          │  api-subscription-key auth             │
│  └─────────────────────────┘                                        │
│                                                                       │
│  DOMAIN ROUTING:                                                     │
│  farmintelect.in      → Vercel (frontend)                           │
│  api.farmintelect.in  → Railway (backend)                           │
│  *.supabase.co        → Supabase (managed)                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Vercel Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  VERCEL FRONTEND DEPLOYMENT                                          │
│                                                                       │
│  vercel.json:                                                        │
│  {                                                                   │
│    "rewrites": [                                                    │
│      { "source": "/(.*)", "destination": "/" }                      │
│    ]                                                                 │
│  }                                                                   │
│                                                                       │
│  BUILD SETTINGS:                                                     │
│  ┌──────────────────┬────────────────────────────────────────────┐  │
│  │ Framework        │ Vite                                        │  │
│  │ Build Command    │ npm run build (vite build)                  │  │
│  │ Output Directory │ dist/                                       │  │
│  │ Install Command  │ npm install                                 │  │
│  │ Node Version     │ 18.x                                        │  │
│  └──────────────────┴────────────────────────────────────────────┘  │
│                                                                       │
│  ENVIRONMENT VARIABLES (Vercel Dashboard):                           │
│  ├── VITE_SUPABASE_URL         → https://xxx.supabase.co           │
│  └── VITE_SUPABASE_ANON_KEY    → eyJhbGciOiJIUzI1NiI...          │
│                                                                       │
│  AUTO-DEPLOY:                                                        │
│  ├── Push to main → production deploy                               │
│  ├── Push to feature/* → preview deploy                             │
│  └── PR → preview URL for review                                    │
│                                                                       │
│  PERFORMANCE:                                                        │
│  ├── Edge CDN in 30+ regions (Asia-Pacific priority)                │
│  ├── Brotli + Gzip compression                                     │
│  ├── Immutable cache headers for hashed assets                     │
│  └── Automatic HTTPS (Let's Encrypt)                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Railway Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  RAILWAY BACKEND DEPLOYMENT                                          │
│                                                                       │
│  SERVICE SETUP:                                                      │
│  ┌──────────────────┬────────────────────────────────────────────┐  │
│  │ Start Command    │ npm start (node src/server.js)             │  │
│  │ Build Command    │ npm install && npx prisma generate         │  │
│  │                  │             && npx prisma db push          │  │
│  │ Root Directory   │ backend/                                   │  │
│  │ Health Check     │ /health                                    │  │
│  │ Port             │ $PORT (Railway assigns dynamically)        │  │
│  │ Region           │ ap-southeast-1 (Singapore, close to India) │  │
│  └──────────────────┴────────────────────────────────────────────┘  │
│                                                                       │
│  ENVIRONMENT VARIABLES (Railway Dashboard):                          │
│  ├── DATABASE_URL          = file:./dev.db                          │
│  ├── JWT_SECRET            = <32+ char random string>               │
│  ├── SUPABASE_URL          = https://xxx.supabase.co                │
│  ├── SUPABASE_SERVICE_KEY  = eyJ...                                 │
│  ├── SARVAM_API_KEY        = <subscription key>                     │
│  ├── TWILIO_ACCOUNT_SID    = AC...                                  │
│  ├── TWILIO_AUTH_TOKEN     = <token>                                │
│  ├── SMTP_HOST             = smtp.gmail.com                         │
│  ├── SMTP_USER             = <email>                                │
│  ├── SMTP_PASS             = <app password>                         │
│  ├── NODE_ENV              = production                             │
│  ├── PORT                  = (assigned by Railway)                  │
│  └── CORS_ORIGIN           = https://farmintelect.in                │
│                                                                       │
│  DEPLOYMENT FLOW:                                                    │
│  git push → Railway detects → npm install → prisma generate        │
│  → prisma db push → node src/server.js → health check passes      │
│  → traffic routed to new deployment                                 │
│                                                                       │
│  ZERO-DOWNTIME: Railway uses rolling deploys. Old instance          │
│  serves traffic until new instance passes health check.             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supabase Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  SUPABASE PROJECT SETUP                                              │
│                                                                       │
│  supabase/config.toml:                                               │
│  ├── project_id = "farm-intellect"                                  │
│  ├── [auth] site_url = "https://farmintelect.in"                   │
│  ├── [auth] redirect_urls = ["https://farmintelect.in/**"]         │
│  └── [db] port = 54322 (local dev)                                  │
│                                                                       │
│  MIGRATIONS:                                                         │
│  supabase/migrations/20260306*_*.sql                                │
│  ├── Create app_role ENUM (farmer, merchant, admin, expert)         │
│  ├── Create profiles table (linked to auth.users)                   │
│  ├── Create user_roles table                                        │
│  ├── Enable RLS on profiles + user_roles                            │
│  ├── Create handle_new_user() trigger function                      │
│  ├── Create has_role() security definer function                    │
│  └── Create get_user_role() security definer function               │
│                                                                       │
│  DEPLOYMENT:                                                         │
│  npx supabase db push     → Apply migrations to remote              │
│  npx supabase db reset    → Reset + re-apply (dev only)             │
│  npx supabase functions deploy → Deploy edge functions              │
│                                                                       │
│  AUTH PROVIDERS:                                                     │
│  ├── Email + Password (primary)                                     │
│  ├── Magic Link (planned)                                           │
│  └── Phone OTP via Twilio (configured)                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## CI/CD Pipeline (Planned)

```
┌─────────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS CI/CD                                                │
│                                                                       │
│  ON PUSH TO main:                                                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Step 1: Lint                                                  │ │
│  │  └── npx eslint . (ESLint flat config)                        │ │
│  │                                                                │ │
│  │  Step 2: Type Check                                            │ │
│  │  └── npx tsc --noEmit                                         │ │
│  │                                                                │ │
│  │  Step 3: Unit Tests                                            │ │
│  │  └── npx vitest run (frontend)                                │ │
│  │  └── cd backend && npx vitest run (backend)                   │ │
│  │                                                                │ │
│  │  Step 4: Build                                                 │ │
│  │  └── npm run build (vite build)                               │ │
│  │                                                                │ │
│  │  Step 5: Deploy                                                │ │
│  │  └── Vercel auto-deploys (GitHub integration)                 │ │
│  │  └── Railway auto-deploys (GitHub integration)                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ON PULL REQUEST:                                                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  • Lint + Type Check + Tests                                   │ │
│  │  • Vercel Preview Deploy → comment URL on PR                  │ │
│  │  • No Railway preview (single backend)                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ENVIRONMENTS:                                                       │
│  ┌────────────┬──────────────────┬──────────────────────────────┐  │
│  │ Branch     │ Frontend          │ Backend                      │  │
│  ├────────────┼──────────────────┼──────────────────────────────┤  │
│  │ main       │ farmintelect.in  │ api.farmintelect.in          │  │
│  │ develop    │ dev.farmintelect │ dev-api.farmintelect.in      │  │
│  │ feature/*  │ preview URL      │ (shared dev backend)         │  │
│  └────────────┴──────────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Migration Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  SQLite → PostgreSQL MIGRATION PATH                                  │
│                                                                       │
│  CURRENT (MVP):                                                      │
│  ├── Backend: SQLite via Prisma (file:./dev.db)                     │
│  ├── Auth: Supabase PostgreSQL (profiles + roles)                   │
│  └── Perfect for: < 100 concurrent users, single server             │
│                                                                       │
│  MIGRATION TRIGGER: > 500 users OR need for concurrent writes       │
│                                                                       │
│  STEPS:                                                              │
│  1. Change prisma/schema.prisma:                                    │
│     datasource db { provider = "postgresql" }                       │
│  2. Create PostgreSQL on Supabase (or Railway)                      │
│  3. Run: npx prisma migrate deploy                                  │
│  4. Export SQLite data → Import to PostgreSQL                       │
│  5. Update DATABASE_URL environment variable                        │
│  6. Zero application code changes (Prisma abstracts DB)             │
│                                                                       │
│  DOWNTIME: ~30 minutes (data export + import + DNS update)          │
└─────────────────────────────────────────────────────────────────────┘
```
