# Feature Specification: Backend API for Todo Application

**Feature Branch**: `001-backend-api`
**Created**: 2026-02-09
**Status**: Draft
**Input**: Backend API specifications for Phase II of the Todo Full-Stack Web Application with FastAPI, SQLModel, and Neon PostgreSQL

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Task Data Access (Priority: P1)

As a user, I need my task data to be securely stored and accessible only to me, so that my personal tasks remain private and cannot be viewed or modified by other users.

**Why this priority**: Data security and user isolation are foundational requirements. Without this, the application cannot be trusted with user data.

**Independent Test**: Can be fully tested by creating multiple user accounts, adding tasks to each, and verifying that User A cannot access, view, modify, or delete User B's tasks through any API endpoint.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT token, **When** they request their task list, **Then** they receive only tasks that belong to them
2. **Given** a user attempts to access another user's task by ID, **When** they make the request with their own JWT token, **Then** they receive a 404 Not Found response
3. **Given** a user's JWT token is missing or invalid, **When** they attempt any API operation, **Then** they receive a 401 Unauthorized response
4. **Given** a user attempts to create a task with a different user_id in the URL, **When** the backend processes the request, **Then** it ignores the URL user_id and uses the authenticated user's ID from the JWT token

---

### User Story 2 - Reliable Task Management Operations (Priority: P1)

As a user, I need to create, read, update, and delete my tasks reliably, so that I can manage my todo list effectively without data loss or corruption.

**Why this priority**: Core CRUD operations are the primary value proposition of the application. Without reliable task management, the application has no purpose.

**Independent Test**: Can be fully tested by performing a complete lifecycle: create a task, retrieve it, update its properties, mark it complete, and delete it, verifying data integrity at each step.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they create a task with a title, **Then** the task is stored with a unique ID and returned with all properties including timestamps
2. **Given** a user has existing tasks, **When** they request their task list, **Then** all their tasks are returned with complete data including title, description, completion status, priority, due date, tags, and recurrence pattern
3. **Given** a user wants to update a task, **When** they submit changes to any task property, **Then** the task is updated and the changes are persisted
4. **Given** a user wants to delete a task, **When** they request deletion, **Then** the task is permanently removed and subsequent requests for that task return 404
5. **Given** a user wants to toggle task completion, **When** they use the completion endpoint, **Then** the task's completed status is toggled and the change is persisted

---

### User Story 3 - Data Validation and Error Handling (Priority: P2)

As a user, I need clear feedback when I submit invalid data or encounter errors, so that I can correct my input and understand what went wrong.

**Why this priority**: Good error handling improves user experience and prevents data corruption, but the application can function without perfect error messages initially.

**Independent Test**: Can be fully tested by submitting various invalid inputs (empty titles, invalid priority values, malformed dates) and verifying that appropriate error messages are returned with 400 status codes.

**Acceptance Scenarios**:

1. **Given** a user attempts to create a task with an empty title, **When** the request is processed, **Then** they receive a 400 Bad Request with a clear error message
2. **Given** a user submits an invalid priority value, **When** the request is processed, **Then** they receive a 400 Bad Request indicating valid priority options
3. **Given** a user submits an invalid date format for due_date, **When** the request is processed, **Then** they receive a 400 Bad Request with format requirements
4. **Given** a user submits invalid data types for tags or recurrence_pattern, **When** the request is processed, **Then** they receive a 400 Bad Request with type requirements

---

### User Story 4 - Stateless Authentication (Priority: P1)

As a system administrator, I need the backend to verify user identity through JWT tokens without maintaining session state, so that the system can scale horizontally and remain performant under load.

**Why this priority**: Stateless authentication is a constitutional requirement and enables scalability. Without it, the system architecture violates core principles.

**Independent Test**: Can be fully tested by making authenticated requests without any server-side session storage, verifying that JWT tokens are decoded and validated on every request, and confirming that the backend remains stateless.

**Acceptance Scenarios**:

1. **Given** a user has a valid JWT token from Better Auth, **When** they include it in the Authorization header, **Then** the backend decodes it, extracts the user_id, and processes the request
2. **Given** a JWT token has expired, **When** a user attempts to use it, **Then** they receive a 401 Unauthorized response
3. **Given** a JWT token has an invalid signature, **When** a user attempts to use it, **Then** they receive a 401 Unauthorized response
4. **Given** the backend restarts, **When** a user makes a request with a valid JWT, **Then** the request succeeds without requiring re-authentication (proving statelessness)

