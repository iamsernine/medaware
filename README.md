# MedAware

Reddit-style medical Q&A MVP. Patients post questions; verified doctors respond. No authentication—users are simulated via dropdown selection and `x-user-id` header.

## Prerequisites

- Node.js 18+
- pnpm
- Docker (for Postgres)

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start Postgres**
   ```bash
   docker compose up -d
   ```

3. **Configure environment**
   - Copy `apps/api/.env.example` to `apps/api/.env`
   - Set `DATABASE_URL` (default: `postgresql://medaware:medaware@localhost:5432/medaware`)

4. **Run migrations**
   ```bash
   pnpm --filter api exec prisma migrate deploy
   ```

5. **Seed database**
   ```bash
   pnpm db:seed
   ```

6. **Start development**
   ```bash
   pnpm dev
   ```

- **Web**: http://localhost:5173
- **API**: http://localhost:3001
- **Swagger**: http://localhost:3001/docs

## Seeded Users

| Role              | display_name   | Notes                         |
|-------------------|----------------|-------------------------------|
| PATIENT           | Patient Alice  | Can create questions          |
| PATIENT           | Patient Bob    | Can create questions          |
| DOCTOR (verified) | Dr. Smith      | Can create/edit/delete answers|
| DOCTOR            | Dr. Unverified | Cannot create answers         |

Use the "Active User" dropdown to switch identities.

## Endpoints

| Method | Path                       | Auth        |
|--------|----------------------------|-------------|
| GET    | /users                     | No          |
| GET    | /users/:id                 | No          |
| GET    | /questions                 | No          |
| GET    | /questions/:id             | No          |
| POST   | /questions                 | x-user-id   |
| PATCH  | /questions/:id             | x-user-id   |
| DELETE | /questions/:id             | x-user-id   |
| POST   | /questions/:id/answers     | x-user-id   |
| PATCH  | /answers/:id               | x-user-id   |
| DELETE | /answers/:id               | x-user-id   |

## Validation

- Question title: 5–120 characters
- Question/Answer body: 20–5000 characters
- Tags: max 5 per question
