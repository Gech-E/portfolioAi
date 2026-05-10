import * as React from 'react';
import { cn } from '../lib/utils';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

function ScoreRing({
  score,
  maxScore = 100,
  size = 88,
  strokeWidth = 8,
  color = '#2563EB',
  label,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / maxScore, 1);
  const dashoffset = circumference * (1 - progress);

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-medium text-gray-900 dark:text-white">{score}</span>
          <span className="text-[10px] text-gray-400">/ {maxScore}</span>
        </div>
      </div>
      {label && (
        <p className="mt-2.5 text-center text-xs text-gray-500 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
}

export { ScoreRing };
export type { ScoreRingProps };
