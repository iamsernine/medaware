# Research: MedAware MVP

**Feature**: 001-medaware-monorepo  
**Date**: 2025-02-14

## Monorepo Tooling

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Turborepo + pnpm | Fast incremental builds; good DX for TypeScript monorepos; pnpm handles workspaces well | Nx (heavier), Lerna (legacy), yarn workspaces (slower) |
| packages/config | Shared tsconfig, eslint, prettier reduces duplication | Per-app config (maintenance burden) |

## Backend

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| NestJS | Structured modules, decorators for validation/Swagger, strong TypeScript support | Express (more manual), Fastify (less ecosystem for Nest patterns) |
| Prisma | Type-safe schema, migrations, seeding; works well with NestJS | TypeORM (less ergonomic), raw SQL (no type safety) |
| x-user-id header | Simple, stateless; no tokens; backend validates via DB lookup | Cookie, body field (less RESTful) |

## Frontend

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| React + Vite | Fast HMR, modern build; Vite preferred over CRA | Next.js (overkill for SPA), CRA (deprecated) |
| React Router | Standard SPA routing | TanStack Router (newer), file-based (needs framework) |
| Axios or fetch | API client; x-user-id from selected user in state | SWR/React Query (can layer on later) |

## Infrastructure

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Docker Compose for Postgres | Reproducible local DB; volume for persistence | Cloud DB (adds complexity for MVP), SQLite (insufficient for production path) |

## Request-User Mechanism

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Guard/middleware per write route | Reads stay public; writes require valid x-user-id; user loaded once, attached to request | Global auth guard (would block reads), per-controller (duplication) |
| Reject missing/unknown ID with 401/403 | Clear error; no silent fallback | Default to "anonymous" (violates spec) |

## Validation

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| class-validator + class-transformer | NestJS native; DTOs with decorators; pipes for validation | Manual validation (error-prone), Zod (different style) |

## /ai Placeholder

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| README describing triage, red-flag, misinformation, pgvector | Documents future modules; no implementation | Skip (loses context), stub code (adds noise) |
