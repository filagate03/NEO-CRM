'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building,
  Clock,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Smartphone,
  Mail,
  Link2,
  FileText,
  Save,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Tabs, VerticalTabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { clinicSettings } from '@/data/mockData';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const settingsTabs = [
  { id: 'profile', label: 'Мой профиль', icon: <Settings className="w-5 h-5" /> },
  { id: 'clinic', label: 'Клиника', icon: <Building className="w-5 h-5" /> },
  { id: 'staff', label: 'Сотрудники', icon: <Shield className="w-5 h-5" /> },
  { id: 'schedule', label: 'График работы', icon: <Clock className="w-5 h-5" /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-5 h-5" /> },
  { id: 'appearance', label: 'Внешний вид', icon: <Palette className="w-5 h-5" /> },
  { id: 'integrations', label: 'Интеграции', icon: <Link2 className="w-5 h-5" /> },
  { id: 'billing', label: 'Платёжные системы', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'security', label: 'Безопасность', icon: <Shield className="w-5 h-5" /> },
  { id: 'documents', label: 'Шаблоны документов', icon: <FileText className="w-5 h-5" /> },
];

const initialIntegrations = [
  { id: 1, name: 'Telegram Bot', description: 'Уведомления и запись через Telegram', connected: true, icon: '📱' },
  { id: 2, name: 'CloudPayments', description: 'Приём платежей онлайн', connected: true, icon: '💳' },
  { id: 3, name: 'ЮKassa', description: 'Приём платежей онлайн', connected: false, icon: '💰' },
  { id: 4, name: 'Google Calendar', description: 'Синхронизация календаря', connected: true, icon: '📅' },
  { id: 5, name: '1С:Бухгалтерия', description: 'Интеграция с бухгалтерией', connected: false, icon: '📊' },
  { id: 6, name: 'МедЭксперт', description: 'Медицинская информационная система', connected: false, icon: '🏥' },
];

const availableTimezones = [
  { id: 'Europe/Moscow', city: 'Москва', flag: '🇷🇺', offset: 'UTC+3' },
  { id: 'Europe/London', city: 'Лондон', flag: '🇬🇧', offset: 'UTC+0' },
  { id: 'America/New_York', city: 'Нью-Йорк', flag: '🇺🇸', offset: 'UTC-5' },
  { id: 'Asia/Tokyo', city: 'Токио', flag: '🇯🇵', offset: 'UTC+9' },
  { id: 'Asia/Dubai', city: 'Дубай', flag: '🇦🇪', offset: 'UTC+4' },
  { id: 'Europe/Paris', city: 'Париж', flag: '🇫🇷', offset: 'UTC+1' },
  { id: 'Asia/Shanghai', city: 'Шанхай', flag: '🇨🇳', offset: 'UTC+8' },
  { id: 'Australia/Sydney', city: 'Сидней', flag: '🇦🇺', offset: 'UTC+11' },
];

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);

  // Настройки внешнего вида
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedColor, setSelectedColor] = useState('#00D4AA');
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const [selectedDateFormat, setSelectedDateFormat] = useState('DD.MM.YYYY');
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['Europe/Moscow', 'Europe/London', 'America/New_York', 'Asia/Tokyo']);

  // Интеграции
  const [integrations, setIntegrations] = useState(initialIntegrations);

  // Функция подключения/отключения интеграции
  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map((int) =>
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedColor = localStorage.getItem('accentColor') || '#00D4AA';
    const savedLanguage = localStorage.getItem('language') || 'ru';
    const savedDateFormat = localStorage.getItem('dateFormat') || 'DD.MM.YYYY';
    const savedTimezones = JSON.parse(localStorage.getItem('worldClocks') || '["Europe/Moscow", "Europe/London", "America/New_York", "Asia/Tokyo"]');

    setSelectedTheme(savedTheme);
    setSelectedColor(savedColor);
    setSelectedLanguage(savedLanguage);
    setSelectedDateFormat(savedDateFormat);
    setSelectedTimezones(savedTimezones);

    // Применяем тему
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }

    // Применяем цвет акцента
    document.documentElement.style.setProperty('--color-secondary', savedColor);
  }, []);

  // Функция сохранения темы
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('theme', themeId);

    if (themeId === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeId === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (themeId === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Функция сохранения цвета акцента
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem('accentColor', color);
    document.documentElement.style.setProperty('--color-secondary', color);
  };

  // Функция сохранения языка
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);
    // Можно добавить i18n переключение здесь
  };

  // Читаем ?tab= параметр из URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && settingsTabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, []);


  return (
    <div className="min-h-screen bg-background">
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Настройки</h1>
              <p className="text-gray-400 mt-1">
                Управление настройками клиники и системы
              </p>
            </div>

            <div className="flex gap-6">
              {/* Sidebar Tabs */}
              <div className="w-64 flex-shrink-0">
                <Card padding="sm">
                  <VerticalTabs
                    tabs={settingsTabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                  />
                </Card>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Мой профиль"
                      description="Настройки вашего аккаунта"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="md:col-span-2 flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                          АД
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-white">Администратор</p>
                          <p className="text-gray-400">Директор клиники</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Изменить фото
                          </Button>
                        </div>
                      </div>
                      <Input label="Имя" defaultValue="Александр" />
                      <Input label="Фамилия" defaultValue="Дмитриев" />
                      <Input label="Email" type="email" defaultValue="admin@dentalpro.ru" />
                      <Input label="Телефон" defaultValue="+7 (495) 123-45-67" />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                        <Select
                          options={[
                            { value: 'director', label: 'Директор' },
                            { value: 'manager', label: 'Менеджер' },
                            { value: 'doctor', label: 'Врач' },
                            { value: 'admin', label: 'Администратор' },
                          ]}
                          className="w-48"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                      <Button variant="outline">Отмена</Button>
                      <Button variant="secondary" leftIcon={<Save className="w-4 h-4" />}>
                        Сохранить
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Staff Tab */}
                {activeTab === 'staff' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Управление сотрудниками"
                      description="Врачи и менеджеры клиники"
                      action={
                        <Button variant="secondary" size="sm">
                          + Добавить сотрудника
                        </Button>
                      }
                    />
                    <div className="mt-6 space-y-4">
                      {[
                        { name: 'Иванов Пётр', role: 'Врач-стоматолог', access: 'doctor', status: 'online' },
                        { name: 'Петрова Мария', role: 'Ортодонт', access: 'doctor', status: 'online' },
                        { name: 'Сидорова Анна', role: 'Менеджер', access: 'manager', status: 'offline' },
                        { name: 'Козлов Дмитрий', role: 'Хирург', access: 'doctor', status: 'online' },
                      ].map((staff, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium">
                                {staff.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className={cn(
                                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                staff.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                              )} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{staff.name}</p>
                              <p className="text-sm text-gray-400">{staff.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Select
                              options={[
                                { value: 'director', label: 'Директор (полный доступ)' },
                                { value: 'manager', label: 'Менеджер' },
                                { value: 'doctor', label: 'Врач' },
                                { value: 'readonly', label: 'Только просмотр' },
                              ]}
                              className="w-52"
                            />
                            <Button variant="outline" size="sm">
                              Настроить
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
                      <p className="text-sm font-medium text-white">💡 Права доступа</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Директор имеет полный доступ ко всем разделам. Менеджеры могут управлять записями и пациентами.
                        Врачи видят только своих пациентов и записи.
                      </p>
                    </div>
                  </Card>
                )}

                {activeTab === 'clinic' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Информация о клинике"
                      description="Основные данные вашей клиники"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Input
                        label="Название клиники"
                        defaultValue={clinicSettings.name}
                      />
                      <Input
                        label="ИНН"
                        defaultValue={clinicSettings.inn}
                      />
                      <Input
                        label="ОГРН"
                        defaultValue={clinicSettings.ogrn}
                      />
                      <Input
                        label="ФИО директора"
                        defaultValue={clinicSettings.directorName}
                      />
                      <Input
                        label="Телефон"
                        defaultValue={clinicSettings.phone}
                        leftIcon="phone"
                      />
                      <Input
                        label="Email"
                        type="email"
                        defaultValue={clinicSettings.email}
                        leftIcon="email"
                      />
                      <div className="md:col-span-2">
                        <Textarea
                          label="Адрес"
                          defaultValue={clinicSettings.address}
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                      <Button variant="outline">Отмена</Button>
                      <Button variant="secondary" leftIcon={<Save className="w-4 h-4" />}>
                        Сохранить
                      </Button>
                    </div>
                  </Card>
                )}

                {activeTab === 'schedule' && (
                  <Card padding="lg">
                    <CardHeader
                      title="График работы"
                      description="Настройка рабочего времени и перерывов"
                    />
                    <div className="mt-6 space-y-4">
                      {[
                        { day: 'Понедельник', value: 'Пн' },
                        { day: 'Вторник', value: 'Вт' },
                        { day: 'Среда', value: 'Ср' },
                        { day: 'Четверг', value: 'Чт' },
                        { day: 'Пятница', value: 'Пт' },
                        { day: 'Суббота', value: 'Сб' },
                        { day: 'Воскресенье', value: 'Вс' },
                      ].map((item, index) => {
                        const schedule = clinicSettings.workSchedule.find(
                          (s) => s.day === (index + 1) % 7
                        );
                        const isWorking = schedule?.isWorking;

                        return (
                          <div
                            key={item.day}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                          >
                            <span className="w-20 text-sm font-medium text-white">
                              {item.day}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                className={cn(
                                  'w-12 h-6 rounded-full transition-colors',
                                  isWorking ? 'bg-secondary' : 'bg-gray-300'
                                )}
                                onClick={() => { }}
                              >
                                <div
                                  className={cn(
                                    'w-5 h-5 bg-white rounded-full shadow transition-transform',
                                    isWorking ? 'translate-x-6' : 'translate-x-0.5'
                                  )}
                                />
                              </button>
                              <span className="text-sm text-gray-400">
                                {isWorking ? 'Рабочий' : 'Выходной'}
                              </span>
                            </div>
                            {isWorking && (
                              <div className="flex items-center gap-2 ml-auto">
                                <input
                                  type="time"
                                  defaultValue={schedule?.startTime}
                                  className="px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
                                />
                                <span className="text-gray-400">—</span>
                                <input
                                  type="time"
                                  defaultValue={schedule?.endTime}
                                  className="px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/5 text-white"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Длительность записи (минут)"
                          type="number"
                          defaultValue={clinicSettings.appointmentDuration}
                        />
                        <Input
                          label="Напомнить за (часов)"
                          type="number"
                          defaultValue={clinicSettings.reminderHours}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                      <Button variant="secondary" leftIcon={<Save className="w-4 h-4" />}>
                        Сохранить
                      </Button>
                    </div>
                  </Card>
                )}

                {activeTab === 'notifications' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Уведомления"
                      description="Настройка уведомлений и отправка сообщений сотрудникам"
                    />
                    <div className="mt-6 space-y-6">
                      {/* Настройки уведомлений */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Каналы уведомлений</p>
                        <div className="space-y-3">
                          {[
                            { id: 'email', label: 'Email уведомления', desc: 'Получать уведомления на почту' },
                            { id: 'telegram', label: 'Telegram', desc: 'Получать уведомления в Telegram' },
                            { id: 'sms', label: 'SMS уведомления', desc: 'Получать SMS о важных событиях' },
                            { id: 'push', label: 'Push уведомления', desc: 'Уведомления в браузере' },
                          ].map((channel) => (
                            <div key={channel.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                              <div>
                                <p className="font-medium text-white">{channel.label}</p>
                                <p className="text-sm text-gray-400">{channel.desc}</p>
                              </div>
                              <button className="w-12 h-6 bg-secondary rounded-full relative transition-colors">
                                <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Отправить сообщение сотруднику */}
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-3">Отправить сообщение сотруднику</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Select
                            label="Выберите сотрудника"
                            options={[
                              { value: 'all', label: '👥 Всем сотрудникам' },
                              { value: 'doc1', label: '👨‍⚕️ Иванов Пётр Сергеевич' },
                              { value: 'doc2', label: '👩‍⚕️ Петрова Мария Александровна' },
                              { value: 'admin', label: '👩‍💼 Сидорова Анна Викторовна' },
                              { value: 'nurse', label: '👩‍⚕️ Козлова Елена Игоревна' },
                            ]}
                          />
                          <Select
                            label="Канал отправки"
                            options={[
                              { value: 'telegram', label: '📱 Telegram' },
                              { value: 'email', label: '📧 Email' },
                              { value: 'both', label: '📤 Все каналы' },
                            ]}
                          />
                        </div>
                        <Textarea
                          label="Текст сообщения"
                          placeholder="Введите сообщение для сотрудника..."
                          rows={4}
                        />
                        <div className="flex gap-3 mt-4">
                          <Button variant="secondary">
                            Отправить сообщение
                          </Button>
                          <Button variant="outline">
                            Запланировать
                          </Button>
                        </div>
                      </div>

                      {/* История сообщений */}
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-3">Последние сообщения</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {[
                            { to: 'Всем сотрудникам', text: 'Завтра собрание в 10:00', time: '10 мин назад', channel: 'Telegram' },
                            { to: 'Иванов П.С.', text: 'Новое расписание на январь', time: '2 часа назад', channel: 'Email' },
                            { to: 'Петрова М.А.', text: 'Подтвердите отпуск на 15-20 января', time: 'вчера', channel: 'Telegram' },
                          ].map((msg, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-white text-sm">{msg.to}</span>
                                <span className="text-xs text-gray-500">{msg.time}</span>
                              </div>
                              <p className="text-sm text-gray-400 truncate">{msg.text}</p>
                              <span className="text-xs text-secondary">{msg.channel}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'appearance' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Внешний вид"
                      description="Настройки темы и интерфейса"
                    />
                    <div className="mt-6 space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Тема</p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'light', label: 'Светлая', icon: '☀️' },
                            { id: 'dark', label: 'Тёмная', icon: '🌙' },
                            { id: 'system', label: 'Системная', icon: '💻' },
                          ].map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => handleThemeChange(theme.id)}
                              className={cn(
                                'p-4 rounded-lg border-2 transition-all',
                                theme.id === selectedTheme
                                  ? 'border-secondary bg-secondary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              )}
                            >
                              <span className="text-2xl">{theme.icon}</span>
                              <p className="text-sm font-medium text-gray-900 mt-2">
                                {theme.label}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Цвет акцента</p>
                        <div className="flex gap-3">
                          {['#00D4AA', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'].map((color) => (
                            <button
                              key={color}
                              onClick={() => handleColorChange(color)}
                              className={cn(
                                'w-10 h-10 rounded-full transition-transform hover:scale-110',
                                color === selectedColor && 'ring-2 ring-offset-2 ring-gray-800'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Мировые часы</p>
                        <p className="text-xs text-gray-500 mb-3">Выберите до 4 городов для отображения в шапке</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {availableTimezones.map((tz) => (
                            <button
                              key={tz.id}
                              onClick={() => {
                                const newTimezones = selectedTimezones.includes(tz.id)
                                  ? selectedTimezones.filter(id => id !== tz.id)
                                  : [...selectedTimezones, tz.id].slice(0, 4);
                                setSelectedTimezones(newTimezones);
                                localStorage.setItem('worldClocks', JSON.stringify(newTimezones));
                              }}
                              className={cn(
                                'p-3 rounded-lg border-2 transition-all',
                                selectedTimezones.includes(tz.id)
                                  ? 'border-secondary bg-secondary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              )}
                            >
                              <span className="text-xl">{tz.flag}</span>
                              <p className="text-xs font-medium text-gray-900 mt-1">
                                {tz.city}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {tz.offset}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Язык интерфейса</p>
                        <Select
                          options={[
                            { value: 'ru', label: 'Русский' },
                            { value: 'en', label: 'English' },
                          ]}
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="w-48"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Формат даты</p>
                        <Select
                          options={[
                            { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
                            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                          ]}
                          value={selectedDateFormat}
                          onChange={(e) => {
                            setSelectedDateFormat(e.target.value);
                            localStorage.setItem('dateFormat', e.target.value);
                          }}
                          className="w-48"
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'integrations' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Интеграции"
                      description="Подключение внешних сервисов"
                    />
                    <div className="mt-6 space-y-4">
                      {integrations.map((integration) => (
                        <div
                          key={integration.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <p className="font-medium text-white">{integration.name}</p>
                              <p className="text-sm text-gray-400">{integration.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {integration.connected ? (
                              <>
                                <Badge variant="success" dot>Подключено</Badge>
                                <Button variant="outline" size="sm" onClick={() => toggleIntegration(integration.id)}>
                                  Отключить
                                </Button>
                              </>
                            ) : (
                              <Button variant="secondary" size="sm" onClick={() => toggleIntegration(integration.id)}>
                                Подключить
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === 'billing' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Платёжные системы"
                      description="Настройки приёма платежей"
                    />
                    <div className="mt-6 space-y-6">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-white">CloudPayments</p>
                              <p className="text-sm text-gray-400">Приём карт и платежей</p>
                            </div>
                          </div>
                          <Badge variant="success" dot>Активен</Badge>
                        </div>
                        <div className="space-y-3">
                          <Input
                            label="Public ID"
                            defaultValue="pk_123456789"
                            type={showApiKey ? 'text' : 'password'}
                            rightIcon={
                              <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">💳</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">ЮKassa</p>
                              <p className="text-sm text-gray-400">Альтернативный способ оплаты</p>
                            </div>
                          </div>
                          <Badge variant="default">Не подключен</Badge>
                        </div>
                        <Button variant="outline" className="w-full">
                          Подключить ЮKassa
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'notifications' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Уведомления"
                      description="Настройка уведомлений и напоминаний"
                    />
                    <div className="mt-6 space-y-6">
                      {[
                        { title: 'SMS-уведомления', description: 'Отправка SMS пациентам', enabled: true },
                        { title: 'Email-уведомления', description: 'Отправка Email пациентам', enabled: true },
                        { title: 'Push-уведомления', description: 'Push-уведомления в браузере', enabled: false },
                        { title: 'Telegram-уведомления', description: 'Уведомления через Telegram', enabled: true },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                          <button
                            className={cn(
                              'w-12 h-6 rounded-full transition-colors',
                              item.enabled ? 'bg-secondary' : 'bg-gray-300'
                            )}
                          >
                            <div
                              className={cn(
                                'w-5 h-5 bg-white rounded-full shadow transition-transform',
                                item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === 'security' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Безопасность"
                      description="Настройки безопасности и доступа"
                    />
                    <div className="mt-6 space-y-6">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="font-medium text-white mb-3">Смена пароля</p>
                        <div className="space-y-3">
                          <Input label="Текущий пароль" type="password" />
                          <Input label="Новый пароль" type="password" />
                          <Input label="Подтвердите пароль" type="password" />
                        </div>
                        <Button variant="secondary" className="mt-4">
                          Изменить пароль
                        </Button>
                      </div>

                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="font-medium text-white mb-3">Двухфакторная аутентификация</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Дополнительная защита аккаунта через SMS или приложение
                        </p>
                        <Button variant="outline">Включить 2FA</Button>
                      </div>

                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="font-medium text-white mb-3">Сеансы</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Активные сеансы на других устройствах
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-white">Chrome на Windows</p>
                                <p className="text-xs text-gray-500">Москва, текущая сессия</p>
                              </div>
                            </div>
                            <Badge variant="success" dot>Активен</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'documents' && (
                  <Card padding="lg">
                    <CardHeader
                      title="Шаблоны документов"
                      description="Настройка шаблонов для автоматической генерации"
                    />
                    <div className="mt-6 space-y-4">
                      {[
                        { id: 1, name: 'Договор на лечение', type: 'Договор', template: 'ДОГОВОР НА ОКАЗАНИЕ МЕДИЦИНСКИХ УСЛУГ...' },
                        { id: 2, name: 'Информированное согласие', type: 'Согласие', template: 'ИНФОРМИРОВАННОЕ ДОБРОВОЛЬНОЕ СОГЛАСИЕ...' },
                        { id: 3, name: 'Акт выполненных работ', type: 'Акт', template: 'АКТ № ___ выполненных работ...' },
                        { id: 4, name: 'Счёт на оплату', type: 'Счёт', template: 'СЧЁТ № ___ на оплату...' },
                        { id: 5, name: 'Направление к специалисту', type: 'Направление', template: 'НАПРАВЛЕНИЕ на консультацию...' },
                      ].map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-white">{doc.name}</p>
                              <p className="text-sm text-gray-400">{doc.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newContent = window.prompt(`Редактировать шаблон "${doc.name}":`, doc.template);
                                if (newContent) {
                                  alert(`Шаблон "${doc.name}" сохранён!`);
                                }
                              }}
                            >
                              Редактировать
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const printWindow = window.open('', '_blank');
                                if (printWindow) {
                                  printWindow.document.write(`<pre style="font-family: monospace; padding: 40px;">${doc.template}</pre>`);
                                  printWindow.document.close();
                                }
                              }}
                            >
                              Просмотр
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
