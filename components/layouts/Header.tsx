'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  HelpCircle,
  LogOut,
  User,
  ChevronDown,
  X,
  Clock,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  type Notification
} from '@/lib/notifications';

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

interface WorldClock {
  city: string;
  timezone: string;
  flag: string;
  offset: string;
}

const availableTimezones: WorldClock[] = [
  { city: 'Москва', timezone: 'Europe/Moscow', flag: '🇷🇺', offset: 'UTC+3' },
  { city: 'Лондон', timezone: 'Europe/London', flag: '🇬🇧', offset: 'UTC+0' },
  { city: 'Нью-Йорк', timezone: 'America/New_York', flag: '🇺🇸', offset: 'UTC-5' },
  { city: 'Токио', timezone: 'Asia/Tokyo', flag: '🇯🇵', offset: 'UTC+9' },
  { city: 'Дубай', timezone: 'Asia/Dubai', flag: '🇦🇪', offset: 'UTC+4' },
  { city: 'Париж', timezone: 'Europe/Paris', flag: '🇫🇷', offset: 'UTC+1' },
  { city: 'Шанхай', timezone: 'Asia/Shanghai', flag: '🇨🇳', offset: 'UTC+8' },
  { city: 'Сидней', timezone: 'Australia/Sydney', flag: '🇦🇺', offset: 'UTC+11' },
];

const getWorldTime = (timezone: string): { time: string; date: string } => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };
  return {
    time: now.toLocaleTimeString('ru-RU', options),
    date: now.toLocaleDateString('ru-RU', dateOptions),
  };
};

const WorldClocks = () => {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([]);
  const [times, setTimes] = useState<Record<string, { time: string; date: string }>>({});

  useEffect(() => {
    const savedTimezones = JSON.parse(localStorage.getItem('worldClocks') || '["Europe/Moscow", "Europe/London", "America/New_York", "Asia/Tokyo"]');
    setSelectedTimezones(savedTimezones);
  }, []);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, { time: string; date: string }> = {};
      selectedTimezones.forEach((timezone) => {
        const clock = availableTimezones.find(c => c.timezone === timezone);
        if (clock) {
          newTimes[clock.city] = getWorldTime(clock.timezone);
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezones]);

  return (
    <div className="hidden lg:flex items-center gap-2">
      {selectedTimezones.map((timezone) => {
        const clock = availableTimezones.find(c => c.timezone === timezone);
        if (!clock) return null;
        return (
          <div
            key={clock.city}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/50 transition-colors cursor-pointer group"
            title={`${clock.city} - ${clock.offset}`}
          >
            <span className="text-sm">{clock.flag}</span>
            <div className="text-right">
              <p className="text-xs font-light text-gray-300 font-mono tabular-nums tracking-wide">
                {times[clock.city]?.time || '--:--:--'}
              </p>
              <p className="text-[10px] font-extralight text-gray-500 tracking-wider uppercase">
                {clock.city}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};


const Header = ({ onToggleSidebar, sidebarCollapsed }: HeaderProps) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Загрузка уведомлений
  useEffect(() => {
    const loadNotifications = () => {
      const notifs = getNotifications();
      setNotifications(notifs);
      setUnreadCount(getUnreadCount());
    };

    loadNotifications();

    // Обновление каждые 30 секунд
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Обработчик клика по уведомлению
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
    setShowNotifications(false);

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleProfileClick = () => {
    setShowUserMenu(false);
    router.push('/settings?tab=profile');
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    router.push('/settings');
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    localStorage.clear();
    router.push('/');
  };

  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Поиск пациентов, записей, процедур..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-10 pl-10 pr-10 rounded-xl border border-white/10',
              'bg-white/5 text-sm text-white',
              'placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary',
              'transition-all duration-200'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 lg:gap-2">
        <WorldClocks />

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          title={isDarkMode ? 'Светлая тема' : 'Тёмная тема'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => setShowHelp(true)}
          className="p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          title="Помощь"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 text-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-card rounded-2xl shadow-xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Уведомления</h3>
                    <span className="text-xs text-secondary font-medium">
                      {unreadCount} новых
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      Нет уведомлений
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          'p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors',
                          notification.unread && 'bg-secondary/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              notification.unread ? 'bg-secondary' : 'bg-gray-600'
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-white/10 flex gap-2">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      router.push('/notifications');
                    }}
                    className="flex-1 text-center text-sm text-secondary font-medium hover:underline"
                  >
                    Показать все
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        markAllAsRead();
                        setNotifications(getNotifications());
                        setUnreadCount(0);
                      }}
                      className="flex-1 text-center text-sm text-gray-400 hover:text-gray-300"
                    >
                      Прочитать все
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 lg:h-8 bg-white/10 mx-1 lg:mx-2" />

        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"
              name="Администратор"
              size="sm"
              status="online"
            />
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium text-white">Администратор</p>
              <p className="text-xs text-gray-400">Менеджер</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl shadow-xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="font-medium text-white">Администратор</p>
                  <p className="text-sm text-gray-400">admin@neocrm.ru</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Мой профиль
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Настройки
                  </button>
                </div>
                <div className="p-2 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}

      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setShowHelp(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Справка</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">📋 Быстрые клавиши</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+K</kbd> — Быстрый поиск</li>
                    <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+N</kbd> — Новый пациент</li>
                    <li><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+D</kbd> — Дашборд</li>
                  </ul>
                </div>

                <div className="p-4 bg-secondary/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">💬 Поддержка</h3>
                  <p className="text-sm text-gray-400 mb-2">Нужна помощь? Свяжитесь с нами:</p>
                  <a
                    href="mailto:support@neocrm.ru"
                    className="text-sm text-secondary hover:underline flex items-center gap-1"
                  >
                    support@neocrm.ru <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 bg-secondary/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">🤖 AI Ассистент</h3>
                  <p className="text-sm text-gray-400">
                    Используйте AI-ассистент для получения бизнес-рекомендаций, анализа финансов и консультаций по НДС.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 transition-colors"
              >
                Закрыть
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
