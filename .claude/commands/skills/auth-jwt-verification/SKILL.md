---
name: auth-jwt-verification
description: Implements secure authentication middleware for FastAPI to verify JWT tokens issued by Better Auth. Extracts identity, enforces user isolation, and rejects unauthorized requests.
---

# Auth & JWT Verification Skill

## Purpose
Secure FastAPI APIs by verifying JWT tokens issued by Better Auth. This skill ensures that every request is authenticated and mapped to a specific user, enabling strict multi-user isolation.

## Context & Research
- **Better Auth Integration**: Tokens are verified using a shared secret or JWKS (JSON Web Key Set).
- **FastAPI Security**: Uses `OAuth2PasswordBearer` for token extraction and dependency injection for verification.
- **Isolation**: The `user_id` from the verified token MUST be the source of truth, never the request body.

## Responsibilities
- **Extract Token**: specific patterns to get JWT from `Authorization: Bearer <token>` header.
- **Verify Signature**: Decode token using `BETTER_AUTH_SECRET` and `HS256` (or configured algorithm).
- **Identity Provider**: Inject `current_user` into route handlers.
- **Enforce Isolation**: Provide the `user_id` that MUST be used for all DB queries.

## Rules
1. **Reject Unauthenticated**: Return `401 Unauthorized` for missing/invalid tokens.
2. **Trust Token Only**: Ignore `user_id` in request bodies; overwrite it with the token's `sub`.
3. **No Direct Key Access**: API routes must not access the secret key directly; use the dependency.

## Implementation Pattern

### 1. Dependencies (`api/deps.py`)
```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access-token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Verify using Better Auth Secret
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[settings.ALGORITHM],
            audience=settings.BETTER_AUTH_URL
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return user_id
```

### 2. Protected Route Usage (`api/routes/todos.py`)
```python
@router.post("/")
def create_item(
    item_in: ItemCreate,
    current_user_id: Annotated[str, Depends(get_current_user)]
):
    # Enforce ownership explicitly
    item_data = item_in.model_dump()
    item_data["user_id"] = current_user_id
    # Proceed to service/CRUD...
```

## Checklist
- [ ] Is `OAuth2PasswordBearer` configured correctly?
- [ ] Is the `BETTER_AUTH_SECRET` loaded from env?
- [ ] Does `get_current_user` raise 401 on failure?
- [ ] Are all protected routes using `Depends(get_current_user)`?
