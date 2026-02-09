'use client';

import React, { useState } from 'react';
import TodoItemComponent from './TodoItem';
import { TodoItem } from '@/types/todo';

interface TodoListProps {
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onUpdateTodo: (id: string, title: string, description: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList = ({ todos, onToggleTodo, onUpdateTodo, onDeleteTodo }: TodoListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Handle edit start
  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditForm({ title: todo.title, description: todo.description });
  };

  // Handle edit cancel
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '' });
  };

  // Handle edit save
  const saveEdit = (id: string) => {
    if (editForm.title.trim()) {
      onUpdateTodo(id, editForm.title, editForm.description);
      setEditingId(null);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Show empty state if no todos
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Get started by creating your first task
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {todos.map((todo) => (
        <li key={todo.id}>
          {editingId === todo.id ? (
            // Edit form
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="mb-3">
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Task title"
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Task description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="px-3 py-1 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // Todo item display
            <TodoItemComponent
              todo={todo}
              onToggle={() => onToggleTodo(todo.id)}
              onStartEdit={() => startEditing(todo)}
              onDelete={() => onDeleteTodo(todo.id)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;