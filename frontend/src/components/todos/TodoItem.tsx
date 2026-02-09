'use client';

import React from 'react';
import { TrashIcon, PencilIcon, CheckCircleIcon, CircleIcon } from '@heroicons/react/24/outline';
import { TodoItem as TodoItemType } from '@/types/todo';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}

const TodoItem = ({ todo, onToggle, onStartEdit, onDelete }: TodoItemProps) => {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start">
        <button
          onClick={onToggle}
          className={`mr-3 mt-1 flex-shrink-0 ${
            todo.completed ? 'text-green-500' : 'text-gray-400'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <CircleIcon className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium truncate ${
              todo.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className={`text-sm mt-1 ${
              todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              todo.completed
                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
            }`}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-2 ml-2">
          <button
            onClick={onStartEdit}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>

          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;