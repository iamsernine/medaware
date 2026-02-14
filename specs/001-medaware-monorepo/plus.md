# MedAware: What to Implement Next (Plus)

**Purpose**: Deep analysis of the MVP after Phases 1–9. Recommendations for the next layer of features, quality, and production readiness.

**Status**: All tasks T001–T048 are complete. This document outlines **plus** work: spec alignment, quality, security, UX, and future capabilities.

---

## 1. Completed in This Pass (Spec & Bug Fixes)

- **Thread.tsx**: Added missing `Link` import from `react-router-dom` (runtime bug).
- **Question close (spec FR-020)**: Only verified doctors can set `status: CLOSED`. Implemented in `questions.service.update` (author can still edit title/body/tags; any verified doctor can close any question).
- **Close thread UI**: "Close thread" button on Thread page for verified doctors when question is OPEN; API client supports `status` in `updateQuestion`.
- **Feed error state**: Feed page now shows error message in UI instead of only `console.error`.
- **API client**: Handles empty response body (e.g. DELETE) via `text()` + conditional `JSON.parse`; avoids crash on 204/no-content.

---

## 2. High Priority (Quality & Correctness)

### 2.1 Tests

- **API**: Unit tests for services (QuestionsService, AnswersService, UsersService) and guards (RequestUserGuard). E2E tests for critical flows: create question (patient), create answer (verified doctor), reject answer (non-verified), close question (doctor), author-only edit/delete.
- **Web**: Component tests for Feed, Thread, CreateQuestion, ActiveUserDropdown; integration or E2E for "select user → create question → see in feed".
- **Contract**: Optional OpenAPI contract tests (e.g. schemas and status codes) to keep API aligned with `contracts/openapi.yaml`.

### 2.2 Error & Loading Consistency (Web)

- **DoctorInbox**, **MyQuestions**: Show error state in UI (like Feed) instead of only `console.error`.
- **CreateQuestion**, **EditQuestion**, **AnswerEditor**: Already use `alert()` for errors; consider inline error message for better UX.
- **Global error boundary**: React error boundary to catch render errors and show a fallback instead of blank screen.

### 2.3 Validation & API Robustness

- **Pagination**: API already clamps `page`/`limit` (e.g. limit max 100). Document in OpenAPI; consider returning 400 for invalid values (e.g. negative page).
- **UUIDs**: Validate path params (`id`, `questionId`) as UUIDs where applicable; return 400 for malformed IDs.
- **API client**: Shared types (e.g. from OpenAPI or `packages/shared`) for request/response to reduce `any` and catch mismatches early.

---

## 3. Security & Production Readiness

### 3.1 Authentication & Authorization (Post-MVP)

- **Current**: Identity is simulated via `x-user-id`; no real auth. Fine for MVP/demo only.
- **Next**: Replace with real auth (e.g. JWT or session); validate token and set user server-side. Remove or strictly restrict `x-user-id` in production.
- **Rate limiting**: Add rate limiting (e.g. per IP or per user) on write endpoints to prevent abuse.
- **Security headers**: Helmet or equivalent (X-Content-Type-Options, CSP, etc.) on API and, if needed, web.

### 3.2 Environment & Secrets

- **API**: Keep `DATABASE_URL` and any future secrets in env only; ensure `.env` is gitignored (already). Consider validation at startup (e.g. required env vars).
- **Web**: `VITE_API_URL` for production build; avoid leaking internal URLs.

### 3.3 Database & Operations

- **Health check**: GET `/health` or `/ready` that checks DB connectivity; useful for k8s/Docker and load balancers.
- **Migrations**: Document that production deploys run `pnpm db:migrate` (or equivalent); consider migration strategy for zero-downtime.

---

## 4. UX & Frontend

### 4.1 Persistence & State

- **Active user**: Tasks mentioned "optional localStorage" for user selection. Persist selected user in `localStorage` so refresh keeps the same user.
- **Optimistic updates**: Optional: optimistic UI for create/edit (e.g. add question to list before API responds) with rollback on error.

### 4.2 Accessibility (a11y)

- **Semantic HTML**: Use `<main>`, `<nav>`, headings hierarchy; ensure forms have labels.
- **Keyboard & focus**: Focus management after submit; skip links; visible focus styles.
- **ARIA**: Roles and live regions where helpful (e.g. form errors, loading).

