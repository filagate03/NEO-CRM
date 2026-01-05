'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  data: { date: string; value: number }[];
  height?: number;
  showLegend?: boolean;
  period?: 'day' | 'week' | 'month' | 'year';
  onPeriodChange?: (period: 'day' | 'week' | 'month' | 'year') => void;
}

const RevenueChart = ({
  data,
  height = 300,
  showLegend = true,
  period = 'week',
  onPeriodChange,
}: RevenueChartProps) => {
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTooltip = (value: number) => formatCurrency(value);

  return (
    <div className="w-full">
      {onPeriodChange && (
        <div className="flex items-center gap-2 mb-4">
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                period === p
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {p === 'day' && 'День'}
              {p === 'week' && 'Неделя'}
              {p === 'month' && 'Месяц'}
              {p === 'year' && 'Год'}
            </button>
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="strokeRevenue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 15, 20, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                padding: '12px 16px',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Выручка']}
              labelFormatter={(label) => formatXAxis(label)}
              cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#strokeRevenue)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Выручка"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default RevenueChart;
