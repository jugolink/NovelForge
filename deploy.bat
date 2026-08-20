@echo off
echo ========================================================
echo    NovelForge - Docker Auto Build ^& Push
echo ========================================================

for /f "delims=" %%v in ('node -p "require('./frontend/package.json').version"') do set APP_VERSION=%%v

:: 请将这里的 DOCKER_USER 修改为你自己的 Docker Hub 用户名
set DOCKER_USER=jugolink

set BACKEND_IMAGE_LATEST=%DOCKER_USER%/novelforge-backend:latest
set BACKEND_IMAGE_VERSION=%DOCKER_USER%/novelforge-backend:%APP_VERSION%

set FRONTEND_IMAGE_LATEST=%DOCKER_USER%/novelforge-frontend:latest
set FRONTEND_IMAGE_VERSION=%DOCKER_USER%/novelforge-frontend:%APP_VERSION%

echo.
echo [1/4] Building Backend Docker image (Version: %APP_VERSION%) ...
:: 强制指定构建架构为 linux/amd64
docker build --platform linux/amd64 -t %BACKEND_IMAGE_LATEST% -t %BACKEND_IMAGE_VERSION% ./backend
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Backend Docker build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Building Frontend Docker image (Version: %APP_VERSION%) ...
:: 强制指定构建架构为 linux/amd64
docker build --platform linux/amd64 -t %FRONTEND_IMAGE_LATEST% -t %FRONTEND_IMAGE_VERSION% ./frontend
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Frontend Docker build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Logging into Docker Hub ...
docker login
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker login failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [4/4] Pushing images to Docker Hub ...
docker push %BACKEND_IMAGE_LATEST%
docker push %BACKEND_IMAGE_VERSION%
docker push %FRONTEND_IMAGE_LATEST%
docker push %FRONTEND_IMAGE_VERSION%
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to push images!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   SUCCESS! Image build and push completed.
echo   Tags pushed: latest and %APP_VERSION%
echo ========================================================
pause