### 4.3 Design & Responsiveness

- **Layout**: Currently fixed max-width; ensure usable on small screens (stack nav, readable tap targets).
- **Theming**: Optional dark/light or high-contrast; can be done via CSS variables.

### 4.4 Doctor Inbox Filtering

- **API**: Add optional `status=OPEN` (and later `CLOSED`) to `GET /questions` so Doctor Inbox can request only OPEN questions instead of filtering client-side. Reduces payload and keeps filter logic in one place.

---

## 5. API & Contract

### 5.1 OpenAPI Alignment

- **DELETE responses**: OpenAPI says 204 for delete; Nest may return 200. Standardize (e.g. 204 no content) and document; client already handles empty body.
- **Sync**: Keep Swagger decorators and `contracts/openapi.yaml` in sync (or generate one from the other) to avoid drift.

### 5.2 Versioning & Stability

- **Prefix**: Optional `/v1` prefix for API to allow future breaking changes under `/v2`.
- **Deprecation**: If you add new endpoints or change behavior, document in OpenAPI and plan deprecation.

---

## 6. Future Features (From Spec & AI Placeholder)

### 6.1 From Spec / Data Model

- **Reopen question**: Spec does not require it; if needed, allow verified doctors (or author) to set status back to OPEN with audit trail.
- **Soft delete**: Optional soft delete for questions/answers (e.g. `deleted_at`) for moderation and recovery.

### 6.2 AI Layer (`apps/api/ai/README.md`)

- **Triage**: Classify question urgency (e.g. emergency / urgent / routine / informational).
- **Red-flag detection**: Detect high-risk wording (e.g. chest pain, stroke, suicidal ideation) and surface to doctors or trigger escalation.
- **Misinformation flagging**: Flag dangerous or myth-heavy content; optional moderation workflow.
- **pgvector**: Vector embeddings for questions/answers; semantic search and "similar questions" or retrieval for AI assistants.

Implement only after product direction and compliance (e.g. medical disclaimers, human-in-the-loop) are clear.

---

## 7. DevOps & Delivery

### 7.1 CI/CD

- **CI**: Lint, test, build on every PR; run migrations (or migration check) in CI if possible.
- **CD**: Build and deploy API + web (e.g. Docker images); run migrations before switching traffic.

### 7.2 Observability

- **Logging**: Structured logs (e.g. request id, user id, status code); avoid logging PII in production.
- **Metrics**: Optional request duration, error rate, DB pool usage.
- **Tracing**: Optional distributed tracing if you add more services.

### 7.3 Documentation

- **README**: Already has setup, seeded users, endpoints. Add: how to run tests, how to deploy, env var reference.
- **API**: Swagger at `/docs` is sufficient for MVP; keep descriptions and examples up to date.

---

## 8. Suggested Order of Implementation

1. **Immediate**: Error UI on DoctorInbox and MyQuestions; optional localStorage for active user.
2. **Short term**: API + web tests (at least smoke E2E and a few unit tests); GET /questions `status` filter; health endpoint.
3. **Before production**: Real authentication; rate limiting; security headers; CI/CD.
4. **Later**: a11y pass; design/responsiveness; AI modules per product roadmap.

---

## Summary Table

| Area            | Priority   | Effort | Notes                                      |
|-----------------|-----------|--------|--------------------------------------------|
| Tests           | High      | Medium | API + web; E2E for main flows              |
| Error UI        | High      | Low    | DoctorInbox, MyQuestions, optional global  |
| Active user persistence | Medium | Low  | localStorage in UserContext                |
| status=OPEN filter | Medium  | Low    | GET /questions?status=OPEN                 |
| Health endpoint | Medium    | Low    | GET /health or /ready                      |
| Real auth       | High (prod) | High | Replace x-user-id; tokens/sessions         |
| Rate limiting   | High (prod) | Low  | Per IP or per user                         |
| a11y            | Medium    | Medium | Labels, focus, ARIA                        |
| AI modules      | Later     | High   | After product and compliance clarity       |

This document can be used as a backlog: pick items by priority and dependency, and add concrete tasks to `tasks.md` or your issue tracker as needed.
