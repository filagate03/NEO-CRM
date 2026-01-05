'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    Key,
    Copy,
    Check,
    Settings,
    MessageSquare,
    Users,
    Zap,
    Shield,
    Clock,
    Send,
    FileText,
    ExternalLink,
    Play,
    Pause,
    RefreshCw,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { TELEGRAM_SALES_PROMPT } from '@/lib/ai';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const features = [
    { icon: MessageSquare, title: 'Автоответы', desc: 'Мгновенные ответы на вопросы пациентов 24/7' },
    { icon: Users, title: 'Запись на приём', desc: 'Автоматическая запись через Telegram' },
    { icon: Zap, title: 'AI-продажи', desc: 'Умные рекомендации услуг на основе запроса' },
    { icon: Shield, title: 'Безопасность', desc: 'Защищённый канал связи с пациентами' },
];

const instructions = `Приветствуй пользователей дружелюбно
При вопросе о ценах — направляй на консультацию
Записывай на приём через форму
Отвечай быстро и по делу
При сложных вопросах — переадресуй на администратора`;

interface TestMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
}

export default function TelegramBotPage() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [botToken, setBotToken] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [customInstructions, setCustomInstructions] = useState(instructions);
    const [isSaving, setIsSaving] = useState(false);
    const [showTestChat, setShowTestChat] = useState(false);
    const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
    const [testInput, setTestInput] = useState('');
    const [isTestLoading, setIsTestLoading] = useState(false);

    // Загрузка настроек из localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('telegram_bot_token');
        const savedInstructions = localStorage.getItem('telegram_bot_instructions');
        const savedConnected = localStorage.getItem('telegram_bot_connected');

        if (savedToken) setBotToken(savedToken);
        if (savedInstructions) setCustomInstructions(savedInstructions);
        if (savedConnected === 'true') setIsConnected(true);
    }, []);

    // Сохранение настроек в localStorage
    const saveSettings = () => {
        localStorage.setItem('telegram_bot_token', botToken);
        localStorage.setItem('telegram_bot_instructions', customInstructions);
        localStorage.setItem('telegram_bot_connected', isConnected.toString());
    };

    const handleConnect = async () => {
        if (!botToken.trim()) return;

        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsConnected(true);
        setIsSaving(false);
        saveSettings();
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        localStorage.setItem('telegram_bot_connected', 'false');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Тестовый чат с AI
    const handleTestMessage = async () => {
        if (!testInput.trim() || isTestLoading) return;

        const userMsg: TestMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: testInput.trim(),
        };
        setTestMessages(prev => [...prev, userMsg]);
        setTestInput('');
        setIsTestLoading(true);

        try {
            const { getTelegramResponse } = await import('@/lib/ai');
            const response = await getTelegramResponse(testInput.trim());

            const botMsg: TestMessage = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: response,
            };
            setTestMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg: TestMessage = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: 'Извините, произошла ошибка. Попробуйте позже.',
            };
            setTestMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTestLoading(false);
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
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Telegram Бот</h1>
                                    <p className="text-gray-500 mt-0.5">
                                        AI-продавец для вашей клиники
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={isConnected ? 'success' : 'default'}
                                className="flex items-center gap-1.5"
                            >
                                <span className={cn(
                                    'w-2 h-2 rounded-full',
                                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                                )} />
                                {isConnected ? 'Подключён' : 'Не подключён'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Config */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Token Input */}
                                <Card padding="lg">
                                    <CardHeader
                                        title="Подключение бота"
                                        description="Введите токен от @BotFather для активации"
                                    />
                                    <div className="mt-4 space-y-4">
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={botToken}
                                                onChange={(e) => setBotToken(e.target.value)}
                                                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                                disabled={isConnected}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            {isConnected ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1"
                                                        leftIcon={<RefreshCw className="w-4 h-4" />}
                                                    >
                                                        Перезапустить
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                                        onClick={handleDisconnect}
                                                        leftIcon={<Pause className="w-4 h-4" />}
                                                    >
                                                        Отключить
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                                    onClick={handleConnect}
                                                    disabled={!botToken.trim() || isSaving}
                                                    leftIcon={isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                                >
                                                    {isSaving ? 'Подключение...' : 'Подключить бота'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Instructions for getting token */}
                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Как получить токен:
                                        </h4>
                                        <ol className="text-sm text-blue-800 space-y-1.5 ml-6 list-decimal">
                                            <li>Откройте Telegram и найдите @BotFather</li>
                                            <li>Отправьте команду /newbot</li>
                                            <li>Введите имя и username бота</li>
                                            <li>Скопируйте полученный токен сюда</li>
                                        </ol>
                                        <a
                                            href="https://t.me/BotFather"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            Открыть @BotFather
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </Card>

                                {/* Custom Instructions */}
                                <Card padding="lg">
                                    <CardHeader
                                        title="Инструкции для бота"
                                        description="Настройте поведение AI-продавца"
                                    />
                                    <div className="mt-4">
                                        <textarea
                                            value={customInstructions}
                                            onChange={(e) => setCustomInstructions(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Введите инструкции для бота..."
                                        />
                                        <div className="flex items-center justify-between mt-4">
                                            <button
                                                onClick={() => copyToClipboard(TELEGRAM_SALES_PROMPT)}
                                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                {isCopied ? 'Скопировано!' : 'Копировать системный промпт'}
                                            </button>
                                            <Button variant="secondary" size="sm">
                                                Сохранить инструкции
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Features Sidebar */}
                            <div className="space-y-4">
                                <Card padding="lg">
                                    <CardHeader
                                        title="Возможности бота"
                                        description="Что умеет AI-продавец"
                                    />
                                    <div className="space-y-3 mt-4">
                                        {features.map((feature, index) => (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                    <feature.icon className="w-4.5 h-4.5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">{feature.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Stats */}
                                {isConnected && (
                                    <Card padding="lg" className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <MessageSquare className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Статистика</h3>
                                                <p className="text-xs text-gray-500">За последние 7 дней</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <span className="text-sm text-gray-600">Сообщений</span>
                                                <span className="font-semibold text-gray-900">247</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <span className="text-sm text-gray-600">Записей</span>
                                                <span className="font-semibold text-emerald-600">18</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <span className="text-sm text-gray-600">Конверсия</span>
                                                <span className="font-semibold text-blue-600">7.3%</span>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Time */}
                                <Card padding="lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Работает 24/7</h3>
                                            <p className="text-xs text-gray-500">Отвечает мгновенно</p>
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
