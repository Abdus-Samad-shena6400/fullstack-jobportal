#!/bin/bash

# GitHub Upload Script for Job Portal Project
# This script helps you upload your project to GitHub

echo "==============================================="
echo "GitHub Upload Script - Job Portal Project"
echo "==============================================="
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git is installed"
echo

# Navigate to project directory
cd "/c/Users/obaid jan/OneDrive/Desktop/my-all-project/job-portal" 2>/dev/null || cd "c:/Users/obaid jan/OneDrive/Desktop/my-all-project/job-portal"

# Check if .gitignore exists
if [ ! -f .gitignore ]; then
    echo "Error: .gitignore file not found!"
    exit 1
fi

echo "✅ .gitignore found"
echo

# Initialize git if not already done
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo
echo "Adding files to Git (respecting .gitignore)..."
git add .

echo
echo "Files that will be committed:"
git status --porcelain

echo
echo "==============================================="
echo "Ready to commit and push to GitHub!"
echo "==============================================="
echo
echo "Next steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo
echo "git commit -m \"Initial commit: Job Portal Full Stack Application\""
echo "git remote add origin YOUR_GITHUB_REPO_URL"
echo "git push -u origin main"
echo
echo "==============================================="
echo