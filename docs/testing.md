# Testing Guide

## Current testing setup

### Frontend
- framework: **Vitest**
- DOM environment: **jsdom**
- UI assertions: **Testing Library**
- setup file: `src/test/setup.ts`
- starter test: `src/lib/utils.test.ts`

Run:

```bash
npm run test
```

### Backend
- framework: **Vitest**
- HTTP assertions: **Supertest**
- starter API test: `backend/test/health.test.js`

Run:

```bash
cd backend
npm run test
```

## What is covered today

- utility unit testing baseline
- backend health endpoint smoke test
- CI execution path for frontend and backend tests

## Current limitations reviewers may notice

The current test setup is useful, but still early compared with the breadth of the product.

### What is not yet fully covered

- Supabase-authenticated flows are not yet comprehensively tested end to end
- hybrid boundaries between frontend datasets, Supabase auth, and backend APIs are not yet verified by integration tests
- document uploads, RBAC decisions, notifications, and chat flows need deeper route-level coverage
- realtime socket behavior is documented more thoroughly than it is currently tested

### How to explain this honestly

> The codebase now has working test scaffolding and CI, but coverage is still concentrated on smoke-test and foundation layers. The next maturity step is integration coverage across the hybrid boundaries.

## Recommended next test coverage

### Frontend
- auth flows
- route protection
- SmartChatbot response selection logic
- crop recommendation rendering
- analytics charts with dataset mocks
- field map NDVI profile rendering

### Backend
- auth signup/login flows
- JWT-protected route access
- chat endpoint validation
- document upload authorization
- admin/expert document verification RBAC
- notification routes

### Hybrid boundary tests
- frontend auth context behavior with mocked Supabase sessions
- protected route rendering by role
- dataset-driven features with deterministic fixture checks
- frontend-to-backend API contract assertions
- socket authentication and room-join authorization

## Documentation support for testing

To reduce reviewer confusion, every major hybrid boundary should eventually have a matching test story:

| Boundary | Desired proof |
|---|---|
| Frontend ↔ Supabase | auth/session integration tests |
| Frontend ↔ Backend | API contract and protected-route tests |
| Frontend ↔ Datasets | deterministic advisory/component tests |
| Backend ↔ Database | route + persistence tests |
| Realtime ↔ JWT auth | socket auth and room authorization tests |

## Testing strategy recommendation

- unit tests for pure utility/data transforms
- component tests for page/feature rendering
- API tests for auth and route behavior
- selected end-to-end tests for critical user flows
