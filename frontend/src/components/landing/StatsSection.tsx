'use client';

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, value: 10000, label: 'Active Users', suffix: '+' },
  { id: 2, value: 50000, label: 'Tasks Completed', suffix: '+' },
  { id: 3, value: 99.9, label: 'Uptime', suffix: '%' },
  { id: 4, value: 24, label: 'Support', suffix: '/7' }
];

const CountUp = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);

          const start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          let current = start;

          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              element.textContent = `${Math.floor(end)}${suffix}`;
              clearInterval(timer);
            } else {
              element.textContent = `${Math.floor(current)}${suffix}`;
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end, suffix, hasAnimated]);

  return <span ref={ref}>0</span>;
};

const StatsSection = () => {
  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-[rgba(26,35,71,0.6)] backdrop-blur-md rounded-xl p-6 border border-[rgba(255,22,22,0.2)] hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
                <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;