'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'midnight-professional' | 'ocean-breeze' | 'lavender-dream' | 'forest-zen' | 'sunset-warmth' | 'slate-professional';

interface ThemeContextType {
  theme: Theme;
  systemTheme: Theme | null;
  isThemeChanging: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('midnight-professional');
  const [systemTheme, setSystemTheme] = useState<Theme | null>(null);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  const availableThemes: Theme[] = [
    'midnight-professional',
    'ocean-breeze',
    'lavender-dream',
    'forest-zen',
    'sunset-warmth',
    'slate-professional'
  ];

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to first theme
      setTheme('midnight-professional');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme) {
      document.documentElement.classList.remove(...availableThemes);
      document.documentElement.classList.add(theme);

      // Add card-bg class to body for consistent card backgrounds
      document.body.classList.add('card-bg');

      localStorage.setItem('theme', theme);
    }

    // Clean up on unmount
    return () => {
      document.body.classList.remove('card-bg');
    };
  }, [theme, availableThemes]);

  const toggleTheme = () => {
    setIsThemeChanging(true);

    // Cycle through themes
    const currentIndex = availableThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setTheme(availableThemes[nextIndex]);

    // Reset the changing state after a short delay to allow for transition
    setTimeout(() => {
      setIsThemeChanging(false);
    }, 300);
  };

  const value = {
    theme,
    systemTheme,
    isThemeChanging,
    toggleTheme,
    setTheme,
    availableThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};