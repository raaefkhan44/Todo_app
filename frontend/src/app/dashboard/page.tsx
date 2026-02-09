'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/UpdatedDashboardLayout';
import TodoCard from '@/components/todos/TodoCard';
import EmptyState from '@/components/todos/EmptyState';
import AddEditTodoModal from '@/components/todos/AddEditTodoModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/contexts/toast-context';

// Define the Todo type to match our new components
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

const DashboardPage = () => {
  // For now, we'll use mock data. In a real app, this would come from an API
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Learn Next.js',
      description: 'Complete the official Next.js tutorial',
      completed: false,
      priority: 'medium',
      category: 'work',
      tags: ['learning', 'web-dev'],
      subtasks: [
        { id: 's1', title: 'Setup development environment', completed: true },
        { id: 's2', title: 'Create first component', completed: false },
        { id: 's3', title: 'Deploy to Vercel', completed: false }
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Build Todo App',
      description: 'Create a beautiful and functional todo application',
      completed: true,
      priority: 'high',
      category: 'personal',
      tags: ['project', 'react'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Deploy Application',
      description: 'Deploy the application to production',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      category: 'work',
      tags: ['deployment', 'production'],
      createdAt: new Date().toISOString(),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { addToast } = useToast();

  // Add a new todo
  const addTodo = (todoData: Todo) => {
    if (!todoData.title.trim()) {
      addToast('Title is required', 'error');
      return;
    }

    const newTodo: Todo = {
      ...todoData,
      id: (Date.now() + Math.random()).toString(), // More unique ID
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    addToast('Task created successfully!', 'success');
  };

  // Update an existing todo
  const updateTodo = (todoData: Todo) => {
    if (!todoData.title.trim()) {
      addToast('Title is required', 'error');
      return;
    }

    setTodos(todos.map(todo => todo.id === todoData.id ? { ...todoData } : todo));
    addToast('Task updated successfully!', 'info');
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));

    const todo = todos.find(t => t.id === id);
    if (todo) {
      addToast(
        `${todo.completed ? 'Reopened' : 'Completed'} task: ${todo.title}`,
        todo.completed ? 'info' : 'success'
      );
    }
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    const deletedTodo = todos.find(todo => todo.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    if (deletedTodo) {
      addToast(`Deleted task: ${deletedTodo.title}`, 'error');
    }
  };

  const handleCreateTodo = () => {
    setEditingTodo(null);
    setShowModal(true);
    addToast('Creating new task...', 'info');
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowModal(true);
    addToast('Editing task...', 'info');
  };

  const handleSubmitTodo = (todoData: Todo) => {
    if (editingTodo) {
      updateTodo({ ...todoData, id: editingTodo.id });
    } else {
      addTodo(todoData);
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <button
            onClick={handleCreateTodo}
            className="btn-grad flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Task
          </button>
        </div>

        {todos.length === 0 ? (
          <EmptyState onCreateTodo={handleCreateTodo} />
        ) : (
          <div className="space-y-4">
            {todos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onEdit={handleEditTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}

        {/* Enhanced Add/Edit Todo Modal */}
        <AddEditTodoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitTodo}
          initialData={editingTodo || undefined}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;