# Data Model: Backend API Database Schema

**Feature**: Backend API for Todo Application
**Date**: 2026-02-09
**Database**: Neon Serverless PostgreSQL
**ORM**: SQLModel

## Overview

This document defines the complete database schema for the Todo application backend, including all tables, columns, relationships, indexes, and validation rules as specified in the feature specification (FR-026 to FR-031).

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     User        │
│─────────────────│
│ id (PK)         │◄─────┐
│ username        │      │
│ email           │      │
│ password        │      │
│ created_at      │      │
└─────────────────┘      │
                         │ 1:N
                         │
                    ┌────┴────────────┐
                    │                 │
         ┌──────────┴──────┐   ┌─────┴──────────┐
         │     Task        │   │    Session     │
         │─────────────────│   │────────────────│
         │ id (PK)         │   │ id (PK)        │
         │ title           │   │ user_id (FK)   │
         │ description     │   │ created_at     │
         │ completed       │   │ expires_at     │
         │ priority        │   └────────────────┘
         │ due_date        │
         │ tags            │
         │ recurrence_...  │
         │ user_id (FK)    │
         │ created_at      │
         │ updated_at      │
         └─────────────────┘
```

---

## Table 1: users

### Purpose
Stores user account information. Users own tasks and are authenticated via JWT tokens issued by Better Auth.

### Schema Definition

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| username | VARCHAR(255) | NOT NULL, UNIQUE | User's username for display |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| password | VARCHAR(255) | NOT NULL | Hashed password (bcrypt/argon2) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |

### Indexes

- **PRIMARY KEY**: `id` (automatic)
- **UNIQUE INDEX**: `username` (for fast username lookups)
- **UNIQUE INDEX**: `email` (for fast email lookups)

### Validation Rules

- **username**:
  - Required (non-null)
  - Unique across all users
  - Length: 3-255 characters
  - Pattern: alphanumeric, underscore, hyphen allowed

- **email**:
  - Required (non-null)
  - Unique across all users
  - Must be valid email format
  - Length: 5-255 characters

- **password**:
  - Required (non-null)
  - Must be hashed (never store plain text) - FR-031
  - Hashing algorithm: bcrypt or argon2
  - Minimum length (before hashing): 8 characters

### SQLModel Definition Pattern

```python
from sqlmodel import Field, SQLModel
from datetime import datetime
from uuid import UUID, uuid4

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(max_length=255, unique=True, index=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password: str = Field(max_length=255)  # Hashed
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Notes

- Password hashing is handled by Better Auth on the frontend
- Backend only verifies JWT tokens, does not perform password operations
- Users table exists for data integrity and future user management features

---

## Table 2: tasks

### Purpose
Stores todo items that belong to users. Each task is owned by exactly one user and can only be accessed by that user.

### Schema Definition

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique task identifier |
| title | VARCHAR(255) | NOT NULL | Task title (required) |
| description | TEXT | NULL | Optional task description |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| priority | VARCHAR(10) | NULL, CHECK IN ('low', 'medium', 'high') | Task priority level |
| due_date | DATE | NULL | Optional due date (ISO 8601) |
| tags | TEXT[] | NOT NULL, DEFAULT '{}' | Array of tag strings |
| recurrence_pattern | VARCHAR(255) | NULL | Optional recurrence pattern |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) | Owner user ID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Indexes

- **PRIMARY KEY**: `id` (automatic)
- **INDEX**: `user_id` (critical for query performance) - FR-029
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

### Validation Rules

- **title** (FR-032):
  - Required (non-null, non-empty)
  - Must not be whitespace-only
  - Length: 1-255 characters
  - Trimmed before storage

- **description**:
  - Optional (nullable)
  - Length: 0-2000 characters
  - Trimmed before storage

- **completed**:
  - Required (non-null)
  - Boolean: true or false
  - Default: false

- **priority** (FR-033):
  - Optional (nullable)
  - Must be one of: 'low', 'medium', 'high', or NULL
  - Case-sensitive
  - Enforced via CHECK constraint or Enum

- **due_date** (FR-034):
  - Optional (nullable)
  - Must be valid ISO 8601 date format (YYYY-MM-DD)
  - Can be past, present, or future date
  - Stored as DATE type (no time component)

- **tags** (FR-035):
  - Required (non-null, but can be empty array)
  - PostgreSQL ARRAY of TEXT
  - Each tag: 1-50 characters
  - No duplicate tags within same task
  - Default: empty array []

- **recurrence_pattern** (FR-036):
  - Optional (nullable)
  - String format (e.g., "daily", "weekly", "monthly")
  - Length: 1-255 characters
  - Format validation deferred to application layer

- **user_id** (FR-030):
  - Required (non-null)
  - Must reference existing user
  - Foreign key constraint enforced
  - Indexed for fast filtering

### SQLModel Definition Pattern

