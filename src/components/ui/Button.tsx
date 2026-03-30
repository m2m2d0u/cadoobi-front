import React from 'react';
import { cn } from '@/src/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-white font-semibold shadow-lg shadow-primary/10 hover:translate-y-[-1px]',
  secondary: 'bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold',
  outline:   'border border-outline-variant/20 text-primary font-bold hover:bg-surface-container-low',
  ghost:     'text-secondary font-bold hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded transition-all',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
