'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    X,
    Calculator,
    FileText,
    ExternalLink,
    ChevronRight,
    Info,
    Clock,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface VATNotificationProps {
    revenue?: number;
    onDismiss?: () => void;
    className?: string;
}

// Актуальная информация о НДС 2026 для медуслуг
const vatInfo = {
    title: 'НДС для УСН с 2026 года',
    description: 'С 1 января 2026 года порог освобождения от НДС для организаций на УСН снижается до 20 млн руб. Медицинские услуги с лицензией остаются освобождёнными.',
    keyPoints: [
        'Мед. услуги с лицензией - ОСВОБОЖДЕНЫ от НДС (ст. 149 НК)',
        'Порог для УСН с 2026: 20 млн руб./год',
        'Продажа товаров (щётки, пасты) - облагается НДС 5%',
        'Требуется раздельный учёт услуг и товаров',
    ],
    vatRateLow: 0.05, // 5% при 20-272.5 млн
    vatRateHigh: 0.07, // 7% при 272.5-490.5 млн
    deadline: new Date('2026-01-01T00:00:00'),
    threshold: 20000000, // 20 млн
};

// Функция расчёта обратного отсчёта
const getCountdown = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, passed: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, passed: false };
};

export default function VATNotification({
    revenue = 0,
    onDismiss,
    className
}: VATNotificationProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [countdown, setCountdown] = useState(getCountdown(vatInfo.deadline));

    // Обновление обратного отсчёта каждую минуту
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getCountdown(vatInfo.deadline));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Расчёт НДС для товаров (услуги освобождены)
    const estimatedVAT = revenue > vatInfo.threshold ? revenue * vatInfo.vatRateLow : 0;
    const needsVAT = revenue > vatInfo.threshold;

    const handleDismiss = () => {
        setIsDismissed(true);
        onDismiss?.();
    };

    if (isDismissed) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                'glass-card rounded-2xl overflow-hidden shadow-apple',
                className
            )}
        >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-200/50">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{vatInfo.title}</h3>
                            <button
                                onClick={handleDismiss}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {vatInfo.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* VAT Calculator Preview */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
                {/* Countdown */}
                {!countdown.passed && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl shadow-sm">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">До вступления в силу:</span>
                        <div className="flex gap-2 ml-auto">
                            <div className="bg-amber-100 px-2 py-1 rounded text-center min-w-[50px]">
                                <p className="text-lg font-bold text-amber-700">{countdown.days}</p>
                                <p className="text-[10px] text-amber-600">дней</p>
                            </div>
                            <div className="bg-amber-100 px-2 py-1 rounded text-center min-w-[40px]">
                                <p className="text-lg font-bold text-amber-700">{countdown.hours}</p>
                                <p className="text-[10px] text-amber-600">часов</p>
                            </div>
                        </div>
                    </div>
                )}

                {revenue > 0 && (
                    <>
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Анализ для вашей выручки</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Годовая выручка</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(revenue)}</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Порог УСН</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(vatInfo.threshold)}</p>
                            </div>
                            <div className={cn(
                                "rounded-xl p-3 shadow-sm",
                                needsVAT ? "bg-red-50" : "bg-emerald-50"
                            )}>
                                <p className="text-xs text-gray-500 mb-1">Статус</p>
                                <p className={cn(
                                    "font-semibold",
                                    needsVAT ? "text-red-600" : "text-emerald-600"
                                )}>
                                    {needsVAT ? "НДС 5%" : "Освобождены"}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Expandable Details */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <span className="text-sm font-medium text-gray-700">Ключевые изменения</span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <ul className="mt-3 space-y-2">
                                {vatInfo.keyPoints.map((point, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-2 text-sm text-gray-600"
                                    >
                                        <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        {point}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors">
                    <FileText className="w-4 h-4" />
                    Подготовить документы
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Подробнее
                </button>
            </div>
        </motion.div>
    );
}
