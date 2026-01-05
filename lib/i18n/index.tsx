'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Импорт переводов
import ruTranslations from './ru.json';
import enTranslations from './en.json';

type Translations = typeof ruTranslations;
type Language = 'ru' | 'en';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translations: Translations;
}

const translations: Record<Language, Translations> = {
    ru: ruTranslations,
    en: enTranslations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [language, setLanguageState] = useState<Language>('ru');

    // Загрузка языка из localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            setLanguageState(savedLang);
        }
    }, []);

    // Функция смены языка
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    // Функция перевода с поддержкой вложенных ключей (например, "nav.dashboard")
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Возвращаем ключ если перевод не найден
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t, translations: translations[language] }}>
            {children}
        </I18nContext.Provider>
    );
}

// Хук для использования переводов
export function useTranslation() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }

    return context;
}

// Хук для получения только функции t
export function useT() {
    const { t } = useTranslation();
    return t;
}
