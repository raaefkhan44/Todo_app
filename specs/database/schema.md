# Database Schema Specification

This document defines the database schema for the Todo application.

## Tables

### Todos Table
- id: INTEGER (Primary Key, Auto-increment)
- title: VARCHAR(255) (Not Null)
- description: TEXT (Nullable)
- completed: BOOLEAN (Default False)
- created_at: TIMESTAMP (Default Current Timestamp)
- updated_at: TIMESTAMP (Default Current Timestamp, Updates on Change)

### Users Table
- id: INTEGER (Primary Key, Auto-increment)
- username: VARCHAR(255) (Unique, Not Null)
- email: VARCHAR(255) (Unique, Not Null)
- password_hash: VARCHAR(255) (Not Null)
- created_at: TIMESTAMP (Default Current Timestamp)
- updated_at: TIMESTAMP (Default Current Timestamp, Updates on Change)

## Relationships
- Users to Todos: One-to-Many (One user can have many todos)