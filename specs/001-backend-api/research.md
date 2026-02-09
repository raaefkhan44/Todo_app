# Research & Technical Decisions: Backend API

**Feature**: Backend API for Todo Application
**Date**: 2026-02-09
**Status**: Complete

## Overview

This document captures technical research findings and architectural decisions made during the planning phase for the backend API implementation. All decisions are based on the approved specification and constitutional requirements.

---

## Research Area 1: JWT Verification Strategy

### Context
The backend must verify JWT tokens issued by Better Auth on the frontend, extract user_id, and enforce authentication on all endpoints (FR-007 to FR-014).

### Research Findings

**Better Auth JWT Token Structure**:
- Better Auth follows standard JWT format with three parts: header.payload.signature
- Standard claims expected: `sub` (subject/user_id), `exp` (expiration), `iat` (issued at)
- Tokens are signed with BETTER_AUTH_SECRET using HS256 algorithm (HMAC with SHA-256)
- Token format: `Authorization: Bearer <token>`

**JWT Library Comparison**:

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| python-jose[cryptography] | FastAPI docs use it, supports multiple algorithms, includes crypto backend | Larger dependency | ✅ **Selected** |
| PyJWT | Lightweight, widely used | Less FastAPI integration examples | Not selected |
| authlib | Full OAuth suite | Overkill for JWT-only verification | Not selected |

### Decision 1.1: Use python-jose[cryptography]

**Rationale**:
- Official FastAPI security documentation uses python-jose
- Includes cryptography backend for secure operations
- Supports HS256, RS256, and other algorithms
- Well-maintained with active community

**Implementation Pattern**:
```python
from jose import JWTError, jwt

def verify_jwt_token(token: str, secret: str) -> dict:
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
```

### Decision 1.2: JWT Claim Names

**Decision**: Use standard `sub` claim for user_id

**Rationale**:
- `sub` (subject) is the standard JWT claim for user identifier
- Better Auth follows JWT standards
- If Better Auth uses custom claim, we'll detect during integration testing

**Fallback**: If `sub` is not present, check for `user_id` or `id` claims

### Decision 1.3: Token Expiration Handling

**Decision**: Verify `exp` claim and return 401 with clear message

**Error Response**:
```json
{
  "detail": "Token has expired. Please log in again."
}
```

**Rationale**:
- Clear user guidance for expired tokens
- No sensitive information exposed
- Follows FR-010 requirement

---

## Research Area 2: Database Connection Management

### Context
Backend must connect exclusively to Neon Serverless PostgreSQL using DATABASE_URL environment variable (FR-003, FR-004).

### Research Findings

**Neon PostgreSQL Characteristics**:
- Serverless architecture with automatic scaling
- Connection pooling handled by Neon proxy
- Supports both psycopg2 (sync) and asyncpg (async) drivers
- Connection string format: `postgresql://user:password@host/database?sslmode=require`
- Recommended: Use connection pooling on client side for optimal performance

**SQLModel Engine Options**:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Sync engine (psycopg) | Simpler code, well-documented, sufficient for Phase II | Blocks on I/O | ✅ **Selected for Phase II** |
| Async engine (asyncpg) | Non-blocking I/O, better concurrency | More complex, requires async/await everywhere | Defer to Phase III+ |

### Decision 2.1: Use Synchronous SQLModel Engine

**Rationale**:
- Phase II performance target (<500ms p95, 100 concurrent requests) achievable with sync
- SQLModel documentation primarily uses sync patterns
- Simpler implementation and testing
- Can migrate to async in future phase if needed

**Implementation Pattern**:
```python
from sqlmodel import create_engine, Session

engine = create_engine(
    database_url,
    echo=False,  # Set to True for SQL logging in development
    pool_pre_ping=True,  # Verify connections before using
    pool_size=10,  # Adjust based on load testing
    max_overflow=20
)
```

### Decision 2.2: Connection Pool Configuration

**Settings**:
- `pool_size=10`: Base connection pool size
- `max_overflow=20`: Additional connections under load (total 30 max)
- `pool_pre_ping=True`: Verify connection health before use
- `pool_recycle=3600`: Recycle connections every hour

**Rationale**:
- Neon handles server-side pooling, but client-side pooling reduces latency
- 30 total connections sufficient for 100 concurrent requests
- Pre-ping prevents stale connection errors
- Recycle prevents long-lived connection issues

### Decision 2.3: Startup Connection Validation

**Decision**: Validate DATABASE_URL and connection on startup, fail fast if unavailable

**Implementation**:
```python
def validate_database_connection():
    if not os.getenv("DATABASE_URL"):
        raise RuntimeError("DATABASE_URL environment variable is not set")

    try:
        with Session(engine) as session:
            session.exec(text("SELECT 1"))
    except Exception as e:
        raise RuntimeError(f"Failed to connect to database: {str(e)}")
```

**Rationale**:
- Satisfies FR-005 (fail if DATABASE_URL not configured)
- Catches configuration errors before serving requests
- Prevents silent failures

---

## Research Area 3: User Isolation Enforcement Pattern

### Context
Every database query must be filtered by authenticated user_id to prevent cross-user data access (FR-015, FR-016, FR-017).

### Research Findings

**Pattern Options**:

| Pattern | Pros | Cons | Verdict |
|---------|------|------|---------|
| Direct queries in routes | Simple, no abstraction | Easy to forget user_id filter, hard to test | ❌ Rejected |
| Middleware query filtering | Automatic filtering | Complex, hard to debug, SQLModel doesn't support well | ❌ Rejected |
| Repository pattern | Centralized logic, testable, explicit | Extra abstraction layer | ✅ **Selected** |

