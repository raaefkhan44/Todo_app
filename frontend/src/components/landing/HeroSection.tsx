'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow-[0_0_20px_rgba(255,22,22,0.3)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Organize Your Life with
          </motion.h1>

          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 text-shadow-[0_0_30px_rgba(255,22,22,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Todo App
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A modern, intuitive task management solution designed to boost your productivity.
            Stay on top of everything that matters in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/signup">
              <motion.button
                className="btn-grad"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 22, 22, 0.6)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>

            <Link href="/login">
              <motion.button
                className="btn-outlined"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 22, 22, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="bg-[rgba(26,35,71,0.6)] backdrop-blur-md border border-[rgba(255,22,22,0.3)] rounded-xl p-4 shadow-lg"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: item * 0.2,
                }}
              >
                <div className="h-4 bg-[rgba(255,255,255,0.2)] rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-[rgba(255,255,255,0.2)] rounded w-full mb-2"></div>
                <div className="h-3 bg-[rgba(255,255,255,0.2)] rounded w-5/6"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;