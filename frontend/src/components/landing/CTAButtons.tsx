'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CTAButtons = () => {
  return (
    <div className="py-12 text-center bg-[rgba(0,0,0,0.7)] backdrop-blur-md rounded-2xl m-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-shadow-[0_0_10px_rgba(255,22,22,0.3)]">
          Ready to Boost Your Productivity?
        </h2>
        <p className="text-gray-300 mb-8">
          Join thousands of users who are getting things done with Todo App
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <motion.button
              className="btn-grad"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 22, 22, 0.6)" }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
            </motion.button>
          </Link>

          <Link href="/login">
            <motion.button
              className="btn-outlined"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 22, 22, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Demo
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <motion.p
        className="mt-6 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        No credit card required • 14-day free trial • Cancel anytime
      </motion.p>
    </div>
  );
};

export default CTAButtons;