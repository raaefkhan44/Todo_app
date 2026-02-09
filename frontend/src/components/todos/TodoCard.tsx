import React, { useState } from 'react';
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  TagIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  category?: string;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
}

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoCard = ({ todo, onToggle, onEdit, onDelete }: TodoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = () => {
    switch (todo.priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return '';
    }
  };

  const completedSubtasks = todo.subtasks?.filter(subtask => subtask.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div
      className={`card-bg border border-blue-500/20 rounded-xl p-5 backdrop-blur-sm shadow-lg transition-all duration-300 ${
        todo.completed ? 'opacity-60' : 'hover:shadow-blue-500/20 hover:shadow-lg hover:-translate-y-1'
      } ${isHovered ? 'ring-2 ring-blue-500/50' : ''} ${
        todo.completed ? 'line-through' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 h-6 w-6 rounded border-2 flex items-center justify-center mr-3 mt-1 transition-all duration-300 ${
            todo.completed
              ? 'bg-blue-500 border-blue-500'
              : 'border-blue-400 bg-transparent hover:bg-blue-500/10'
          }`}
        >
          {todo.completed && (
            <CheckCircleIcon className="h-4 w-4 text-white" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`text-lg font-semibold ${
              todo.completed ? 'text-gray-400' : 'text-white'
            }`}>
              {todo.title}
            </h3>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(todo)}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {todo.description && (
            <p className={`mt-2 text-gray-300 ${todo.completed ? 'text-gray-500' : ''}`}>
              {todo.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {todo.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {todo.category}
              </span>
            )}

            {todo.priority && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todo.priority === 'high'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : todo.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {getPriorityText()}
              </span>
            )}

            {todo.dueDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                Due: {formatDate(todo.dueDate)}
              </span>
            )}

            {todo.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {todo.subtasks && todo.subtasks.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center text-sm text-gray-400 hover:text-white"
                >
                  Subtasks ({completedSubtasks}/{totalSubtasks})
                  {isExpanded ? (
                    <ChevronUpIcon className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </button>

                {totalSubtasks > 0 && (
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {todo.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-transparent border-gray-600"
                      />
                      <span className={`ml-2 text-sm ${
                        subtask.completed ? 'text-gray-500 line-through' : 'text-gray-400'
                      }`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoCard;