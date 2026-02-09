'use client';

import React, { useState } from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '../common/ThemeToggle';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-blue-500/30 h-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-white mr-4 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Todo App
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  searchExpanded
                    ? 'border-blue-500 bg-black/50 text-white'
                    : 'border-gray-600 bg-black/50 text-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                placeholder={searchExpanded ? "Search tasks..." : ""}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={toggleSearch}
                onBlur={() => {
                  if (!searchQuery) {
                    setTimeout(() => setSearchExpanded(false), 200);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <button className="text-gray-300 hover:text-white focus:outline-none">
              <BellIcon className="h-6 w-6" />
            </button>

            <button className="flex items-center text-white focus:outline-none">
              <UserCircleIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;