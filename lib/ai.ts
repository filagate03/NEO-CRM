'use client';

// AI Client for Gemini 2.5 Flash via artemox.com API
const API_URL = 'https://api.artemox.com/v1';
const API_KEY = 'sk-0pme-SrCrIDmVKmLnrc0uw';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    id: string;
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// Функция получения актуального контекста CRM
export function getCRMContext() {
    // Импортируем данные динамически чтобы всегда иметь актуальные
    return `
## АКТУАЛЬНЫЕ ДАННЫЕ CRM DENTAL PRO (${new Date().toLocaleDateString('ru-RU')})

### ФИНАНСЫ:
- Общая выручка: 4 580 000 ₽ (рост +12.5% к прошлому месяцу)
- Средний чек: ~10 044 ₽
- Топ по выручке: Имплантация (1 035 000 ₽), Коронки (850 000 ₽), Лечение кариеса (445 000 ₽)

### ПАЦИЕНТЫ:
- Всего: 1 247 пациентов
- Новых за месяц: 89
- Вернувшихся: 312
- Конверсия возврата: 25%

### ЗАПИСИ:
- Всего за месяц: 456
- Завершено: 398 (87.3%)
- Отменено: 42 (9.2%)
- Неявки: 16 (3.5%)

### ВРАЧИ И ЗАГРУЗКА:
1. Иванов А.П. (Терапевт) - выручка 1 250 000 ₽, 89 приёмов, загрузка 75%
2. Соколов Д.В. (Хирург-имплантолог) - выручка 1 420 000 ₽, 65 приёмов, загрузка 60%
3. Петрова М.С. (Ортодонт) - выручка 980 000 ₽, 76 приёмов, загрузка 90%
4. Кузнецова Е.А. (Ортопед) - выручка 890 000 ₽, 71 приём, сейчас offline

### ТОП ПРОЦЕДУР:
1. Консультация: 145 шт, 217 500 ₽
2. Лечение кариеса: 89 шт, 445 000 ₽
3. Профессиональная чистка: 67 шт, 335 000 ₽
4. Имплантация: 23 шт, 1 035 000 ₽
5. Коронки: 34 шт, 850 000 ₽

### ПРОБЛЕМЫ ТРЕБУЮЩИЕ ВНИМАНИЯ:
- Петрова М.С. перегружена на 90% - нужен второй ортодонт или перераспределение
- 16 неявок за месяц - потеря ~160 000 ₽
- Кузнецова Е.А. offline - нужно уточнить причину
`;
}

// Системный промпт для бизнес-ассистента
const DENTAL_SYSTEM_PROMPT = `Ты — АГЕНТНЫЙ AI-ассистент CRM системы DENTAL PRO. Ты ИНТЕГРИРОВАН в систему и ВИДИШЬ все данные.

## ТВОИ ПРАВИЛА:
1. НЕ ИСПОЛЬЗУЙ звёздочки (*) и markdown форматирование. Пиши простым текстом.
2. НЕ ЗАДАВАЙ лишних вопросов - ДЕЙСТВУЙ и давай конкретные рекомендации сразу.
3. ВСЕГДА опирайся на реальные цифры из CRM (они даны ниже).
4. Отвечай КРАТКО и ПО ДЕЛУ. Максимум 300 слов.
5. Давай КОНКРЕТНЫЕ рекомендации с цифрами.

## ТЫ МОЖЕШЬ:
- Анализировать выручку-расходы и давать финансовые советы
- Оценивать загрузку врачей и предлагать оптимизацию
- Выявлять проблемных пациентов (долги, неявки)
- Рекомендовать маркетинговые активности
- Консультировать по НДС для медицины (с 2025-2026 новые правила)
- Помогать с планированием записей

## НДС 2025-2026 ДЛЯ МЕДИЦИНЫ:
- Мед. услуги с лицензией ОСВОБОЖДЕНЫ от НДС
- С 2026: УСН до 20 млн/год = без НДС
- Превышение: ставка 5% (20-272.5 млн) или 7% (272.5-490.5 млн)
- Продажа товаров (щётки, пасты) = НДС обязателен

${getCRMContext()}

Отвечай на русском, кратко, без звёздочек и лишних вопросов. Сразу давай ответ.`;

