'use client';

import React, { ReactNode } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: ReactNode;
  showThemeToggle?: boolean;
  showHeader?: boolean;
}

const MainLayout = ({
  children,
  showThemeToggle = true,
  showHeader = true
}: MainLayoutProps) => {
  const { theme, toggleTheme, isThemeChanging } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-[rgba(0,0,0,0.7)] backdrop-blur-md border-b border-[rgba(255,22,22,0.3)]">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white text-shadow-[0_0_10px_rgba(255,22,22,0.5)]">Todo App</h1>
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[rgba(255,22,22,0.2)] transition-colors"
                aria-label="Change theme"
              >
                <SunIcon className="h-5 w-5 text-white" />
              </button>
            )}
          </div>
        </header>
      )}

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="mt-auto py-6 border-t border-[rgba(255,22,22,0.3)] text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Todo App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;