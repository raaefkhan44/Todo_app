'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CheckCircleIcon,
    title: 'Task Management',
    description: 'Easily create, update, and track your tasks with a simple interface.'
  },
  {
    icon: ClockIcon,
    title: 'Time Tracking',
    description: 'Monitor how much time you spend on important tasks.'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Responsive Design',
    description: 'Access your tasks from any device, anywhere.'
  },
  {
    icon: SunIcon,
    title: 'Light & Dark Mode',
    description: 'Work comfortably in any lighting condition.'
  },
  {
    icon: LockClosedIcon,
    title: 'Secure & Private',
    description: 'Your data is encrypted and stored securely.'
  },
  {
    icon: ArrowPathIcon,
    title: 'Sync Across Devices',
    description: 'Stay up to date on all your devices automatically.'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features for <span className="text-red-500">Productivity</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to organize your tasks and boost your productivity
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[rgba(26,35,71,0.6)] backdrop-blur-md border border-[rgba(255,22,22,0.3)] rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4 mx-auto">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white text-center">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-center mb-4">
                {feature.description}
              </p>
              <div className="text-center">
                <button className="btn-outlined">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;