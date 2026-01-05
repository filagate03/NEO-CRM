'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Calendar,
  PieChart,
  FileText,
  RefreshCw,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader, MetricCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Table, DataTable } from '@/components/ui/Table';
import { DonutChart } from '@/components/charts/DonutChart';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { transactions, analyticsData } from '@/data/mockData';
import { Transaction } from '@/types';
import VATNotification from '@/components/notifications/VATNotification';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const paymentMethods = [
  { name: 'Наличные', value: 35, color: '#00D4AA' },
  { name: 'Карта', value: 45, color: '#3B82F6' },
  { name: 'Перевод', value: 15, color: '#8B5CF6' },
  { name: 'Страховка', value: 5, color: '#F59E0B' },
];

export default function FinancePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  // Функция экспорта финансового отчёта
  const handleExport = () => {
    const csvContent = [
      ['Дата', 'Категория', 'Описание', 'Тип', 'Сумма'].join(','),
      ...transactions.map(t => [
        t.date,
        t.category,
        t.description,
        t.type === 'income' ? 'Доход' : 'Расход',
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const columns = [
    {
      key: 'date',
      header: 'Дата',
      width: '120px',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'category',
      header: 'Категория',
      width: '180px',
      render: (value: string) => (
        <Badge variant={value === 'Лечение' || value === 'Протезирование' ? 'success' : 'default'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'description',
      header: 'Описание',
      render: (value: string, row: Transaction) => (
        <span>{value || row.patientName || '-'}</span>
      ),
    },
    {
      key: 'method',
      header: 'Способ',
      width: '120px',
      render: (value: string) => {
        const methods: Record<string, { label: string; icon: React.ReactNode }> = {
          cash: { label: 'Наличные', icon: <Banknote className="w-4 h-4" /> },
          card: { label: 'Карта', icon: <CreditCard className="w-4 h-4" /> },
          transfer: { label: 'Перевод', icon: <ArrowUpRight className="w-4 h-4" /> },
        };
        const method = methods[value] || { label: value, icon: null };
        return (
          <span className="flex items-center gap-1.5">
            {method.icon}
            {method.label}
          </span>
        );
      },
    },
    {
      key: 'amount',
      header: 'Сумма',
      width: '150px',
      align: 'right' as const,
      render: (value: number, row: Transaction) => (
        <span
          className={cn(
            'font-medium',
            row.type === 'income' ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {row.type === 'expense' ? '-' : '+'}
          {formatCurrency(value)}
        </span>
      ),
    },
  ] as any[];

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-[280px]'
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
                <h1 className="text-2xl font-bold text-gray-900">Финансы</h1>
                <p className="text-gray-500 mt-1">
                  Учёт доходов и расходов клиники
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Синхронизировать
                </Button>
                <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
                  Экспорт
                </Button>
              </div>
            </div>

            {/* VAT Notification */}
            <div className="mb-6">
              <VATNotification revenue={totalIncome} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Доходы"
                value={formatCurrency(totalIncome)}
                change={12.5}
                trend="up"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <MetricCard
                title="Расходы"
                value={formatCurrency(totalExpense)}
                change={8.2}
                trend="up"
                icon={<TrendingDown className="w-5 h-5" />}
              />
              <MetricCard
                title="Прибыль"
                value={formatCurrency(profit)}
                change={15.3}
                trend="up"
                icon={<DollarSign className="w-5 h-5" />}
              />
              <MetricCard
                title="Средний чек"
                value={formatCurrency(12500)}
                change={-2.1}
                trend="down"
                icon={<PieChart className="w-5 h-5" />}
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Payment Methods Chart */}
              <Card padding="lg">
                <CardHeader
                  title="Способы оплаты"
                  description="Распределение за месяц"
                />
                <DonutChart
                  data={paymentMethods}
                  height={250}
                  centerLabel="Всего"
                  centerValue={formatCurrency(totalIncome).replace('₽', '')}
                />
              </Card>

              {/* Quick Stats */}
              <Card padding="lg" className="lg:col-span-2">
                <CardHeader
                  title="Финансовая сводка"
                  description="Текущий месяц"
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-emerald-600 font-medium">Приход</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">
                      {formatCurrency(totalIncome)}
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                      {incomeTransactions.length} операций
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Расход</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">
                      {formatCurrency(totalExpense)}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {expenseTransactions.length} операций
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Ожидаемые платежи</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(85000)}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-600 mb-1">Дебиторская задолженность</p>
                    <p className="text-xl font-bold text-amber-700">
                      {formatCurrency(125000)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card padding="none">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Tabs
                    tabs={[
                      { id: 'all', label: 'Все', count: transactions.length },
                      { id: 'income', label: 'Приход', count: incomeTransactions.length },
                      { id: 'expense', label: 'Расход', count: expenseTransactions.length },
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    variant="pills"
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
                      Фильтры
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
                      Период
                    </Button>
                  </div>
                </div>
              </div>
              <Table
                columns={columns}
                data={filteredTransactions}
                keyExtractor={(row) => row.id}
                emptyMessage="Транзакции не найдены"
              />
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
