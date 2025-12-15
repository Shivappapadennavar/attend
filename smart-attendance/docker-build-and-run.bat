@echo off
setlocal enabledelayedexpansion

echo Building Smart Attendance and Leave Management System...

REM Build frontend
echo Building frontend Docker image...
cd frontend
docker build -t smart-attendance-frontend:latest .
if errorlevel 1 (
    echo Frontend build failed
    exit /b 1
)
cd ..

REM Build backend
echo Building backend Docker image...
cd backend
docker build -t smart-attendance-backend:latest .
if errorlevel 1 (
    echo Backend build failed
    exit /b 1
)
cd ..

REM Stop existing containers
echo Stopping existing containers...
docker stop smart-attendance-backend smart-attendance-frontend 2>nul
docker rm smart-attendance-backend smart-attendance-frontend 2>nul

REM Create data directory
if not exist "backend\data" mkdir backend\data

REM Run backend
echo Starting backend container...
docker run -d ^
  --name smart-attendance-backend ^
  -p 8000:8000 ^
  -v %cd%\backend\data:/app/data ^
  --restart unless-stopped ^
  smart-attendance-backend:latest

REM Run frontend
echo Starting frontend container...
docker run -d ^
  --name smart-attendance-frontend ^
  -p 80:80 ^
  --restart unless-stopped ^
  smart-attendance-frontend:latest

echo.
echo Deployment complete!
echo.
echo Access the application:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo Demo Credentials:
echo   Admin: admin@example.com / password
echo   Employee: emp@example.com / password
echo.
echo View logs:
echo   docker logs -f smart-attendance-backend
echo   docker logs -f smart-attendance-frontend
