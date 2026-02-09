---
name: monorepo-navigation
description: Navigation strategy for Spec-Kit based full-stack Todo application. Use this skill to determine where to find files and where to make changes in the monorepo, ensuring separation of concerns between frontend, backend, and specs.
---

# Monorepo Navigation

## Purpose
This skill teaches Claude Code how to correctly navigate a Spec-Kit based monorepo for a full-stack Todo application and avoid editing wrong files.

## Project Structure
```
Todo-app/
├── .spec-kit/
│   └── config.yaml
├── specs/
├── frontend/
│   ├── CLAUDE.md
│   └── (Next.js App)
├── backend/
│   ├── CLAUDE.md
│   └── (FastAPI App)
├── docker-compose.yml
└── README.md
```

## Responsibilities
- **Identify Context**: Always identify whether a change belongs to frontend, backend, or specs.
- **Read Context First**: Read Root `CLAUDE.md` first, then folder-level `CLAUDE.md`.
- **Separation of Concerns**:
  - Never modify frontend files when implementing backend logic.
  - Never modify backend files when implementing UI logic.
- **Spec-First**: Reference specs from `/specs` before coding.

## Rules
- If file location is unclear, stop and ask for clarification.
- Never create files outside this structure.
- Follow Spec-Kit conventions strictly.

## Navigation Strategy
1. **Determine Task Scope**: Analyze the request to see if it touches Frontend (React/Next.js), Backend (FastAPI), or Infrastructure (Docker, Specs).
2. **Consult Docs**: Read `CLAUDE.md` in the root and the relevant subdirectory (`frontend/` or `backend/`).
3. **Locate Specs**: Check `specs/` for relevant requirements.
4. **Execute**: Perform changes only in the targeted directory.
