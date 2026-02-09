# UI Pages Specification

This document defines the pages for the Todo application.

## Main Todo Page

### URL: /
### Components:
- Header with app title
- AddTodoForm
- FilterControls
- TodoList

### Functionality:
- Display all todos
- Add new todos
- Toggle todo completion status
- Delete todos
- Filter todos (All/Active/Completed)

### Layout:
```
┌─────────────────┐
│   Todo App      │
├─────────────────┤
│ Add Todo Form   │
├─────────────────┤
│ Filter Controls │
├─────────────────┤
│   Todo List     │
│  - Item 1       │
│  - Item 2       │
│  - Item 3       │
└─────────────────┘
```

## Authentication Pages

### Login Page (Future Enhancement)
### URL: /login
### Components:
- LoginForm
- Link to Register page

### Register Page (Future Enhancement)
### URL: /register
### Components:
- RegisterForm
- Link to Login page

## Responsive Design
- Mobile: Single column layout
- Tablet: Single column layout
- Desktop: Single column layout with wider components