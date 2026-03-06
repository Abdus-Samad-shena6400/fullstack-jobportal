#!/bin/bash

# 🚀 Job Portal - Quick Start Script
# This script starts both the backend and frontend servers

echo "==============================================="
echo "🎯 Job Portal - Full Stack Application"
echo "==============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Start Backend
echo "📦 Starting Backend Server..."
cd backend
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   → Running on http://localhost:5000"
sleep 2

# Start Frontend
echo ""
echo "📱 Starting Frontend Development Server..."
cd ../frontend
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   → Running on http://localhost:5173"
sleep 2

echo ""
echo "==============================================="
echo "✨ Application is ready!"
echo "==============================================="
echo ""
echo "🌐 Open your browser and navigate to:"
echo "   → http://localhost:5173/"
echo ""
echo "📊 Backend API:"
echo "   → http://localhost:5000/api"
echo ""
echo "ℹ️  Press Ctrl+C to stop both servers"
echo ""

# Keep the script running
wait
