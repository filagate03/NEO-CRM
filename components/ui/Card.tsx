'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = motion(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
      const variants = {
        default: 'bg-card shadow-soft',
        bordered: 'bg-card border border-white/10',
        elevated: 'bg-card shadow-card',
      };

      const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      };

      return (
        <motion.div
          ref={ref}
          className={cn(
            'rounded-xl transition-all duration-200',
            variants[variant],
            paddings[padding],
            hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
            className
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }
  )
);

Card.displayName = 'Card';

// CardHeader компонент
interface CardHeaderProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const CardHeader = ({ title, description, action, className }: CardHeaderProps) => {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

// CardContent компонент
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1', className)}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

// CardFooter компонент
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center mt-4 pt-4 border-t border-gray-100', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

// MetricCard компонент для метрик
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  sparkline?: { data: number[]; color?: string };
  className?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  className,
}: MetricCardProps) => {
  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <Card className={cn('', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center mt-2 text-sm', trendColors[trend])}>
              <span className="mr-1">{trendIcons[trend]}</span>
              <span>{Math.abs(change)}%</span>
              {changeLabel && <span className="text-gray-500 ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-white/5 rounded-lg text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

MetricCard.displayName = 'MetricCard';

// StatCard для простых статистик
interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({ label, value, color = '#00D4AA', icon, className }: StatCardProps) => {
  return (
    <div
      className={cn(
        'flex items-center p-4 rounded-lg bg-card border border-white/5',
        className
      )}
    >
      {icon && (
        <div
          className="p-2 rounded-lg mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            style: { color, width: 20, height: 20 },
          })}
        </div>
      )}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
};

StatCard.displayName = 'StatCard';

// EmptyStateCard для пустых состояний
interface EmptyStateCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyStateCard = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="p-4 rounded-full bg-white/5 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

EmptyStateCard.displayName = 'EmptyStateCard';

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  MetricCard,
  StatCard,
  EmptyStateCard,
};
