# Feature Specification: MedAware Reddit-Style Medical Q&A Platform MVP

**Feature Branch**: `001-medaware-monorepo`  
**Created**: 2025-02-14  
**Status**: Draft  
**Input**: User description: "Generate a Turborepo monorepo project named medaware using pnpm. The monorepo must contain: apps/web (React), apps/api (NestJS), packages/shared, Postgres via Docker Compose, Prisma ORM. Build an MVP Reddit-style medical Q&A platform where patients post questions and verified doctors respond. No authentication—users simulated via seeded records and role selection in requests."

## Clarifications

### Session 2025-02-14

- Q: Who can close a question (set status to CLOSED), and is closing required? → A: Closing is optional. If implemented, only verified doctors can close threads.
- Q: Which API style (REST vs GraphQL)? → A: REST only.
- Q: How does the backend enforce user identity for write operations? → A: Middleware/guard reads x-user-id header, loads user from DB, attaches to request context; rejects missing or unknown IDs for write operations. Reads remain public (no header required).
- Q: Where should request-user validation apply? → A: Write operations (create question, create answer, update, delete) require valid x-user-id; read operations do not.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Public Medical Q&A Feed (Priority: P1)

A visitor (patient or doctor) can view a public feed of medical questions with search, tag filtering, and pagination. No login required.

**Why this priority**: Core discovery—users must find and read content before participating.

**Independent Test**: Load the feed, apply search/tag filters, paginate. Verifies read access and listing behavior.

**Acceptance Scenarios**:

1. **Given** questions exist in the system, **When** a user visits the feed, **Then** they see a paginated list of questions with title, author, tags, status, and creation date.
2. **Given** the feed page, **When** the user searches by keyword or filters by tag, **Then** only matching questions are returned.
3. **Given** the feed, **When** the user clicks a question, **Then** they see the full question and all answers in a thread view.
4. **Given** any user, **When** they read questions or answers, **Then** verified doctors display a "Verified Doctor" badge.

---

### User Story 2 - Patient Posts a Medical Question (Priority: P1)

A patient selects their identity from a dropdown and posts a new medical question. Only users with the patient role can create questions.

**Why this priority**: Core participation—enables the Q&A flow.

**Independent Test**: Select patient user, submit question with valid title/body/tags. Question appears in feed and in "my questions" list.

**Acceptance Scenarios**:

1. **Given** a patient user is selected, **When** they submit a question with title (5–120 chars), body (20–5000 chars), and up to 5 tags, **Then** the question is created and appears in the feed.
2. **Given** a doctor user is selected, **When** they attempt to create a question, **Then** the request is rejected with a clear error.
3. **Given** a question form, **When** validation fails (e.g., title too short, body too long, more than 5 tags), **Then** the user receives clear validation errors.
4. **Given** a patient, **When** they visit "my questions", **Then** they see only questions they authored.

---

### User Story 3 - Verified Doctor Responds to a Question (Priority: P1)

A verified doctor selects their identity and posts an answer to an open question. Only verified doctors can create answers.

**Why this priority**: Core participation—completes the Q&A loop.

**Independent Test**: Select verified doctor, post answer to open question. Answer appears in thread. Non-verified doctor is rejected.

**Acceptance Scenarios**:

1. **Given** a verified doctor user is selected, **When** they submit an answer to an open question, **Then** the answer is created and appears in the thread.
2. **Given** a non-verified doctor or patient is selected, **When** they attempt to create an answer, **Then** the request is rejected with a clear error.
3. **Given** a doctor, **When** they visit the "inbox" (open questions), **Then** they see all open questions available to answer.
4. **Given** a doctor on a thread page, **When** they submit an answer, **Then** they can continue to edit or delete their own answer.

---

### User Story 4 - Question Author Manages Their Question (Priority: P2)

The patient who authored a question can edit or delete it. Only the author can modify or remove their question.

**Why this priority**: Supports content correction and user control.

**Independent Test**: Select question author, edit title/body, then delete. Verify non-authors cannot modify.

**Acceptance Scenarios**:

1. **Given** the question author is selected, **When** they edit the question title or body (within validation limits), **Then** the question is updated.
2. **Given** the question author is selected, **When** they delete the question, **Then** the question and its answers are removed (or handled per business rule).
3. **Given** a non-author is selected, **When** they attempt to edit or delete the question, **Then** the request is rejected.

---

### User Story 5 - Answer Author Manages Their Answer (Priority: P2)

The doctor who wrote an answer can edit or delete it. Only the owning doctor can modify or remove their answer.

**Why this priority**: Supports content correction and doctor control.

**Independent Test**: Select answer author (verified doctor), edit and delete answer. Verify non-authors cannot modify.

**Acceptance Scenarios**:

1. **Given** the answer author (verified doctor) is selected, **When** they edit the answer body (within validation limits), **Then** the answer is updated.
2. **Given** the answer author is selected, **When** they delete the answer, **Then** the answer is removed from the thread.
3. **Given** a different user is selected, **When** they attempt to edit or delete another user's answer, **Then** the request is rejected.

---

### User Story 6 - Simulated User Selection (Priority: P1)

