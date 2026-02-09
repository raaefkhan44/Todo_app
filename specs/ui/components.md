# UI Components Specification

This document defines the UI components for the Todo application.

## Components

### TodoItem Component
- Props:
  - id: number
  - title: string
  - description: string
  - completed: boolean
  - onToggle: function
  - onDelete: function
- Display: Shows todo title with checkbox and delete button
- Functionality: Allows toggling completion status and deleting the item

### TodoList Component
- Props:
  - todos: array of TodoItem objects
  - onToggle: function
  - onDelete: function
- Display: Renders multiple TodoItem components
- Functionality: Shows all todos in a list format

### AddTodoForm Component
- Props:
  - onAdd: function
- Display: Input field for title, textarea for description, and submit button
- Functionality: Allows adding new todos to the list

### FilterControls Component
- Props:
  - filter: string
  - onFilterChange: function
- Display: Buttons for 'All', 'Active', 'Completed' filters
- Functionality: Allows filtering the displayed todos

## Pages

### Todo App Page
- Contains: AddTodoForm, FilterControls, TodoList
- Layout: Header, main content area with form and list
- Functionality: Complete todo management interface