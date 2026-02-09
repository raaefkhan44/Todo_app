'use client';

import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/theme-context';

const ThemeToggle = () => {
  const { theme, toggleTheme, isThemeChanging } = useTheme();

  // Determine if current theme is "dark" based on theme name
  const isDarkTheme = theme.includes('midnight') || theme.includes('slate');

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        isThemeChanging ? 'scale-95' : 'scale-100'
      } hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      <div className="relative w-6 h-6">
        {isDarkTheme ? (
          <MoonIcon className="w-6 h-6 text-blue-400 transition-transform duration-300" />
        ) : (
          <SunIcon className="w-6 h-6 text-yellow-400 transition-transform duration-300" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