---

### User Story 5 - Database Connection Reliability (Priority: P1)

As a developer, I need the backend to connect exclusively to Neon Serverless PostgreSQL and fail gracefully if the connection is unavailable, so that configuration errors are caught early and the system doesn't operate with incorrect data sources.

**Why this priority**: Using the correct database is a constitutional requirement. Connecting to the wrong database or failing silently could cause data loss or corruption.

**Independent Test**: Can be fully tested by starting the backend without DATABASE_URL, verifying it fails to start, then providing a valid Neon connection string and verifying successful startup and database operations.

**Acceptance Scenarios**:

1. **Given** the DATABASE_URL environment variable is not set, **When** the backend attempts to start, **Then** it fails immediately with a clear error message
2. **Given** the DATABASE_URL points to a Neon PostgreSQL instance, **When** the backend starts, **Then** it successfully connects and is ready to serve requests
3. **Given** the database connection is lost during operation, **When** a user makes a request, **Then** they receive a 500 Internal Server Error without exposing sensitive connection details

---

### Edge Cases

- What happens when a user attempts to create a task with extremely long title or description (exceeding reasonable limits)?
- How does the system handle concurrent updates to the same task by the same user from different devices?
- What happens when a user's JWT token expires mid-request?
- How does the system handle malformed JWT tokens (not just invalid signatures)?
- What happens when the database connection pool is exhausted?
- How does the system handle requests with user_id in URL that doesn't match the JWT user_id?
- What happens when a user attempts to access a task that was just deleted by another session?

## Requirements *(mandatory)*

### Functional Requirements

#### Technology Stack (Constitutional Requirements)

- **FR-001**: System MUST use Python FastAPI as the backend framework
- **FR-002**: System MUST use SQLModel as the ORM for database operations
- **FR-003**: System MUST use Neon Serverless PostgreSQL as the exclusive database
- **FR-004**: System MUST read database connection string from DATABASE_URL environment variable
- **FR-005**: System MUST fail to start if DATABASE_URL is not configured
- **FR-006**: System MUST NOT connect to local SQLite, local PostgreSQL, or any in-memory database

#### Authentication & Authorization

- **FR-007**: System MUST verify JWT tokens on every API request
- **FR-008**: System MUST extract user_id from JWT token payload, not from request body or URL
- **FR-009**: System MUST reject requests without valid JWT tokens with 401 Unauthorized
- **FR-010**: System MUST reject requests with expired JWT tokens with 401 Unauthorized
- **FR-011**: System MUST reject requests with invalid JWT signatures with 401 Unauthorized
- **FR-012**: System MUST expect JWT tokens in Authorization header with Bearer scheme
- **FR-013**: System MUST remain stateless - no server-side session storage
- **FR-014**: System MUST use the same BETTER_AUTH_SECRET for JWT verification as the frontend uses for JWT signing

#### Data Isolation & Security

- **FR-015**: System MUST enforce user isolation - users can only access their own tasks
- **FR-016**: System MUST filter all database queries by authenticated user_id
- **FR-017**: System MUST return 404 Not Found when a user attempts to access another user's task
- **FR-018**: System MUST ignore user_id provided in URL path and use authenticated user_id from JWT
- **FR-019**: System MUST NOT expose sensitive information in error messages (connection strings, stack traces, internal IDs)

#### API Endpoints (Constitutional Contract)

- **FR-020**: System MUST implement GET /api/{user_id}/tasks to list all tasks for authenticated user
- **FR-021**: System MUST implement POST /api/{user_id}/tasks to create a new task for authenticated user
- **FR-022**: System MUST implement GET /api/{user_id}/tasks/{id} to retrieve a specific task
- **FR-023**: System MUST implement PUT /api/{user_id}/tasks/{id} to update a task
- **FR-024**: System MUST implement DELETE /api/{user_id}/tasks/{id} to delete a task
- **FR-025**: System MUST implement PATCH /api/{user_id}/tasks/{id}/complete to toggle task completion status

#### Database Schema

