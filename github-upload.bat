@echo off
REM GitHub Upload Script for Job Portal Project
REM This script helps you upload your project to GitHub

echo.
echo ===============================================
echo GitHub Upload Script - Job Portal Project
echo ===============================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Navigate to project directory
cd "c:/Users/obaid jan/OneDrive/Desktop/my-all-project/job-portal"

REM Check if .gitignore exists
if not exist .gitignore (
    echo Error: .gitignore file not found!
    pause
    exit /b 1
)

echo ✅ .gitignore found
echo.

REM Initialize git if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo Adding files to Git (respecting .gitignore)...
git add .

echo.
echo Files that will be committed:
git status --porcelain

echo.
echo ===============================================
echo Ready to commit and push to GitHub!
echo ===============================================
echo.
echo Next steps:
echo 1. Create a new repository on GitHub.com
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo git commit -m "Initial commit: Job Portal Full Stack Application"
echo git remote add origin YOUR_GITHUB_REPO_URL
echo git push -u origin main
echo.
echo ===============================================
echo.
pause