```python
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import ARRAY, String
from datetime import datetime, date
from uuid import UUID, uuid4
from enum import Enum
from typing import Optional, List

class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255, min_length=1)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    priority: Optional[PriorityEnum] = Field(default=None)
    due_date: Optional[date] = Field(default=None)
    tags: List[str] = Field(default_factory=list, sa_column=Column(ARRAY(String)))
    recurrence_pattern: Optional[str] = Field(default=None, max_length=255)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Relationships

- **User → Tasks**: One-to-Many
  - One user can have many tasks
  - Each task belongs to exactly one user
  - Cascade delete: When user is deleted, all their tasks are deleted

### Notes

- **user_id index is critical**: All queries filter by user_id, index ensures fast lookups
- **tags as PostgreSQL ARRAY**: Native array type for efficient storage and querying
- **updated_at**: Should be updated automatically on every modification (trigger or application logic)

---

## Table 3: sessions

### Purpose
Tracks authentication sessions for Better Auth integration. Sessions are validated indirectly through JWT tokens, maintaining backend statelessness.

### Schema Definition

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique session identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) | Session owner user ID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Session creation timestamp |
| expires_at | TIMESTAMP | NOT NULL | Session expiration timestamp |

### Indexes

- **PRIMARY KEY**: `id` (automatic)
- **INDEX**: `user_id` (for user session lookups)
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

### Validation Rules

- **user_id**:
  - Required (non-null)
  - Must reference existing user
  - Foreign key constraint enforced

- **created_at**:
  - Required (non-null)
  - Automatically set on creation
  - Cannot be in the future

- **expires_at**:
  - Required (non-null)
  - Must be after created_at
  - Used for session expiration checks

### SQLModel Definition Pattern

```python
from sqlmodel import Field, SQLModel
from datetime import datetime
from uuid import UUID, uuid4

class Session(SQLModel, table=True):
    __tablename__ = "sessions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
```

### Notes

- Sessions table is for Better Auth's internal tracking
- Backend does not actively manage sessions (stateless)
- JWT verification is the primary authentication mechanism
- Sessions may be used for audit logging or session management in future phases

---

## Database Constraints Summary

### Foreign Key Constraints

1. **tasks.user_id → users.id**
   - ON DELETE CASCADE (delete tasks when user deleted)
   - ON UPDATE CASCADE (update task user_id if user id changes)

2. **sessions.user_id → users.id**
   - ON DELETE CASCADE (delete sessions when user deleted)
   - ON UPDATE CASCADE (update session user_id if user id changes)

### Check Constraints

1. **tasks.priority**: Must be 'low', 'medium', 'high', or NULL
2. **tasks.title**: Length > 0 (non-empty string)
3. **sessions.expires_at**: Must be > created_at

### Unique Constraints

1. **users.username**: Unique across all users
2. **users.email**: Unique across all users

---

## Index Strategy

### Performance-Critical Indexes

1. **tasks.user_id** (FR-029)
   - **Purpose**: Fast filtering of tasks by user
   - **Query Pattern**: `WHERE user_id = ?`
   - **Impact**: Every task query filters by user_id
   - **Type**: B-tree index

2. **users.username**
   - **Purpose**: Fast username lookups
   - **Query Pattern**: `WHERE username = ?`
   - **Type**: Unique B-tree index

3. **users.email**
   - **Purpose**: Fast email lookups
   - **Query Pattern**: `WHERE email = ?`
   - **Type**: Unique B-tree index

### Future Index Considerations (Phase III+)

- **tasks.completed**: If filtering by completion status becomes common
- **tasks.due_date**: If date-based queries are added
- **tasks.priority**: If priority-based filtering is added
- **tasks.tags**: GIN index for array containment queries

---

## Data Types Mapping

### SQLModel → PostgreSQL Type Mapping

| SQLModel Type | PostgreSQL Type | Notes |
|---------------|-----------------|-------|
| UUID | UUID | Native UUID type |
| str | VARCHAR(n) | Variable-length string with limit |
| str (no limit) | TEXT | Unlimited text |
| bool | BOOLEAN | True/false |
| datetime | TIMESTAMP | Timezone-naive (UTC assumed) |
| date | DATE | Date only, no time |
| Optional[T] | T NULL | Nullable column |
| List[str] | TEXT[] | PostgreSQL array |
| Enum | VARCHAR(n) | String enum with CHECK constraint |

---

## Schema Creation Strategy

### Phase II: SQLModel.metadata.create_all()

**Method**: Automatic schema creation on startup

```python
from sqlmodel import SQLModel, create_engine