- **FR-026**: System MUST define a Tasks table with columns: id (UUID), title (string, required), description (string, optional), completed (boolean, default false), priority (enum: 'low'|'medium'|'high'|null), due_date (ISO date string or null), tags (array of strings), recurrence_pattern (string or null), user_id (string, required, foreign key)
- **FR-027**: System MUST define a Users table with columns: id (UUID), username (string, unique), email (string, unique), password (hashed string), created_at (timestamp)
- **FR-028**: System MUST define a Sessions table with columns: id (UUID), user_id (foreign key), created_at (timestamp), expires_at (timestamp)
- **FR-029**: System MUST create an index on tasks.user_id for query performance
- **FR-030**: System MUST enforce that every task belongs to exactly one user (non-null foreign key)
- **FR-031**: System MUST store passwords as hashed values, never in plain text

#### Data Validation

- **FR-032**: System MUST reject task creation/update requests with empty or whitespace-only titles with 400 Bad Request
- **FR-033**: System MUST validate that priority is one of: 'low', 'medium', 'high', or null
- **FR-034**: System MUST validate that due_date is a valid ISO 8601 date string or null
- **FR-035**: System MUST validate that tags is an array of strings
- **FR-036**: System MUST validate that recurrence_pattern is a string or null
- **FR-037**: System MUST return 400 Bad Request with descriptive error messages for validation failures

#### Error Handling

- **FR-038**: System MUST return 400 Bad Request for invalid request data with clear error messages
- **FR-039**: System MUST return 401 Unauthorized for missing or invalid JWT tokens
- **FR-040**: System MUST return 403 Forbidden for cross-user access attempts (optional - may use 404 for security)
- **FR-041**: System MUST return 404 Not Found when requested resource doesn't exist or doesn't belong to user
- **FR-042**: System MUST return 500 Internal Server Error for unexpected errors without exposing sensitive details

#### Non-Functional Requirements

- **FR-043**: System MUST log all authentication failures for security monitoring
- **FR-044**: System MUST log all database connection errors
- **FR-045**: System MUST NOT log sensitive data (passwords, JWT tokens, connection strings)
- **FR-046**: System MUST use production-safe logging configuration

### Key Entities *(mandatory)*

- **User**: Represents an authenticated user with unique identifier (UUID), username, email, and hashed password. Users own tasks and are identified by JWT tokens.

- **Task**: Represents a todo item that belongs to exactly one user. Contains title (required), description (optional), completion status (boolean), priority level (low/medium/high or null), due date (ISO date or null), tags (array of strings), and recurrence pattern (string or null). Each task has a unique UUID and is associated with a user_id.

- **Session**: Represents an authentication session for tracking purposes. Contains session ID (UUID), user_id (foreign key), creation timestamp, and expiration timestamp. Sessions are validated indirectly through JWT tokens, maintaining backend statelessness.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can perform complete task lifecycle (create, read, update, delete) with 100% data integrity - no data loss or corruption
- **SC-002**: System enforces user isolation with 100% accuracy - zero instances of cross-user data access
- **SC-003**: System rejects 100% of unauthenticated requests (missing or invalid JWT tokens)
- **SC-004**: System responds to valid API requests within 500ms at p95 latency under normal load
- **SC-005**: System successfully connects to Neon PostgreSQL on startup 100% of the time when DATABASE_URL is correctly configured
- **SC-006**: System fails to start 100% of the time when DATABASE_URL is missing or invalid, preventing operation with wrong data source
- **SC-007**: All validation errors return clear, actionable error messages that allow users to correct their input
- **SC-008**: System maintains stateless operation - can handle requests after restart without requiring users to re-authenticate
- **SC-009**: System handles at least 100 concurrent authenticated requests without degradation
- **SC-010**: Zero sensitive information (connection strings, stack traces, internal errors) exposed in API responses

## Assumptions

1. **JWT Token Format**: Assuming Better Auth issues JWT tokens with standard claims including `sub` (subject) for user_id and `exp` (expiration). If Better Auth uses different claim names, the JWT verification logic will need adjustment.

2. **Database Schema Ownership**: Assuming the backend is responsible for defining and managing the database schema through SQLModel. If migrations are managed externally, this assumption needs clarification.

3. **Password Management**: Assuming Better Auth handles password hashing and user registration on the frontend, and the backend only needs to verify JWT tokens. The Users table is defined for data integrity but password operations are not part of this backend API scope.

4. **Session Table Usage**: Assuming the Sessions table is for Better Auth's internal tracking and the backend doesn't need to actively manage sessions beyond storing them. JWT verification is the primary authentication mechanism.

5. **Error Response Format**: Assuming standard FastAPI error response format (JSON with detail field). If a specific error schema is required, it should be specified.

