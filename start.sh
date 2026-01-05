#!/bin/bash

# NeoCRM Dental System - Start Script
# Запуск на порту 8005

echo "🦷 NeoCRM Dental System"
echo "=========================="
echo ""

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js."
    exit 1
fi

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Пожалуйста, установите npm."
    exit 1
fi

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
    echo ""
fi

# Запуск приложения
echo "🚀 Запуск приложения на порту 8005..."
echo "📱 Приложение будет доступно по адресу: http://localhost:8005"
echo ""
echo "Нажмите Ctrl+C для остановки"
echo ""

PORT=8005 npm run dev