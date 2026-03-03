@echo off
echo.
echo  ██╗   ██╗██╗   ██╗███╗   ██╗██╗      ██████╗ ██████╗  ██████╗
echo  ██║   ██║╚██╗ ██╔╝████╗  ██║██║     ██╔══██╗██╔══██╗██╔═══██╗
echo  ██║   ██║ ╚████╔╝ ██╔██╗ ██║██║     ██████╔╝██████╔╝██║   ██║
echo  ╚██╗ ██╔╝  ╚██╔╝  ██║╚██╗██║██║     ██╔═══╝ ██╔══██╗██║   ██║
echo   ╚████╔╝    ██║   ██║ ╚████║███████╗██║     ██║  ██║╚██████╔╝
echo    ╚═══╝     ╚═╝   ╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝
echo.
echo  Your Artist Studio — Loading from USB...
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [!] Node.js not found. Please install from https://nodejs.org
    echo      Get Node.js 20 LTS, then run this script again.
    pause
    exit /b 1
)

for /f "tokens=1" %%v in ('node --version') do set NODE_VER=%%v
echo  [✓] Node.js %NODE_VER% detected

:: Set paths
set SCRIPT_DIR=%~dp0
set APP_DIR=%SCRIPT_DIR%app

:: Check if node_modules exist, install if not
if not exist "%APP_DIR%\node_modules" (
    echo  [*] First run — installing dependencies ^(one time only^)...
    cd /d "%APP_DIR%"
    call npm install --prefer-offline 2>nul
    if %errorlevel% neq 0 (
        echo  [*] Installing with online fallback...
        call npm install
    )
)

:: Set env for local
set NODE_ENV=production
set NEXTAUTH_URL=http://localhost:3000

:: Start the app
echo  [*] Starting VYNL.PRO on http://localhost:3000
echo.
cd /d "%APP_DIR%"

:: Open browser after short delay
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: Start Next.js server
call npm start

pause
