'use client';

import React from 'react';
import { motion } from 'framer-motion';

// This is a placeholder component for animated illustrations
// In a real implementation, you would use actual illustrations or animations
const AnimatedIllustrations = () => {
  return (
    <div className="flex justify-center items-center space-x-4 py-8">
      {/* Simple animated checklist icon */}
      <motion.div
        className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <svg
          className="w-8 h-8 text-primary-600 dark:text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      {/* Simple animated plus icon */}
      <motion.div
        className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <svg
          className="w-8 h-8 text-secondary-600 dark:text-secondary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </motion.div>

      {/* Simple animated check icon */}
      <motion.div
        className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default AnimatedIllustrations;