'use client';

import React from 'react';
import { CheckCircleIcon, CircleIcon } from '@heroicons/react/24/outline';

interface TodoCompletionToggleProps {
  completed: boolean;
  onToggle: () => void;
  className?: string;
}

const TodoCompletionToggle = ({ completed, onToggle, className = '' }: TodoCompletionToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`${className} ${
        completed ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'
      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full`}
      aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {completed ? (
        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <CircleIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};

export default TodoCompletionToggle;