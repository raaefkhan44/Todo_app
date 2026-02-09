---
name: backend-crud
description: Implements structured, secure, and spec-compliant CRUD operations for a FastAPI + SQLModel backend. Enforces user ownership, Pydantic validation, and repository pattern separation.
---

# Backend CRUD Skill

## Purpose
This skill provides a standardized, error-free workflow for implementing Todo task CRUD operations. It ensures every endpoint is built with security (user ownership), validation (Pydantic), and architectural cleanliness (Service/Repository pattern).

## Context & Research
Based on FastAPI best practices and SQLModel relationships:
- **FastAPI**: Use `APIRouter` for modularity. Use `HTTPException` for errors. Use Pydantic models for request/response schemas.
- **SQLModel**: Define `table=True` for DB models, pure `SQLModel` for Pydantic schemas. Use `Session` for transactions.

## Responsibilities
- **Implements REST Endpoints**: GET, POST, PUT, DELETE mappings from spec.
- **Enforces Ownership**: Every query MUST filter by `user_id` (e.g., `.where(Todo.user_id == current_user.id)`).
- **Validation**:
  - Request Body: Pydantic Create/Update models.
  - Response Model: Public Pydantic models.
- **Error Handling**: Raise `HTTPException(404)` if not found, `403` if access denied.

## Rules
1. **No Business Logic in Routes**: Routes only handle HTTP layer (parsing, status codes). Logic goes to Service/Repository.
2. **No Direct DB Access in Routes**: Pass `Session` to Repository functions.
3. **Follow Spec**: Field names and types must match `specs/api/`.
4. **Read Guidelines**: strictly follow `backend/CLAUDE.md`.

## Implementation Pattern

### 1. Define Models (`models/todo.py`)
- `TodoBase`: Shared fields.
- `Todo(TodoBase, table=True)`: Database table.
- `TodoCreate(TodoBase)`: Input schema.
- `TodoRead(TodoBase)`: Output schema.

### 2. Repository Layer (`crud/todo.py`)
```python
def get_todos(session: Session, user_id: int, offset: int = 0, limit: int = 100):
    statement = select(Todo).where(Todo.user_id == user_id).offset(offset).limit(limit)
    return session.exec(statement).all()

def create_todo(session: Session, todo: Todo):
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
```

### 3. API Router (`api/routes/todos.py`)
```python
@router.post("/", response_model=TodoRead)
def create_todo_endpoint(
    todo_in: TodoCreate,
    session: SessionDep,
    current_user: CurrentUser,
):
    todo = Todo.model_validate(todo_in, update={"user_id": current_user.id})
    return crud.create_todo(session, todo)
```

## Checklist
- [ ] Is `user_id` enforced in every SELECT/UPDATE/DELETE?
- [ ] Are Pydantic models used (no raw dicts)?
- [ ] Are 404/403 errors handled explicitly?
- [ ] Does the implementation match the Spec exactly?
