# MedAware Quickstart

**Feature**: 001-medaware-monorepo

## Prerequisites

- Node.js 18+
- pnpm
- Docker (for Postgres)

## Setup

1. **Clone and install**
   ```bash
   pnpm install
   ```

2. **Start Postgres**
   ```bash
   docker compose up -d
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env` in `apps/api` and `apps/web`
   - Set `DATABASE_URL` (e.g. `postgresql://user:pass@localhost:5432/medaware`)

4. **Run migrations**
   ```bash
   pnpm --filter api exec prisma migrate dev
   ```

5. **Seed database**
   ```bash
   pnpm db:seed
   ```

6. **Start development**
   ```bash
   pnpm dev
   ```

   - Web: http://localhost:5173
   - API: http://localhost:3001
   - Swagger: http://localhost:3001/docs

## Seeded Users

| Role              | display_name   | Notes                         |
|-------------------|----------------|-------------------------------|
| PATIENT           | Patient Alice  | Can create questions          |
| PATIENT           | Patient Bob    | Can create questions          |
| DOCTOR (verified) | Dr. Smith      | Can create/edit/delete answers|
| DOCTOR            | Dr. Unverified | Cannot create answers         |

Use the "Active User" dropdown in the web app to switch identities. The API client attaches `x-user-id` from the selected user.

## Endpoints Summary

| Method | Path                       | Auth Required | Notes                              |
|--------|----------------------------|---------------|------------------------------------|
| GET    | /users                     | No            | List users                         |
| GET    | /users/:id                 | No            | Get user                           |
| GET    | /questions                 | No            | List, search, tag, paginate        |
| GET    | /questions/:id             | No            | Question with answers              |
| POST   | /questions                 | Yes (patient) | Create question                    |
| PATCH  | /questions/:id             | Yes (author)  | Update question                    |
| DELETE | /questions/:id             | Yes (author)  | Delete question                    |
| POST   | /questions/:id/answers     | Yes (verified doctor) | Create answer             |
| PATCH  | /answers/:id               | Yes (owner)   | Update answer                      |
| DELETE | /answers/:id               | Yes (owner)   | Delete answer                      |

## Validation Rules

- Question title: 5–120 characters
- Question/Answer body: 20–5000 characters
- Tags: max 5 per question
