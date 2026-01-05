'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    X,
    Send,
    Loader2,
    MessageSquare,
    Lightbulb,
    TrendingUp,
    DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendMessage, AIMessage } from '@/lib/ai';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const quickActions = [
    { icon: TrendingUp, label: 'Рекомендации по росту', prompt: 'Дай рекомендации для роста выручки стоматологической клиники' },
    { icon: DollarSign, label: 'Анализ НДС 2025', prompt: 'Объясни новый закон о НДС 2025 для медицинских услуг и как подготовиться' },
    { icon: Lightbulb, label: 'Идеи маркетинга', prompt: 'Предложи 5 эффективных идей для маркетинга стоматологической клиники' },
];

export default function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
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
            console.error('AI Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `❌ Произошла ошибка при подключении к AI. 

**Возможные причины:**
- Проблема с сетевым подключением
- API сервер временно недоступен

Попробуйте обновить страницу или повторить запрос позже.

_Техническая информация: ${error instanceof Error ? error.message : 'Unknown error'}_`,
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
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center',
                    'bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-white',
                    'shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40',
                    'transition-all duration-300'
                )}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] glass-card rounded-2xl overflow-hidden flex flex-col shadow-apple-lg"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-secondary/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">AI-Ассистент</h3>
                                    <p className="text-xs text-gray-500">Gemini 2.5 Flash</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-secondary" />
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-2">Чем могу помочь?</h4>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Задайте вопрос о бизнесе, финансах или пациентах
                                    </p>

                                    {/* Quick Actions */}
                                    <div className="w-full space-y-2">
                                        {quickActions.map((action) => (
                                            <button
                                                key={action.label}
                                                onClick={() => handleSendMessage(action.prompt)}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
                                            >
                                                <action.icon className="w-5 h-5 text-secondary" />
                                                <span className="text-sm text-gray-700 group-hover:text-gray-900">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
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
                                                'max-w-[85%] rounded-2xl px-4 py-3',
                                                message.role === 'user'
                                                    ? 'bg-gradient-to-r from-secondary to-secondary/90 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                            )}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                                    <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                                        <span className="text-sm text-gray-500">Думаю...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100/50">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Напишите сообщение..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all disabled:opacity-50"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSendMessage(inputValue)}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={cn(
                                        'w-11 h-11 rounded-xl flex items-center justify-center transition-all',
                                        inputValue.trim() && !isLoading
                                            ? 'bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-lg shadow-secondary/25'
                                            : 'bg-gray-100 text-gray-400'
                                    )}
                                >
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
