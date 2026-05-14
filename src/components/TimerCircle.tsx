/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface TimerCircleProps {
  percentage: number;
  timeLeft: string;
  className?: string;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({ percentage, timeLeft, className }) => {
  const radius = 170;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-[380px] h-[380px] transform -rotate-90">
        <circle
          cx="190"
          cy="190"
          r={radius}
          stroke="#E2E8F0"
          strokeWidth="12"
          fill="transparent"
        />
        <motion.circle
          cx="190"
          cy="190"
          r={radius}
          stroke="#3B82F6"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "linear" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Fokus</span>
        <span className="text-8xl font-black text-slate-900 tracking-tighter font-mono">{timeLeft}</span>
      </div>
    </div>
  );
};
