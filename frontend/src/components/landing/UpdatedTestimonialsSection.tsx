'use client';

import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const UpdatedTestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "This app has completely transformed how I manage my daily tasks. The interface is intuitive and the features are powerful.",
      rating: 5,
      name: "Sarah Johnson",
      title: "Product Manager"
    },
    {
      quote: "I've tried many task management apps, but this one stands out with its beautiful design and seamless functionality.",
      rating: 5,
      name: "Michael Chen",
      title: "Software Engineer"
    },
    {
      quote: "The productivity gains I've seen since using this app are incredible. Highly recommend to anyone looking to get organized.",
      rating: 5,
      name: "Emma Rodriguez",
      title: "Marketing Director"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by Thousands of Users
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See what our users have to say about their experience with our app.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card-bg border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-yellow-400 flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-white italic mb-6">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="bg-blue-500/20 border border-blue-500/40 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                  {testimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-400">{testimonials[currentIndex].title}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdatedTestimonialsSection;