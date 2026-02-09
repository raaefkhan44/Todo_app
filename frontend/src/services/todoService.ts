// Todo API service for handling todo-related operations
import { TodoItem } from '@/types/todo';
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from './api-client';

// Get all todos for a user
export const getTodos = async (userId: string): Promise<TodoItem[]> => {
  try {
    return await apiGet<TodoItem[]>(`/api/${userId}/todos`);
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Get a specific todo
export const getTodoById = async (userId: string, todoId: string): Promise<TodoItem> => {
  try {
    return await apiGet<TodoItem>(`/api/${userId}/todos/${todoId}`);
  } catch (error) {
    console.error(`Error fetching todo ${todoId}:`, error);
    throw error;
  }
};

// Create a new todo
export const createTodo = async (userId: string, todoData: Partial<TodoItem>): Promise<TodoItem> => {
  try {
    return await apiPost<TodoItem>(`/api/${userId}/todos`, todoData);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// Update a todo
export const updateTodo = async (userId: string, todoId: string, todoData: Partial<TodoItem>): Promise<TodoItem> => {
  try {
    return await apiPut<TodoItem>(`/api/${userId}/todos/${todoId}`, todoData);
  } catch (error) {
    console.error(`Error updating todo ${todoId}:`, error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (userId: string, todoId: string): Promise<void> => {
  try {
    await apiDelete<void>(`/api/${userId}/todos/${todoId}`);
  } catch (error) {
    console.error(`Error deleting todo ${todoId}:`, error);
    throw error;
  }
};

// Toggle todo completion status
export const toggleTodoCompletion = async (userId: string, todoId: string): Promise<TodoItem> => {
  try {
    return await apiPatch<TodoItem>(`/api/${userId}/todos/${todoId}/complete`);
  } catch (error) {
    console.error(`Error toggling completion for todo ${todoId}:`, error);
    throw error;
  }
};

// Bulk operations
export const markAllTodosAsCompleted = async (userId: string): Promise<TodoItem[]> => {
  try {
    // This would typically be a separate endpoint, but for now we'll update each individually
    const todos = await getTodos(userId);
    const completedTodos = [];

    for (const todo of todos) {
      if (!todo.completed) {
        const updatedTodo = await updateTodo(userId, todo.id, { ...todo, completed: true });
        completedTodos.push(updatedTodo);
      }
    }

    return completedTodos;
  } catch (error) {
    console.error('Error marking all todos as completed:', error);
    throw error;
  }
};