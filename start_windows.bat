@echo off
cd /d "%~dp0"
title Server Setup and 3X-UI Guide

echo ==========================================================
echo   Server Setup and 3X-UI Guide - Windows Launcher
echo ==========================================================
echo Current folder: "%CD%"
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Download: https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules\vite\" (
    echo [INFO] Installing libraries...
    call npm.cmd install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

start "" http://localhost:3000
echo [INFO] Opening http://localhost:3000 ...

if exist "%~dp0node_modules\vite\bin\vite.js" (
    node "%~dp0node_modules\vite\bin\vite.js" --port=3000 --host=0.0.0.0
) else (
    call npm.cmd run dev
)
pause
