#!/bin/bash

# Interview Q&A Practice - Startup Script for Mac/Linux
# This script starts both backend and frontend servers

echo ""
echo "========================================"
echo "Interview Q&A Practice Application"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Or use: brew install node (on Mac)"
    echo "Then restart this script."
    exit 1
fi

echo "✓ Node.js is installed"
echo ""

# Check if in correct directory
if [ ! -f "backend/package.json" ]; then
    echo "ERROR: Backend folder not found!"
    echo ""
    echo "Please run this script from the project root directory."
    echo "(Where backend/ and frontend/ folders are located)"
    exit 1
fi

echo "✓ Directory verified"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo ""
    echo "Installing backend dependencies..."
    echo "(This may take 1-2 minutes)"
    echo ""
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies!"
        exit 1
    fi
    cd ..
fi

echo ""
echo "========================================"
echo "✓ All checks passed!"
echo "========================================"
echo ""

# Ask user which terminal multiplexer to use
echo "Choose how to run the servers:"
echo "1) Separate terminal windows (requires iTerm2 on Mac)"
echo "2) Single split terminal (requires tmux)"
echo "3) Manual start (you'll start each server separately)"
echo ""
read -p "Enter choice (1/2/3): " choice

case $choice in
    1)
        echo "Starting backend server in a new window..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # Mac
            osascript -e 'tell app "Terminal" to do script "cd '$PWD'/backend && npm start"'
        else
            # Linux
            gnome-terminal -- bash -c "cd '$PWD'/backend && npm start; bash"
        fi
        
        sleep 3
        
        echo "Starting frontend server in a new window..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # Mac
            osascript -e 'tell app "Terminal" to do script "cd '$PWD'/frontend && python3 -m http.server 8000"'
        else
            # Linux
            gnome-terminal -- bash -c "cd '$PWD'/frontend && python3 -m http.server 8000; bash"
        fi
        ;;
    
    2)
        if ! command -v tmux &> /dev/null; then
            echo "ERROR: tmux is not installed!"
            echo "Install with: brew install tmux (Mac) or apt-get install tmux (Linux)"
            exit 1
        fi
        
        # Create tmux session with two windows
        tmux new-session -d -s interview -x 200 -y 50
        
        # Backend window
        tmux send-keys -t interview:0 "cd backend && npm start" Enter
        tmux rename-window -t interview:0 "Backend (Port 5000)"
        
        # Frontend window
        tmux new-window -t interview
        tmux send-keys -t interview:1 "cd frontend && python3 -m http.server 8000" Enter
        tmux rename-window -t interview:1 "Frontend (Port 8000)"
        
        # Show tmux session
        tmux attach-session -t interview
        ;;
    
    3)
        echo ""
        echo "========================================"
        echo "Manual Start Instructions"
        echo "========================================"
        echo ""
        echo "Terminal 1 (Backend):"
        echo "  cd backend"
        echo "  npm start"
        echo ""
        echo "Terminal 2 (Frontend) - Open in NEW terminal:"
        echo "  cd frontend"
        echo "  python3 -m http.server 8000"
        echo ""
        echo "Then open browser to:"
        echo "  http://localhost:8000"
        echo ""
        ;;
    
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "========================================"
echo "✓ Servers are starting!"
echo "========================================"
echo ""
echo "Frontend URL: http://localhost:8000"
echo "Backend API: http://localhost:5000"
echo ""
echo "Keep all terminals open while using the app!"
echo "========================================="
echo ""

# Try to open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 2
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    sleep 2
    xdg-open http://localhost:8000
fi

echo "The application is starting in your browser..."
