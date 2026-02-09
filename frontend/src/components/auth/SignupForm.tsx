'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignupData } from '@/types/auth';
import { saveUserSession } from '@/services/auth-service';

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // In a real implementation, you would call the actual signup API
      // For now, we'll simulate a successful signup
      console.log('Attempting signup with:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response
      const mockUserSession = {
        id: '1',
        email: formData.email,
        name: formData.name,
        isAuthenticated: true,
        token: 'mock-jwt-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };

      // Save the session
      saveUserSession(mockUserSession);

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh(); // Refresh to update the UI based on auth state
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-[rgba(239,68,68,0.2)] p-4 border border-red-500">
          <div className="text-sm text-red-400">{error}</div>
        </div>
      )}

      <input type="hidden" name="remember" defaultValue="true" />

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="appearance-none relative block w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] placeholder-gray-400 text-white rounded-md bg-[rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
            placeholder="Full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="appearance-none relative block w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] placeholder-gray-400 text-white rounded-md bg-[rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
            placeholder="Email address"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="appearance-none relative block w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] placeholder-gray-400 text-white rounded-md bg-[rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
            placeholder="Password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            className="appearance-none relative block w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] placeholder-gray-400 text-white rounded-md bg-[rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm transition-colors"
            placeholder="Confirm Password"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          disabled={loading}
          className="h-4 w-4 text-red-500 focus:ring-red-500 border-red-500 rounded bg-transparent"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
          I agree to the{' '}
          <Link href="/terms" className="font-medium text-red-500 hover:text-red-400">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-red-500 hover:text-red-400">
            Privacy Policy
          </Link>
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn-grad-full flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Sign up'
          )}
        </button>
      </div>

      <div className="text-sm text-center text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-red-500 hover:text-red-400">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;