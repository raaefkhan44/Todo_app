'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const UpdatedHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`container mx-auto px-4 relative z-10 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-wrap items-center justify-between -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <div className="max-w-lg">
              <div className="inline-block px-4 py-1 mb-6 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                <span>Productivity Redefined</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Organize Your Life with
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Todo App
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-md">
                A modern, intuitive task management solution designed to boost your productivity.
                Streamline your workflow and achieve your goals with our powerful features.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="btn-grad flex items-center justify-center w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>

                <Link
                  href="/login"
                  className="btn-outlined flex items-center justify-center w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
              {/* Preview Todo Cards */}
              <div className="card-bg border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm animate-float">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 h-5 w-5 rounded border border-blue-400 bg-transparent flex items-center justify-center mt-0.5">
                    <div className="h-3 w-3 rounded bg-blue-400 hidden"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-medium">Complete project proposal</h3>
                    <p className="text-sm text-gray-400">Due: Tomorrow</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>

              <div className="card-bg border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm animate-float animation-delay-1000">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 h-5 w-5 rounded border border-blue-400 bg-transparent flex items-center justify-center mt-0.5">
                    <div className="h-3 w-3 rounded bg-blue-400"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-medium line-through">Review team feedback</h3>
                    <p className="text-sm text-gray-400">Completed</p>
                  </div>
                </div>
              </div>

              <div className="card-bg border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm animate-float animation-delay-500">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 h-5 w-5 rounded border border-blue-400 bg-transparent flex items-center justify-center mt-0.5">
                    <div className="h-3 w-3 rounded bg-blue-400 hidden"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-medium">Prepare presentation</h3>
                    <p className="text-sm text-gray-400">Due: Next week</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
};

export default UpdatedHeroSection;