6. **CORS Configuration**: Assuming CORS will be configured to allow requests from the Next.js frontend. Specific origins and methods are not specified in this spec.

7. **Rate Limiting**: Assuming rate limiting is not required for Phase II. If needed, it should be specified in a separate requirement.

8. **Task Title Length**: Assuming reasonable limits (e.g., 255 characters for title, 2000 for description) unless specified otherwise.

9. **Concurrent Update Handling**: Assuming last-write-wins strategy for concurrent updates. If optimistic locking is required, it should be specified.

10. **Database Migration Strategy**: Assuming SQLModel will handle schema creation. If Alembic or another migration tool is required, it should be specified in the plan phase.

## Dependencies

- **External Dependency**: Neon Serverless PostgreSQL - requires active Neon account and DATABASE_URL connection string
- **External Dependency**: Better Auth - frontend must issue valid JWT tokens with correct secret and user claims
- **External Dependency**: BETTER_AUTH_SECRET - shared secret between frontend and backend for JWT signing/verification
- **Configuration Dependency**: DATABASE_URL environment variable must be set before backend startup
- **Schema Dependency**: Database schema must be created before API operations (handled by SQLModel on first connection)

## Out of Scope

- User registration and password management (handled by Better Auth on frontend)
- Password reset and email verification flows
- Task sharing or collaboration features
- Real-time updates or WebSocket connections
- File attachments or media uploads
- Task categories or projects (beyond tags)
- Task search and filtering (beyond basic list retrieval)
- Pagination for task lists (may be added in future phases)
- Rate limiting and API throttling
- Audit logging of task changes
- Soft delete functionality (tasks are permanently deleted)
- Task archiving or history
- Bulk operations (create/update/delete multiple tasks at once)
- Export/import functionality
- API versioning (v1, v2, etc.)
- GraphQL endpoint (REST only)
- Admin endpoints or user management APIs

## Technical Constraints

1. **Locked Technology Stack**: Must use Python FastAPI, SQLModel, and Neon Serverless PostgreSQL as mandated by constitution. No substitutions allowed.

2. **Stateless Architecture**: Backend must remain completely stateless. No server-side session storage, no in-memory caches that affect authentication.

3. **Database Exclusivity**: Must connect ONLY to Neon PostgreSQL. Local databases (SQLite, local Postgres) are strictly forbidden.

4. **API Contract Immutability**: The six API endpoints defined in the constitution cannot be changed without a spec amendment.

5. **User Isolation Enforcement**: Every database query must be filtered by authenticated user_id. This is a security-critical constraint.

6. **JWT Verification Requirement**: Every endpoint must verify JWT tokens. No public or unauthenticated endpoints allowed.

7. **Environment Variable Dependency**: DATABASE_URL must be the sole source of database configuration. No hardcoded connection strings.

8. **Repository Structure**: Backend code must reside in /backend directory only. No mixing of frontend and backend logic.

## Risks and Mitigations

### Risk 1: JWT Secret Mismatch
**Description**: If BETTER_AUTH_SECRET differs between frontend and backend, all authentication will fail.
**Impact**: High - complete system failure
**Mitigation**: Document secret sharing requirement clearly in plan phase; include validation test in implementation

### Risk 2: Neon Connection Failures
**Description**: Network issues or Neon service outages could prevent database access.
**Impact**: High - system unavailable
**Mitigation**: Implement connection retry logic; fail fast on startup if connection unavailable; monitor connection health

### Risk 3: Cross-User Data Leakage
**Description**: Bug in user_id filtering could expose tasks across users.
**Impact**: Critical - security breach
**Mitigation**: Enforce filtering at repository layer; include comprehensive security tests; code review all query logic

### Risk 4: JWT Token Expiration Handling
**Description**: Unclear how frontend handles token refresh; users may experience unexpected logouts.
**Impact**: Medium - poor user experience
**Mitigation**: Document token expiration behavior; ensure error messages guide users to re-authenticate

### Risk 5: Database Schema Evolution
**Description**: Future schema changes may require migrations that could cause downtime.
**Impact**: Medium - potential data loss or downtime
**Mitigation**: Plan migration strategy in plan phase; consider using Alembic for schema versioning

## Notes

- This specification focuses on Phase II backend API requirements only
- Frontend integration details will be covered in a separate frontend specification
- Database migration strategy will be detailed in the implementation plan
- Performance benchmarks and load testing criteria will be defined during planning phase
- Security testing and penetration testing requirements will be specified in tasks phase
