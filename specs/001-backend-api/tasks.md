# Tasks: Backend API for Todo Application

**Input**: Design documents from `/specs/001-backend-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are excluded. Focus is on implementation and manual testing via quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` for application code, `backend/tests/` for tests
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per plan.md: backend/app/{models,schemas,repositories,routers,dependencies,core}/, backend/tests/
- [x] T002 Create requirements.txt with dependencies: fastapi>=0.115.0, sqlmodel>=0.0.24, psycopg[binary]>=3.1.0, python-jose[cryptography]>=3.3.0, pydantic>=2.0.0, uvicorn[standard]>=0.27.0, python-dotenv>=1.0.0, pytest>=8.0.0, pytest-asyncio>=0.23.0, httpx>=0.27.0
- [x] T003 [P] Create .env.example with DATABASE_URL and BETTER_AUTH_SECRET placeholders in backend/.env.example
- [x] T004 [P] Create backend/README.md with setup instructions referencing specs/001-backend-api/quickstart.md
- [x] T005 [P] Create __init__.py files in all backend/app/ subdirectories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Connection (US5 - Database Connection Reliability)

- [x] T006 Implement configuration management in backend/app/config.py: load DATABASE_URL and BETTER_AUTH_SECRET from environment, validate required variables, fail fast if missing
- [x] T007 Implement database connection in backend/app/database.py: create SQLModel engine with Neon PostgreSQL connection, configure connection pool (size=10, max_overflow=20, pool_pre_ping=True), implement get_session() dependency for FastAPI

### Authentication Infrastructure (US4 - Stateless Authentication)

- [x] T008 [P] Implement JWT verification utilities in backend/app/core/security.py: verify_jwt_token() function using python-jose, extract user_id from 'sub' claim, handle JWTError and return None for invalid tokens
- [x] T009 Implement authentication dependency in backend/app/dependencies/auth.py: get_current_user() dependency that extracts JWT from Authorization header, verifies token using security.py, raises HTTPException 401 if invalid, returns user_id string

### Database Models (US1 + US2 - Data Foundation)

- [x] T010 [P] Create User model in backend/app/models/user.py: SQLModel with id (UUID), username (str, unique, indexed), email (str, unique, indexed), password (str), created_at (datetime)
- [x] T011 [P] Create Task model in backend/app/models/task.py: SQLModel with id (UUID), title (str, max 255), description (Optional[str], max 2000), completed (bool, default False), priority (Optional[Enum: low/medium/high]), due_date (Optional[date]), tags (List[str], ARRAY), recurrence_pattern (Optional[str]), user_id (UUID, foreign key, indexed), created_at (datetime), updated_at (datetime)
- [x] T012 [P] Create Session model in backend/app/models/session.py: SQLModel with id (UUID), user_id (UUID, foreign key), created_at (datetime), expires_at (datetime)
- [x] T013 Update backend/app/database.py to call SQLModel.metadata.create_all(engine) on startup to create tables

### Request/Response Schemas (US2 + US3 - API Contracts)

- [x] T014 [P] Create TaskCreate schema in backend/app/schemas/task.py: Pydantic model with title (str, min 1, max 255), description (Optional[str], max 2000), priority (Optional[Enum]), due_date (Optional[date]), tags (List[str], default []), recurrence_pattern (Optional[str])
- [x] T015 [P] Create TaskUpdate schema in backend/app/schemas/task.py: Pydantic model with all fields optional for partial updates
- [x] T016 [P] Create TaskResponse schema in backend/app/schemas/task.py: Pydantic model matching Task model for API responses
- [x] T017 [P] Create error response schemas in backend/app/schemas/error.py: ErrorResponse and ValidationErrorResponse models

### Error Handling (US3 - Data Validation and Error Handling)

- [x] T018 Implement custom exception handlers in backend/app/core/exceptions.py: handlers for HTTPException, RequestValidationError (Pydantic), SQLAlchemyError (database), JWTError (auth), and generic Exception, ensure no sensitive data in responses

### User Isolation Infrastructure (US1 - Secure Task Data Access)

- [x] T019 Create TaskRepository in backend/app/repositories/task.py: class with __init__(session: Session), all methods require user_id parameter, implement get_all_tasks(user_id), get_task_by_id(task_id, user_id), create_task(task_data, user_id), update_task(task_id, task_data, user_id), delete_task(task_id, user_id), toggle_completion(task_id, user_id), all queries filter by user_id

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 2 - Reliable Task Management Operations (Priority: P1) 🎯 MVP

