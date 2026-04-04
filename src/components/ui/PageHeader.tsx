import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BreadcrumbItem {
  label: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  customMargin?: string;
}

export function PageHeader({ title, subtitle, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex justify-between items-end mb-8', className)}>
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
            {breadcrumb.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <span className={i === breadcrumb.length - 1 ? 'text-primary font-semibold' : ''}>
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h2 className="text-3xl font-bold font-headline text-primary tracking-tight">{title}</h2>
        {subtitle && <p className="text-on-surface-variant text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
