'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const UpdatedCTASection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users who have transformed their workflow with our app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-grad flex items-center justify-center"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="btn-outlined flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdatedCTASection;