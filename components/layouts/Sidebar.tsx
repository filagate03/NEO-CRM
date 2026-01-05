'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  DollarSign,
  BarChart3,
  Users2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge: string | number | null;
  isAI?: boolean;
}

const getMenuItems = (t: (key: string) => string): MenuItem[] => [
  { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard', badge: null },
  { icon: Users, label: t('nav.patients'), href: '/patients', badge: 50 },
  { icon: Calendar, label: t('nav.appointments'), href: '/appointments', badge: 12 },
  { icon: Activity, label: t('nav.treatments'), href: '/treatments', badge: 3 },
  { icon: DollarSign, label: t('nav.finance'), href: '/finance', badge: null },
  { icon: BarChart3, label: t('nav.analytics'), href: '/analytics', badge: null },
  { icon: Users2, label: t('nav.team'), href: '/team', badge: null },
];

const getAiMenuItems = (t: (key: string) => string): MenuItem[] => [
  { icon: Sparkles, label: t('nav.assistant'), href: '/assistant', badge: 'AI', isAI: true },
  { icon: Bot, label: 'Telegram Bot', href: '/telegram-bot', badge: null, isAI: true },
];

const getBottomMenuItems = (t: (key: string) => string): MenuItem[] => [
  { icon: Settings, label: t('nav.settings'), href: '/settings', badge: null },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = getMenuItems(t);
  const aiMenuItems = getAiMenuItems(t);
  const bottomMenuItems = getBottomMenuItems(t);

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;

    return (
      <motion.li
        key={item.href}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
            isActive
              ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white',
            item.isAI && !isActive && 'hover:bg-gradient-to-r hover:from-secondary/10 hover:to-transparent'
          )}
        >
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}

          <div className={cn(
            'relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300',
            isActive
              ? 'bg-white/20'
              : item.isAI
                ? 'bg-gradient-to-br from-secondary/20 to-secondary/5'
                : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-sm'
          )}>
            <Icon className={cn(
              'w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110',
              isActive && 'text-white',
              item.isAI && !isActive && 'text-secondary'
            )} />
          </div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="relative z-10 flex-1 text-sm font-medium text-left"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {item.badge && !collapsed && (
            <span
              className={cn(
                'relative z-10 px-2 py-0.5 text-xs font-semibold rounded-full transition-all duration-300',
                isActive
                  ? 'bg-white/25 text-white'
                  : item.badge === 'AI'
                    ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-sm shadow-secondary/25'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-secondary/10 group-hover:text-secondary'
              )}
            >
              {item.badge}
            </span>
          )}

          {collapsed && item.badge && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-secondary/30">
              {typeof item.badge === 'number' ? item.badge : '✦'}
            </span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 h-screen glass-sidebar border-r border-white/5 flex flex-col shadow-apple"
    >
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xl text-white tracking-tight">Neo</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">CRM</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider">DENTAL SYSTEM</span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary via-secondary/90 to-secondary/30 shadow-lg shadow-secondary/25"
            >
              <span className="font-bold text-lg text-white">N</span>
            </motion.div>
          )}
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>

        <div className="my-4 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 mb-2"
            >
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-secondary" />
                AI Функции
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="space-y-1">
          {aiMenuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>

        <div className="my-4 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <ul className="space-y-1">
          {bottomMenuItems.map((item, index) => renderMenuItem(item, index))}
        </ul>
      </nav>

      <div className="p-3 border-t border-white/5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-400 rounded-xl transition-all duration-300',
            'hover:bg-white/5 hover:text-gray-200 active:bg-white/10'
          )}
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Свернуть
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
