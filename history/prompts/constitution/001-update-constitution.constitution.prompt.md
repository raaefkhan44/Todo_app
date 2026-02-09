---
id: "001"
title: "Update Constitution for Todo Full-Stack Web Application"
stage: "constitution"
date_iso: "2026-01-13"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "002-todo-cli-app"
user: "asrak"
command: "/sp.constitution"
labels: ["constitution", "todo-app", "full-stack"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
  - ".specify/templates/plan-template.md"
  - ".specify/templates/spec-template.md"
  - ".specify/templates/tasks-template.md"
tests:
  - "Constitution update validated"
  - "Template alignment verified"
outcome: "Successfully updated constitution with Phase II requirements for Todo full-stack application"
evaluation: "Constitution now reflects locked tech stack, authentication requirements, and development workflow"
---

# Prompt History Record: Update Constitution for Todo Full-Stack Web Application

## Original Prompt

```
# Spec-Kit Project Constitution — Phase II
## Todo Full-Stack Web Application

---

## 1. Objective

The objective of **Phase II** is to transform the Phase I Todo CLI application into a
**modern, multi-user, full-stack web application** with:

- Persistent storage
- Authentication & authorization
- RESTful APIs
- Responsive frontend
- Strict **Spec-Driven Development**

This project must demonstrate **Reusable Intelligence** using
**Claude Code + Spec-Kit Plus**, following the **Agentic Dev Stack workflow**.

⚠️ **Manual coding is strictly prohibited.**

---

## 2. Development Philosophy (Non-Negotiable)

### 2.1 Spec-Driven Development Only
- Every change must originate from a written spec
- No code may be written without a corresponding spec
- No inferred or assumed requirements
- Specs are the single source of truth

### 2.2 Agentic Dev Stack Workflow
Claude Code must always follow this sequence:

Write Spec → Generate Plan → Break into Tasks → Implement via Claude Code

yaml
Copy code

Skipping or reordering steps is not allowed.

### 2.3 No Manual Coding
- All code must be generated or modified by Claude Code
- Human-written code is not allowed
- Prompts, iterations, and plans are part of evaluation

### 2.4 Reusable Intelligence First
- Prefer reusable skills over one-off solutions
- Avoid hard-coded logic
- Design abstractions reusable in later phases

---

## 3. Locked Technology Stack

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth |
| Spec System | Claude Code + Spec-Kit Plus |

❌ No substitutions without a spec amendment.

---

## 4. Repository Structure Authority

This structure is **authoritative**:

Todo-app/
├── .spec-kit/
│ └── config.yaml
├── specs/
├── frontend/
│ ├── CLAUDE.md
│ └── (Next.js App)
├── backend/
│ ├── CLAUDE.md
│ └── (FastAPI App)
├── docker-compose.yml
└── README.md

yaml
Copy code

### Rules
- Read root `CLAUDE.md` first
- Then read folder-level `CLAUDE.md`
- Frontend logic → `/frontend` only
- Backend logic → `/backend` only
- Specs are read-only during implementation unless explicitly updated

---

## 5. Feature Scope — Phase II

### 5.1 Mandatory (Basic Level Features)

These **must be fully implemented**:

- Add Task
- Delete Task
- Update Task
- View Task List
- Mark Task as Complete

### 5.2 Allowed Enhancements

Intermediate and Advanced features may be added **only if**:
- Fully defined in specs
- Do not break basic features
- Follow same auth & ownership rules

---

## 6. API Contract (Immutable Without Spec Change)

All endpoints must exist exactly as defined:

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create task |
| GET | `/api/{user_id}/tasks/{id}` | Get task |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

### API Rules
- `user_id` must match authenticated user
- Backend must never trust client-sent user_id
- All queries must be filtered by authenticated user

---

## 7. Authentication & Security Constitution

### 7.1 Authentication Model
- Better Auth runs on Next.js frontend
- JWT tokens issued on login
- JWT sent in every API request:

Authorization: Bearer <token>

markdown
Copy code

### 7.2 Shared Secret Rule
- Frontend & backend must use the same secret:
BETTER_AUTH_SECRET

yaml
Copy code
- Secrets must come from environment variables only

### 7.3 Backend Responsibilities
- Verify JWT signature
- Decode user identity
- Enforce task ownership on every request
- Reject unauthenticated requests (401)

### 7.4 Security Guarantees
- Strict user isolation
- Stateless authentication
- Token expiry enforced

---

## 8. Database Constitution

- Neon Serverless PostgreSQL is the single source of truth
- SQLModel defines all schemas
- Every task must belong to a user
- No schema changes without database spec update

---

## 9. Frontend Constitution

- Must be responsive
- Must use centralized API client
- JWT attached to every request
- No direct backend calls inside UI components
- UI logic & data fetching must remain separated

---

## 10. Prohibited Actions

❌ Manual coding
❌ Skipping specs
❌ Hardcoding secrets
❌ Cross-user data access
❌ Mixing frontend & backend logic
❌ Editing files outside defined structure

---

## 11. Success Criteria

Phase II is successful only if:

- All Basic Level features work end-to-end
- Authentication enforced on all endpoints
- Specs, plans, and tasks are auditable
- Claude Code follows constitution & skills strictly
- Codebase is reusable for Phase III+

---

## 12. Final Principle

> **Specs define truth.
> Agents enforce discipline.
> Code is a consequence.**

This constitution overrides all ad-hoc instructions unless explicitly updated via
```

## Response Summary

Updated the project constitution at `.specify/memory/constitution.md` to reflect the specific requirements for the Todo Full-Stack Web Application. The new constitution includes:

1. Core Principles aligned with the development philosophy (Spec-Driven Development, Agentic Dev Stack, No Manual Coding, etc.)
2. Additional Constraints reflecting the locked technology stack and API contract
3. Development Workflow requirements for authentication and security
4. Governance section enforcing the constitution's authority

Also updated template files to align with the new constitution:
- Modified plan-template.md to include constitution check gates
- Updated spec-template.md with technology stack requirements
- Modified tasks-template.md to reflect the required API endpoints and authentication requirements

The constitution now serves as the authoritative guide for the Todo application's development, ensuring compliance with the locked technology stack, API contract, and development workflow requirements.