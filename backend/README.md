# Backend API - Todo Application

Backend REST API for the Todo application built with FastAPI, SQLModel, and Neon PostgreSQL.

## Quick Start

For detailed setup instructions, see: [specs/001-backend-api/quickstart.md](../specs/001-backend-api/quickstart.md)

## Prerequisites

- Python 3.11+
- Neon PostgreSQL account and DATABASE_URL
- BETTER_AUTH_SECRET (shared with frontend)

## Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET
```

## Environment Variables

Required:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Shared secret for JWT verification (must match frontend)

Optional:
- `LOG_LEVEL`: Logging verbosity (default: INFO)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: http://localhost:3000)
- `DEBUG`: Enable debug mode (default: false)

## Running Locally

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server with Gunicorn (if installed)
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Running with Docker

```bash
# From repository root
docker-compose up backend

# Or build and run manually
cd backend
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json
- **Health Check**: http://localhost:8000/health

## Testing

```bash
# Run authentication tests
python -m tests.manual_auth_test

# Run security tests (requires two JWT tokens)
python -m tests.manual_security_test

# Run validation tests
python -m tests.manual_validation_test
```

See [tests/README.md](tests/README.md) for detailed testing procedures.

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection
│   ├── models/              # SQLModel database models
│   │   ├── user.py          # User model
│   │   ├── task.py          # Task model
│   │   └── session.py       # Session model
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── task.py          # Task schemas
│   │   └── error.py         # Error schemas
│   ├── repositories/        # Data access layer
│   │   └── task.py          # Task repository (user isolation)
│   ├── routers/             # API endpoints
│   │   └── tasks.py         # Task CRUD endpoints
│   ├── dependencies/        # FastAPI dependencies
│   │   ├── auth.py          # JWT verification
│   │   └── database.py      # Database session
│   └── core/                # Core utilities
│       ├── security.py      # JWT utilities
│       ├── exceptions.py    # Exception handlers
│       └── logging.py       # Logging configuration
├── tests/                   # Test suite
│   ├── README.md            # Testing procedures
│   ├── manual_auth_test.py  # Authentication tests
│   ├── manual_security_test.py  # User isolation tests
│   └── manual_validation_test.py  # Validation tests
├── .env.example             # Example environment variables
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container definition
└── README.md                # This file
```

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Tasks

- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks` - List all tasks
- `GET /api/{user_id}/tasks/{id}` - Get task by ID
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

**Note**: The `user_id` in the URL is ignored. The authenticated user's ID from the JWT token is used for all operations.

## Security Features

- **JWT Authentication**: All endpoints require valid JWT tokens
- **User Isolation**: Users can only access their own tasks
- **Stateless**: No server-side session storage
- **Input Validation**: Pydantic schemas validate all input
- **Error Handling**: Production-safe error messages (no sensitive data exposure)
- **Logging**: Sensitive data filtered from logs

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Verify `.env` file exists in backend directory
- Check that `DATABASE_URL` is set in `.env`
- Restart the server after updating `.env`

### "Failed to connect to database"
- Verify DATABASE_URL is correct (copy from Neon Console)
- Check network connectivity
- Ensure Neon database is not paused (free tier auto-pauses)
- Verify `?sslmode=require` is in connection string

### "Could not validate credentials" (401)
- Verify JWT token is included in Authorization header
- Check that BETTER_AUTH_SECRET matches frontend
- Generate a new JWT token (tokens expire after 1 hour)
- Verify token format: `Authorization: Bearer <token>`

### "Task not found" (404) when accessing own task
- Verify task ID is correct
- Check JWT token user_id matches task owner
- Verify task wasn't deleted

### Port 8000 already in use
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Use different port
uvicorn app.main:app --reload --port 8001
```

## Documentation

- [Feature Specification](../specs/001-backend-api/spec.md)
- [Implementation Plan](../specs/001-backend-api/plan.md)
- [Data Model](../specs/001-backend-api/data-model.md)
- [API Contracts](../specs/001-backend-api/contracts/openapi.yaml)
- [Quickstart Guide](../specs/001-backend-api/quickstart.md)
- [Testing Procedures](tests/README.md)

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints for all functions
- Document all public APIs with docstrings
- Keep functions focused and testable

### Adding New Endpoints
1. Define Pydantic schemas in `app/schemas/`
2. Add repository methods in `app/repositories/`
3. Create router endpoints in `app/routers/`
4. Register router in `app/main.py`
5. Add tests in `tests/`

### Database Migrations
Currently using `SQLModel.metadata.create_all()` for schema creation. For production schema changes, consider using Alembic:

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Production Deployment

### Environment Setup
- Use strong BETTER_AUTH_SECRET (32+ bytes)
- Set LOG_LEVEL=WARNING or ERROR
- Configure CORS_ORIGINS for your domain
- Use production DATABASE_URL

### Running in Production
```bash
# With Gunicorn
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -

# With Docker
docker-compose up -d backend
```

### Monitoring
- Health check endpoint: `GET /health`
- Check logs for errors: `docker-compose logs backend`
- Monitor database connection pool usage
- Set up alerts for 5xx errors

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [Quickstart Guide](../specs/001-backend-api/quickstart.md)
3. Check implementation plan and data model documentation
4. Review test procedures in `tests/README.md`