**Goal**: Allow users to create, read, update, delete, and toggle completion of their tasks with full CRUD lifecycle

**Independent Test**: User can perform complete task lifecycle - create task, list tasks, get task details, update task, toggle completion, delete task - all with authentication and user isolation enforced

**Integrates**: US1 (Secure Task Data Access), US3 (Data Validation), US4 (Stateless Authentication)

### FastAPI Application Setup

- [x] T020 Create FastAPI application in backend/app/main.py: initialize FastAPI app, register exception handlers from core/exceptions.py, add CORS middleware for frontend origins, implement startup event to validate database connection and create tables, implement health check endpoint GET /health

### Task Router - Create and List (MVP Core)

- [x] T021 [US2] Create tasks router in backend/app/routers/tasks.py: initialize APIRouter with prefix="/api/{user_id}/tasks", add tags=["tasks"]
- [x] T022 [US2] Implement POST /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py: accept TaskCreate schema, use get_current_user dependency to get authenticated user_id, ignore path user_id parameter, use TaskRepository.create_task() with authenticated user_id, validate title is non-empty (US3), return 201 with TaskResponse, handle validation errors with 400
- [x] T023 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py: use get_current_user dependency, ignore path user_id, use TaskRepository.get_all_tasks() with authenticated user_id, return 200 with List[TaskResponse], enforce user isolation (US1)

### Task Router - Get, Update, Delete

- [x] T024 [US2] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/app/routers/tasks.py: use get_current_user dependency, use TaskRepository.get_task_by_id() with authenticated user_id, return 404 if task not found or doesn't belong to user (US1), return 200 with TaskResponse
- [x] T025 [US2] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/app/routers/tasks.py: accept TaskUpdate schema, use get_current_user dependency, use TaskRepository.update_task() with authenticated user_id, validate updated fields (US3), return 404 if task not found or doesn't belong to user, return 200 with TaskResponse, update updated_at timestamp
- [x] T026 [US2] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/app/routers/tasks.py: use get_current_user dependency, use TaskRepository.delete_task() with authenticated user_id, return 404 if task not found or doesn't belong to user, return 204 No Content on success

### Task Router - Toggle Completion

- [x] T027 [US2] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/app/routers/tasks.py: use get_current_user dependency, use TaskRepository.toggle_completion() with authenticated user_id, return 404 if task not found or doesn't belong to user, return 200 with TaskResponse showing toggled completion status

### Integration and Registration

- [x] T028 [US2] Register tasks router in backend/app/main.py: import tasks router and include with app.include_router(tasks.router)
- [x] T029 [US2] Add database session dependency in backend/app/dependencies/database.py: implement get_db() dependency that yields session from get_session()

**Checkpoint**: At this point, User Story 2 (complete CRUD lifecycle) should be fully functional with authentication (US4), user isolation (US1), and validation (US3) enforced

---

## Phase 4: Security Validation & Testing (US1 - Secure Task Data Access)

**Goal**: Verify that user isolation is enforced across all endpoints and cross-user access is prevented

**Independent Test**: Create tasks for User A and User B, verify User A cannot access User B's tasks through any endpoint

- [x] T030 [US1] Create manual security test script in backend/tests/manual_security_test.py: generate JWT tokens for two different user_ids, create tasks for each user, attempt cross-user access on all endpoints (GET list, GET single, PUT, DELETE, PATCH), verify all return 404 (not 403 to prevent information leakage)
- [x] T031 [US1] Create authentication test script in backend/tests/manual_auth_test.py: test missing JWT token (401), expired JWT token (401), invalid JWT signature (401), malformed JWT token (401), valid JWT token (200)
- [x] T032 [US1] Document security test procedures in backend/tests/README.md: how to generate test JWT tokens, how to run security tests, expected results for each test case

---

## Phase 5: Data Validation Testing (US3 - Data Validation and Error Handling)

**Goal**: Verify that invalid data is rejected with clear error messages

**Independent Test**: Submit invalid data to all endpoints and verify appropriate 400 errors with helpful messages

- [x] T033 [US3] Create validation test script in backend/tests/manual_validation_test.py: test empty title (400), title too long (400), invalid priority value (400), invalid due_date format (400), invalid tags type (400), verify error messages are clear and actionable
- [x] T034 [US3] Enhance TaskRepository validation in backend/app/repositories/task.py: add explicit validation for title (strip whitespace, check non-empty), priority (validate enum), due_date (validate ISO format), tags (validate array of strings), raise ValueError with clear messages
- [x] T035 [US3] Update exception handlers in backend/app/core/exceptions.py: ensure ValueError from repository is converted to 400 Bad Request with error detail

