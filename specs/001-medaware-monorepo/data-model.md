# Data Model: MedAware MVP

**Feature**: 001-medaware-monorepo  
**Date**: 2025-02-14

## Entities

### User

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default uuid_generate_v4() | |
| display_name | string | required | |
| role | enum | PATIENT \| DOCTOR | |
| is_verified_doctor | boolean | default false | Only DOCTOR can be true |
| created_at | datetime | required | |
| updated_at | datetime | required | |

**Validation**: role=DOCTOR and is_verified_doctor=true required for creating answers.

---

### Question

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK | |
| author_id | uuid | FK → users.id | |
| title | string | 5–120 chars | |
| body | string | 20–5000 chars | |
| tags | string[] | max 5 elements | |
| status | enum | OPEN \| CLOSED, default OPEN | |
| created_at | datetime | | |
| updated_at | datetime | | |

**Relations**: author → User; answers → Answer[]  
**Validation**: title 5–120, body 20–5000, max 5 tags.

---

### Answer

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK | |
| question_id | uuid | FK → questions.id | |
| doctor_id | uuid | FK → users.id | |
| body | string | 20–5000 chars | |
| created_at | datetime | | |
| updated_at | datetime | | |

**Relations**: question → Question; doctor → User  
**Validation**: body 20–5000. Only users with role=DOCTOR and is_verified_doctor=true can create.

---

## Enums

- **UserRole**: PATIENT, DOCTOR
- **QuestionStatus**: OPEN, CLOSED

---

## State Transitions

- **Question.status**: OPEN (default) → CLOSED (optional; only verified doctors can close)
- **Question/Answer**: create → update (author/owner only) → delete (author/owner only)

---

## Seed Data

- 2 users with role PATIENT
- 1 user with role DOCTOR, is_verified_doctor=true
- 1 user with role DOCTOR, is_verified_doctor=false
- Optionally: sample questions and answers for manual testing
