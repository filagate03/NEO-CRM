@echo off
chcp 65001 >nul
title DENTAL PRO CRM - Development Server

echo.
echo ========================================
echo   DENTAL PRO CRM
echo   Development Server
echo ========================================
echo.

echo [1] Starting development server...
echo.

npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo   ERROR: Server failed to start
    echo ========================================
    echo.
    pause
)