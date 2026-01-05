'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Send,
    Loader2,
    TrendingUp,
    DollarSign,
    Users,
    Lightbulb,
    BarChart3,
    FileText,
    MessageSquare,
    Zap,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency } from '@/lib/utils';
import { sendMessage, AIMessage, getBusinessRecommendations, getVATAnalysis } from '@/lib/ai';
import { analyticsData } from '@/data/mockData';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const quickPrompts = [
    {
        icon: TrendingUp,
        label: 'Рекомендации по росту',
        prompt: 'Проанализируй текущие показатели и дай 5 рекомендаций для роста выручки',
        color: 'from-emerald-500 to-green-500'
    },
    {
        icon: DollarSign,
        label: 'Анализ НДС 2025',
        prompt: 'Объясни изменения в НДС для медицинских услуг с 2025 года',
        color: 'from-amber-500 to-orange-500'
    },
    {
        icon: Users,
        label: 'Удержание пациентов',
        prompt: 'Как повысить лояльность и удержание пациентов стоматологической клиники?',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        icon: Lightbulb,
        label: 'Идеи маркетинга',
        prompt: 'Предложи 5 креативных идей для маркетинга стоматологической клиники в 2025',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: BarChart3,
        label: 'Анализ конкурентов',
        prompt: 'Какие тренды в стоматологическом бизнесе и как опередить конкурентов?',
        color: 'from-cyan-500 to-teal-500'
    },
    {
        icon: FileText,
        label: 'Ценообразование',
        prompt: 'Как оптимизировать ценообразование услуг для максимальной прибыли?',
        color: 'from-rose-500 to-red-500'
    },
];

export default function AssistantPage() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const aiMessages: AIMessage[] = messages.map((m) => ({
                role: m.role,
                content: m.content,
            }));
            aiMessages.push({ role: 'user', content: content.trim() });

            const response = await sendMessage(aiMessages);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Извините, произошла ошибка. Попробуйте позже.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <div
                className={cn(
                    'transition-all duration-300',
                    sidebarCollapsed ? 'ml-20' : 'ml-[280px]'
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
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/25">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">AI-Ассистент</h1>
                                    <p className="text-gray-500 mt-0.5">
                                        Умные рекомендации для вашего бизнеса
                                    </p>
                                </div>
                            </div>
                            <Badge variant="success" className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Gemini 1.5 Flash
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Chat Section */}
                            <div className="lg:col-span-2">
                                <Card className="h-[calc(100vh-220px)] flex flex-col" padding="none">
                                    {/* Chat Messages */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center">
                                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6">
                                                    <MessageSquare className="w-10 h-10 text-secondary" />
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Начните диалог с AI
                                                </h2>
                                                <p className="text-gray-500 max-w-md">
                                                    Задайте вопрос о бизнесе, финансах, маркетинге или выберите одну из быстрых тем справа
                                                </p>
                                            </div>
                                        ) : (
                                            messages.map((message) => (
                                                <motion.div
                                                    key={message.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={cn(
                                                        'flex',
                                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'max-w-[80%] rounded-2xl px-5 py-3',
                                                            message.role === 'user'
                                                                ? 'bg-gradient-to-r from-secondary to-secondary/90 text-white'
                                                                : 'bg-gray-100 text-gray-900'
                                                        )}
                                                    >
                                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}

                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-start"
                                            >
                                                <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-3">
                                                    <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                                                    <span className="text-sm text-gray-600">AI анализирует данные...</span>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="p-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Задайте вопрос AI-ассистенту..."
                                                disabled={isLoading}
                                                className="flex-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all disabled:opacity-50"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSendMessage(inputValue)}
                                                disabled={!inputValue.trim() || isLoading}
                                                className={cn(
                                                    'px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all',
                                                    inputValue.trim() && !isLoading
                                                        ? 'bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-lg shadow-secondary/25'
                                                        : 'bg-gray-100 text-gray-400'
                                                )}
                                            >
                                                <Send className="w-4 h-4" />
                                                Отправить
                                            </motion.button>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Quick Actions Sidebar */}
                            <div className="space-y-4">
                                <Card padding="lg">
                                    <CardHeader
                                        title="Быстрые темы"
                                        description="Выберите тему для анализа"
                                    />
                                    <div className="space-y-3 mt-4">
                                        {quickPrompts.map((prompt) => (
                                            <motion.button
                                                key={prompt.label}
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSendMessage(prompt.prompt)}
                                                disabled={isLoading}
                                                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-left group disabled:opacity-50"
                                            >
                                                <div className={cn(
                                                    'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
                                                    prompt.color
                                                )}>
                                                    <prompt.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                    {prompt.label}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </Card>

                                {/* Stats Card */}
                                <Card padding="lg" className="bg-gradient-to-br from-primary/5 to-secondary/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Данные для анализа</h3>
                                            <p className="text-xs text-gray-500">Текущие показатели</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                            <span className="text-sm text-gray-600">Выручка</span>
                                            <span className="font-semibold text-gray-900">{formatCurrency(analyticsData.revenue.total)}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                            <span className="text-sm text-gray-600">Пациентов</span>
                                            <span className="font-semibold text-gray-900">{analyticsData.patients.total}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                            <span className="text-sm text-gray-600">Записей</span>
                                            <span className="font-semibold text-gray-900">{analyticsData.appointments.total}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
