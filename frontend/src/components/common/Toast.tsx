import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[rgba(16,185,129,0.2)]',
          border: 'border-green-500',
          text: 'text-green-400',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
        };
      case 'error':
        return {
          bg: 'bg-[rgba(239,68,68,0.2)]',
          border: 'border-red-500',
          text: 'text-red-400',
          icon: <XCircleIcon className="h-5 w-5 text-red-400" />,
        };
      case 'warning':
        return {
          bg: 'bg-[rgba(245,158,11,0.2)]',
          border: 'border-yellow-500',
          text: 'text-yellow-400',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />,
        };
      case 'info':
        return {
          bg: 'bg-[rgba(59,130,246,0.2)]',
          border: 'border-blue-500',
          text: 'text-blue-400',
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" />,
        };
      default:
        return {
          bg: 'bg-[rgba(74,158,255,0.2)]',
          border: 'border-primary-500',
          text: 'text-primary-400',
          icon: <InformationCircleIcon className="h-5 w-5 text-primary-400" />,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`flex items-start p-4 rounded-lg shadow-lg border ${config.bg} ${config.border}`}
    >
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <div className="ml-3 flex-1">
        <p className={`text-sm font-medium ${config.text}`}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 flex-shrink-0 text-foreground hover:text-foreground/80"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export default Toast;