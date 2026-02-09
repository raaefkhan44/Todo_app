// Type definitions for todo-related entities

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  userId: string;
}

export interface TodoFormValues {
  title: string;
  description: string;
}

export interface TodoState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
}

export interface TodoFilters {
  status: 'all' | 'active' | 'completed';
  searchQuery?: string;
}