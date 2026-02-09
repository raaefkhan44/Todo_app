'use client';

import React, { useState } from 'react';
import {
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  TagIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
}

const DashboardSidebar = ({ sidebarOpen }: DashboardSidebarProps) => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work', color: 'bg-blue-500', count: 12 },
    { id: 2, name: 'Personal', color: 'bg-green-500', count: 8 },
    { id: 3, name: 'Shopping', color: 'bg-purple-500', count: 5 },
  ]);

  const views = [
    { id: 'all', name: 'All Tasks', icon: HomeIcon, count: 25 },
    { id: 'today', name: 'Today', icon: CalendarDaysIcon, count: 7 },
    { id: 'week', name: 'This Week', icon: ClockIcon, count: 15 },
    { id: 'completed', name: 'Completed', icon: CheckCircleIcon, count: 42 },
  ];

  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: newCategory.trim(),
          color: randomColor,
          count: 0
        }
      ]);
      setNewCategory('');
    }
  };

  return (
    <aside
      className={`fixed md:relative z-30 h-[calc(100vh-4rem)] w-72 bg-[rgba(26,35,71,0.85)] backdrop-blur-md border-r border-blue-500/30 overflow-y-auto transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="p-4">
        <div className="mb-6">
          <button className="btn-grad-full flex items-center justify-center mb-4">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Task
          </button>
        </div>

        <nav className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Views</h3>
          <ul>
            {views.map((view) => (
              <li key={view.id} className="mb-1">
                <a
                  href="#"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    view.id === 'all'
                      ? 'bg-blue-500/20 text-blue-400 border-l-4 border-blue-500'
                      : 'text-gray-300 hover:bg-blue-500/10 hover:text-white'
                  }`}
                >
                  <view.icon className="mr-3 h-5 w-5" />
                  {view.name}
                  {view.count > 0 && (
                    <span className="ml-auto inline-block bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {view.count}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
            <TagIcon className="h-4 w-4 text-gray-400" />
          </div>

          <ul className="mb-4">
            {categories.map((category) => (
              <li key={category.id} className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-blue-500/10 hover:text-white"
                >
                  <span className={`w-3 h-3 rounded-full ${category.color} mr-3`}></span>
                  {category.name}
                  {category.count > 0 && (
                    <span className="ml-auto inline-block bg-gray-700 text-gray-300 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {category.count}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add category"
              className="flex-1 bg-black/40 border border-gray-600 rounded-l-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="btn-grad-sm rounded-l-none rounded-r-md px-3"
            >
              <PlusCircleIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 p-4 border-t border-gray-700">
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-blue-500/10 hover:text-white"
              >
                <Cog6ToothIcon className="mr-3 h-5 w-5" />
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-blue-500/10 hover:text-white"
              >
                <QuestionMarkCircleIcon className="mr-3 h-5 w-5" />
                Help & Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;