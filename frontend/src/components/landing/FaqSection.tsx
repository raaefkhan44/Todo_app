'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    id: 1,
    question: 'How secure is my data?',
    answer: 'We use industry-standard encryption to protect your data. All information is securely stored and transmitted using TLS encryption.'
  },
  {
    id: 2,
    question: 'Can I use the app offline?',
    answer: 'Yes, our app supports offline functionality. Your tasks will sync automatically when you reconnect to the internet.'
  },
  {
    id: 3,
    question: 'Do you offer team collaboration features?',
    answer: 'Absolutely! Our premium plan includes team workspaces, shared task lists, and real-time collaboration tools.'
  },
  {
    id: 4,
    question: 'Is there a mobile app available?',
    answer: 'Yes, we have native iOS and Android apps that sync seamlessly with your desktop experience.'
  },
  {
    id: 5,
    question: 'Can I import tasks from other apps?',
    answer: 'Yes, we support importing from popular task management tools like Trello, Asana, and Microsoft To-Do.'
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to know about our todo application
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="border border-border rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left bg-card hover:bg-muted transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-lg text-foreground">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-primary" />
                )}
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-card border-t border-border"
                >
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;