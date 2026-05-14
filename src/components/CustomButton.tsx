/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200/50',
    secondary: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100',
    outline: 'border-2 border-slate-200 text-slate-600 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs font-bold uppercase tracking-wider',
    md: 'px-6 py-3 text-sm font-bold',
    lg: 'px-10 py-5 text-lg font-black tracking-tight',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};
