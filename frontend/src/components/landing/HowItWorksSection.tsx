'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  PencilIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    id: 1,
    title: 'Create Task',
    description: 'Add new tasks with details, descriptions, and due dates',
    icon: PencilIcon
  },
  {
    id: 2,
    title: 'Organize & Prioritize',
    description: 'Categorize with tags and organize by priority and deadlines',
    icon: CalendarIcon
  },
  {
    id: 3,
    title: 'Track Progress',
    description: 'Monitor your progress with visual indicators and completion percentages',
    icon: CheckCircleIcon
  },
  {
    id: 4,
    title: 'Complete & Celebrate',
    description: 'Mark tasks complete and celebrate your productivity wins',
    icon: CheckCircleIcon
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-[rgba(26,35,71,0.6)] backdrop-blur-md border border-[rgba(255,22,22,0.2)] rounded-2xl m-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It <span className="text-red-500">Works</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started with our simple 4-step process to boost your productivity
          </motion.p>
        </div>

        <div className="relative">
          {/* Animated connection lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[rgba(255,22,22,0.2)] transform -translate-y-1/2">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-700"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4 text-white border-2 border-red-500"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <step.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="md:hidden flex items-center justify-center my-4">
                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <motion.button
            className="btn-grad"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 22, 22, 0.6)" }}
            whileTap={{ scale: 0.98 }}
          >
            Start Now
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;