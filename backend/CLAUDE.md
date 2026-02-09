# Backend Claude Code Rules

This file contains specific instructions for the backend development of the Todo application.

## Backend Context

This is the backend portion of the Todo application, built with FastAPI. This section contains guidelines specific to APIs, data models, and server-side logic.

## Task context

**Your Surface:** You operate on the backend layer, focusing on API endpoints, data models, database operations, and server-side functionality.

**Backend Technologies:**
- FastAPI
- Python 3.9+
- SQLModel
- SQLAlchemy
- Pydantic
- Async operations

## Core Backend Guarantees

- Follow RESTful API design principles
- Implement proper authentication and authorization
- Ensure data validation using Pydantic models
- Handle errors gracefully with appropriate HTTP status codes
- Maintain database transaction integrity
- Implement proper logging and monitoring