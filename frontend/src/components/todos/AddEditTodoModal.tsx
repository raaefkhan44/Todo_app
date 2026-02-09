import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, PlusIcon, TagIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, FlagIcon } from '@heroicons/react/24/solid';

interface Todo {
  id?: string;
  title: string;
  description: string;
  completed?: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt?: string;
}

interface AddEditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Todo) => void;
  initialData?: Todo;
}

const AddEditTodoModal: React.FC<AddEditTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>(
    initialData?.subtasks || []
  );
  const [newSubtask, setNewSubtask] = useState('');

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'high', label: 'High', color: 'text-red-500' }
  ];

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      };
      setSubtasks([...subtasks, newSubtaskObj]);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todoData: Todo = {
      id: initialData?.id,
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      category: category || undefined,
      tags: tags.length > 0 ? tags : undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined
    };

    onSubmit(todoData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[rgba(26,35,71,0.95)] backdrop-blur-md border border-[rgba(255,22,22,0.5)] rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {initialData ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-[rgba(0,0,0,0.3)] text-white"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-[rgba(0,0,0,0.3)] text-white"
                  placeholder="Add details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-[rgba(0,0,0,0.3)] text-white"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value as 'low' | 'medium' | 'high')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                        priority === option.value
                          ? `bg-gradient-to-r from-red-500 to-red-700 text-white border-red-500`
                          : `bg-[rgba(0,0,0,0.3)] text-gray-300 border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,22,22,0.2)]`
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <FlagIcon className={`h-4 w-4 mr-1 ${option.color}`} />
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-[rgba(0,0,0,0.3)] text-white appearance-none"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[rgba(26,35,71,0.95)]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-[rgba(0,0,0,0.3)] text-white"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn-grad-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(255,22,22,0.2)] text-red-400"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Subtasks
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                    className="flex-1 px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-[rgba(0,0,0,0.3)] text-white"
                    placeholder="Add a subtask..."
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="btn-grad-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                {subtasks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center justify-between p-2 bg-[rgba(0,0,0,0.3)] rounded-lg">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSubtask(subtask.id)}
                            className="mr-2"
                          >
                            {subtask.completed ? (
                              <CheckCircleIcon className="h-4 w-4 text-red-500" />
                            ) : (
                              <div className="h-4 w-4 border border-[rgba(255,255,255,0.2)] rounded bg-transparent" />
                            )}
                          </button>
                          <span className={`${subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                            {subtask.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(subtask.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outlined"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-grad"
                >
                  {initialData ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEditTodoModal;