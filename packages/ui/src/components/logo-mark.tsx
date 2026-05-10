import * as React from 'react';
import { Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

function LogoMark({ size = 'md', showText = true, className }: LogoMarkProps) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-sm',
    md: 'h-8 w-8 text-base',
    lg: 'h-10 w-10 text-lg',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-[15px]',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-blue-600 text-white',
          sizeClasses[size],
        )}
      >
        <Briefcase className="h-[55%] w-[55%]" />
      </div>
      {showText && (
        <span className={cn('font-medium text-gray-900 dark:text-white', textSizes[size])}>
          Portfolio<span className="text-blue-600">AI</span>
        </span>
      )}
    </div>
  );
}

export { LogoMark };
export type { LogoMarkProps };
