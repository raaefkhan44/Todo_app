# Quickstart Guide: Backend API Setup

**Feature**: Backend API for Todo Application
**Date**: 2026-02-09
**Target Audience**: Developers setting up the backend locally

## Overview

This guide walks you through setting up and running the Todo application backend API on your local machine. The backend is a Python FastAPI application that connects to Neon Serverless PostgreSQL and verifies JWT tokens from Better Auth.

**Estimated Setup Time**: 15-20 minutes

---

## Prerequisites

### Required Software

- **Python 3.11+**: [Download Python](https://www.python.org/downloads/)
- **pip**: Python package manager (included with Python)
- **Git**: For cloning the repository
- **Neon Account**: [Sign up for Neon](https://neon.tech/) (free tier available)

### Required Credentials

- **DATABASE_URL**: Neon PostgreSQL connection string
- **BETTER_AUTH_SECRET**: Shared secret for JWT verification (must match frontend)

### Verify Prerequisites

```bash
# Check Python version (should be 3.11 or higher)
python --version

# Check pip
pip --version

# Check Git
git --version
```

---

## Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd Todo-app

# Navigate to backend directory
cd backend
```

---

## Step 2: Create Virtual Environment

**Why**: Isolates project dependencies from system Python packages

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Verify activation (should show venv in prompt)
which python  # macOS/Linux
where python  # Windows
```

---

## Step 3: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install project dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

**Expected Dependencies**:
- fastapi>=0.115.0
- sqlmodel>=0.0.24
- psycopg[binary]>=3.1.0
- python-jose[cryptography]>=3.3.0
- pydantic>=2.0.0
- uvicorn[standard]>=0.27.0
- python-dotenv>=1.0.0

---

## Step 4: Set Up Neon PostgreSQL Database

### 4.1 Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a project name (e.g., "todo-app")
4. Select a region (choose closest to your location)
5. Click "Create Project"

### 4.2 Get Connection String

1. In Neon Console, go to your project dashboard
2. Click "Connection Details"
3. Copy the connection string (should look like):
   ```
   postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### 4.3 Test Connection (Optional)

```bash
# Install psql client (if not already installed)
# On macOS: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql-client
# On Windows: Download from PostgreSQL website

# Test connection
psql "postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"

# If successful, you'll see:
# psql (14.x)
# SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
# Type "help" for help.
# dbname=>

# Exit psql
\q
```

---

## Step 5: Configure Environment Variables

### 5.1 Create .env File

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
# On Windows: notepad .env
# On macOS/Linux: nano .env
```

### 5.2 Set Required Variables

Add the following to your `.env` file:

```env
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# Authentication Configuration (REQUIRED)
BETTER_AUTH_SECRET=your-secret-key-here-must-match-frontend

# Application Configuration (OPTIONAL)
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Development Settings (OPTIONAL)
DEBUG=false
```

### 5.3 Generate BETTER_AUTH_SECRET (if needed)

If you don't have a shared secret yet:

```bash
# Generate a secure random secret (32 bytes, base64 encoded)
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Example output: xK8vN2mP9qR4sT6uW8yZ0aB1cD3eF5gH7iJ9kL1mN3oP5qR7sT9uW1xY3zA5bC7d
```

**IMPORTANT**: Use the same secret in both frontend and backend!

### 5.4 Verify Environment Variables

```bash
# Check that .env file is loaded
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('DATABASE_URL:', os.getenv('DATABASE_URL')[:20] + '...' if os.getenv('DATABASE_URL') else 'NOT SET')"

# Should output: DATABASE_URL: postgresql://user:pa...
```

---

## Step 6: Initialize Database Schema

The database schema is automatically created on first startup, but you can verify it manually:

```bash
# Run database initialization script (if provided)
python -m app.database

# Or start the server (schema will be created automatically)
# See Step 7
```

**What Happens**:
- Creates `users` table
- Creates `tasks` table with foreign key to users
- Creates `sessions` table with foreign key to users
- Creates indexes on `tasks.user_id`, `users.username`, `users.email`

---

## Step 7: Start the Development Server

```bash
# Start server with auto-reload (development mode)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Expected output:
# INFO:     Will watch for changes in these directories: ['/path/to/backend']
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process [12345] using StatReload
# INFO:     Started server process [12346]
# INFO:     Waiting for application startup.
# INFO:     Application startup complete.
```

**Server Options**:
- `--reload`: Auto-reload on code changes (development only)
- `--host 0.0.0.0`: Listen on all network interfaces
- `--port 8000`: Port number (default: 8000)
- `--log-level info`: Logging verbosity (debug, info, warning, error)

---

## Step 8: Verify Server is Running

### 8.1 Check Health Endpoint (if implemented)

```bash
# Using curl
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy"}
```

### 8.2 View API Documentation

Open your browser and navigate to:

- **Interactive API Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc
- **OpenAPI Schema (JSON)**: http://localhost:8000/openapi.json

---

## Step 9: Test API Endpoints

### 9.1 Get a Test JWT Token

**Option 1: Use Frontend**
1. Start the frontend application
2. Register/login to get a JWT token
3. Copy the token from browser DevTools (Application → Local Storage)

**Option 2: Generate Test Token (Development Only)**

```python
# Create a test script: generate_test_token.py
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

secret = os.getenv("BETTER_AUTH_SECRET")
user_id = "12345678-1234-1234-1234-123456789012"  # Test user ID

payload = {
    "sub": user_id,
    "exp": datetime.utcnow() + timedelta(hours=1),
    "iat": datetime.utcnow()
}

token = jwt.encode(payload, secret, algorithm="HS256")
print(f"Test JWT Token:\n{token}")
```

Run the script:
```bash
python generate_test_token.py
```

### 9.2 Test Endpoints with curl

**List Tasks** (GET /api/{user_id}/tasks):
```bash
curl -X GET "http://localhost:8000/api/12345678-1234-1234-1234-123456789012/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Expected response (empty array if no tasks):
# []
```

**Create Task** (POST /api/{user_id}/tasks):
```bash
curl -X POST "http://localhost:8000/api/12345678-1234-1234-1234-123456789012/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "This is a test task",
    "priority": "high",
    "tags": ["test"]
  }'

# Expected response:
# {
#   "id": "87654321-4321-4321-4321-210987654321",
#   "title": "Test task",
#   "description": "This is a test task",
#   "completed": false,
#   "priority": "high",
#   "due_date": null,
#   "tags": ["test"],
#   "recurrence_pattern": null,
#   "user_id": "12345678-1234-1234-1234-123456789012",
#   "created_at": "2026-02-09T10:00:00Z",
#   "updated_at": "2026-02-09T10:00:00Z"
# }
```

**Get Task** (GET /api/{user_id}/tasks/{id}):
```bash
curl -X GET "http://localhost:8000/api/12345678-1234-1234-1234-123456789012/tasks/87654321-4321-4321-4321-210987654321" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Update Task** (PUT /api/{user_id}/tasks/{id}):
```bash
curl -X PUT "http://localhost:8000/api/12345678-1234-1234-1234-123456789012/tasks/87654321-4321-4321-4321-210987654321" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated test task",
    "completed": true
  }'
```

**Toggle Completion** (PATCH /api/{user_id}/tasks/{id}/complete):
```bash
curl -X PATCH "http://localhost:8000/api/12345678-1234-1234-1234-123456789012/tasks/87654321-4321-4321-4321-210987654321/complete" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Delete Task** (DELETE /api/{user_id}/tasks/{id}):
```bash
curl -X DELETE "http://localhost:8000/api/12345678-1234-1234-1234-123456789012/tasks/87654321-4321-4321-4321-210987654321" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Expected response: 204 No Content (empty body)
```

---

## Step 10: Run Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_tasks.py

# Run with verbose output
pytest -v

# Run tests matching a pattern
pytest -k "test_create_task"
```

**Expected Output**:
```
============================= test session starts ==============================
collected 25 items

tests/test_auth.py ....                                                  [ 16%]
tests/test_tasks.py ....................                                 [ 96%]
tests/test_user_isolation.py .                                           [100%]

============================== 25 passed in 2.34s ===============================
```

---

## Troubleshooting

### Issue: "DATABASE_URL environment variable is not set"

**Solution**:
1. Verify `.env` file exists in backend directory
2. Check that `DATABASE_URL` is set in `.env`
3. Restart the server after updating `.env`

### Issue: "Failed to connect to database"

**Possible Causes**:
- Invalid DATABASE_URL format
- Network connectivity issues
- Neon database is paused (free tier auto-pauses after inactivity)

**Solution**:
1. Verify DATABASE_URL is correct (copy from Neon Console)
2. Test connection with `psql` (see Step 4.3)
3. Check Neon Console - database may need to be resumed
4. Ensure `?sslmode=require` is in connection string

### Issue: "Could not validate credentials" (401 Unauthorized)

**Possible Causes**:
- JWT token is missing or malformed
- BETTER_AUTH_SECRET mismatch between frontend and backend
- JWT token has expired

**Solution**:
1. Verify `Authorization: Bearer <token>` header is included
2. Check that BETTER_AUTH_SECRET matches frontend
3. Generate a new JWT token (tokens expire after 1 hour by default)
4. Verify token format: should be three base64 strings separated by dots

### Issue: "Task not found" (404) when accessing own task

**Possible Causes**:
- Task ID is incorrect
- JWT token user_id doesn't match task owner
- Task was deleted

**Solution**:
1. Verify task ID is correct (copy from create response)
2. Check JWT token user_id matches task user_id
3. List all tasks to verify task exists

### Issue: Port 8000 already in use

**Solution**:
```bash
# Find process using port 8000
# On macOS/Linux:
lsof -i :8000

# On Windows:
netstat -ano | findstr :8000

# Kill the process or use a different port
uvicorn app.main:app --reload --port 8001
```

### Issue: Module not found errors

**Solution**:
```bash
# Verify virtual environment is activated
which python  # Should show venv path

# Reinstall dependencies
pip install -r requirements.txt

# If still failing, recreate virtual environment
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

## Development Workflow

### Making Code Changes

1. Edit code in `backend/app/` directory
2. Server auto-reloads (if `--reload` flag is used)
3. Test changes via API docs or curl
4. Run tests: `pytest`
5. Commit changes: `git add . && git commit -m "Description"`

### Adding New Dependencies

```bash
# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# Or manually add to requirements.txt with version
echo "package-name>=1.0.0" >> requirements.txt
```

### Database Schema Changes

**Phase II**: Schema is stable, no changes expected

**Phase III+**: Use Alembic migrations
```bash
# Install Alembic
pip install alembic

# Initialize Alembic
alembic init alembic

# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

---

## Production Deployment

### Environment Variables for Production

```env
# Use production database URL
DATABASE_URL=postgresql://prod_user:prod_pass@prod-host/prod_db?sslmode=require

# Use strong secret (different from development)
BETTER_AUTH_SECRET=<production-secret-32-bytes-or-more>

# Production settings
DEBUG=false
LOG_LEVEL=WARNING
CORS_ORIGINS=https://yourdomain.com
```

### Running in Production

```bash
# Install production server
pip install gunicorn

# Run with Gunicorn (multiple workers)
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -

# Or use Docker (see Dockerfile in backend directory)
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```

---

## Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **SQLModel Documentation**: https://sqlmodel.tiangolo.com/
- **Neon Documentation**: https://neon.tech/docs/
- **API Specification**: See `specs/001-backend-api/contracts/openapi.yaml`
- **Data Model**: See `specs/001-backend-api/data-model.md`
- **Implementation Plan**: See `specs/001-backend-api/plan.md`

---

## Next Steps

1. ✅ Backend API is running locally
2. ⏭️ Start frontend application (see frontend README)
3. ⏭️ Test end-to-end flow (register → login → create task → view task)
4. ⏭️ Run integration tests
5. ⏭️ Deploy to production

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error logs in terminal
3. Check Neon Console for database status
4. Verify environment variables are set correctly
5. Consult the implementation plan and data model documentation

**Happy coding! 🚀**
