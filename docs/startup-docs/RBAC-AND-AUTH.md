# Farm Intellect — RBAC & Authentication

## Dual Authentication System

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DUAL AUTH ARCHITECTURE                              │
│                                                                       │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐    │
│  │  SUPABASE AUTH           │  │  LOCAL JWT AUTH              │    │
│  │  (Frontend primary)      │  │  (Backend primary)           │    │
│  │                          │  │                              │    │
│  │  • Email + Password      │  │  • bcrypt password hash     │    │
│  │  • Session management    │  │  • JWT sign (jsonwebtoken)  │    │
│  │  • Magic link (planned)  │  │  • 24h token expiry         │    │
│  │  • onAuthStateChange()   │  │  • userId + role in payload │    │
│  │  • Supabase Dashboard    │  │  • OTP verification flow    │    │
│  │  • RLS enforcement       │  │  • refresh via re-login     │    │
│  └────────────┬─────────────┘  └──────────────┬───────────────┘    │
│               │                                │                     │
│               └────────────┬───────────────────┘                     │
│                            │                                         │
│               ┌────────────┴────────────┐                           │
│               │   authenticate()        │                           │
│               │   middleware             │                           │
│               │                         │                           │
│               │ 1. Extract Bearer token │                           │
│               │ 2. Try verifyToken()    │←── Local JWT first        │
│               │ 3. If fails: try        │                           │
│               │    supabase.getUser()   │←── Supabase fallback      │
│               │ 4. Find/provision user  │                           │
│               │ 5. Set req.user         │                           │
│               └─────────────────────────┘                           │
│                                                                       │
│  WHY DUAL AUTH:                                                      │
│  ├── Supabase Auth: Managed service, social logins, email verify   │
│  ├── Local JWT: Works without Supabase for backend-only testing    │
│  ├── Auto-provisioning bridges both systems seamlessly              │
│  └── Either token type grants full API access                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Role Hierarchy & Permissions

