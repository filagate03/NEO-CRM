'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Mail, Calendar, DollarSign, User, Clock } from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    type Notification
} from '@/lib/notifications';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const typeIcons: Record<Notification['type'], React.ReactNode> = {
    appointment: <Calendar className="w-5 h-5" />,
    payment: <DollarSign className="w-5 h-5" />,
    task: <Clock className="w-5 h-5" />,
    system: <Bell className="w-5 h-5" />,
};

const typeColors: Record<Notification['type'], string> = {
    appointment: 'bg-blue-100 text-blue-600',
    payment: 'bg-emerald-100 text-emerald-600',
    task: 'bg-amber-100 text-amber-600',
    system: 'bg-gray-100 text-gray-600',
};

export default function NotificationsPage() {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    // Загрузка уведомлений
    useEffect(() => {
        const loadNotifications = () => {
            const notifs = getNotifications();
            setNotifications(notifs);
        };

        loadNotifications();

        // Обновление каждые 30 секунд
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter((n) => n.unread).length;
    const filteredNotifications = filter === 'unread'
        ? notifications.filter((n) => n.unread)
        : notifications;

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
        setNotifications(getNotifications());
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
        setNotifications(getNotifications());
    };

    const handleDelete = (id: string) => {
        deleteNotification(id);
        setNotifications(getNotifications());
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkAsRead(notification.id);

        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <div className={cn(
                'transition-all duration-300',
                sidebarCollapsed ? 'ml-20' : 'ml-[280px]'
            )}>
                <Header sidebarCollapsed={sidebarCollapsed} />

                <main className="p-6">
                    <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
                                <p className="text-gray-500 mt-1">
                                    {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Нет новых уведомлений'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={cn(
                                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                        )}
                                    >
                                        Все
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={cn(
                                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                            filter === 'unread' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                        )}
                                    >
                                        Непрочитанные
                                    </button>
                                </div>
                                {unreadCount > 0 && (
                                    <Button variant="outline" leftIcon={<Check className="w-4 h-4" />} onClick={handleMarkAllAsRead}>
                                        Отметить все прочитанными
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <Card padding="none">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Нет уведомлений</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={cn(
                                                'p-4 flex items-start gap-4 hover:bg-gray-50 cursor-pointer transition-colors',
                                                notification.unread && 'bg-blue-50/50'
                                            )}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className={cn(
                                                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                                typeColors[notification.type]
                                            )}>
                                                {typeIcons[notification.type]}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={cn(
                                                        'text-sm',
                                                        notification.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                                                    )}>
                                                        {notification.title}
                                                    </p>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-secondary rounded-full" />
                                                    )}
                                                    {notification.priority === 'high' && (
                                                        <Badge variant="danger" size="sm">Срочно</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {notification.unread && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification.id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Отметить прочитанным"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(notification.id);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
