'use client';

import React, { useState, useEffect } from 'react';

const UpdatedStatsSection = () => {
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const stats = [
    { endCount: 10000, label: "Active Users", suffix: "+" },
    { endCount: 50000, label: "Tasks Completed", suffix: "+" },
    { endCount: 99.9, label: "Uptime", suffix: "%" },
    { endCount: 24, label: "Support", suffix: "/7" }
  ];

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      const duration = 2000; // Animation duration in ms
      const increment = stat.endCount / (duration / 16); // Approximate frame rate of 60fps
      let currentCount = 0;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= stat.endCount) {
          currentCount = stat.endCount;
          clearInterval(timer);
        }

        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(currentCount);
          return newCounts;
        });
      }, 16);

      return timer;
    });

    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card-bg border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm text-center transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                {counts[index]}
                {stat.suffix}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpdatedStatsSection;