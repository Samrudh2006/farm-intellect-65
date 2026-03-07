# Farm Intellect — Security Architecture

## Security Layer Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                              │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  LAYER 1: NETWORK / TRANSPORT                                   ││
│  │  ├── HTTPS enforced (Vercel + Railway auto-SSL)                ││
│  │  ├── Helmet.js security headers (13 HTTP headers)              ││
│  │  ├── CORS whitelist (only frontend origin allowed)             ││
│  │  └── Rate limiting (4 tiers)                                   ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │  LAYER 2: AUTHENTICATION                                        ││
│  │  ├── Dual auth: Supabase Auth + Local JWT                      ││
│  │  ├── bcryptjs password hashing (10 salt rounds)                ││
│  │  ├── JWT tokens with 24h expiry                                ││
│  │  ├── OTP verification (email + SMS)                            ││
│  │  └── Auto-provisioning middleware for Supabase users           ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │  LAYER 3: AUTHORIZATION                                         ││
│  │  ├── Role-Based Access Control (4 roles)                       ││
│  │  ├── authorize() middleware on protected routes                ││
│  │  ├── Supabase RLS policies (row-level security)               ││
│  │  ├── Frontend ProtectedRoute component                        ││
│  │  └── Resource ownership checks (author-only edit/delete)      ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │  LAYER 4: INPUT VALIDATION                                      ││
│  │  ├── express-validator on all POST/PATCH endpoints             ││
│  │  ├── Zod schemas on frontend forms                             ││
│  │  ├── Multer file type + size restrictions                      ││
│  │  ├── Prisma parameterized queries (SQL injection proof)        ││
│  │  └── Sanitized error messages (no stack traces in production)  ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │  LAYER 5: DATA PROTECTION                                       ││
│  │  ├── Password hashing (bcrypt, never stored in plain text)     ││
│  │  ├── JWT secret in environment variables                       ││
│  │  ├── API keys in env (SARVAM_API_KEY, SUPABASE keys)          ││
│  │  ├── No PII in application logs                                ││
│  │  └── OTP codes have expiry timestamps                          ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  DUAL AUTH RESOLUTION                                                │
│                                                                       │
│  Request with Bearer token                                          │
│        │                                                             │
│        ▼                                                             │
│  ┌──────────────────┐                                               │
│  │ Extract token    │                                               │
│  │ from header      │                                               │
│  └───────┬──────────┘                                               │
│          │                                                           │
│          ▼                                                           │
│  ┌──────────────────┐     YES    ┌─────────────────────────┐        │
│  │ Is local JWT?    │───────────→│ Decode + find user in   │        │
│  │ (verifyToken)    │            │ Prisma DB by userId     │        │
│  └───────┬──────────┘            └──────────┬──────────────┘        │
│          │ NO                               │                        │
│          ▼                                  ▼                        │
│  ┌──────────────────┐            ┌─────────────────────────┐        │
│  │ Is Supabase JWT? │            │ Set req.user =          │        │
│  │ (supa.getUser)   │            │ { id, email, role }     │        │
│  └───────┬──────────┘            └─────────────────────────┘        │
│          │ YES                                                       │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Find in local DB │                                               │
│  │ by supabaseId    │                                               │
│  └───────┬──────────┘                                               │
│          │ NOT FOUND                                                 │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ Auto-provision   │  Creates User record with                     │
│  │ Supabase user    │  email from Supabase + default FARMER role    │
│  └──────────────────┘                                               │
│                                                                       │
│  SECURITY NOTES:                                                     │
│  • Both auth paths lead to same req.user shape                      │
│  • Token validation fails → 401 Unauthorized                        │
│  • No token at all → 401 Unauthorized                               │
│  • Expired token → 401 Unauthorized                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Rate Limiting Configuration

```
┌─────────────────────────────────────────────────────────────────────┐
│  4-TIER RATE LIMITING (express-rate-limit)                           │
│                                                                       │
│  ┌──────────────┬──────────┬───────────┬──────────────────────────┐ │
│  │ Tier         │ Window   │ Max Reqs  │ Applied To                │ │
│  ├──────────────┼──────────┼───────────┼──────────────────────────┤ │
│  │ General      │ 15 min   │ 100       │ All routes (default)     │ │
│  │ Auth         │ 15 min   │ 20        │ /api/auth/*              │ │
│  │ AI           │ 15 min   │ 40        │ /api/ai/*                │ │
│  │ Chat         │ 5 min    │ 60        │ /api/chat/*              │ │
│  └──────────────┴──────────┴───────────┴──────────────────────────┘ │
│                                                                       │
│  Response on limit: 429 Too Many Requests                           │
│  Key: req.ip (IP-based limiting)                                    │
│  Header: X-RateLimit-Remaining, X-RateLimit-Reset                   │
│                                                                       │
│  WHY THESE NUMBERS:                                                  │
│  • Auth (20/15min): Prevents brute force. 20 attempts per IP.       │
│  • AI (40/15min): ~$0.001/call. 40 calls = $0.04 max per IP/15min │
│  • Chat (60/5min): Higher burst for active conversations            │
│  • General (100/15min): Generous for normal browsing                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Helmet.js Security Headers

```
┌─────────────────────────────────────────────────────────────────────┐
│  HTTP SECURITY HEADERS (via Helmet)                                  │
│                                                                       │
│  ┌────────────────────────────┬──────────────────────────────────┐  │
│  │ Header                     │ Value / Purpose                   │  │
│  ├────────────────────────────┼──────────────────────────────────┤  │
│  │ X-Content-Type-Options     │ nosniff (prevent MIME sniffing)  │  │
│  │ X-Frame-Options            │ DENY (prevent clickjacking)      │  │
│  │ X-XSS-Protection           │ 1; mode=block                    │  │
│  │ Strict-Transport-Security  │ max-age=31536000; includeSubDom │  │
│  │ Content-Security-Policy    │ default-src 'self'               │  │
│  │ X-Download-Options         │ noopen                           │  │
│  │ X-Permitted-Cross-Domain   │ none                             │  │
│  │ Referrer-Policy            │ no-referrer                      │  │
│  │ X-DNS-Prefetch-Control     │ off                              │  │
│  └────────────────────────────┴──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## OWASP Top 10 Coverage

