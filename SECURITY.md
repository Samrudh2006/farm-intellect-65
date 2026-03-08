# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (latest) | ✅ Yes |
| < 1.0 | ❌ No |

## Reporting a Vulnerability

We take security seriously at **Krishi AI — Farm Intellect**. If you discover a security vulnerability, please report it responsibly.

### 🔒 How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email: **security@farmintellect.app** (or open a private security advisory on GitHub)

### What to Include

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Impact assessment** — what could an attacker do?
4. **Suggested fix** (if you have one)

### Response Timeline

| Action | Timeline |
|---|---|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix deployed | Within 14 business days (critical) |
| Public disclosure | After fix is deployed |

## Security Measures in Place

### Authentication & Authorization
- ✅ Supabase Auth with email verification
- ✅ 4-role RBAC via dedicated `user_roles` table
- ✅ `has_role()` security definer function (prevents recursive RLS)
- ✅ Admin role assignment only via `admin_assign_role()` (server-side only)
- ✅ New users always default to `farmer` role — no self-promotion
- ✅ Cross-role login blocking (farmer can't access merchant routes)

### Data Protection
- ✅ Row-Level Security (RLS) on all 12 database tables
- ✅ Users can only read/write their own data
- ✅ Admins have controlled read access via RLS policies
- ✅ No PII stored in localStorage
- ✅ JWT verification on all Edge Functions

### API Security
- ✅ Private API keys stored as backend secrets (never in code)
- ✅ Edge Functions validate JWT tokens
- ✅ CORS configured for production domains
- ✅ Rate limiting on sensitive endpoints

### Password Security
- ✅ Email verification required before sign-in
- ✅ HIBP (Have I Been Pwned) leaked password check (configurable)
- ✅ No anonymous sign-ups

### Infrastructure
- ✅ HTTPS enforced on all deployments
- ✅ Immutable asset caching (1 year) via Vercel
- ✅ Service Worker excludes API/AI requests from caching
- ✅ Dependabot enabled for dependency vulnerability alerts

## Scope

The following are **in scope** for vulnerability reports:

- Authentication bypass
- Privilege escalation (e.g., farmer → admin)
- SQL injection or RLS bypass
- Cross-site scripting (XSS)
- Sensitive data exposure
- API key leakage
- CSRF attacks

The following are **out of scope**:

- Social engineering
- Denial of service (DoS)
- Issues in third-party dependencies (report to upstream)
- Issues requiring physical access to a user's device

## Recognition

We gratefully acknowledge security researchers who report vulnerabilities responsibly. With your permission, we'll list you in our security hall of fame.

---

<p align="center">
  <strong>Thank you for helping keep Indian farmers' data safe. 🔒🇮🇳</strong>
</p>
