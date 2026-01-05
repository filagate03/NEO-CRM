'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  FileText,
  Stethoscope,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, SearchInput } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Table, DataTable } from '@/components/ui/Table';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate, formatPhone, calculateAge, generateId } from '@/lib/utils';
import { patients as initialPatients, procedures, doctors } from '@/data/mockData';
import { Patient } from '@/types';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function PatientsPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState(initialPatients);

  // Форма добавления пациента
  const [newPatient, setNewPatient] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    reason: '', // Причина обращения
  });

  const handleAddPatient = () => {
    if (!newPatient.lastName || !newPatient.firstName || !newPatient.phone) return;

    const now = new Date().toISOString();
    const patient: Patient = {
      id: generateId(),
      lastName: newPatient.lastName,
      firstName: newPatient.firstName,
      middleName: newPatient.middleName,
      birthDate: newPatient.birthDate || '1990-01-01',
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      status: 'new',
      balance: 0,
      notes: newPatient.reason ? `Причина обращения: ${newPatient.reason}` : undefined,
      createdAt: now,
      updatedAt: now,
    };

    setPatients([patient, ...patients]);
    setNewPatient({ lastName: '', firstName: '', middleName: '', birthDate: '', phone: '', email: '', address: '', reason: '' });
    setShowAddModal(false);
  };

  const handleBookAppointment = (patient: Patient) => {
    setShowPatientModal(false);
    router.push(`/appointments?patient=${patient.id}`);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === '' ||
      `${patient.lastName} ${patient.firstName} ${patient.middleName || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && patient.status === 'active') ||
      (activeTab === 'inactive' && patient.status === 'inactive') ||
      (activeTab === 'new' && patient.status === 'new');

    return matchesSearch && matchesTab;
  });

  const columns = [
    {
      key: 'patient',
      header: 'Пациент',
      width: '250px',
      render: (_: unknown, row: Patient) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={`${row.lastName} ${row.firstName}`}
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.lastName}${row.firstName}`}
            size="sm"
          />
          <div>
            <p className="font-medium text-gray-900">
              {row.lastName} {row.firstName} {row.middleName || ''}
            </p>
            <p className="text-xs text-gray-500">
              {calculateAge(row.birthDate)} лет • {row.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Последний визит',
      width: '150px',
      render: (value: string) => (
        <span className="text-gray-700">{value ? formatDate(value) : '—'}</span>
      ),
    },
    {
      key: 'assignedDoctor',
      header: 'Врач',
      width: '180px',
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">—</span>;
        const doctor = doctors.find(d => d.id === value);
        return <span className="text-gray-700">{doctor ? `${doctor.lastName} ${doctor.firstName[0]}.` : '—'}</span>;
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: '120px',
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'balance',
      header: 'Баланс',
      width: '120px',
      align: 'right' as const,
      render: (value: number) => (
        <span className={cn('font-medium', value < 0 ? 'text-red-600' : 'text-gray-900')}>
          {value > 0 ? '+' : ''}{value.toLocaleString()} ₽
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (_: unknown, row: Patient) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedPatient(row);
              setShowPatientModal(true);
            }}
            className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ] as any[];

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
                <h1 className="text-2xl font-bold text-gray-900">Пациенты</h1>
                <p className="text-gray-500 mt-1">
                  Всего {patients.length} пациентов
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                  Экспорт
                </Button>
                <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
                  Добавить пациента
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <Tabs
                tabs={[
                  { id: 'all', label: 'Все', count: patients.length },
                  { id: 'active', label: 'Активные', count: patients.filter((p) => p.status === 'active').length },
                  { id: 'inactive', label: 'Неактивные', count: patients.filter((p) => p.status === 'inactive').length },
                  { id: 'new', label: 'Новые', count: patients.filter((p) => p.status === 'new').length },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {/* Search and Filters */}
            <Card padding="md" className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Поиск по имени, телефону..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                    Фильтры
                  </Button>
                </div>
              </div>
            </Card>

            {/* Patients Table */}
            <Card padding="none">
              <Table
                columns={columns}
                data={filteredPatients}
                keyExtractor={(row) => row.id}
                onRowClick={(row) => {
                  setSelectedPatient(row);
                  setShowPatientModal(true);
                }}
                emptyMessage="Пациенты не найдены"
              />
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => {
          setShowPatientModal(false);
          setSelectedPatient(null);
        }}
        title="Карточка пациента"
        size="xl"
      >
        {selectedPatient && (
          <div className="p-6">
            {/* Patient Header */}
            <div className="flex items-start gap-4 mb-6">
              <Avatar
                name={`${selectedPatient.lastName} ${selectedPatient.firstName}`}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedPatient.lastName}${selectedPatient.firstName}`}
                size="xl"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPatient.lastName} {selectedPatient.firstName} {selectedPatient.middleName || ''}
                </h2>
                <p className="text-gray-500">
                  {calculateAge(selectedPatient.birthDate)} лет • {formatDate(selectedPatient.birthDate)}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <StatusBadge status={selectedPatient.status} />
                  <Badge variant="outline">Баланс: {selectedPatient.balance} ₽</Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Телефон</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {formatPhone(selectedPatient.phone)}
                </p>
              </div>
              {selectedPatient.email && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedPatient.email}
                  </p>
                </div>
              )}
              {selectedPatient.address && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Адрес</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedPatient.address}
                  </p>
                </div>
              )}
            </div>

            {/* Medical Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedPatient.bloodType && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Группа крови</p>
                  <p className="font-medium text-gray-900">{selectedPatient.bloodType}</p>
                </div>
              )}
              {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-sm text-red-600 mb-1">Аллергии</p>
                  <p className="font-medium text-red-700">{selectedPatient.allergies.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Dental Formula - 32 Teeth */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-lg">🦷</span> Зубная формула
              </h3>
              {/* Upper Jaw - Верхняя челюсть */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 text-center">Верхняя челюсть</p>
                <div className="flex justify-center gap-0.5">
                  {/* Right side (18-11) */}
                  {[18, 17, 16, 15, 14, 13, 12, 11].map(tooth => (
                    <button
                      key={tooth}
                      className="w-7 h-8 rounded-t-lg bg-white border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center"
                      title={`Зуб ${tooth}`}
                    >
                      {tooth}
                    </button>
                  ))}
                  <div className="w-px bg-gray-300 mx-1" />
                  {/* Left side (21-28) */}
                  {[21, 22, 23, 24, 25, 26, 27, 28].map(tooth => (
                    <button
                      key={tooth}
                      className="w-7 h-8 rounded-t-lg bg-white border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center"
                      title={`Зуб ${tooth}`}
                    >
                      {tooth}
                    </button>
                  ))}
                </div>
              </div>
              {/* Lower Jaw - Нижняя челюсть */}
              <div>
                <div className="flex justify-center gap-0.5">
                  {/* Right side (48-41) */}
                  {[48, 47, 46, 45, 44, 43, 42, 41].map(tooth => (
                    <button
                      key={tooth}
                      className="w-7 h-8 rounded-b-lg bg-white border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center"
                      title={`Зуб ${tooth}`}
                    >
                      {tooth}
                    </button>
                  ))}
                  <div className="w-px bg-gray-300 mx-1" />
                  {/* Left side (31-38) */}
                  {[31, 32, 33, 34, 35, 36, 37, 38].map(tooth => (
                    <button
                      key={tooth}
                      className="w-7 h-8 rounded-b-lg bg-white border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center"
                      title={`Зуб ${tooth}`}
                    >
                      {tooth}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Нижняя челюсть</p>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Нажмите на зуб для просмотра истории лечения</p>
            </div>

            {/* Visit History */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span> История визитов
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                {[
                  { date: '15.12.2025', procedure: 'Профессиональная чистка', doctor: 'Иванов П.С.', price: 5000 },
                  { date: '01.11.2025', procedure: 'Лечение кариеса (36)', doctor: 'Петрова М.А.', price: 8500 },
                  { date: '20.09.2025', procedure: 'Консультация', doctor: 'Иванов П.С.', price: 1500 },
                ].map((visit, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{visit.date}</span>
                      <span className="font-medium text-gray-800">{visit.procedure}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-secondary font-medium">{visit.price.toLocaleString()} ₽</span>
                      <span className="text-gray-500 text-xs">{visit.doctor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Treatment Plan */}
            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🎯</span> Текущий план лечения
              </h3>
              <div className="space-y-3">
                {[
                  { stage: 1, name: 'Консультация и диагностика', status: 'completed', date: '20.09.2025' },
                  { stage: 2, name: 'Профессиональная чистка', status: 'completed', date: '15.12.2025' },
                  { stage: 3, name: 'Лечение кариеса (зубы 36, 37)', status: 'in_progress', date: 'В процессе' },
                  { stage: 4, name: 'Установка пломб', status: 'planned', date: 'Запланировано' },
                  { stage: 5, name: 'Контрольный осмотр', status: 'planned', date: 'Через 2 недели' },
                ].map((step) => (
                  <div key={step.stage} className="flex items-center gap-3">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                      step.status === 'completed' && 'bg-emerald-500 text-white',
                      step.status === 'in_progress' && 'bg-amber-500 text-white',
                      step.status === 'planned' && 'bg-gray-200 text-gray-600'
                    )}>
                      {step.status === 'completed' ? '✓' : step.stage}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        'text-sm font-medium',
                        step.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                      )}>
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-400">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Прогресс плана:</span>
                  <span className="text-sm font-semibold text-emerald-600">40% завершено</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>

            {/* Services & Payment */}
            <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">💳</span> Услуги и оплата
              </h3>
              <div className="space-y-2">
                {[
                  { service: 'План лечения "Комплексный"', total: 45000, paid: 15000 },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{item.service}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.total.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Оплачено: <span className="text-emerald-600 font-medium">{item.paid.toLocaleString()} ₽</span></span>
                      <span className="text-amber-600 font-medium">Долг: {(item.total - item.paid).toLocaleString()} ₽</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(item.paid / item.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  Принять оплату
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  История платежей
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                leftIcon={<Calendar className="w-4 h-4" />}
                onClick={() => handleBookAppointment(selectedPatient)}
              >
                Записать на приём
              </Button>
              <Button
                variant="outline"
                leftIcon={<Edit className="w-4 h-4" />}
                onClick={() => router.push(`/patients/${selectedPatient.id}/edit`)}
              >
                Редактировать
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Добавить пациента"
        size="lg"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Фамилия *"
              placeholder="Введите фамилию"
              value={newPatient.lastName}
              onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
            />
            <Input
              label="Имя *"
              placeholder="Введите имя"
              value={newPatient.firstName}
              onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
            />
            <Input
              label="Отчество"
              placeholder="Введите отчество"
              value={newPatient.middleName}
              onChange={(e) => setNewPatient({ ...newPatient, middleName: e.target.value })}
            />
            <Input
              label="Дата рождения"
              type="date"
              value={newPatient.birthDate}
              onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
            />
            <Input
              label="Телефон *"
              placeholder="+7 (___) ___-__-__"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            />
            <Input
              label="Адрес"
              placeholder="г. Москва, ул..."
              className="md:col-span-2"
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Stethoscope className="w-4 h-4 inline mr-1" />
                Причина обращения
              </label>
              <textarea
                placeholder="Опишите причину обращения пациента..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                value={newPatient.reason}
                onChange={(e) => setNewPatient({ ...newPatient, reason: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Отмена
            </Button>
            <Button
              variant="secondary"
              onClick={handleAddPatient}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Добавить пациента
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
