# 💻 Complete Installation Guide

Since Node.js is not installed on your system, here's a complete step-by-step guide.

## 🔹 Step A: Install Node.js (REQUIRED)

### For Windows 11/10:

1. **Download Node.js**
   - Visit: https://nodejs.org/
   - Click the green button (LTS - Long Term Support)
   - This will download a .exe installer

2. **Install Node.js**
   - Double-click the downloaded .exe file
   - Click "Next" on all screens (default options are fine)
   - Click "Install"
   - Restart your computer

3. **Verify Installation**
   - Close all PowerShell windows
   - Open a new PowerShell window
   - Type this command:
     ```
     node --version
     ```
   - You should see something like: `v18.17.0`
   - Type this command:
     ```
     npm --version
     ```
   - You should see something like: `9.6.7`

If you see version numbers, Node.js is installed correctly!

## 🔹 Step B: Install Backend Dependencies

Once Node.js is installed:

1. Open PowerShell
2. Navigate to the backend folder:
   ```powershell
   cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
   This will create a `node_modules` folder and download all packages

4. Wait for it to complete (may take 1-2 minutes)

## 🔹 Step C: Start the Backend Server

1. In the same PowerShell window, type:
   ```powershell
   npm start
   ```

2. You should see:
   ```
   Connected to SQLite database
   Server running on port 5000
   ```

3. **KEEP THIS WINDOW OPEN** while using the application

## 🔹 Step D: Open the Frontend

### Option 1: Using Python (Recommended)

1. Open a **NEW** PowerShell window (don't close the backend server window!)
2. Navigate to frontend:
   ```powershell
   cd "C:\Users\hp\OneDrive\Desktop\trial\frontend"
   ```
3. Start a simple web server:
   ```powershell
   python -m http.server 8000
   ```
4. You should see:
   ```
   Serving HTTP on 0.0.0.0 port 8000 ...
   ```
5. Open your browser and go to: **http://localhost:8000**

### Option 2: Using PHP (Alternative)

If you have PHP installed:
```powershell
cd "C:\Users\hp\OneDrive\Desktop\trial\frontend"
php -S localhost:8000
```

### Option 3: Direct File Access (Simplest)

If you don't have Python or PHP:
1. Open File Explorer
2. Navigate to: `C:\Users\hp\OneDrive\Desktop\trial\frontend`
3. Right-click on `index.html`
4. Select "Open with" → Choose your browser
5. The app will open (but some features might not work perfectly)

## ✅ Verification

After everything is set up, verify:

1. **Backend Server Running** ✅
   - PowerShell window shows "Server running on port 5000"
   - Data is still displayed (hasn't stopped)

2. **Frontend Accessible** ✅
   - Browser shows the Interview Q&A login page
   - Page loads smoothly

3. **Both Running Together** ✅
   - Open browser developer tools (F12)
   - Go to Network tab
   - Try to login
   - Should see successful network requests

## 🎯 Common Issues & Solutions

### Issue: "npm is not recognized"
**Cause**: Node.js not installed or not restarted after installation
**Solution**: 
- Restart your computer
- Verify Node.js is installed: `node --version`

### Issue: "Port 5000 already in use"
**Cause**: Another application using the same port
**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Then try npm start again
```

### Issue: Can't access http://localhost:8000
**Cause**: Frontend server not running
**Solution**:
- Make sure second PowerShell window is still running
- Check for the "Serving HTTP" message
- Try opening directly in browser: `file:///C:/Users/hp/OneDrive/Desktop/trial/frontend/index.html`

### Issue: "Python is not recognized"
**Cause**: Python not installed or not in PATH
**Solution**:
- Install Python from https://www.python.org/
- Check "Add Python to PATH" during installation
- Or use PHP/direct file method instead

### Issue: Quiz not loading / Can't submit answers
**Cause**: Backend server not running
**Solution**:
- Check that backend PowerShell still shows "Server running on port 5000"
- If it stopped, run `npm start` again
- Reload the browser page

## 📊 Final System Check

Before testing, verify all windows are open:

```
Window 1 (Backend):
└─ PowerShell
   └─ cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
   └─ npm start
   └─ Shows: "Server running on port 5000"

Window 2 (Frontend):
└─ PowerShell
   └─ cd "C:\Users\hp\OneDrive\Desktop\trial\frontend"
   └─ python -m http.server 8000
   └─ Shows: "Serving HTTP on... port 8000"

Window 3 (Browser):
└─ http://localhost:8000
   └─ Shows Interview Q&A login page
```

## 🚀 Start Using the App

1. Register a new account
2. Login with your credentials
3. Select a category (e.g., Aptitude)
4. Choose Level 1 (others are locked)
5. Answer the questions
6. Get 60% or more to pass and unlock the next level!
7. Earn badges for completing levels!

## 📚 File Structure Overview

```
Interview Q&A Practice App
│
├── backend/
│   ├── package.json          <- Dependencies list
│   ├── server.js             <- Main server file
│   ├── database.js           <- Database setup
│   └── node_modules/         <- Downloaded packages (created by npm)
│
├── frontend/
│   ├── index.html            <- Login page
│   ├── dashboard.html        <- Category selection
│   ├── levels.html           <- Level selection
│   └── quiz.html             <- Quiz interface
│
├── README.md                 <- Full documentation
└── SETUP.md                  <- This file
```

## 🎓 Learning Resources

If you're new to some of these tools:

- **Node.js**: World's most popular JavaScript runtime
- **npm**: Package manager for Node.js
- **Express**: Web framework for building APIs
- **SQLite**: Lightweight database
- **JWT**: Secure token-based authentication

## ✨ Next Steps

1. Complete the installation following Steps A-D above
2. Create your account
3. Start learning and complete quiz levels
4. Earn badges for your achievements!

---

**Happy learning! If you have any questions, refer to the README.md file for more technical details.** 📚