```
┌─────────────────────────────────────────────────────────────────────┐
│  OWASP TOP 10 (2021) MAPPING                                        │
│                                                                       │
│  ┌────┬─────────────────────────────┬──────────┬─────────────────┐  │
│  │ #  │ Risk                        │ Status   │ Implementation  │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A01│ Broken Access Control       │ COVERED  │ RBAC + RLS +    │  │
│  │    │                             │          │ authorize()     │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A02│ Cryptographic Failures      │ COVERED  │ bcrypt + HTTPS  │  │
│  │    │                             │          │ + env secrets   │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A03│ Injection                   │ COVERED  │ Prisma ORM +    │  │
│  │    │                             │          │ express-valid.  │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A04│ Insecure Design             │ PARTIAL  │ Threat model    │  │
│  │    │                             │          │ needed for AI   │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A05│ Security Misconfiguration   │ COVERED  │ Helmet + CORS   │  │
│  │    │                             │          │ + env config    │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A06│ Vulnerable Components       │ MONITOR  │ npm audit +     │  │
│  │    │                             │          │ Dependabot      │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A07│ Auth Failures               │ COVERED  │ Dual auth +     │  │
│  │    │                             │          │ OTP + rate limit│  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A08│ Data Integrity Failures     │ PARTIAL  │ Input validation│  │
│  │    │                             │          │ + Zod schemas   │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A09│ Logging & Monitoring        │ COVERED  │ Winston logger  │  │
│  │    │                             │          │ + activity log  │  │
│  ├────┼─────────────────────────────┼──────────┼─────────────────┤  │
│  │ A10│ SSRF                        │ LOW RISK │ No user-        │  │
│  │    │                             │          │ supplied URLs   │  │
│  └────┴─────────────────────────────┴──────────┴─────────────────┘  │
│                                                                       │
│  Coverage: 7/10 FULLY COVERED │ 2/10 PARTIAL │ 1/10 LOW RISK       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supabase RLS Policies

```
┌─────────────────────────────────────────────────────────────────────┐
│  ROW LEVEL SECURITY (Supabase PostgreSQL)                            │
│                                                                       │
│  Table: profiles                                                     │
│  ├── SELECT: Users can only view their own profile                  │
│  │   Policy: auth.uid() = id                                        │
│  ├── UPDATE: Users can only update their own profile                │
│  │   Policy: auth.uid() = id                                        │
│  └── INSERT: Via trigger (handle_new_user) on auth.users            │
│                                                                       │
│  Table: user_roles                                                   │
│  ├── SELECT: Users can only view their own roles                    │
│  │   Policy: auth.uid() = user_id                                   │
│  └── INSERT: Via trigger (handle_new_user) on auth.users            │
│                                                                       │
│  Security Definer Functions:                                         │
│  ├── has_role(role app_role) → boolean                              │
│  │   Checks if current user has specified role                      │
│  └── get_user_role() → app_role                                     │
│      Returns current user's role                                    │
│                                                                       │
│  NOTE: Prisma/SQLite tables (backend) use middleware-level auth,    │
│  not RLS. All 13 backend tables rely on authenticate() + authorize()│
│  middleware for access control.                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variable Security

```
┌─────────────────────────────────────────────────────────────────────┐
│  SECRET MANAGEMENT                                                   │
│                                                                       │
│  Backend (.env):                                                     │
│  ├── DATABASE_URL            → Prisma connection string             │
│  ├── JWT_SECRET              → Token signing key (≥ 32 chars)       │
│  ├── SUPABASE_URL            → Project URL                          │
│  ├── SUPABASE_SERVICE_KEY    → Service role key (admin access)      │
│  ├── SARVAM_API_KEY          → AI API subscription key              │
│  ├── TWILIO_ACCOUNT_SID      → SMS provider credentials             │
│  ├── TWILIO_AUTH_TOKEN        → SMS provider credentials             │
│  ├── SMTP_HOST/USER/PASS     → Email server credentials             │
│  └── NODE_ENV                → production/development               │
│                                                                       │
│  Frontend (.env):                                                    │
│  ├── VITE_SUPABASE_URL       → Public Supabase URL                  │
│  └── VITE_SUPABASE_ANON_KEY  → Public anon key (safe to expose)    │
│                                                                       │
│  SECURITY RULES:                                                     │
│  ├── .env files in .gitignore (never committed)                     │
│  ├── Service keys only on backend (never in frontend)               │
│  ├── Anon key is safe for frontend (RLS enforces access)            │
│  ├── Railway environment variables for production secrets           │
│  ├── Vercel environment variables for frontend config               │
│  └── Rotate JWT_SECRET quarterly                                     │
└─────────────────────────────────────────────────────────────────────┘
```
