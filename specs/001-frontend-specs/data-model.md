# Data Model: Frontend Specifications for Phase II Todo Application

**Date**: 2026-01-13
**Feature**: Frontend Specifications for Phase II Todo Application
**Branch**: 001-frontend-specs

## Overview

This document defines the frontend data models and state structures for the Phase II Todo application. These models represent the data as it exists in the frontend application state, not the backend database structure.

## User Session Entity

**Name**: UserSession
**Description**: Represents the authenticated state with JWT token and user identity
**Fields**:
- id: string (user identifier from auth system)
- email: string (user email address)
- name: string (user display name)
- isAuthenticated: boolean (whether user is currently authenticated)
- token: string (JWT token for API requests)
- expiresAt: Date (token expiration time)

**Validation Rules**:
- email must be valid email format
- isAuthenticated must be boolean
- token must be present when authenticated

**State Transitions**:
- Unauthenticated → Authenticating → Authenticated → SessionExpired/LoggedOut

## Todo Item Entity

**Name**: TodoItem
**Description**: Represents a task with title, description, completion status, and metadata
**Fields**:
- id: string (unique identifier from backend)
- title: string (todo title, required)
- description: string (optional todo description)
- completed: boolean (completion status)
- createdAt: Date (when todo was created)
- updatedAt: Date (when todo was last updated)
- userId: string (owner of the todo)

**Validation Rules**:
- title must not be empty
- completed must be boolean
- createdAt and updatedAt must be valid dates
- userId must match authenticated user

**State Transitions**:
- Created → Active → Completed/Active → Updated → Deleted

## UI Component State

**Name**: UIComponentState
**Description**: State for various UI components like loading states, form states
**Fields**:
- loading: boolean (indicates loading state)
- error: string | null (error message if any)
- success: string | null (success message if any)
- formErrors: Record<string, string> (form validation errors)

**Validation Rules**:
- Only one of error or success should be active at a time (in some contexts)
- formErrors keys must correspond to actual form fields

## Theme State

**Name**: ThemeState
**Description**: Represents the current theme (light/dark) and provides toggle functionality
**Fields**:
- currentTheme: 'light' | 'dark' (current theme setting)
- systemTheme: 'light' | 'dark' | null (user's system preference)
- isThemeChanging: boolean (indicates if theme transition is in progress)

**Validation Rules**:
- currentTheme must be either 'light' or 'dark'
- isThemeChanging must be boolean

**State Transitions**:
- Initial → Light/Dark → Toggle Requested → Theme Changing → New Theme Applied

## Form State Models

### Login Form State
**Fields**:
- email: string (user email input)
- password: string (user password input)
- rememberMe: boolean (whether to remember login)

**Validation Rules**:
- email must be valid email format
- password must meet minimum length requirements

### Signup Form State
**Fields**:
- email: string (user email input)
- password: string (user password input)
- confirmPassword: string (password confirmation)
- name: string (user display name)

**Validation Rules**:
- email must be valid email format
- password must meet minimum length requirements
- confirmPassword must match password

### Todo Form State
**Fields**:
- title: string (todo title input)
- description: string (todo description input)
- isEditing: boolean (whether editing existing todo)

**Validation Rules**:
- title must not be empty
- isEditing must be boolean