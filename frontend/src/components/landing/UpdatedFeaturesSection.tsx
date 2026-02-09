'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

const UpdatedFeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <CheckCircleIcon className="h-12 w-12 text-white" />,
      title: "Task Management",
      description: "Easily create, organize, and manage your tasks with our intuitive interface.",
      delay: 100
    },
    {
      icon: <ClockIcon className="h-12 w-12 text-white" />,
      title: "Time Tracking",
      description: "Track how much time you spend on each task to optimize your productivity.",
      delay: 200
    },
    {
      icon: <DevicePhoneMobileIcon className="h-12 w-12 text-white" />,
      title: "Responsive Design",
      description: "Access your tasks from any device with our fully responsive design.",
      delay: 300
    },
    {
      icon: <SunIcon className="h-12 w-12 text-white" />,
      title: "Light & Dark Mode",
      description: "Switch between light and dark themes based on your preference.",
      delay: 400
    },
    {
      icon: <LockClosedIcon className="h-12 w-12 text-white" />,
      title: "Secure & Private",
      description: "Your data is encrypted and securely stored with our privacy-first approach.",
      delay: 500
    },
    {
      icon: <ArrowsRightLeftIcon className="h-12 w-12 text-white" />,
      title: "Sync Across Devices",
      description: "Stay synchronized across all your devices with real-time updates.",
      delay: 600
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for Productivity
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover the tools that will transform how you manage your tasks and boost your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card-bg border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              <div className="bg-blue-500/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <button className="btn-outlined text-sm">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpdatedFeaturesSection;