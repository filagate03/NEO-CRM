import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('ru-RU', options || defaultOptions).format(new Date(date));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  return phone;
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: '#3B82F6',
    confirmed: '#10B981',
    in_progress: '#F59E0B',
    completed: '#10B981',
    cancelled: '#EF4444',
    no_show: '#6B7280',
    active: '#10B981',
    inactive: '#6B7280',
    new: '#8B5CF6',
    online: '#10B981',
    offline: '#6B7280',
    busy: '#F59E0B',
    on_break: '#3B82F6',
  };
  return colors[status] || '#6B7280';
}

export function getAppointmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    consultation: 'Консультация',
    treatment: 'Лечение',
    procedure: 'Процедура',
    surgery: 'Хирургия',
    checkup: 'Осмотр',
    cleaning: 'Чистка',
    imaging: 'Снимок',
    emergency: 'Экстренный',
  };
  return labels[type] || type;
}

export function getProcedureCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    diagnostics: 'Диагностика',
    therapeutic: 'Терапия',
    surgical: 'Хирургия',
    orthodontic: 'Ортодонтия',
    prosthetic: 'Протезирование',
    esthetic: 'Эстетика',
    hygiene: 'Гигиена',
    implant: 'Имплантация',
  };
  return labels[category] || category;
}

export function declension(number: number, titles: string[]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} ${declension(diffMins, ['минуту', 'минуты', 'минут'])} назад`;
  if (diffHours < 24) return `${diffHours} ${declension(diffHours, ['час', 'часа', 'часов'])} назад`;
  if (diffDays < 7) return `${diffDays} ${declension(diffDays, ['день', 'дня', 'дней'])} назад`;
  return formatDate(date);
}

export function isToday(date: string | Date): boolean {
  const today = new Date();
  const target = new Date(date);
  return (
    today.getDate() === target.getDate() &&
    today.getMonth() === target.getMonth() &&
    today.getFullYear() === target.getFullYear()
  );
}

export function isTomorrow(date: string | Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = new Date(date);
  return (
    tomorrow.getDate() === target.getDate() &&
    tomorrow.getMonth() === target.getMonth() &&
    tomorrow.getFullYear() === target.getFullYear()
  );
}

export function getWeekDays(): string[] {
  return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
}

export function getMonths(): string[] {
  return [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];
}

export function getToothNumber(toothId: string): number {
  // Верхняя правая: 11-18 (зубы мудрости 18)
  // Верхняя левая: 21-28
  // Нижняя левая: 31-38
  // Нижняя правая: 41-48
  const numbers: Record<string, number> = {
    // Верхняя правая
    'ur-1': 18, 'ur-2': 17, 'ur-3': 16, 'ur-4': 15,
    'ur-5': 14, 'ur-6': 13, 'ur-7': 12, 'ur-8': 11,
    // Верхняя левая
    'ul-1': 21, 'ul-2': 22, 'ul-3': 23, 'ul-4': 24,
    'ul-5': 25, 'ul-6': 26, 'ul-7': 27, 'ul-8': 28,
    // Нижняя левая
    'll-1': 31, 'll-2': 32, 'll-3': 33, 'll-4': 34,
    'll-5': 35, 'll-6': 36, 'll-7': 37, 'll-8': 38,
    // Нижняя правая
    'lr-1': 41, 'lr-2': 42, 'lr-3': 43, 'lr-4': 44,
    'lr-5': 45, 'lr-6': 46, 'lr-7': 47, 'lr-8': 48,
  };
  return numbers[toothId] || 0;
}

export function getToothName(toothNumber: number): string {
  const names: Record<number, string> = {
    18: 'Третий моляр (зуб мудрости)', 17: 'Второй моляр', 16: 'Первый моляр',
    15: 'Второй премоляр', 14: 'Первый премоляр', 13: 'Клык', 12: 'Боковой резец', 11: 'Центральный резец',
    21: 'Центральный резец', 22: 'Боковой резец', 23: 'Клык', 24: 'Первый премоляр',
    25: 'Второй премоляр', 26: 'Первый моляр', 27: 'Второй моляр', 28: 'Третий моляр (зуб мудрости)',
    31: 'Центральный резец', 32: 'Боковой резец', 33: 'Клык', 34: 'Первый премоляр',
    35: 'Второй премоляр', 36: 'Первый моляр', 37: 'Второй моляр', 38: 'Третий моляр (зуб мудрости)',
    41: 'Центральный резец', 42: 'Боковой резец', 43: 'Клык', 44: 'Первый премоляр',
    45: 'Второй премоляр', 46: 'Первый моляр', 47: 'Второй моляр', 48: 'Третий моляр (зуб мудрости)',
  };
  return names[toothNumber] || `Зуб ${toothNumber}`;
}