All users (patient or doctor) can switch which "active user" they are acting as via a dropdown. No login system exists—identity is simulated for MVP.

**Why this priority**: Enables testing of role-based behavior without authentication.

**Independent Test**: Switch between patient, verified doctor, and non-verified doctor. Verify create-question and create-answer behavior changes accordingly.

**Acceptance Scenarios**:

1. **Given** the web application, **When** a user selects an identity from the dropdown, **Then** subsequent create/edit/delete requests use that identity.
2. **Given** the selected user, **When** the application sends requests to the API, **Then** the user identifier is passed in the request (e.g., via header) so the backend can validate the role.
3. **Given** no authentication, **When** any user browses the platform, **Then** all questions and answers are publicly readable.

---

### Edge Cases

- What happens when a user attempts to create a question or answer without a valid user identifier? System rejects the request with a clear error.
- What happens when pagination parameters are invalid (e.g., negative page)? System returns sensible defaults or validation errors.
- What happens when a question is closed? Answers can still be read; new answers are disallowed for CLOSED questions. Closing is optional; only verified doctors can close a thread (if implemented).
- What happens when a non-existent question or answer ID is requested? System returns a 404 or equivalent not-found response.
- What happens when the database is unavailable? System returns an appropriate error; user sees a clear message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a public feed of questions with search, tag filter, and pagination.
- **FR-002**: System MUST allow only users with the PATIENT role to create questions.
- **FR-003**: System MUST allow only users with the DOCTOR role AND verified status to create answers.
- **FR-004**: System MUST validate question title length (5–120 characters), body length (20–5000 characters), and maximum 5 tags.
- **FR-005**: System MUST validate answer body length (20–5000 characters).
- **FR-006**: System MUST allow only the question author to edit or delete their question.
- **FR-007**: System MUST allow only the answer author (owning doctor) to edit or delete their answer.
- **FR-008**: System MUST identify the acting user via a request header (e.g., x-user-id) and validate role against stored data.
- **FR-009**: System MUST provide public read access to all questions and answers—no authentication required for reads.
- **FR-010**: System MUST return a consistent JSON shape for API responses (e.g., `{ data, meta? }`).
- **FR-011**: System MUST provide interactive API documentation (e.g., Swagger) at a /docs endpoint.
- **FR-012**: System MUST seed the database with 2 patients, 1 verified doctor, and 1 non-verified doctor for testing.
- **FR-013**: System MUST store users with: id, display_name, role (PATIENT | DOCTOR), is_verified_doctor, created_at, updated_at.
- **FR-014**: System MUST store questions with: id, author_id, title, body, tags (string array), status (OPEN | CLOSED, default OPEN), created_at, updated_at.
- **FR-015**: System MUST store answers with: id, question_id, doctor_id, body, created_at, updated_at.
- **FR-016**: System MUST run both the web application and API from a single development command (e.g., pnpm dev).
- **FR-017**: System MUST include a placeholder folder structure for future AI capabilities (triage, red-flag detection, misinformation flagging, vector search) with a README—no AI implementation in this MVP.
- **FR-018**: System MUST use REST only (no GraphQL). API documentation at /docs.
- **FR-019**: System MUST reject write requests (create/update/delete) when x-user-id is missing or refers to an unknown user; read requests remain public and do not require the header.
- **FR-020**: If question-closing is implemented, only verified doctors MAY set a question's status to CLOSED. Closing is optional (not required for MVP).

### Key Entities

- **User**: Represents a participant. Attributes: id, display_name, role (PATIENT | DOCTOR), is_verified_doctor, created_at, updated_at. Only patients create questions; only verified doctors create answers.
- **Question**: Represents a patient's medical question. Attributes: id, author_id, title, body, tags, status (OPEN | CLOSED), created_at, updated_at. Linked to answers.
- **Answer**: Represents a doctor's response to a question. Attributes: id, question_id, doctor_id, body, created_at, updated_at. Belongs to one question and one doctor.

## Assumptions

- OPEN/CLOSED status: Open questions accept new answers; closed questions do not. Closing is optional; only verified doctors can close (if implemented).
- Deleting a question: May cascade delete answers, or retain answers with a soft-delete; implementation chooses. Spec requires author-only delete.
- Monorepo structure: Single workspace with web app, API, and shared packages. Exact tooling (Turborepo, pnpm) is an implementation choice.
- Database: Relational database with support for JSON or array fields for tags. Docker Compose for local development.
- No authentication: All identity is passed via header; suitable only for MVP and development/testing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A patient can post a question and see it in the feed within 5 seconds.
- **SC-002**: A verified doctor can post an answer and see it in the thread within 5 seconds.
- **SC-003**: Users can complete a full flow (browse feed → open question → read answers) in under 30 seconds.
- **SC-004**: Non-verified doctors and patients receive clear rejection when attempting to create answers or questions outside their role.
- **SC-005**: All CRUD operations (create question, create answer, edit, delete) work end-to-end without an authentication system, using simulated user selection.
- **SC-006**: API documentation is available and allows exploration of all endpoints.
- **SC-007**: Development environment starts with a single command and both web application and API are reachable.
