---
name: database-schema-migration
description: Defines best practices for designing and evolving SQLModel schemas for Neon Serverless PostgreSQL. Ensures compatibility with migrations (Alembic) and enforces schema hygiene (indexes, relationships, user ownership).
---

# Database Schema & Migration Skill

## Purpose
Design and evolve database schemas using SQLModel for Neon Serverless PostgreSQL. This skill ensures that the database layer remains consistent, scalable, and compatible with iterative Spec-Driven Development.

## Context & Research
- **SQLModel**: Defines both Pydantic schemas (data validation) and SQLAlchemy tables (ORM) in one class.
- **Neon Serverless**: Requires connection pooling (`postgresql+psycopg2://` or similar) and resilient connection handling.
- **Migrations**: Changes to `table=True` models must be captured via `alembic revision --autogenerate`.

## Responsibilities
- **Model Definition**: Translate `specs/database/` requirements into SQLModel classes.
- **Optimization**: Define indexes for frequently queried fields (especially `user_id` and `title`).
- **Relationships**: Use `Relationship` attributes to define foreign keys and ORM links.
- **Compatibility**: Ensure schema changes are additive and non-destructive to support future phases.

## Rules
1. **Spec-First Changes**: Never modify schema code without a corresponding update in `specs/database/`.
2. **User Isolation**: fastidiously include `user_id` as a `Field(index=True)` in every user-owned table.
3. **Naming**: Use singular, snake_case for tables and columns (e.g., `todo_item`, `created_at`).
4. **Docs**: Follow guidelines in `directory/database/schema.md`.

## Implementation Pattern

### 1. Model Definition (`models/todo.py`)
```python
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class TodoBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = None
    is_completed: bool = Field(default=False)

class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # CRITICAL: Indexed for ownership queries
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TodoCreate(TodoBase):
    pass

class TodoRead(TodoBase):
    id: int
    created_at: datetime
```

### 2. Connection (`core/db.py`)
```python
from sqlmodel import create_engine, SQLModel
from app.core.config import settings

# Use connection pooling for Neon
connection_string = str(settings.DATABASE_URL)
engine = create_engine(connection_string, echo=False, pool_pre_ping=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
```

### 3. Migration Workflow
1. Update `models/*.py`.
2. Run `alembic revision --autogenerate -m "description"`.
3. Checks `alembic/versions/` for generated script.
4. Apply with `alembic upgrade head`.

## Checklist
- [ ] Does every table have a `user_id` field (if user-specific)?
- [ ] Is `user_id` indexed (`index=True`)?
- [ ] Are Pydantic models (Read/Create) separated from Table models?
- [ ] Is the migration script generated and reviewed?
- [ ] Does the schema match `specs/database/schema.spec`?