def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)
```

**Execution**: Called during application startup after database connection established

**Behavior**:
- Creates tables if they don't exist
- Does NOT modify existing tables
- Idempotent (safe to run multiple times)

### Phase III+: Alembic Migrations

**When to migrate**: When schema changes are needed after production deployment

**Migration Path**:
1. Install Alembic: `pip install alembic`
2. Initialize: `alembic init alembic`
3. Generate initial migration: `alembic revision --autogenerate -m "Initial schema"`
4. Apply migration: `alembic upgrade head`

---

## Data Integrity Rules

### User Isolation (Critical Security Requirement)

**Rule**: Every task MUST belong to exactly one user (FR-030)

**Enforcement**:
1. **Database Level**: Foreign key constraint (tasks.user_id → users.id, NOT NULL)
2. **Application Level**: Repository pattern requires user_id parameter
3. **Query Level**: All queries filter by user_id

**Validation**: Security tests must verify no cross-user data access

### Referential Integrity

**Rule**: Orphaned records are not allowed

**Enforcement**:
- Foreign key constraints with CASCADE delete
- When user is deleted, all their tasks and sessions are automatically deleted
- Database enforces referential integrity

### Data Validation

**Rule**: Invalid data is rejected at application layer before database insertion

**Enforcement**:
1. **Pydantic Schemas**: Validate request data (title non-empty, priority enum, date format)
2. **SQLModel Validators**: Additional validation on model fields
3. **Database Constraints**: Final enforcement (CHECK constraints, NOT NULL)

---

## Sample Data for Testing

### Test User

```python
test_user = User(
    id=UUID("12345678-1234-1234-1234-123456789012"),
    username="testuser",
    email="test@example.com",
    password="$2b$12$hashed_password_here",  # Hashed
    created_at=datetime.utcnow()
)
```

### Test Tasks

```python
task1 = Task(
    id=UUID("87654321-4321-4321-4321-210987654321"),
    title="Complete project documentation",
    description="Write comprehensive docs for the API",
    completed=False,
    priority=PriorityEnum.HIGH,
    due_date=date(2026, 2, 15),
    tags=["documentation", "urgent"],
    recurrence_pattern=None,
    user_id=test_user.id,
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)

task2 = Task(
    id=UUID("11111111-2222-3333-4444-555555555555"),
    title="Buy groceries",
    description=None,
    completed=True,
    priority=PriorityEnum.LOW,
    due_date=None,
    tags=["personal", "shopping"],
    recurrence_pattern="weekly",
    user_id=test_user.id,
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)
```

---

## Schema Evolution Considerations

### Phase II (Current)

- Schema is stable as defined in specification
- No migrations needed (new database)
- SQLModel.metadata.create_all() sufficient

### Phase III+ (Future)

**Potential Schema Changes**:
- Add task categories or projects
- Add task attachments (file references)
- Add task comments or notes
- Add user preferences or settings
- Add audit log table

**Migration Strategy**:
- Use Alembic for version-controlled migrations
- Test migrations on staging before production
- Plan for zero-downtime migrations (add columns, backfill, remove old columns)

---

## Performance Considerations

### Query Optimization

1. **Always filter by user_id**: Leverages index, prevents full table scans
2. **Use SELECT specific columns**: Avoid `SELECT *` for large result sets
3. **Limit result sets**: Add pagination in Phase III+ for large task lists

### Connection Pooling

- Pool size: 10 base + 20 overflow (from research.md)
- Pre-ping enabled: Validates connections before use
- Recycle: 3600 seconds (1 hour)

### Indexing Strategy

- Index on tasks.user_id is critical (every query uses it)
- Unique indexes on users.username and users.email for fast lookups
- Monitor query performance and add indexes as needed

---

## Security Considerations

### User Isolation

- **Database Level**: Foreign key constraints ensure tasks belong to valid users
- **Application Level**: Repository pattern enforces user_id filtering
- **Query Level**: All SELECT, UPDATE, DELETE queries include `WHERE user_id = ?`

### Password Security

- Passwords are hashed (never plain text) - FR-031
- Hashing handled by Better Auth (frontend)
- Backend never receives or stores plain text passwords

### SQL Injection Prevention

- SQLModel uses parameterized queries (automatic protection)
- Never concatenate user input into SQL strings
- ORM layer provides safe query construction

---

## Compliance with Specification

### Functional Requirements Mapping

- **FR-026**: ✅ Tasks table defined with all required columns
- **FR-027**: ✅ Users table defined with all required columns
- **FR-028**: ✅ Sessions table defined with all required columns
- **FR-029**: ✅ Index on tasks.user_id created
- **FR-030**: ✅ Foreign key constraint enforces task ownership
- **FR-031**: ✅ Password stored as hashed string

### Validation Rules Mapping

- **FR-032**: ✅ Title validation (non-empty, max 255 chars)
- **FR-033**: ✅ Priority validation (enum: low/medium/high or null)
- **FR-034**: ✅ Due date validation (ISO 8601 date or null)
- **FR-035**: ✅ Tags validation (array of strings)
- **FR-036**: ✅ Recurrence pattern validation (string or null)

---

## Summary

This data model provides a complete, secure, and performant database schema for the Todo application backend. Key features:

- **Three tables**: users, tasks, sessions
- **User isolation**: Enforced via foreign keys and indexed user_id
- **Data integrity**: Foreign key constraints with cascade delete
- **Performance**: Strategic indexes on high-traffic columns
- **Validation**: Multi-layer validation (Pydantic, SQLModel, database)
- **Security**: Password hashing, SQL injection prevention, user_id filtering

The schema is ready for implementation using SQLModel and Neon PostgreSQL.
