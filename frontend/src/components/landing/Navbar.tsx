'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/theme-context';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { theme, toggleTheme, setTheme, availableThemes } = useTheme();

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
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const themeNames = {
    'midnight-professional': 'Midnight Pro',
    'ocean-breeze': 'Ocean Breeze',
    'lavender-dream': 'Lavender Dream',
    'forest-zen': 'Forest Zen',
    'sunset-warmth': 'Sunset Warmth',
    'slate-professional': 'Slate Pro'
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgba(0,0,0,0.7)] backdrop-blur-md border-b border-[rgba(255,22,22,0.3)]">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-white text-shadow-[0_0_10px_rgba(255,22,22,0.5)]">
            Todo App
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-red-500 transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="btn-outlined"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-grad"
          >
            Get Started
          </Link>
          <div className="relative theme-dropdown">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-full hover:bg-[rgba(255,22,22,0.2)] transition-colors flex items-center"
              aria-label="Change theme"
            >
              <ComputerDesktopIcon className="h-5 w-5 text-white" />
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
                      {themeNames[availableTheme]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <div className="relative theme-dropdown">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-full hover:bg-[rgba(255,22,22,0.2)] transition-colors flex items-center"
              aria-label="Change theme"
            >
              <ComputerDesktopIcon className="h-5 w-5 text-white" />
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
                      {themeNames[availableTheme]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-2 rounded-md text-white hover:bg-[rgba(255,22,22,0.2)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgba(0,0,0,0.9)] border-t border-[rgba(255,22,22,0.3)] backdrop-blur-md">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-red-500 py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-[rgba(255,22,22,0.3)] flex flex-col space-y-3">
              <Link
                href="/login"
                className="btn-outlined"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-grad"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;