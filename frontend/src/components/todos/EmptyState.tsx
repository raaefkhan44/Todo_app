import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  onCreateTodo: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateTodo }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[rgba(255,22,22,0.2)]">
        <PlusIcon className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-white">No tasks yet!</h3>
      <p className="mt-2 text-sm text-gray-300">
        Create your first task to get started
      </p>
      <div className="mt-6">
        <button
          onClick={onCreateTodo}
          className="btn-grad flex items-center mx-auto"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Task
        </button>
      </div>
    </div>
  );
};

export default EmptyState;