---

## Phase 6: Database Connection Testing (US5 - Database Connection Reliability)

**Goal**: Verify that database connection is validated on startup and errors are handled gracefully

**Independent Test**: Start backend without DATABASE_URL and verify it fails with clear error, then start with valid DATABASE_URL and verify success

- [x] T036 [US5] Enhance startup validation in backend/app/main.py: add startup event handler that calls database.validate_connection(), catch exceptions and log error with clear message, exit with non-zero code if validation fails
- [x] T037 [US5] Implement validate_connection() in backend/app/database.py: attempt to execute "SELECT 1" query, raise RuntimeError if DATABASE_URL not set or connection fails, include helpful error message without exposing connection string
- [x] T038 [US5] Add connection error handling in backend/app/core/exceptions.py: add handler for database connection errors during requests, return 500 Internal Server Error without exposing sensitive details, log full error for debugging

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [x] T039 [P] Add logging configuration in backend/app/core/logging.py: configure Python logging with structured format, set log levels from environment (default INFO), filter sensitive data (passwords, JWT tokens, DATABASE_URL)
- [x] T040 [P] Add logging to all endpoints in backend/app/routers/tasks.py: log authentication failures (ERROR), log task operations (INFO), log validation errors (WARNING)
- [x] T041 [P] Create Dockerfile in backend/Dockerfile: multi-stage build with Python 3.11-slim base, install dependencies, copy app/, expose port 8000, set entrypoint to uvicorn
- [x] T042 [P] Create docker-compose.yml in repository root: define backend service with environment variables, volume mounts, port mapping
- [ ] T043 Update backend/README.md with complete documentation: prerequisites, setup steps, environment variables, running locally, running with Docker, API documentation links, troubleshooting
- [ ] T044 Verify all API endpoints match OpenAPI specification in specs/001-backend-api/contracts/openapi.yaml: compare request/response schemas, status codes, error formats
- [ ] T045 Run complete manual test flow per specs/001-backend-api/quickstart.md: follow all steps from setup to testing, verify all curl examples work, document any discrepancies
- [ ] T046 Security audit: verify JWT verification on all endpoints, verify user_id filtering in all repository methods, verify no sensitive data in error responses, verify DATABASE_URL validation on startup
- [ ] T047 Performance validation: test with 100 concurrent requests using load testing tool, verify p95 latency <500ms, verify connection pool handles load, document results
- [ ] T048 Code cleanup: remove any debug print statements, ensure consistent error handling, verify all imports are used, run linter (flake8 or ruff) and fix issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 2 (Phase 3)**: Depends on Foundational phase completion - This is the MVP
- **Security Validation (Phase 4)**: Depends on User Story 2 completion - Validates US1
- **Validation Testing (Phase 5)**: Depends on User Story 2 completion - Validates US3
- **Database Testing (Phase 6)**: Can run after Foundational phase - Validates US5
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US4 (Stateless Authentication)**: Foundational - implemented in Phase 2 (T008-T009)
- **US5 (Database Connection)**: Foundational - implemented in Phase 2 (T006-T007, T013) and validated in Phase 6
- **US1 (Secure Task Data Access)**: Foundational infrastructure in Phase 2 (T019), validated in Phase 4
- **US2 (Reliable Task Management)**: Main feature in Phase 3 - depends on US1, US4, US5
- **US3 (Data Validation)**: Integrated throughout Phase 2 (schemas) and Phase 3 (endpoints), validated in Phase 5

### Within Each Phase

**Phase 2 (Foundational)**:
1. T006-T007: Database connection (sequential)
2. T008-T009: Authentication (can run parallel with database)
3. T010-T012: Models (all parallel after database connection)
4. T013: Schema creation (depends on T010-T012)
5. T014-T017: Schemas (all parallel)
6. T018: Exception handlers (parallel)
7. T019: Repository (depends on T010-T012, T014-T017)

**Phase 3 (User Story 2)**:
1. T020: FastAPI app setup (depends on Phase 2)
2. T021: Router setup (depends on T020)
3. T022-T023: Create and List endpoints (parallel, depend on T021)
4. T024-T026: Get, Update, Delete endpoints (parallel, depend on T021)
5. T027: Toggle completion (depends on T021)
6. T028-T029: Integration (depends on all endpoints)

