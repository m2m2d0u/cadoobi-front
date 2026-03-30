import React from 'react';
import { cn } from '@/src/lib/utils';

type IconColor = 'primary' | 'secondary' | 'amber' | 'error';
type ProgressColor = 'primary' | 'secondary' | 'amber' | 'error';
type DescColor = 'secondary' | 'error' | 'muted';

interface ProgressBar {
  percent: number;
  color: ProgressColor;
}

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: IconColor;
  desc?: string;
  descColor?: DescColor;
  /** Top-right content (badge/label). Pass a <span> with desired styling. */
  badge?: React.ReactNode;
  progressBar?: ProgressBar;
  className?: string;
}

const iconColorMap: Record<IconColor, string> = {
  primary:   'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  amber:     'bg-amber-500/10 text-amber-600',
  error:     'bg-error/10 text-error',
};

const progressColorMap: Record<ProgressColor, string> = {
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  amber:     'bg-amber-500',
  error:     'bg-error',
};

const descColorMap: Record<DescColor, string> = {
  secondary: 'text-secondary',
  error:     'text-error',
  muted:     'text-on-surface-variant',
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconColor = 'primary',
  desc,
  descColor = 'secondary',
  badge,
  progressBar,
  className,
}: StatsCardProps) {
  return (
    <div className={cn('bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10', className)}>
      {(Icon || badge) && (
        <div className="flex justify-between items-center mb-4">
          {Icon && (
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconColorMap[iconColor])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge}
        </div>
      )}
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-primary">{value}</h3>
      {desc && <p className={cn('text-[10px] font-bold mt-2', descColorMap[descColor])}>{desc}</p>}
      {progressBar && (
        <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', progressColorMap[progressBar.color])}
            style={{ width: `${progressBar.percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
