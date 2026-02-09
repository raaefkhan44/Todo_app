'use client';

import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedLoginForm from '@/components/auth/EnhancedLoginForm';

const LoginPage = () => {
  return (
    <MainLayout showHeader={true} showThemeToggle={true}>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 p-8 card-bg backdrop-blur-md border border-blue-500/30 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Sign in to your account
            </p>
            <p className="mt-4 text-center text-sm text-gray-300">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
          <EnhancedLoginForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-500/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[rgba(26,35,71,0.7)] text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outlined flex items-center justify-center"
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">GitHub</span>
              </a>

              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outlined flex items-center justify-center"
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                <span className="ml-2">Google</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;