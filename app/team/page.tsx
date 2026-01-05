'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users2,
  Plus,
  Phone,
  Mail,
  Calendar,
  Star,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  TrendingUp,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader, MetricCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/charts/DonutChart';
import { cn, formatCurrency } from '@/lib/utils';
import { doctors } from '@/data/mockData';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function TeamPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);

  const totalAppointments = doctors.reduce((sum, d) => sum + d.appointmentsToday, 0);
  const avgLoad = Math.round(doctors.reduce((sum, d) => sum + d.loadPercent, 0) / doctors.length);
  const avgRating = (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <h1 className="text-2xl font-bold text-gray-900">Команда</h1>
                <p className="text-gray-500 mt-1">
                  Управление сотрудниками клиники
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                  Настройки доступа
                </Button>
                <Button variant="secondary" leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
                  Добавить сотрудника
                </Button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Врачей"
                value={doctors.length}
                icon={<Users2 className="w-5 h-5" />}
              />
              <MetricCard
                title="Записей сегодня"
                value={totalAppointments}
                icon={<Calendar className="w-5 h-5" />}
              />
              <MetricCard
                title="Средняя загрузка"
                value={`${avgLoad}%`}
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <MetricCard
                title="Средний рейтинг"
                value={`${avgRating}`}
                icon={<Star className="w-5 h-5" />}
              />
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <Tabs
                tabs={[
                  { id: 'all', label: 'Все', count: doctors.length },
                  { id: 'online', label: 'Онлайн', count: doctors.filter((d) => d.status === 'online').length },
                  { id: 'doctors', label: 'Врачи', count: doctors.length },
                  { id: 'admins', label: 'Администраторы', count: 2 },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card padding="lg" hover>
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={doctor.photo}
                        name={`${doctor.firstName} ${doctor.lastName}`}
                        size="lg"
                        status={doctor.status}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {doctor.lastName} {doctor.firstName}
                            </h3>
                            <p className="text-sm text-gray-500">{doctor.specialization}</p>
                          </div>
                          <button className="p-1 rounded text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant={doctor.category === 'Высшая' ? 'success' : 'primary'}>
                            {doctor.category} категория
                          </Badge>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Записей сегодня</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {doctor.appointmentsToday}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Стаж</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {doctor.experience} лет
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Загрузка</span>
                        <span className="font-medium text-gray-900">{doctor.loadPercent}%</span>
                      </div>
                      <ProgressBar
                        value={doctor.loadPercent}
                        color={
                          doctor.loadPercent > 90 ? '#EF4444' :
                            doctor.loadPercent > 70 ? '#F59E0B' : '#10B981'
                        }
                      />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        leftIcon={<Calendar className="w-4 h-4" />}
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        График
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        leftIcon={<Edit className="w-4 h-4" />}
                      >
                        Изменить
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Add New Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: doctors.length * 0.1 }}
              >
                <Card
                  padding="lg"
                  className="border-dashed border-2 border-gray-200 bg-transparent hover:bg-gray-50 cursor-pointer"
                  onClick={() => setShowAddModal(true)}
                >
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-600">Добавить сотрудника</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Врач, администратор, ассистент
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Добавить сотрудника"
        size="lg"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Роль</p>
              <div className="grid grid-cols-3 gap-2">
                {['Врач', 'Администратор', 'Ассистент'].map((role) => (
                  <button
                    key={role}
                    className="p-3 text-sm font-medium rounded-lg border border-gray-200 hover:border-secondary hover:bg-secondary/5 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фото сотрудника
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-secondary cursor-pointer transition-colors">
                <Users2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Нажмите для загрузки</p>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Фамилия"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                placeholder="Имя"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                placeholder="Отчество"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <input
              type="tel"
              placeholder="Телефон"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <input
              type="text"
              placeholder="Специализация"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
              <option>Выберите категорию</option>
              <option>Высшая категория</option>
              <option>Первая категория</option>
              <option>Вторая категория</option>
              <option>Без категории</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Отмена
            </Button>
            <Button variant="secondary">Добавить сотрудника</Button>
          </div>
        </div>
      </Modal>

      {/* Doctor Schedule Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title="График работы"
        size="md"
      >
        {selectedDoctor && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                src={selectedDoctor.photo}
                name={`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDoctor.lastName} {selectedDoctor.firstName}
                </h3>
                <p className="text-gray-500">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { day: 'Понедельник', time: '08:00 - 20:00' },
                { day: 'Вторник', time: '08:00 - 20:00' },
                { day: 'Среда', time: '08:00 - 20:00' },
                { day: 'Четверг', time: '08:00 - 20:00' },
                { day: 'Пятница', time: '08:00 - 20:00' },
                { day: 'Суббота', time: '09:00 - 18:00' },
                { day: 'Воскресенье', time: 'Выходной' },
              ].map((schedule) => (
                <div
                  key={schedule.day}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{schedule.day}</span>
                  <span className="text-gray-600">{schedule.time}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
                Изменить график
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