### Decision 3.1: Repository Pattern with Required user_id Parameter

**Rationale**:
- Centralizes all data access logic in one place
- Makes it impossible to query without user_id (compile-time safety)
- Easy to test user isolation independently
- Follows separation of concerns (routes handle HTTP, repositories handle data)

**Implementation Pattern**:
```python
class TaskRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all_tasks(self, user_id: str) -> List[Task]:
        statement = select(Task).where(Task.user_id == user_id)
        return self.session.exec(statement).all()

    def get_task_by_id(self, task_id: str, user_id: str) -> Optional[Task]:
        statement = select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id  # Always filter by user_id
        )
        return self.session.exec(statement).first()
```

**Key Principle**: Every repository method MUST have `user_id` as a required parameter

### Decision 3.2: Return 404 for Cross-User Access

**Decision**: When a user attempts to access another user's task, return 404 Not Found instead of 403 Forbidden

**Rationale**:
- Prevents information leakage (user can't determine if task exists)
- Follows security best practice (fail closed)
- Satisfies FR-017

**Implementation**: Repository returns `None` when task not found or doesn't belong to user, route handler converts to 404

---

## Research Area 4: Database Migration Strategy

### Context
Need to create and manage database schema for tasks, users, and sessions tables (FR-026 to FR-031).

### Research Findings

**Migration Tool Options**:

| Tool | Pros | Cons | Use Case |
|------|------|------|----------|
| SQLModel.metadata.create_all() | Simple, automatic, no extra tool | No migration history, manual schema changes | ✅ **Phase II** |
| Alembic | Full migration history, rollback support, team-friendly | More complex setup, overkill for MVP | Phase III+ |
| Manual SQL | Full control | Error-prone, no automation | Not recommended |

### Decision 4.1: Use SQLModel.metadata.create_all() for Phase II

**Rationale**:
- Phase II has stable schema defined in specification
- No existing data to migrate
- Simpler setup for initial development
- Alembic can be added in Phase III+ when schema evolution is needed

**Implementation**:
```python
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
```

**Call on startup**: Run during application initialization

### Decision 4.2: Plan Alembic Migration for Phase III+

**When to migrate to Alembic**:
- When schema changes are needed after production deployment
- When multiple developers need to coordinate schema changes
- When rollback capability is required

**Migration Path**: Alembic can generate initial migration from existing SQLModel models

---

## Research Area 5: Error Handling and Logging

### Context
Backend must return clear error messages without exposing sensitive information (FR-038 to FR-046).

### Research Findings

**FastAPI Exception Handling**:
- FastAPI provides automatic validation error handling via Pydantic
- Custom exception handlers can override default behavior
- HTTPException is the standard way to return HTTP errors

### Decision 5.1: Custom Exception Handlers

**Decision**: Implement custom exception handlers for production-safe error responses

**Handlers Needed**:
1. **ValidationError**: Pydantic validation failures → 400 with field-specific errors
2. **HTTPException**: Standard HTTP errors → preserve status and detail
3. **JWTError**: JWT verification failures → 401 with generic message
4. **SQLAlchemyError**: Database errors → 500 without exposing SQL details
5. **Exception**: Catch-all for unexpected errors → 500 with generic message

**Implementation Pattern**:
```python
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

### Decision 5.2: Logging Configuration

**Decision**: Use Python's standard logging with structured format and sensitive data filtering

**Log Levels**:
- ERROR: Authentication failures, database errors, unexpected exceptions
- WARNING: Deprecated endpoints, rate limit warnings (future)
- INFO: Startup/shutdown, configuration loaded
- DEBUG: Request/response details (development only)

**Sensitive Data Filtering**:
- Never log: passwords, JWT tokens, DATABASE_URL connection string
- Redact: email addresses (log as `user@***`), user IDs (log first 8 chars)

**Log Format**:
```
%(asctime)s - %(name)s - %(levelname)s - %(message)s
```

### Decision 5.3: Error Response Schema

**Decision**: Standardize error responses using FastAPI's default format

**Schema**:
```json
{
  "detail": "Human-readable error message"
}
```

**For validation errors**:
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Rationale**:
- Consistent with FastAPI conventions
- Client-friendly format
- Supports both simple and complex errors

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| JWT Library | python-jose[cryptography] | FastAPI standard, secure, well-documented |
| JWT Claims | Use `sub` for user_id | Standard JWT claim |
| Database Driver | psycopg (sync) | Sufficient for Phase II, simpler implementation |
| Connection Pool | 10 base + 20 overflow | Handles 100 concurrent requests |
| User Isolation | Repository pattern with required user_id | Compile-time safety, testable |
| Cross-User Access | Return 404, not 403 | Prevents information leakage |
| Schema Creation | SQLModel.metadata.create_all() | Simple for Phase II MVP |
| Migration Tool | Alembic in Phase III+ | Not needed for stable Phase II schema |
| Error Handling | Custom exception handlers | Production-safe, no sensitive data |
| Logging | Standard logging with filtering | Secure, structured, debuggable |

---

## Open Questions (None)

All technical unknowns have been resolved. Implementation can proceed based on these decisions.

---

## References

- FastAPI Security Documentation: https://fastapi.tiangolo.com/tutorial/security/
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Neon PostgreSQL Documentation: https://neon.tech/docs/
- python-jose Documentation: https://python-jose.readthedocs.io/
- JWT Standard (RFC 7519): https://tools.ietf.org/html/rfc7519
