'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/theme-context';
import {
  HomeIcon,
  PlusCircleIcon,
  FolderIcon,
  CalendarIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme, setTheme, availableThemes } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.theme-dropdown')) {
        setThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'All Tasks', href: '/dashboard', icon: FolderIcon },
    { name: 'Today', href: '/dashboard/today', icon: CalendarIcon },
    { name: 'This Week', href: '/dashboard/week', icon: CalendarIcon },
    { name: 'Completed', href: '/dashboard/completed', icon: BellIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  const categories = [
    { name: 'Work', color: 'blue', count: 12 },
    { name: 'Personal', color: 'green', count: 8 },
    { name: 'Shopping', color: 'orange', count: 5 },
    { name: 'Urgent', color: 'red', count: 3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs bg-[rgba(26,35,71,0.85)] backdrop-blur-md border-r border-[rgba(255,22,22,0.3)] shadow-xl">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Quick Action */}
              <div className="px-4 mb-6">
                <button className="w-full btn-grad flex items-center justify-center">
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  New Task
                </button>
              </div>

              <div className="flex items-center justify-between px-4">
                <Link href="/dashboard" className="text-xl font-bold text-white text-shadow-[0_0_10px_rgba(255,22,22,0.5)]">
                  Todo App
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-md text-white hover:bg-[rgba(255,22,22,0.2)]"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 px-2">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Views
                </h3>
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 text-base font-medium rounded-md text-white hover:bg-[rgba(255,22,22,0.2)] transition-colors"
                    >
                      <item.icon className="mr-3 h-6 w-6 text-white" aria-hidden="true" />
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-[rgba(255,22,22,0.3)] my-4"></div>

                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center px-3 py-2">
                      <div className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-3`}></div>
                      <span className="flex-1 text-base font-medium text-white">{category.name}</span>
                      <span className="text-sm text-gray-300">{category.count}</span>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
            <div className="border-t border-[rgba(255,22,22,0.3)] p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">John Doe</p>
                  <div className="relative theme-dropdown">
                    <button
                      onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                      className="text-xs text-gray-300 hover:text-white"
                    >
                      Change Theme
                    </button>
                    {themeDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-64 bg-[rgba(26,35,71,0.9)] border border-[rgba(255,22,22,0.3)] rounded-lg shadow-lg z-50 backdrop-blur-md">
                        <div className="py-2">
                          <div className="px-4 py-2 text-white font-semibold border-b border-[rgba(255,22,22,0.2)]">
                            Themes
                          </div>
                          {availableThemes.map((availableTheme) => (
                            <button
                              key={availableTheme}
                              onClick={() => {
                                setTheme(availableTheme);
                                setThemeDropdownOpen(false);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                theme === availableTheme
                                  ? 'bg-[rgba(255,22,22,0.3)] text-white'
                                  : 'text-gray-300 hover:bg-[rgba(255,22,22,0.1)]'
                              }`}
                            >
                              {availableTheme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-[rgba(255,22,22,0.3)] bg-[rgba(26,35,71,0.85)] backdrop-blur-md shadow-sm">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Quick Action */}
            <div className="px-4 mb-6">
              <button className="w-full btn-grad flex items-center justify-center hover:scale-[1.02]">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                New Task
              </button>
            </div>

            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/dashboard" className="text-xl font-bold text-white text-shadow-[0_0_10px_rgba(255,22,22,0.5)]">
                Todo App
              </Link>
            </div>

            <div className="mt-5 flex-1 px-2">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Views
              </h3>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:bg-[rgba(255,22,22,0.2)] transition-colors"
                  >
                    <item.icon className="mr-3 h-6 w-6 text-white" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-[rgba(255,22,22,0.3)] my-4"></div>

              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center px-3 py-2">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-3`}></div>
                    <span className="flex-1 text-sm font-medium text-white">{category.name}</span>
                    <span className="text-xs text-gray-300">{category.count}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-[rgba(255,22,22,0.3)] p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-10 w-10 text-white" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <div className="relative theme-dropdown">
                  <button
                    onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                    className="text-xs text-gray-300 hover:text-white truncate"
                  >
                    {theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                  {themeDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-[rgba(26,35,71,0.9)] border border-[rgba(255,22,22,0.3)] rounded-lg shadow-lg z-50 backdrop-blur-md">
                      <div className="py-2">
                        <div className="px-4 py-2 text-white font-semibold border-b border-[rgba(255,22,22,0.2)]">
                          Themes
                        </div>
                        {availableThemes.map((availableTheme) => (
                          <button
                            key={availableTheme}
                            onClick={() => {
                              setTheme(availableTheme);
                              setThemeDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              theme === availableTheme
                                ? 'bg-[rgba(255,22,22,0.3)] text-white'
                                : 'text-gray-300 hover:bg-[rgba(255,22,22,0.1)]'
                            }`}
                          >
                            {availableTheme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pl-72 flex flex-col flex-1">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-10 bg-[rgba(0,0,0,0.7)] backdrop-blur-md border-b border-[rgba(255,22,22,0.3)]">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <button
              type="button"
              className="md:hidden mr-2 p-2 rounded-md text-white hover:bg-[rgba(255,22,22,0.2)]"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex-1 flex justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-white">My Tasks</h1>
              </div>

              <div className="ml-4 flex items-center space-x-4">
                {/* Search bar */}
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-64 pl-10 pr-4 py-2 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.2)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Theme toggle */}
                <div className="relative theme-dropdown">
                  <button
                    onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                    className="p-2 rounded-full hover:bg-[rgba(255,22,22,0.2)] transition-colors flex items-center"
                    aria-label="Change theme"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </button>
                  {themeDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[rgba(26,35,71,0.9)] border border-[rgba(255,22,22,0.3)] rounded-lg shadow-lg z-50 backdrop-blur-md">
                      <div className="py-2">
                        <div className="px-4 py-2 text-white font-semibold border-b border-[rgba(255,22,22,0.2)]">
                          Themes
                        </div>
                        {availableThemes.map((availableTheme) => (
                          <button
                            key={availableTheme}
                            onClick={() => {
                              setTheme(availableTheme);
                              setThemeDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              theme === availableTheme
                                ? 'bg-[rgba(255,22,22,0.3)] text-white'
                                : 'text-gray-300 hover:bg-[rgba(255,22,22,0.1)]'
                            }`}
                          >
                            {availableTheme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative ml-3">
                  <button className="flex text-sm rounded-full focus:outline-none">
                    <UserCircleIcon className="h-8 w-8 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;