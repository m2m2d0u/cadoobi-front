import React from 'react';
import { cn } from '@/src/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ className?: string }>;
  hoverColor?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

export function IconButton({ icon: Icon, hoverColor = 'primary', size = 'sm', className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center justify-center rounded transition-colors text-on-surface-variant hover:bg-surface-container-high',
        size === 'sm' ? 'p-1.5' : 'p-2',
        hoverColor === 'primary' ? 'hover:text-primary' : 'hover:text-secondary',
        className
      )}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
