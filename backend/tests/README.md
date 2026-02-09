# Security Testing Procedures

This document describes how to run security tests to validate user isolation and authentication.

## Prerequisites

- Backend server running (`uvicorn app.main:app --reload`)
- Python environment with dependencies installed
- BETTER_AUTH_SECRET configured in `.env`

## Test 1: Authentication Tests

Tests JWT token validation and authentication enforcement (US4).

### Running the Test

```bash
cd backend
python -m tests.manual_auth_test
```

### What It Tests

1. **Missing JWT Token**: Requests without token → 401 Unauthorized
2. **Valid JWT Token**: Requests with valid token → 200 OK
3. **Expired JWT Token**: Expired tokens → 401 Unauthorized
4. **Invalid Signature**: Wrong secret → 401 Unauthorized
5. **Malformed Token**: Invalid format → 401 Unauthorized
6. **Missing Bearer Prefix**: Token without "Bearer " → 401 Unauthorized
7. **Stateless Operation**: Backend works after restart without re-authentication

### Expected Results

All tests should pass with ✅ marks. Any failures indicate authentication issues.

## Test 2: User Isolation Tests

Tests that users cannot access each other's tasks (US1).

### Setup

1. Generate two test JWT tokens for different users:

```python
# In Python shell or script
from jose import jwt
from datetime import datetime, timedelta
import os

SECRET = os.getenv("BETTER_AUTH_SECRET")

# User A token
payload_a = {
    "sub": "12345678-1234-1234-1234-123456789012",
    "exp": datetime.utcnow() + timedelta(hours=1),
    "iat": datetime.utcnow()
}
token_a = jwt.encode(payload_a, SECRET, algorithm="HS256")
print(f"User A Token: {token_a}")

# User B token
payload_b = {
    "sub": "87654321-4321-4321-4321-210987654321",
    "exp": datetime.utcnow() + timedelta(hours=1),
    "iat": datetime.utcnow()
}
token_b = jwt.encode(payload_b, SECRET, algorithm="HS256")
print(f"User B Token: {token_b}")
```

2. Update `tests/manual_security_test.py`:
   - Set `USER_A_ID` to User A's UUID
   - Set `USER_B_ID` to User B's UUID
   - Set `USER_A_TOKEN` to User A's JWT token
   - Set `USER_B_TOKEN` to User B's JWT token

### Running the Test

```bash
cd backend
python -m tests.manual_security_test
```

### What It Tests

1. User A creates a task
2. User B creates a task
3. User A tries to GET User B's task → 404 Not Found
4. User B tries to GET User A's task → 404 Not Found
5. User A tries to UPDATE User B's task → 404 Not Found
6. User B tries to DELETE User A's task → 404 Not Found
7. User A tries to TOGGLE User B's task → 404 Not Found
8. User A can only see their own tasks in list
9. User B can only see their own tasks in list

### Expected Results

All tests should pass with ✅ marks. Key points:
- Cross-user access returns **404** (not 403) to prevent information leakage
- Users can only see their own tasks in list endpoints
- All CRUD operations enforce user isolation

## Test 3: Manual Validation with curl

### Create Task

```bash
# Generate token first (see above)
TOKEN="your-jwt-token-here"
USER_ID="your-user-id-here"

# Create task
curl -X POST "http://localhost:8000/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "Testing security",
    "priority": "high",
    "tags": ["test"]
  }'
```

### List Tasks

```bash
curl -X GET "http://localhost:8000/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN"
```

### Try Cross-User Access

```bash
# Try to access another user's task (should return 404)
OTHER_USER_ID="different-user-id"
TASK_ID="task-id-from-other-user"

curl -X GET "http://localhost:8000/api/$USER_ID/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected: {"detail":"Task not found"}
```

## Troubleshooting

### Test Fails: "Expected 401, got 403"

- Check that `get_current_user` dependency is applied to all endpoints
- Verify JWT verification is working correctly

### Test Fails: "Expected 404, got 200"

- User isolation is not enforced
- Check that repository methods filter by `user_id`
- Verify authenticated `user_id` is used, not path parameter

### Test Fails: "Connection refused"

- Ensure backend server is running
- Check that server is listening on correct port (8000)

### Token Generation Fails

- Verify `BETTER_AUTH_SECRET` is set in `.env`
- Check that secret matches between frontend and backend

## Security Checklist

After running all tests, verify:

- [ ] All endpoints require JWT authentication
- [ ] Expired tokens are rejected
- [ ] Invalid tokens are rejected
- [ ] Users cannot access other users' tasks (404)
- [ ] Users can only see their own tasks in lists
- [ ] Cross-user UPDATE/DELETE operations fail (404)
- [ ] Backend remains stateless (no session storage)
- [ ] Error messages don't expose sensitive information

## Next Steps

After all security tests pass:
1. Run validation tests (Phase 5)
2. Run database connection tests (Phase 6)
3. Proceed with production deployment (Phase 7)
