'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-gray-300',
        primary: 'bg-primary/20 text-primary',
        secondary: 'bg-secondary/20 text-secondary',
        success: 'bg-emerald-500/20 text-emerald-400',
        warning: 'bg-amber-500/20 text-amber-400',
        danger: 'bg-red-500/20 text-red-400',
        info: 'bg-blue-500/20 text-blue-400',
        purple: 'bg-purple-500/20 text-purple-400',
        outline: 'border border-white/10 text-gray-400 bg-white/5',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    const dotColors = {
      default: 'bg-gray-500',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-emerald-400',
      warning: 'bg-amber-400',
      danger: 'bg-red-400',
      info: 'bg-blue-400',
      purple: 'bg-purple-400',
      outline: 'bg-gray-500',
    };

    return (
      <span
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant || 'default'])} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// StatusBadge для отображения статусов
interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: StatusBadgeProps['variant']; dot: boolean }> = {
  scheduled: { label: 'Запланировано', variant: 'info', dot: true },
  confirmed: { label: 'Подтверждено', variant: 'success', dot: true },
  in_progress: { label: 'В процессе', variant: 'warning', dot: true },
  completed: { label: 'Завершено', variant: 'success', dot: true },
  cancelled: { label: 'Отменено', variant: 'danger', dot: true },
  no_show: { label: 'Неявка', variant: 'danger', dot: true },
  active: { label: 'Активен', variant: 'success', dot: true },
  inactive: { label: 'Неактивен', variant: 'default', dot: true },
  new: { label: 'Новый', variant: 'purple', dot: true },
  online: { label: 'Онлайн', variant: 'success', dot: true },
  offline: { label: 'Офлайн', variant: 'default', dot: true },
  busy: { label: 'Занят', variant: 'warning', dot: true },
  on_break: { label: 'Перерыв', variant: 'info', dot: true },
  planned: { label: 'Запланировано', variant: 'info', dot: true },
  paused: { label: 'Приостановлено', variant: 'warning', dot: true },
  draft: { label: 'Черновик', variant: 'default', dot: true },
  paid: { label: 'Оплачено', variant: 'success', dot: true },
  unpaid: { label: 'Не оплачено', variant: 'warning', dot: true },
  overdue: { label: 'Просрочено', variant: 'danger', dot: true },
  urgent: { label: 'Срочно', variant: 'danger', dot: true },
  high: { label: 'Высокий', variant: 'warning', dot: true },
  medium: { label: 'Средний', variant: 'info', dot: true },
  low: { label: 'Низкий', variant: 'default', dot: false },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, variant: 'default', dot: false };

  return (
    <Badge variant={config.variant} dot={config.dot} className={className}>
      {config.label}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';

export { Badge, badgeVariants, StatusBadge };