**Phase 4-6**: Can run in parallel after Phase 3

**Phase 7**: All tasks marked [P] can run in parallel

### Parallel Opportunities

**Setup (Phase 1)**:
- T003, T004, T005 can run in parallel

**Foundational (Phase 2)**:
- T008-T009 (auth) parallel with T006-T007 (database)
- T010, T011, T012 (models) all parallel
- T014, T015, T016, T017 (schemas) all parallel
- T018 (exceptions) parallel with schemas

**User Story 2 (Phase 3)**:
- T022-T023 (create/list) parallel
- T024-T025-T026 (get/update/delete) parallel

**Polish (Phase 7)**:
- T039, T040, T041, T042 all parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch database and auth setup in parallel:
Task T006-T007: "Database connection setup"
Task T008-T009: "JWT authentication setup"

# After database is ready, launch all models in parallel:
Task T010: "Create User model in backend/app/models/user.py"
Task T011: "Create Task model in backend/app/models/task.py"
Task T012: "Create Session model in backend/app/models/session.py"

# Launch all schemas in parallel:
Task T014: "Create TaskCreate schema"
Task T015: "Create TaskUpdate schema"
Task T016: "Create TaskResponse schema"
Task T017: "Create error schemas"
```

---

## Implementation Strategy

### MVP First (Phase 1-3 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T019) - CRITICAL
3. Complete Phase 3: User Story 2 (T020-T029) - Core CRUD
4. **STOP and VALIDATE**: Test complete CRUD lifecycle with authentication
5. Deploy/demo if ready

**This gives you a working backend API with all 6 endpoints, authentication, user isolation, and validation.**

### Incremental Validation

After MVP (Phase 1-3):
1. Add Phase 4: Security validation tests → Verify US1
2. Add Phase 5: Validation tests → Verify US3
3. Add Phase 6: Database tests → Verify US5
4. Add Phase 7: Polish → Production ready

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (Phase 1-2)
2. **Once Foundational is done**:
   - Developer A: Phase 3 (User Story 2 implementation)
   - Developer B: Phase 4 (Security validation scripts)
   - Developer C: Phase 5 (Validation test scripts)
3. **After Phase 3 completes**:
   - All developers: Phase 7 (Polish) in parallel

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
  - US1: Secure Task Data Access
  - US2: Reliable Task Management Operations
  - US3: Data Validation and Error Handling
  - US4: Stateless Authentication (foundational)
  - US5: Database Connection Reliability (foundational)
- **No test tasks**: Tests not explicitly requested in specification, focus on implementation and manual testing
- **Repository pattern**: Enforces user isolation at data access layer (US1)
- **JWT verification**: Enforced via FastAPI dependency injection (US4)
- **Validation**: Integrated into schemas (Pydantic) and repository (US3)
- **Database**: Neon PostgreSQL only, validated on startup (US5)
- **Commit strategy**: Commit after each task or logical group
- **Stop at checkpoints**: Validate functionality before proceeding
- **Manual testing**: Use quickstart.md and curl examples to validate each endpoint

---

## Task Count Summary

- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 14 tasks (T006-T019)
- **Phase 3 (User Story 2 - MVP)**: 10 tasks (T020-T029)
- **Phase 4 (Security Validation)**: 3 tasks (T030-T032)
- **Phase 5 (Validation Testing)**: 3 tasks (T033-T035)
- **Phase 6 (Database Testing)**: 3 tasks (T036-T038)
- **Phase 7 (Polish)**: 10 tasks (T039-T048)

**Total**: 48 tasks

**MVP Scope** (Phase 1-3): 29 tasks
**Full Implementation**: 48 tasks

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel within their phases

---

## Success Criteria

✅ **Phase 1-3 Complete (MVP)**:
- Backend starts successfully with valid DATABASE_URL and BETTER_AUTH_SECRET
- All 6 REST endpoints functional (POST, GET list, GET single, PUT, DELETE, PATCH)
- JWT authentication enforced on all endpoints
- User isolation enforced - users can only access their own tasks
- Validation errors return 400 with clear messages
- Cross-user access returns 404 (not 403)
- Complete CRUD lifecycle works end-to-end

✅ **All Phases Complete (Production Ready)**:
- All MVP criteria met
- Security validation tests pass
- Validation tests pass
- Database connection tests pass
- Logging configured and working
- Docker containerization working
- Documentation complete
- Performance targets met (<500ms p95, 100 concurrent requests)
- Code cleanup complete
