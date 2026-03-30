import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, icon: Icon = Search, className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-container-high border-none rounded-lg text-sm py-2 pl-10 focus:ring-2 focus:ring-secondary/20"
      />
    </div>
  );
}
