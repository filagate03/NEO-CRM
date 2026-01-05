'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Activity,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Trash2,
  DownloadIcon,
  FileText,
  CalendarDays,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardContent, CardFooter, CardHeader, MetricCard, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import RevenueChart from '@/components/charts/RevenueChart';
import TopProceduresChart from '@/components/charts/TopProceduresChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { patients, appointments, doctors, analyticsData, procedures, notifications } from '@/data/mockData';
import { cn, formatCurrency, formatDate, formatTime } from '@/lib/utils';
import AIAssistantWidget from '@/components/ai/AIAssistantWidget';
import VATNotification from '@/components/notifications/VATNotification';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  completed?: boolean;
}

type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('monthly');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Позвонить пациенту Козлов М.А.', priority: 'high', due: 'Сегодня' },
    { id: 2, title: 'Подготовить документы для протезирования', priority: 'medium', due: 'Завтра' },
    { id: 3, title: 'Отправить счёт за лечение', priority: 'low', due: '25 декабря' },
  ]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      due: 'Сегодня',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTaskComplete = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const todayAppointments = appointments.filter(
    (a) => a.date === new Date().toISOString().split('T')[0] && a.status !== 'cancelled'
  );

  const todayRevenue = todayAppointments.reduce((sum, a) => sum + a.price, 0);

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.date) >= new Date() && a.status === 'scheduled')
    .slice(0, 6);

  const procedureStats = [
    { name: 'Консультация', count: 145, revenue: 217500, color: '#8B5CF6' },
    { name: 'Лечение кариеса', count: 89, revenue: 445000, color: '#EC4899' },
    { name: 'Чистка', count: 67, revenue: 335000, color: '#F59E0B' },
    { name: 'Имплантация', count: 23, revenue: 1035000, color: '#10B981' },
    { name: 'Коронки', count: 34, revenue: 850000, color: '#3B82F6' },
  ];

  const generateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const reportData = {
      type: selectedReportType,
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      statistics: {
        totalRevenue: todayRevenue * 30,
        totalAppointments: todayAppointments.length * 30,
        newPatients: analyticsData.patients.new,
        completedProcedures: analyticsData.appointments.completed,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${selectedReportType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGeneratingReport(false);
    setShowReportModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Дашборд</h1>
                <p className="text-gray-400 mt-1">
                  {formatDate(new Date().toISOString(), { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  leftIcon={<CalendarDays className="w-4 h-4" />}
                  onClick={() => setShowReportModal(true)}
                >
                  За период
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}
                  onClick={() => setShowReportModal(true)}
                >
                  Скачать отчёт
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <Tabs
                tabs={[
                  { id: 'overview', label: 'Обзор' },
                  { id: 'revenue', label: 'Выручка' },
                  { id: 'patients', label: 'Пациенты' },
                  { id: 'appointments', label: 'Записи' },
                ]}
                activeTab={activeTab}
                onChange={(tabId) => {
                  if (tabId === 'revenue') {
                    router.push('/finance');
                  } else if (tabId === 'patients') {
                    router.push('/patients');
                  } else if (tabId === 'appointments') {
                    router.push('/appointments');
                  } else {
                    setActiveTab(tabId);
                  }
                }}
                variant="default"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Выручка сегодня"
                value={formatCurrency(todayRevenue)}
                change={12.5}
                changeLabel="к вчера"
                trend="up"
                icon={<DollarSign className="w-5 h-5 text-secondary" />}
              />
              <MetricCard
                title="Записей сегодня"
                value={todayAppointments.length}
                change={8}
                changeLabel="к среднему"
                trend="up"
                icon={<Calendar className="w-5 h-5 text-secondary" />}
              />
              <MetricCard
                title="Активные пациенты"
                value={analyticsData.patients.total}
                change={5.2}
                changeLabel="за месяц"
                trend="up"
                icon={<Users className="w-5 h-5 text-secondary" />}
              />
              <MetricCard
                title="Средний чек"
                value={formatCurrency(12500)}
                change={-2.1}
                changeLabel="к прошлому месяцу"
                trend="down"
                icon={<TrendingUp className="w-5 h-5 text-secondary" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2" padding="lg">
                <CardHeader
                  title="Динамика выручки"
                  description="За последние 14 дней"
                  action={
                    <Link href="/finance">
                      <Button variant="ghost" size="sm">Подробнее</Button>
                    </Link>
                  }
                />
                <RevenueChart data={analyticsData.revenue.data} height={300} />
              </Card>

              <Card padding="lg">
                <CardHeader
                  title="Топ процедур"
                  description="По выручке за месяц"
                  action={
                    <Link href="/treatments">
                      <Button variant="ghost" size="sm">Все</Button>
                    </Link>
                  }
                />
                <TopProceduresChart data={procedureStats} height={300} />
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card padding="lg">
                <CardHeader
                  title="Ближайшие записи"
                  description="На сегодня и завтра"
                  action={
                    <Link href="/appointments">
                      <Button variant="ghost" size="sm">Все записи</Button>
                    </Link>
                  }
                />
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="text-center min-w-[50px]">
                        <p className="text-lg font-bold text-white">
                          {formatTime(appointment.time)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(appointment.date).getDate()} {new Date(appointment.date).toLocaleDateString('ru-RU', { month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {appointment.patientName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {procedures.find((p) => p.id === appointment.procedureIds[0])?.name || 'Процедура'}
                        </p>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader
                  title="Задачи"
                  description="К выполнению"
                  action={
                    <Badge variant="warning" dot>
                      {tasks.filter(t => !t.completed).length}
                    </Badge>
                  }
                />
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border transition-colors group',
                        task.completed
                          ? 'border-white/5 bg-white/5 opacity-60'
                          : 'border-white/5 hover:border-secondary/50'
                      )}
                    >
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={cn(
                          'p-1.5 rounded mt-0.5 transition-colors',
                          task.completed && 'bg-emerald-500/20 text-emerald-400',
                          !task.completed && task.priority === 'high' && 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
                          !task.completed && task.priority === 'medium' && 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
                          !task.completed && task.priority === 'low' && 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        )}
                      >
                        {task.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : task.priority === 'high' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-medium',
                          task.completed ? 'text-gray-500 line-through' : 'text-white'
                        )}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Срок: {task.due}
                        </p>
                      </div>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {showAddTask ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-white/5 rounded-xl"
                    >
                      <input
                        type="text"
                        placeholder="Название задачи..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-secondary mb-3"
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      />
                      <div className="flex gap-2 mb-3">
                        {(['high', 'medium', 'low'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setNewTaskPriority(p)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                              newTaskPriority === p
                                ? p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            )}
                          >
                            {p === 'high' ? 'Высокий' : p === 'medium' ? 'Средний' : 'Низкий'}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={addTask} leftIcon={<Plus className="w-4 h-4" />}>
                          Добавить
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                          Отмена
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => setShowAddTask(true)}
                    >
                      Добавить задачу
                    </Button>
                  )}
                </AnimatePresence>
              </Card>

              <Card padding="lg">
                <CardHeader
                  title="Команда"
                  description="Статус врачей"
                  action={
                    <Link href="/team">
                      <Button variant="ghost" size="sm">Все</Button>
                    </Link>
                  }
                />
                <div className="space-y-4">
                  {doctors.slice(0, 4).map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <Avatar
                        src={doctor.photo}
                        name={`${doctor.firstName} ${doctor.lastName}`}
                        size="md"
                        status={doctor.status}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {doctor.lastName} {doctor.firstName.charAt(0)}.
                        </p>
                        <p className="text-xs text-gray-400">
                          {doctor.specialization}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {doctor.appointmentsToday}
                        </p>
                        <p className="text-xs text-gray-400">записей</p>
                      </div>
                      <div className="w-16">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Загрузка</span>
                          <span>{doctor.loadPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${doctor.loadPercent}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={cn(
                              'h-full rounded-full',
                              doctor.loadPercent > 80 && 'bg-amber-500',
                              doctor.loadPercent > 95 && 'bg-red-500',
                              doctor.loadPercent <= 80 && 'bg-emerald-500'
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <StatCard
                label="Завершённые записи"
                value={analyticsData.appointments.completed}
                icon={<CheckCircle className="w-5 h-5" />}
                color="#10B981"
              />
              <StatCard
                label="Новые пациенты"
                value={analyticsData.patients.new}
                icon={<Users className="w-5 h-5" />}
                color="#3B82F6"
              />
              <StatCard
                label="Отменённые"
                value={analyticsData.appointments.cancelled}
                icon={<AlertCircle className="w-5 h-5" />}
                color="#EF4444"
              />
              <StatCard
                label="Средний чек"
                value={formatCurrency(12500)}
                icon={<DollarSign className="w-5 h-5" />}
                color="#8B5CF6"
              />
            </div>
          </motion.div>
        </main>
      </div>

      <AIAssistantWidget />

      <AnimatePresence>
        {showReportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setShowReportModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Скачать отчёт</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3">Тип отчёта</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'daily', label: 'Дневной', icon: Clock },
                      { id: 'weekly', label: 'Недельный', icon: Calendar },
                      { id: 'monthly', label: 'Месячный', icon: FileText },
                      { id: 'custom', label: 'Произвольный', icon: CalendarDays },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedReportType(type.id as ReportType)}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-xl border-2 transition-all',
                          selectedReportType === type.id
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        )}
                      >
                        <type.icon className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium text-white">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedReportType === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">От</label>
                      <input
                        type="date"
                        value={selectedPeriod.start}
                        onChange={(e) => setSelectedPeriod({ ...selectedPeriod, start: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">До</label>
                      <input
                        type="date"
                        value={selectedPeriod.end}
                        onChange={(e) => setSelectedPeriod({ ...selectedPeriod, end: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowReportModal(false)}>
                  Отмена
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={generateReport}
                  isLoading={isGeneratingReport}
                  leftIcon={<DownloadIcon className="w-4 h-4" />}
                >
                  Скачать
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
