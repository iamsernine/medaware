# Implementation Plan: MedAware Reddit-Style Medical Q&A MVP

**Branch**: `001-medaware-monorepo` | **Date**: 2025-02-14 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-medaware-monorepo/spec.md`

## Summary

MedAware is a Reddit-style public medical Q&A MVP with two user modes (Patient, Verified Doctor) and no authentication. Users are selected in the UI and sent via `x-user-id` header; the backend enforces role/ownership rules by looking up that user in Postgres. Public read access; Patients create/edit/delete only their own questions; Verified doctors create/edit/delete only their own answers; non-verified doctors cannot answer. REST API, Swagger at /docs, validation (title 5–120, body 20–5000, max 5 tags), paginated list endpoints, consistent `{ data, meta? }` responses.

## Technical Context

| Item | Value |
|------|-------|
| **Language/Version** | TypeScript (Node 18+), React 18 |
| **Primary Dependencies** | NestJS (API), React + Vite (web), Turborepo, Prisma |
| **Storage** | PostgreSQL via Docker Compose |
| **Testing** | Jest (optional minimal API tests), ESLint, Prettier |
| **Target Platform** | Web (browser) + Node API |
| **Project Type** | Monorepo (apps/web, apps/api, packages/shared, packages/config) |
| **Performance Goals** | Standard web MVP (no formal SLA) |
| **Constraints** | No auth; simulated user via x-user-id header |
| **Scale/Scope** | MVP: 4 seeded users, sample questions/answers |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Safety-First | **Deferred** | AI triage/red-flag/misinformation not in MVP; `/ai` placeholder added for future work |
| II. AI as Co-Pilot | **Deferred** | MVP is human-only Q&A; AI layer planned for later |
| III. Misinformation Control | **Deferred** | No AI detection in MVP |
| IV. Patient-Friendly Clarity | **Partial** | UI shows doctor badge; structured display supports clarity; AI translation deferred |
| V. Structured Knowledge Extraction | **Deferred** | Post-thread extraction planned for AI phase |

**Gate Result**: PASS (MVP builds foundation; AI principles apply to future `/ai` modules)

## Project Structure

### Documentation (this feature)

```text
specs/001-medaware-monorepo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # OpenAPI + schemas
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
medaware/
├── apps/
│   ├── web/                 # React + Vite
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── api/
│   │   │   └── ...
│   │   └── package.json
│   └── api/                 # NestJS
│       ├── src/
│       │   ├── users/
│       │   ├── questions/
│       │   ├── answers/
│       │   ├── prisma/
│       │   └── ...
│       ├── ai/              # Placeholder + README
│       └── package.json
├── packages/
│   ├── shared/              # Shared types, DTOs
│   └── config/              # Shared tsconfig, eslint, prettier
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Structure Decision**: Turborepo monorepo with pnpm; apps/web (React), apps/api (NestJS), packages/shared, packages/config. `/ai` placeholder in api for future triage/red-flag/misinformation/pgvector modules.

## Phase 0: Research

See [research.md](./research.md) for technology choices and rationale.

## Phase 1: Design Artifacts

- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/openapi.yaml](./contracts/openapi.yaml)
- **Quickstart**: [quickstart.md](./quickstart.md)

## Implementation Phases (Outline)

1. **Repo scaffolding**: Turborepo + pnpm workspace, apps/web, apps/api, packages/shared, packages/config; shared tsconfig/eslint/prettier; root scripts (dev, lint).
2. **Infra**: docker-compose.yml for Postgres + volume; .env.example for api/web; API reads DATABASE_URL.
3. **Prisma**: Schema (users, questions, answers), enums, relations, migrations; seed (4 users + optional sample Q&A).
4. **API foundation**: NestJS bootstrap, CORS, global validation pipe, exception formatting, Swagger at /docs.
5. **Request-user mechanism**: Middleware/guard reads x-user-id, loads user from DB, attaches to req.user; rejects missing/unknown for writes.
6. **Modules**: Users, Questions, Answers with endpoints per spec.
7. **Frontend**: React + Vite + Router; feed, thread, patient/doctor pages; Active User dropdown; API client with x-user-id.
8. **End-to-end**: Create question, answer, edit, delete flows; verified badge; loading/errors; empty states.
9. **Quality**: Lint/format, README, /ai/README.md placeholder.
