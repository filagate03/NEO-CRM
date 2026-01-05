'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MapPin,
  Filter,
  Grid,
  List,
  RefreshCw,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate, formatTime, getWeekDays, getMonths } from '@/lib/utils';
import { appointments, patients, doctors, procedures } from '@/data/mockData';
import { Appointment } from '@/types';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const viewModes = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
];

const statusColors: Record<string, string> = {
  scheduled: '#3B82F6',
  confirmed: '#10B981',
  in_progress: '#F59E0B',
  completed: '#10B981',
  cancelled: '#EF4444',
  no_show: '#6B7280',
};

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [highlightedAppointmentId, setHighlightedAppointmentId] = useState<string | null>(null);

  // Автоматическое открытие модала при переходе с ?patient= или ?appointment=
  useEffect(() => {
    const patientId = searchParams.get('patient');
    const appointmentId = searchParams.get('appointment');
    const dateParam = searchParams.get('date');

    if (patientId) {
      setSelectedPatientId(patientId);
      setShowAddModal(true);
    }

    if (appointmentId) {
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
        setHighlightedAppointmentId(appointmentId);

        // Устанавливаем дату записи
        if (appointment.date) {
          const appointmentDate = new Date(appointment.date);
          setCurrentDate(appointmentDate);
          setViewMode('day');
        }
      }
    }

    if (dateParam) {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        setCurrentDate(date);
        setViewMode('day');
      }
    }
  }, [searchParams]);

  const weekDays = getWeekDays();
  const months = getMonths();

  // Генерация слотов для календаря (полные 24 часа)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0:00 - 23:00

  const getAppointmentColor = (appointment: Appointment) => {
    return statusColors[appointment.status] || '#3B82F6';
  };

  const getProcedureName = (ids: string[]) => {
    if (ids.length === 0) return 'Не указано';
    const proc = procedures.find((p) => p.id === ids[0]);
    return proc?.name || 'Процедура';
  };

  // Фильтрация записей для отображения
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((a) => a.date === dateStr && a.status !== 'cancelled');
  };

  const goToToday = () => setCurrentDate(new Date());

  // День навигация
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Неделя навигация
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Месяц навигация
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Универсальная навигация в зависимости от режима
  const goToPrevious = () => {
    if (viewMode === 'day') goToPreviousDay();
    else if (viewMode === 'week') goToPreviousWeek();
    else goToPreviousMonth();
  };
  const goToNext = () => {
    if (viewMode === 'day') goToNextDay();
    else if (viewMode === 'week') goToNextWeek();
    else goToNextMonth();
  };

  // Генерация дней недели
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Понедельник

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Расписание</h1>
                <p className="text-gray-500 mt-1">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Синхронизировать
                </Button>
                <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
                  Новая запись
                </Button>
              </div>
            </div>

            {/* Calendar Controls */}
            <Card padding="md" className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevious}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Сегодня
                  </button>
                  <button
                    onClick={goToNext}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-lg font-medium text-gray-900 ml-2">
                    {formatDate(currentDate, { month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    {viewModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id)}
                        className={cn(
                          'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                          viewMode === mode.id
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                    Фильтры
                  </Button>
                </div>
              </div>
            </Card>

            {/* Calendar Grid - День */}
            {viewMode === 'day' && (
              <Card padding="none" className="overflow-hidden">
                <div className="flex">
                  {/* Time Column */}
                  <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                    <div className="h-14 border-b border-gray-200" />
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 px-2 py-1 text-xs text-gray-500 text-right border-b border-gray-100"
                      >
                        {String(hour).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>
                  {/* Single Day Column */}
                  <div className="flex-1">
                    <div className="p-3 text-center border-b border-gray-200 bg-secondary/10">
                      <p className="text-xs text-gray-500 uppercase">
                        {weekDays[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}
                      </p>
                      <p className="text-lg font-semibold text-secondary">
                        {currentDate.getDate()}
                      </p>
                    </div>
                    <div className="relative">
                      {timeSlots.map((hour) => {
                        const dateStr = currentDate.toISOString().split('T')[0];
                        const hourAppointments = appointments.filter(
                          (a) =>
                            a.date === dateStr &&
                            a.status !== 'cancelled' &&
                            parseInt(a.time.split(':')[0]) === hour
                        );
                        return (
                          <div
                            key={hour}
                            className="h-16 border-b border-gray-100 p-1 relative cursor-pointer hover:bg-secondary/5 transition-colors"
                            onClick={() => {
                              if (hourAppointments.length === 0) {
                                setShowAddModal(true);
                              }
                            }}
                          >
                            {hourAppointments.map((apt) => (
                              <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                  'absolute left-1 right-1 rounded-md p-2 cursor-pointer hover:shadow-md transition-shadow',
                                  highlightedAppointmentId === apt.id && 'ring-2 ring-secondary ring-offset-2'
                                )}
                                style={{
                                  backgroundColor: getAppointmentColor(apt),
                                  top: `${parseInt(apt.time.split(':')[1]) * 2}px`,
                                  height: `${apt.duration * 2}px`,
                                }}
                                onClick={() => {
                                  setSelectedAppointment(apt);
                                  setShowDetailsModal(true);
                                  setHighlightedAppointmentId(null);
                                }}
                              >
                                <p className="text-white text-xs font-medium truncate">
                                  {apt.patientName}
                                </p>
                                <p className="text-white/80 text-[10px] truncate">
                                  {getProcedureName(apt.procedureIds)}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Calendar Grid - Неделя */}
            {viewMode === 'week' && (
              <Card padding="none" className="overflow-hidden">
                <div className="flex">
                  {/* Time Column */}
                  <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                    <div className="h-14 border-b border-gray-200" />
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 px-2 py-1 text-xs text-gray-500 text-right border-b border-gray-100"
                      >
                        {String(hour).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  {/* Days Columns */}
                  <div className="flex-1 overflow-x-auto">
                    {/* Day Headers */}
                    <div className="flex border-b border-gray-200">
                      {weekDates.map((date, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex-1 min-w-[140px] p-3 text-center border-r border-gray-100 last:border-r-0',
                            isToday(date) && 'bg-secondary/10'
                          )}
                        >
                          <p className="text-xs text-gray-500 uppercase">
                            {weekDays[index]}
                          </p>
                          <p
                            className={cn(
                              'text-lg font-semibold',
                              isToday(date) ? 'text-secondary' : 'text-gray-900'
                            )}
                          >
                            {date.getDate()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Time Slots */}
                    <div className="relative">
                      {timeSlots.map((hour) => (
                        <div key={hour} className="flex h-16 border-b border-gray-100">
                          {weekDates.map((date, dayIndex) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const dayAppointments = appointments.filter(
                              (a) =>
                                a.date === dateStr &&
                                a.status !== 'cancelled' &&
                                parseInt(a.time.split(':')[0]) === hour
                            );

                            return (
                              <div
                                key={dayIndex}
                                className={cn(
                                  'flex-1 min-w-[140px] border-r border-gray-100 last:border-r-0 p-1 relative',
                                  isToday(date) && 'bg-secondary/5'
                                )}
                              >
                                {dayAppointments.map((apt) => (
                                  <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                      'absolute left-1 right-1 rounded-md p-2 cursor-pointer hover:shadow-md transition-shadow',
                                      highlightedAppointmentId === apt.id && 'ring-2 ring-secondary ring-offset-2'
                                    )}
                                    style={{
                                      backgroundColor: getAppointmentColor(apt),
                                      top: `${parseInt(apt.time.split(':')[1]) * 2}px`,
                                      height: `${apt.duration * 2}px`,
                                    }}
                                    onClick={() => {
                                      setSelectedAppointment(apt);
                                      setShowDetailsModal(true);
                                      setHighlightedAppointmentId(null);
                                    }}
                                  >
                                    <p className="text-white text-xs font-medium truncate">
                                      {apt.patientName.split(' ')[0]} {apt.patientName.split(' ')[1]?.charAt(0)}.
                                    </p>
                                    <p className="text-white/80 text-[10px] truncate">
                                      {getProcedureName(apt.procedureIds)}
                                    </p>
                                    <p className="text-white/60 text-[10px] mt-0.5">
                                      {apt.time} • {apt.doctorName}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Calendar Grid - Месяц */}
            {viewMode === 'month' && (
              <Card padding="md" className="overflow-hidden">
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {weekDays.map((day, i) => (
                    <div key={i} className="p-2 text-center text-xs text-gray-500 uppercase font-medium">
                      {day}
                    </div>
                  ))}
                  {/* Month Days */}
                  {(() => {
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                    const days = [];

                    // Empty cells for offset
                    for (let i = 0; i < startOffset; i++) {
                      days.push(<div key={`empty-${i}`} className="p-2 min-h-[80px]" />);
                    }

                    // Days of month
                    for (let day = 1; day <= lastDay.getDate(); day++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayAppointments = appointments.filter(a => a.date === dateStr && a.status !== 'cancelled');
                      const isCurrentDay = new Date().toDateString() === new Date(year, month, day).toDateString();

                      days.push(
                        <div
                          key={day}
                          className={cn(
                            'p-2 min-h-[80px] border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer',
                            isCurrentDay && 'bg-secondary/10 border-secondary/30'
                          )}
                          onClick={() => {
                            setCurrentDate(new Date(year, month, day));
                            setViewMode('day');
                          }}
                        >
                          <p className={cn(
                            'text-sm font-medium mb-1',
                            isCurrentDay ? 'text-secondary' : 'text-gray-900'
                          )}>
                            {day}
                          </p>
                          {dayAppointments.slice(0, 2).map((apt) => (
                            <div
                              key={apt.id}
                              className={cn(
                                'text-[10px] p-1 rounded mb-0.5 text-white truncate cursor-pointer hover:opacity-80 transition-opacity',
                                highlightedAppointmentId === apt.id && 'ring-2 ring-secondary ring-offset-1'
                              )}
                              style={{ backgroundColor: getAppointmentColor(apt) }}
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setShowDetailsModal(true);
                                setHighlightedAppointmentId(null);
                              }}
                            >
                              {apt.time} {apt.patientName.split(' ')[0]}
                            </div>
                          ))}
                          {dayAppointments.length > 2 && (
                            <p className="text-[10px] text-gray-500">+{dayAppointments.length - 2} ещё</p>
                          )}
                        </div>
                      );
                    }

                    return days;
                  })()}
                </div>
              </Card>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Запланировано</p>
                    <p className="text-xl font-bold text-gray-900">
                      {appointments.filter((a) => a.status === 'scheduled').length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">В процессе</p>
                    <p className="text-xl font-bold text-gray-900">
                      {appointments.filter((a) => a.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">На сегодня</p>
                    <p className="text-xl font-bold text-gray-900">
                      {appointments.filter(
                        (a) => a.date === new Date().toISOString().split('T')[0]
                      ).length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Врачей</p>
                    <p className="text-xl font-bold text-gray-900">
                      {doctors.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPatientId('');
        }}
        title="Новая запись"
        size="lg"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Пациент */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пациент *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="">Выберите пациента</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.lastName} {p.firstName} {p.middleName || ''}
                  </option>
                ))}
              </select>
            </div>
            {/* Врач */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Врач *</label>
              <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                <option value="">Выберите врача</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.lastName} {d.firstName} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>
            {/* Дата */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата *</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            {/* Время */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время *</label>
              <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                <option value="">Выберите время</option>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            {/* Услуга/Процедура */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Услуга *</label>
              <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                <option value="">Выберите услугу</option>
                {procedures.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.price.toLocaleString()} ₽ ({p.duration} мин)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Дополнительная информация..."
            />
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Отмена
            </Button>
            <Button variant="secondary">Создать запись</Button>
          </div>
        </div>
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
        }}
        title="Детали записи"
        size="md"
      >
        {selectedAppointment && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                name={selectedAppointment.patientName}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedAppointment.patientName}
                </h3>
                <p className="text-gray-500">
                  {getProcedureName(selectedAppointment.procedureIds)}
                </p>
              </div>
              <StatusBadge status={selectedAppointment.status} className="ml-auto" />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Дата и время</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedAppointment.date)} в {formatTime(selectedAppointment.time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Длительность</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.duration} мин</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Врач</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Стоимость</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.price.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <Button variant="secondary" leftIcon={<Clock className="w-4 h-4" />}>
                Перенести
              </Button>
              <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
                Подтвердить
              </Button>
              <Button variant="outline" className="ml-auto text-red-600 hover:bg-red-50">
                Отменить
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Загрузка...</div>
    </div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