```
┌─────────────────────────────────────────────────────────────────────┐
│  ROLE-BASED ACCESS CONTROL (4 Roles)                                 │
│                                                                       │
│  enum UserRole { FARMER, MERCHANT, EXPERT, ADMIN }                  │
│                                                                       │
│  PERMISSION MATRIX:                                                  │
│  ┌────────────────────────┬────────┬──────────┬────────┬─────────┐ │
│  │ Action                 │ FARMER │ MERCHANT │ EXPERT │ ADMIN   │ │
│  ├────────────────────────┼────────┼──────────┼────────┼─────────┤ │
│  │ View own profile       │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ Edit own profile       │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ AI chat                │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ Voice STT/TTS          │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ View forum posts       │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ Create forum posts     │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ Add comments           │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ View crop library      │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ Disease detection      │  ✅    │   ❌     │  ✅    │  ✅    │ │
│  │ Crop calendar          │  ✅    │   ❌     │  ✅    │  ✅    │ │
│  │ Upload documents       │  ✅    │   ✅     │  ❌    │  ✅    │ │
│  │ View notifications     │  ✅    │   ✅     │  ✅    │  ✅    │ │
│  │ View farmer list       │  ❌    │   ✅     │  ✅    │  ✅    │ │
│  │ Auto-approve posts     │  ❌    │   ❌     │  ✅    │  ✅    │ │
│  │ Preventive tips API    │  ❌    │   ❌     │  ✅    │  ✅    │ │
│  │ View all users         │  ❌    │   ❌     │  ❌    │  ✅    │ │
│  │ Moderate forum         │  ❌    │   ❌     │  ❌    │  ✅    │ │
│  │ Broadcast notification │  ❌    │   ❌     │  ❌    │  ✅    │ │
│  │ Change user roles      │  ❌    │   ❌     │  ❌    │  ✅    │ │
│  │ Access admin dashboard │  ❌    │   ❌     │  ❌    │  ✅    │ │
│  │ System settings        │  ❌    │   ❌     │  ❌    │  ✅    │ │
│  └────────────────────────┴────────┴──────────┴────────┴─────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Middleware Chain

```
┌─────────────────────────────────────────────────────────────────────┐
│  REQUEST PROCESSING PIPELINE                                         │
│                                                                       │
│  HTTP Request                                                        │
│    │                                                                 │
│    ▼                                                                 │
│  ┌──────────────────┐                                               │
│  │ 1. Helmet()      │  Security headers (13 headers set)            │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 2. CORS()        │  Origin whitelist check                       │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 3. Rate Limiter  │  Check IP against tier limits                 │
│  │    (4 tiers)     │  429 if exceeded                              │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 4. JSON Parser   │  express.json({ limit: '10mb' })             │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 5. Route Match   │  Match /api/{module}/{action}                 │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 6. authenticate()│  Extract + verify Bearer token                │
│  │                  │  Set req.user = { id, email, role }           │
│  │                  │  401 if invalid/missing token                  │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 7. authorize()   │  Check req.user.role against allowed roles    │
│  │    (optional)    │  authorize('ADMIN', 'EXPERT')                 │
│  │                  │  403 if role not in allowed list               │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 8. Validation    │  express-validator checks on body/query       │
│  │   (optional)     │  400 if validation fails                      │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 9. Route Handler │  Business logic + Prisma queries              │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 10. Activity Log │  Record user action (Activity model)          │
│  │    (optional)    │  middleware/activity.js                        │
│  └───────┬──────────┘                                               │
│          ▼                                                           │
│  ┌──────────────────┐                                               │
│  │ 11. Error Handler│  Catch all errors → sanitized JSON response   │
│  │   (global)       │  middleware/errorHandler.js                    │
│  └──────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Auto-Provisioning Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  SUPABASE → LOCAL DB AUTO-PROVISIONING                               │
│                                                                       │
│  Scenario: User signs up via Supabase Auth (frontend), then makes  │
│  their first API call. Backend has no local User record yet.        │
│                                                                       │
│  authenticate() middleware:                                          │
│    │                                                                 │
│    ├── verifyToken(token) → FAILS (not a local JWT)                 │
│    │                                                                 │
│    ├── supabase.auth.getUser(token) → SUCCESS                       │
│    │   Returns: { id: "supa-uuid", email: "farmer@example.com" }   │
│    │                                                                 │
│    ├── prisma.user.findFirst({                                      │
│    │     where: { supabaseId: "supa-uuid" }                        │
│    │   }) → NOT FOUND                                               │
│    │                                                                 │
│    ├── findOrProvisionSupabaseUser() → CREATES:                     │
│    │   prisma.user.create({                                         │
│    │     data: {                                                     │
│    │       email: "farmer@example.com",                             │
│    │       supabaseId: "supa-uuid",                                │
│    │       name: "farmer@example.com",  // extracted from email    │
│    │       role: "FARMER",              // default role             │
│    │       isVerified: true             // Supabase verified       │
│    │     }                                                          │
│    │   })                                                            │
│    │                                                                 │
│    └── req.user = { id: "local-uuid", role: "FARMER", ... }        │
│                                                                       │
│  RESULT: Seamless transition. User never knows two auth systems     │
│  exist. All subsequent API calls find the provisioned User record.  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Route Protection

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROTECTED ROUTE COMPONENT (App.tsx)                                 │
│                                                                       │
│  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>               │
│    <Dashboard />                                                    │
│  </ProtectedRoute>                                                   │
│                                                                       │
│  LOGIC:                                                              │
│  1. Check AuthContext → is user authenticated?                      │
│     NO → Redirect to /login                                        │
│  2. Check user.role → is role in allowedRoles array?                │
│     NO → Redirect to user's default dashboard                      │
│  3. YES → Render child component                                    │
│                                                                       │
│  DEFAULT DASHBOARDS (redirect on role mismatch):                    │
│  ├── FARMER   → /dashboard                                         │
│  ├── MERCHANT → /merchant/dashboard                                │
│  ├── EXPERT   → /expert/dashboard                                  │
│  └── ADMIN    → /admin-dashboard                                   │
│                                                                       │
│  NOTE: Frontend protection is UX-only. Real security is enforced   │
│  by backend authorize() middleware. Even if frontend bypass occurs, │
│  API calls will return 403 Forbidden.                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## OTP Verification Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  OTP VERIFICATION (Email + SMS)                                      │
│                                                                       │
│  Prisma Model: OtpCode                                              │
│  {                                                                   │
│    id, userId, code (6-digit), type (EMAIL/SMS),                    │
│    expiresAt (10 min), isUsed, createdAt                            │
│  }                                                                   │
│                                                                       │
│  enum OtpType { EMAIL, SMS }                                        │
│                                                                       │
│  FLOW:                                                               │
│  Signup / Sensitive Action                                          │
│    │                                                                 │
│    ├── Generate 6-digit random code                                 │
│    ├── Store in OtpCode table (expires in 10 min)                   │
│    ├── Send via email (Nodemailer) or SMS (Twilio)                  │
│    │                                                                 │
│    ▼                                                                 │
│  User enters code on frontend                                       │
│    │                                                                 │
│    ├── POST /api/auth/verify-otp { userId, code, purpose }         │
│    ├── Check: code matches AND not expired AND not used             │
│    ├── Mark isUsed = true                                           │
│    └── Continue with authenticated flow                              │
│                                                                       │
│  SECURITY:                                                           │
│  ├── 10-minute expiry prevents replay attacks                       │
│  ├── isUsed prevents code reuse                                     │
│  ├── Rate limit on /api/auth/* (20/15min) prevents brute force     │
│  ├── 6-digit code = 1,000,000 possibilities                        │
│  └── Resend cooldown: 60 seconds between resend requests            │
└─────────────────────────────────────────────────────────────────────┘
```
