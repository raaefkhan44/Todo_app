'use client';

import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  FolderIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const UpdatedHowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      number: "01",
      icon: <PencilIcon className="h-8 w-8 text-white" />,
      title: "Create Task",
      description: "Quickly add new tasks with titles, descriptions, priorities, and due dates."
    },
    {
      number: "02",
      icon: <FolderIcon className="h-8 w-8 text-white" />,
      title: "Organize & Prioritize",
      description: "Categorize tasks, set priorities, and organize them into lists or projects."
    },
    {
      number: "03",
      icon: <ChartBarIcon className="h-8 w-8 text-white" />,
      title: "Track Progress",
      description: "Monitor your progress with visual indicators and productivity insights."
    },
    {
      number: "04",
      icon: <CheckCircleIcon className="h-8 w-8 text-white" />,
      title: "Complete & Celebrate",
      description: "Mark tasks as complete and celebrate your achievements."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get started with our simple 4-step process to boost your productivity.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 transition-all duration-700 ease-out ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{ transitionDelay: `${200 * index}ms` }}
                >
                  {step.icon}
                </div>

                <div className="text-blue-400 font-bold text-lg mb-2">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="btn-grad">
            Start Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpdatedHowItWorksSection;