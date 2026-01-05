'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader, MetricCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import RevenueChart from '@/components/charts/RevenueChart';
import TopProceduresChart from '@/components/charts/TopProceduresChart';
import { DonutChart, ProgressRing } from '@/components/charts/DonutChart';
import { cn, formatCurrency } from '@/lib/utils';
import { analyticsData, doctors, procedures } from '@/data/mockData';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const categoryData = [
  { name: 'Терапия', value: 234, color: '#00D4AA' },
  { name: 'Хирургия', value: 89, color: '#3B82F6' },
  { name: 'Ортопедия', value: 67, color: '#8B5CF6' },
  { name: 'Ортодонтия', value: 34, color: '#F59E0B' },
  { name: 'Гигиена', value: 78, color: '#EF4444' },
];

const doctorPerformance = analyticsData.doctors.performance;

export default function AnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState('month');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-18' : 'ml-[260px]'
        )}
      >
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main className="p-6">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
                <p className="text-gray-500 mt-1">
                  Подробная статистика и метрики клиники
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  {(['day', 'week', 'month', 'year'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={cn(
                        'px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize',
                        period === p
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {p === 'day' ? 'День' : p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
                    </button>
                  ))}
                </div>
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                  Экспорт
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Общая выручка"
                value={formatCurrency(analyticsData.revenue.total)}
                change={analyticsData.revenue.change}
                trend={analyticsData.revenue.change > 0 ? 'up' : 'down'}
                icon={<DollarSign className="w-5 h-5" />}
              />
              <MetricCard
                title="Всего пациентов"
                value={analyticsData.patients.total}
                change={8.5}
                trend="up"
                icon={<Users className="w-5 h-5" />}
              />
              <MetricCard
                title="Записей"
                value={analyticsData.appointments.total}
                change={12.3}
                trend="up"
                icon={<Calendar className="w-5 h-5" />}
              />
              <MetricCard
                title="Конверсия"
                value="78%"
                change={5.2}
                trend="up"
                icon={<Target className="w-5 h-5" />}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Revenue Chart */}
              <Card padding="lg" className="lg:col-span-2">
                <CardHeader
                  title="Динамика выручки"
                  description="По дням за выбранный период"
                  action={
                    <Button variant="ghost" size="sm">
                      Подробнее
                    </Button>
                  }
                />
                <RevenueChart data={analyticsData.revenue.data} height={300} />
              </Card>

              {/* Category Distribution */}
              <Card padding="lg">
                <CardHeader
                  title="Распределение по категориям"
                  description="Количество процедур"
                />
                <DonutChart
                  data={categoryData}
                  height={280}
                  centerLabel="Всего"
                  centerValue={analyticsData.appointments.total.toString()}
                />
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top Procedures */}
              <Card padding="lg">
                <CardHeader
                  title="Топ процедур"
                  description="По выручке"
                  action={
                    <Button variant="ghost" size="sm">
                      Все
                    </Button>
                  }
                />
                <TopProceduresChart
                  data={analyticsData.procedures.top}
                  height={280}
                />
              </Card>

              {/* Doctor Performance */}
              <Card padding="lg">
                <CardHeader
                  title="Эффективность врачей"
                  description="По выручке за период"
                />
                <div className="space-y-4 mt-4">
                  {doctorPerformance.map((doctor, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {doctor.name}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(doctor.revenue)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(doctor.revenue / doctorPerformance[0].revenue) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-secondary rounded-full"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {doctor.count} процедур
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Third Row - Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Appointment Stats */}
              <Card padding="lg">
                <CardHeader
                  title="Статистика записей"
                  description="Статусы завершённых"
                />
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-600">Завершено</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {analyticsData.appointments.completed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-sm text-gray-600">Отменено</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {analyticsData.appointments.cancelled}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span className="text-sm text-gray-600">Неявка</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {analyticsData.appointments.noShow}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Процент завершения</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {Math.round(
                          (analyticsData.appointments.completed /
                            analyticsData.appointments.total) *
                          100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Patient Stats */}
              <Card padding="lg">
                <CardHeader
                  title="Пациенты"
                  description="Активность за период"
                />
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Новые пациенты</span>
                    <span className="font-bold text-primary">{analyticsData.patients.new}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Вернувшиеся</span>
                    <span className="font-bold text-secondary">{analyticsData.patients.returning}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Среднее посещений</span>
                    <span className="font-bold text-gray-900">3.2</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600"> NPS</span>
                    <span className="font-bold text-emerald-600">+72</span>
                  </div>
                </div>
              </Card>

              {/* Load Heatmap Placeholder */}
              <Card padding="lg">
                <CardHeader
                  title="Загрузка"
                  description="По дням недели"
                />
                <div className="mt-4">
                  <div className="grid grid-cols-7 gap-1">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
                      <div key={day} className="text-center">
                        <p className="text-xs text-gray-500 mb-2">{day}</p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={cn(
                            'w-8 h-8 rounded mx-auto',
                            i < 5 && 'bg-secondary/80',
                            i === 5 && 'bg-secondary/40',
                            i === 6 && 'bg-gray-200'
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Пиковая загрузка: Вт, Ср, Чт</p>
                    <p className="text-xs text-gray-400 mt-1">Средняя загрузка кабинетов: 78%</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
