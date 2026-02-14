# Tasks: MedAware Reddit-Style Medical Q&A MVP

**Input**: Design documents from `/specs/001-medaware-monorepo/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, research.md

**Tests**: Not included (optional per spec; add via `/speckit.tasks` with test request if needed).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US6)
- Include exact file paths in descriptions

## Path Conventions

- Monorepo root: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `docker-compose.yml`
- API: `apps/api/src/`
- Web: `apps/web/src/`
- Shared: `packages/shared/`
- Config: `packages/config/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [x] T001 Create Turborepo + pnpm workspace (package.json, pnpm-workspace.yaml, turbo.json) at repo root
- [x] T002 [P] Create apps/web with React + Vite + TypeScript in apps/web/package.json and apps/web/src/
- [x] T003 [P] Create apps/api with NestJS + TypeScript in apps/api/package.json and apps/api/src/
- [x] T004 [P] Create packages/shared with package.json and placeholder types in packages/shared/
- [x] T005 [P] Create packages/config with shared tsconfig, eslint, prettier configs in packages/config/
- [x] T006 Add root scripts (dev, lint) and wire turbo in package.json and turbo.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 Add docker-compose.yml for Postgres with volume at repo root
- [x] T008 Add .env.example for apps/api and apps/web
- [x] T009 Define Prisma schema (users, questions, answers, enums, relations) in apps/api/prisma/schema.prisma
- [x] T010 Run Prisma migrate dev to create initial migration in apps/api
- [x] T011 Add db:seed script creating 4 users (2 patients, 1 verified doctor, 1 non-verified) plus optional sample Q&A in apps/api/prisma/seed.ts
- [x] T012 Bootstrap NestJS app with CORS, global ValidationPipe, exception filter in apps/api/src/main.ts
- [x] T013 Add Swagger at /docs in apps/api/src/main.ts
- [x] T014 Implement RequestUser guard (reads x-user-id, loads user from DB, attaches to request; rejects missing/unknown for write routes) in apps/api/src/common/guards/
- [x] T015 Implement UsersModule with GET /users and GET /users/:id in apps/api/src/users/
- [x] T016 Implement QuestionsModule with GET /questions (search, tag, page, limit) and GET /questions/:id (with answers) in apps/api/src/questions/
- [x] T017 Add consistent { data, meta? } response interceptor in apps/api/src/
- [x] T018 Create apps/api/ai/README.md placeholder describing future triage, red-flag, misinformation, pgvector modules

**Checkpoint**: Foundation ready—user story implementation can begin.

---

## Phase 3: User Story 1 - Browse Public Medical Q&A Feed (Priority: P1) 🎯 MVP

**Goal**: Visitor can view feed of questions, filter, paginate, open thread, see verified doctor badge.

**Independent Test**: Load feed, apply search/tag filters, paginate, click question, see thread with answers and verified badge.

- [x] T019 [P] [US1] Create Feed page with question list, search, tag filter, pagination in apps/web/src/pages/Feed.tsx
- [x] T020 [US1] Create Thread page component (question + answers, Verified Doctor badge) in apps/web/src/pages/Thread.tsx
- [x] T021 [US1] Add API client for GET /questions and GET /questions/:id in apps/web/src/api/
- [x] T022 [US1] Add routes / and /q/:id with React Router in apps/web/src/
- [x] T023 [US1] Add layout components (header, feed layout) with Reddit-like styling in apps/web/src/components/

**Checkpoint**: US1 complete—browse feed and threads without auth.

---

## Phase 4: User Story 6 - Simulated User Selection (Priority: P1)

**Goal**: User can switch "Active User" via dropdown; API client attaches x-user-id from selected user.

**Independent Test**: Select different users from dropdown; verify x-user-id sent on write requests; reads work without selection.

- [x] T024 [P] [US6] Create Active User dropdown component fetching GET /users in apps/web/src/components/ActiveUserDropdown.tsx
- [x] T025 [US6] Add user selection state (React state + optional localStorage) in apps/web
- [x] T026 [US6] Update API client to attach x-user-id header from selected user in apps/web/src/api/

**Checkpoint**: US6 complete—dropdown and header wiring ready for US2/US3/US4/US5.

---

## Phase 5: User Story 2 - Patient Posts a Medical Question (Priority: P1)

**Goal**: Patient can create question; visit "my questions"; validation enforced; non-patients rejected.

**Independent Test**: Select patient, submit question with valid title/body/tags; see in feed and /patient/mine; select doctor, verify reject.

- [x] T027 [US2] Add optional author_id filter to GET /questions for /patient/mine in apps/api/src/questions/
- [x] T028 [US2] Implement QuestionsModule POST /questions with RequestUser guard and PATIENT role check in apps/api/src/questions/
- [x] T029 [US2] Add CreateQuestionDto with validation (title 5–120, body 20–5000, max 5 tags) in apps/api/src/questions/dto/
- [x] T030 [US2] Create CreateQuestionForm with validation and submit in apps/web/src/components/
- [x] T031 [US2] Create /patient/new page in apps/web/src/pages/
- [x] T032 [US2] Create /patient/mine page listing questions by selected patient (GET /questions?author_id=...) in apps/web/src/pages/