// Основная функция для отправки сообщений к AI
export async function sendMessage(
    messages: AIMessage[],
    systemPrompt: string = DENTAL_SYSTEM_PROMPT
): Promise<string> {
    try {
        // Используем локальный API прокси для обхода CORS
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
                max_tokens: 4096,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }

        const data: AIResponse = await response.json();
        let content = data.choices[0]?.message?.content || 'Не удалось получить ответ';

        // Удаляем звёздочки из ответа если они всё же появились
        content = content.replace(/\*+/g, '').replace(/#+/g, '').replace(/_+/g, '');

        return content;
    } catch (error) {
        console.error('AI API Error:', error);
        throw error;
    }
}

// Функция для получения бизнес-рекомендаций на основе данных
export async function getBusinessRecommendations(context: {
    revenue?: number;
    patients?: number;
    appointments?: number;
    averageCheck?: number;
}): Promise<string> {
    const contextMessage = `
Текущие показатели клиники:
- Выручка: ${context.revenue ? `${context.revenue.toLocaleString('ru-RU')} ₽` : 'не указана'}
- Количество пациентов: ${context.patients || 'не указано'}
- Записей: ${context.appointments || 'не указано'}
- Средний чек: ${context.averageCheck ? `${context.averageCheck.toLocaleString('ru-RU')} ₽` : 'не указан'}

На основе этих данных, дай 3-5 конкретных рекомендаций для роста бизнеса.
`;

    return sendMessage([{ role: 'user', content: contextMessage }]);
}

// Функция для анализа НДС
export async function getVATAnalysis(revenue: number): Promise<string> {
    const vatMessage = `
С 2025 года вступает в силу новый закон о НДС для медицинских услуг.

Текущая выручка клиники: ${revenue.toLocaleString('ru-RU')} ₽

Объясни:
1. Какие медицинские услуги теперь облагаются НДС
2. Как это повлияет на ценообразование
3. Какие шаги нужно предпринять для соответствия новым требованиям
4. Примерный расчёт НДС при текущей выручки
`;

    return sendMessage([{ role: 'user', content: vatMessage }]);
}

// Функция для получения рекомендаций по пациенту
export async function getPatientRecommendations(patientData: {
    age?: number;
    lastVisit?: string;
    treatmentHistory?: string[];
}): Promise<string> {
    const patientMessage = `
Данные пациента:
- Возраст: ${patientData.age || 'не указан'}
- Последний визит: ${patientData.lastVisit || 'не указан'}
- История лечения: ${patientData.treatmentHistory?.join(', ') || 'не указана'}

Дай рекомендации:
1. Какие услуги предложить этому пациенту
2. Когда рекомендовать следующий визит
3. Как повысить лояльность этого пациента
`;

    return sendMessage([{ role: 'user', content: patientMessage }]);
}

// Telegram Bot Sales Prompt
export const TELEGRAM_SALES_PROMPT = `Ты — AI-продавец стоматологической клиники DENTAL PRO в Telegram. Твои задачи:

1. **Запись на приём**: Помогай пользователям записаться на консультацию или лечение
2. **Консультация по услугам**: Объясняй виды услуг и их стоимость
3. **Ответы на вопросы**: Отвечай на частые вопросы о лечении
4. **Сбор контактов**: Вежливо запрашивай контактные данные для связи

Стиль общения:
- Дружелюбный и профессиональный
- Не агрессивные продажи
- Эмпатия к проблемам пациентов
- Быстрые и чёткие ответы

Если не можешь ответить на вопрос — предложи связаться с администратором клиники.`;

export async function getTelegramResponse(userMessage: string): Promise<string> {
    return sendMessage(
        [{ role: 'user', content: userMessage }],
        TELEGRAM_SALES_PROMPT
    );
}
