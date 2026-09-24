@echo off
cd /d "%~dp0"
echo Starting setup in folder: "%CD%"

if not exist "node_modules\vite\" (
    echo [INFO] Installing libraries...
    call npm.cmd install --legacy-peer-deps
)

start "" http://localhost:3000

echo [INFO] Starting Vite server on http://localhost:3000 ...
if exist "%~dp0node_modules\vite\bin\vite.js" (
    node "%~dp0node_modules\vite\bin\vite.js" --port=3000 --host=0.0.0.0
) else (
    call npm.cmd run dev
)
pause