**Checkpoint**: US2 complete—patients can create and view their questions.

---

## Phase 6: User Story 3 - Verified Doctor Responds to a Question (Priority: P1)

**Goal**: Verified doctor can post answer to open question; non-verified/patient rejected; doctor inbox and respond page.

**Independent Test**: Select verified doctor, post answer to open question; select non-verified doctor, verify reject; visit /doctor/inbox and /doctor/respond/:id.

- [x] T033 [US3] Implement AnswersModule with POST /questions/:id/answers (RequestUser, verified-doctor check, reject if CLOSED) in apps/api/src/answers/
- [x] T034 [US3] Add CreateAnswerDto (body 20–5000) in apps/api/src/answers/dto/
- [x] T035 [US3] Create answer editor component and add to Thread page in apps/web/src/components/
- [x] T036 [US3] Create /doctor/inbox page (OPEN questions only) in apps/web/src/pages/
- [x] T037 [US3] Create /doctor/respond/:id page (thread + answer editor) in apps/web/src/pages/

**Checkpoint**: US3 complete—verified doctors can create answers.

---

## Phase 7: User Story 4 - Question Author Manages Their Question (Priority: P2)

**Goal**: Question author can edit and delete their question; non-authors rejected.

**Independent Test**: Select author, edit and delete question; select non-author, verify reject.

- [x] T038 [US4] Implement QuestionsModule PATCH and DELETE /questions/:id with author ownership check in apps/api/src/questions/
- [x] T039 [US4] Add UpdateQuestionDto in apps/api/src/questions/dto/
- [x] T040 [US4] Add edit/delete controls to question on Thread and /patient/mine in apps/web/src/components/

**Checkpoint**: US4 complete—authors can manage questions.

---

## Phase 8: User Story 5 - Answer Author Manages Their Answer (Priority: P2)

**Goal**: Answer author (verified doctor) can edit and delete their answer; non-owners rejected.

**Independent Test**: Select answer author, edit and delete answer; select other user, verify reject.

- [x] T041 [US5] Implement AnswersModule PATCH and DELETE /answers/:id with owner check in apps/api/src/answers/
- [x] T042 [US5] Add UpdateAnswerDto in apps/api/src/answers/dto/
- [x] T043 [US5] Add edit/delete controls to answers for owning doctor in apps/web/src/components/

**Checkpoint**: US5 complete—doctors can manage their answers.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: UX, quality, and documentation

- [x] T044 Add loading and error states across Feed, Thread, patient, and doctor pages in apps/web
- [x] T045 Add empty states (no questions, no answers) in apps/web
- [x] T046 [P] Add ESLint + Prettier via packages/config, run lint/format in root
- [x] T047 Add README with run steps, seeded users, endpoint summary at repo root
- [x] T048 Verify pnpm dev runs both web and api via turbo

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies—start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1—BLOCKS all user stories.
- **Phase 3 (US1)**: Depends on Phase 2. No other story dependencies.
- **Phase 4 (US6)**: Depends on Phase 2. Enables US2, US3, US4, US5.
- **Phase 5 (US2)**: Depends on Phase 2 + Phase 4.
- **Phase 6 (US3)**: Depends on Phase 2 + Phase 4.
- **Phase 7 (US4)**: Depends on Phase 2 + Phase 4 + Phase 5.
- **Phase 8 (US5)**: Depends on Phase 2 + Phase 4 + Phase 6.
- **Phase 9 (Polish)**: Depends on Phases 3–8.

### User Story Dependencies

| Story | Depends On | Blocks |
|-------|------------|--------|
| US1 | Phase 2 | — |
| US6 | Phase 2 | US2, US3, US4, US5 |
| US2 | Phase 2, US6 | US4 |
| US3 | Phase 2, US6 | US5 |
| US4 | Phase 2, US6, US2 | — |
| US5 | Phase 2, US6, US3 | — |

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005 can run in parallel.
- **Phase 2**: T015, T016 can run in parallel after T009–T014.
- **Phase 3**: T019 can run in parallel with T021.
- **Phase 5**: T029, T030 can run in parallel.
- **Phase 6**: T034, T035 can run in parallel.
- **Phase 9**: T046 can run in parallel with T047.

---

## Parallel Example: Phase 1 Setup

```bash
# Parallel setup tasks:
Task T002: Create apps/web with React + Vite
Task T003: Create apps/api with NestJS
Task T004: Create packages/shared
Task T005: Create packages/config
```

---

## Parallel Example: User Story 1

```bash
# After foundational complete:
Task T019: Create Feed page
Task T021: Add API client (no page dependency)
# Then T020, T022, T023 in sequence or parallel where possible
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Load feed, open thread, see verified badge
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. + US1 → Browse feed and threads (MVP)
3. + US6 → User selection for writes
4. + US2 → Patients create questions
5. + US3 → Doctors create answers
6. + US4 → Authors manage questions
7. + US5 → Doctors manage answers
8. + Polish → Production-ready

---

## Notes

- [P] = different files, no dependencies on incomplete tasks
- [USn] maps task to user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
