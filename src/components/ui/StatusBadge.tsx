import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type StatusType =
  | 'Active' | 'Pending' | 'Success' | 'Failed' | 'Processing'
  | 'Blocked' | 'Healthy' | 'Degraded' | 'Redeemed' | 'Expired';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  /** badge = pill, dot = circle+text, icon = icon+text */
  variant?: 'badge' | 'dot' | 'icon';
  className?: string;
}

const config: Record<StatusType, { text: string; dot: string; badge: string }> = {
  Active:   { text: 'text-secondary',  dot: 'bg-secondary', badge: 'bg-secondary/10 text-secondary' },
  Success:  { text: 'text-secondary',  dot: 'bg-secondary', badge: 'bg-secondary/10 text-secondary' },
  Healthy:  { text: 'text-secondary',  dot: 'bg-secondary', badge: 'bg-secondary/10 text-secondary' },
  Redeemed: { text: 'text-primary',    dot: 'bg-primary',   badge: 'bg-primary/10 text-primary' },
  Pending:  { text: 'text-amber-600',  dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600' },
  Processing:  { text: 'text-amber-600',  dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600' },
  Failed:   { text: 'text-error',      dot: 'bg-error',     badge: 'bg-error/10 text-error' },
  Blocked:  { text: 'text-error',      dot: 'bg-error',     badge: 'bg-error/10 text-error' },
  Degraded: { text: 'text-error',      dot: 'bg-error',     badge: 'bg-error/10 text-error' },
  Expired:  { text: 'text-error',      dot: 'bg-error',     badge: 'bg-error/10 text-error' },
};

const statusIcons: Partial<Record<StatusType, React.ComponentType<{ className?: string }>>> = {
  Active: CheckCircle2, Success: CheckCircle2, Healthy: CheckCircle2, Redeemed: CheckCircle2,
  Pending: Clock,
  Failed: XCircle, Blocked: XCircle, Degraded: XCircle, Expired: XCircle,
};

export function StatusBadge({ status, label, variant = 'badge', className }: StatusBadgeProps) {
  const c = config[status];
  const displayLabel = label ?? status;
  const Icon = statusIcons[status];

  if (variant === 'badge') {
    return (
      <span className={cn('px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider', c.badge, className)}>
        {displayLabel}
      </span>
    );
  }

  if (variant === 'dot') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn('w-2 h-2 rounded-full', c.dot)} />
        <span className={cn('text-[11px] font-bold uppercase tracking-wider', c.text)}>{displayLabel}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Icon && <Icon className={cn('w-4 h-4', c.text)} />}
      <span className={cn('text-xs font-bold uppercase tracking-wider', c.text)}>{displayLabel}</span>
    </div>
  );
}
