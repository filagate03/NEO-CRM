'use client';

export interface Notification {
    id: string;
    type: 'appointment' | 'payment' | 'task' | 'system';
    title: string;
    message: string;
    time: string;
    unread: boolean;
    priority: 'high' | 'medium' | 'low';
    actionUrl?: string;
    appointmentId?: string;
    patientId?: string;
    createdAt: string;
}

const STORAGE_KEY = 'dental_notifications';

// Начальные уведомления
const initialNotifications: Notification[] = [
    {
        id: 'n-001',
        type: 'appointment',
        title: 'Новая запись',
        message: 'Петров А.С. записан на 30 декабря в 10:00',
        time: '30 мин назад',
        unread: true,
        priority: 'medium',
        actionUrl: '/appointments',
        appointmentId: 'a-0001',
        patientId: 'p-001',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: 'n-002',
        type: 'payment',
        title: 'Платёж получен',
        message: 'Поступила оплата от Смирновой Е.И. — 15 000 ₽',
        time: '2 часа назад',
        unread: true,
        priority: 'low',
        actionUrl: '/finance',
        patientId: 'p-002',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'n-003',
        type: 'task',
        title: 'Напоминание',
        message: 'Необходимо связаться с Козловым М.А.',
        time: '1 день назад',
        unread: false,
        priority: 'high',
        actionUrl: '/patients',
        patientId: 'p-003',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Получить уведомления из localStorage
export function getNotifications(): Notification[] {
    if (typeof window === 'undefined') return initialNotifications;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }

    // Сохраняем начальные уведомления
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
    return initialNotifications;
}

// Сохранить уведомления в localStorage
export function saveNotifications(notifications: Notification[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
}

// Добавить новое уведомление
export function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const notifications = getNotifications();
    const newNotification: Notification = {
        ...notification,
        id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
    };

    notifications.unshift(newNotification);
    saveNotifications(notifications);

    return newNotification;
}

// Отметить уведомление как прочитанное
export function markAsRead(notificationId: string): void {
    const notifications = getNotifications();
    const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, unread: false } : n
    );
    saveNotifications(updated);
}

// Отметить все уведомления как прочитанные
export function markAllAsRead(): void {
    const notifications = getNotifications();
    const updated = notifications.map(n => ({ ...n, unread: false }));
    saveNotifications(updated);
}

// Удалить уведомление
export function deleteNotification(notificationId: string): void {
    const notifications = getNotifications();
    const updated = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
}

// Очистить все уведомления
export function clearAllNotifications(): void {
    saveNotifications([]);
}

// Получить количество непрочитанных уведомлений
export function getUnreadCount(): number {
    const notifications = getNotifications();
    return notifications.filter(n => n.unread).length;
}

// Получить уведомления по типу
export function getNotificationsByType(type: Notification['type']): Notification[] {
    const notifications = getNotifications();
    return notifications.filter(n => n.type === type);
}

// Получить уведомления по пациенту
export function getNotificationsByPatient(patientId: string): Notification[] {
    const notifications = getNotifications();
    return notifications.filter(n => n.patientId === patientId);
}

// Получить уведомления по записи
export function getNotificationsByAppointment(appointmentId: string): Notification[] {
    const notifications = getNotifications();
    return notifications.filter(n => n.appointmentId === appointmentId);
}

// Форматировать время уведомления
export function formatNotificationTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} д назад`;

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

// Создать уведомление о новой записи
export function createAppointmentNotification(
    patientName: string,
    date: string,
    time: string,
    appointmentId: string,
    patientId: string
): Notification {
    return addNotification({
        type: 'appointment',
        title: 'Новая запись',
        message: `${patientName} записан на ${date} в ${time}`,
        time: formatNotificationTime(new Date().toISOString()),
        unread: true,
        priority: 'medium',
        actionUrl: `/appointments?date=${date}&appointment=${appointmentId}`,
        appointmentId,
        patientId,
    });
}

// Создать уведомление о платеже
export function createPaymentNotification(
    patientName: string,
    amount: number,
    patientId: string
): Notification {
    return addNotification({
        type: 'payment',
        title: 'Платёж получен',
        message: `Поступила оплата от ${patientName} — ${amount.toLocaleString('ru-RU')} ₽`,
        time: formatNotificationTime(new Date().toISOString()),
        unread: true,
        priority: 'low',
        actionUrl: '/finance',
        patientId,
    });
}

// Создать уведомление о задаче
export function createTaskNotification(
    title: string,
    message: string,
    patientId?: string
): Notification {
    return addNotification({
        type: 'task',
        title,
        message,
        time: formatNotificationTime(new Date().toISOString()),
        unread: true,
        priority: 'high',
        actionUrl: patientId ? `/patients` : '/dashboard',
        patientId,
    });
}

// Создать системное уведомление
export function createSystemNotification(
    title: string,
    message: string,
    priority: 'high' | 'medium' | 'low' = 'low'
): Notification {
    return addNotification({
        type: 'system',
        title,
        message,
        time: formatNotificationTime(new Date().toISOString()),
        unread: true,
        priority,
    });
}
