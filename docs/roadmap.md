# Roadmap and Enhancements

## Implemented / scaffolded in this pass

- complete README
- architecture/API/database/deployment/security docs
- dataset citations doc
- testing doc
- user flow doc
- project assessment doc
- demo asset manifest
- frontend Vitest scaffolding
- backend API test scaffolding
- CI workflow
- shared starter API DTOs
- route-specific rate limiting
- stricter RBAC middleware usage on sensitive routes
- frontend error boundary and centralized error helper

## Engineering improvements

### In progress / starter state
- frontend tests with Vitest + React Testing Library
- backend API tests
- centralized frontend error handling
- logging foundation
- typed API contracts between frontend/backend
- CI pipeline

### Next engineering targets
- request validation everywhere
- shared schema validation between frontend/backend
- monitoring dashboards and alerting
- code coverage reporting
- contract-first API docs (OpenAPI)

## Data improvements

- automate mandi/weather refresh
- version datasets explicitly
- add regional language metadata
- add confidence score / freshness timestamp to advisories
- add source attribution in UI

## Security improvements

- stricter RBAC checks everywhere
- audit logs for admin actions
- file upload scanning
- CSP hardening
- secret rotation policy
- encrypted sensitive fields at rest if stored later

## Product improvements

- multilingual support expansion
- offline/PWA-first farmer mode
- image-based disease detection with ML model
- personalized crop planning
- field history timeline
- subsidy/scheme eligibility wizard
- smart irrigation advisory
- alert engine for pests/weather/market drops
- expert booking + consultation workflow
- village/mandi geo-personalization

## Product expansion program

The next feature wave should be delivered as a structured program rather than as isolated UI additions. A dedicated capability breakdown now lives in [`future-capabilities.md`](./future-capabilities.md).

### Phase 1 — Farmer productivity foundation

- multilingual support expansion
- offline/PWA-first farmer mode
- personalized crop planning
- field history timeline
- subsidy/scheme eligibility wizard

### Phase 2 — Advisory intelligence upgrade

- image-based disease detection with ML model
- smart irrigation advisory
- alert engine for pests/weather/market drops
- village/mandi geo-personalization

### Phase 3 — Assisted services and marketplace maturity

- expert booking + consultation workflow
- stronger role-specific advisory escalations
- report export and notification workflows

### Delivery principle

Each phase should include:

- product UX definition
- dataset/model/service ownership clarification
- API/schema updates
- observability and alerting hooks
- test coverage for the new boundary

## Architecture implications of the next wave

The next feature wave changes the system in important ways:

- **multilingual + geo-personalization** increase profile, locale, and context management complexity
- **offline mode + alerting** require service worker strategy, sync queues, and notification/event design
- **ML disease detection** introduces a new model-serving boundary
- **crop planning + field history** push the product toward timeline/stateful farm records
- **scheme wizard + expert booking** introduce workflow/state machine style backend logic
- **smart irrigation** requires weather, field, and crop-stage context fusion

This means the roadmap is not only about adding features; it is about evolving the architecture responsibly.

## Highest-impact differentiators

### High impact
- offline-first farmer mode
- regional language voice assistant
- true ML disease classifier
- satellite-based field health monitoring
- personalized farm digital twin
- market prediction + sell timing advice

### Great for judges / recruiters
- farmer-specific dashboard by district
- PDF advisory report export
- WhatsApp/SMS alert integration
- admin analytics with real adoption metrics
