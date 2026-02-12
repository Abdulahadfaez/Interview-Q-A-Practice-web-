# 🏗️ System Architecture & Troubleshooting

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                              │
│  ┌──────────┬──────────┬──────────┬──────────┐                  │
│  │ Login    │Dashboard │ Levels   │ Quiz     │                  │
│  │ Page     │ Page     │ Page     │ Page     │                  │
│  └──────────┴──────────┴──────────┴──────────┘                  │
│         ↓                                                         │
│  Frontend Files (HTML, CSS, JavaScript)                         │
│  Served by: python -m http.server 8000                          │
└─────────────────────────────────────────────────────────────────┘
                           ↓
                    HTTP Requests/
                    Responses (JSON)
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API SERVER                            │
│              Node.js + Express on Port 5000                     │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Routes:                                                     │ │
│  │ /auth/register, /auth/login, /categories                  │ │
│  │ /levels/:categoryId, /questions/:levelId                  │ │
│  │ /submit-quiz, /badges, /progress                          │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SQLITE DATABASE                               │
│              File: app.db (Auto-created)                        │
│                                                                  │
│  Tables:                                                         │
│  ├─ users           (User accounts & info)                     │
│  ├─ categories      (Learning categories)                      │
│  ├─ levels          (5 levels per category)                    │
│  ├─ questions       (Quiz questions)                           │
│  ├─ user_progress   (Tracking,completion)                      │
│  └─ badges          (Achievements)                             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration & Login
```
User enters credentials
    ↓
Frontend sends to /auth/register or /auth/login
    ↓
Backend validates (checks if user exists, password correct)
    ↓
Backend creates JWT token
    ↓
Frontend stores token in localStorage
    ↓
All future requests include token in header
```

### 2. Category & Level Loading
```
User logs in
    ↓
Frontend requests /categories
    ↓
Backend returns all categories from database
    ↓
User selects category
    ↓
Frontend requests /levels/categoryId
    ↓
Backend checks user_progress table to determine lock status
    ↓
Returns levels with status (locked/unlocked/completed)
```

### 3. Quiz Completion Flow
```
User loads quiz
    ↓
Frontend requests /questions/levelId
    ↓
Backend returns questions (without answers)
    ↓
User answers questions and clicks Submit
    ↓
Frontend sends answers to /submit-quiz
    ↓
Backend checks answers against correct_answer field
    ↓
Calculates score (if ≥60% = PASS)
    ↓
On PASS:
  - Creates badge entry
  - Unlocks next level (updates user_progress)
  - Returns result to frontend
    ↓
Frontend shows result page with badge if passed
```

## 🔧 Troubleshooting Guide

### Problem: Application Won't Start

#### Symptom: "npm: command not found"
```
Error:
  npm : The term 'npm' is not recognized
```
**Root Cause**: Node.js not installed

**Solution**:
1. Download Node.js from https://nodejs.org/
2. Install it (LTS version recommended)
3. Restart computer
4. Verify: `node --version` && `npm --version`

---

#### Symptom: "EADDRINUSE: address already in use :::5000"
```
Error:
  Error: listen EADDRINUSE :::5000
```
**Root Cause**: Port 5000 is already in use

**Solutions**:
```powershell
# Option 1: Kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID 1234 /F  # Replace 1234 with PID

# Option 2: Use different port (modify server.js line at bottom)
# Change: const PORT = 5000;
# To:     const PORT = 5001;

# Then restart backend and update API_URL in frontend files
```

---

#### Symptom: "python: command not found" or "python -m http.server" doesn't work
```
Error:
  python : The term 'python' is not recognized
```
**Root Cause**: Python not installed or not in PATH

**Solutions**:
```powershell
# Option 1: Install Python from https://www.python.org/
#   → Check "Add Python to PATH" during installation

# Option 2: Use PHP instead (if installed)
cd frontend
php -S localhost:8000

# Option 3: Use direct file access
# Open File Explorer
# Navigate to: C:\Users\hp\OneDrive\Desktop\trial\frontend
# Right-click index.html → Open with Browser
```

---

### Problem: Can't Access Application

#### Symptom: "localhost:8000 refused to connect" or "Connection timeout"
```
Error in browser:
  ERR_CONNECTION_REFUSED
  net::ERR_CONNECTION_TIMEOUT
```
**Root Cause**: Frontend server not running

**Solution**:
1. Check Terminal 2 is still open and running
2. Look for: "Serving HTTP on 0.0.0.0 port 8000"
3. If not there, run:
```powershell
cd "C:\Users\hp\OneDrive\Desktop\trial\frontend"
python -m http.server 8000
```

---

#### Symptom: Backend requests fail
```
Console error:
  Failed to fetch
  Network error
  ERR_FAILED
```
**Root Cause**: Backend server not running

**Solution**:
1. Check Terminal 1 is open
2. Look for: "Server running on port 5000"
3. If not there, run:
```powershell
cd C:\Users\hp\OneDrive\Desktop\trial\backend
npm start
```

---

### Problem: Features Not Working

#### Symptom: Can't login / Register button doesn't work
```
Error message:
  "Failed to register" or "Failed to login"
Console error:
  POST http://localhost:5000/auth/login 404 Not Found
```
**Root Cause**: Backend not running or API not responding

**Solution**:
1. Ensure backend Terminal shows "Server running on port 5000"
2. Check no errors in backend Terminal
3. Try stopping and restarting backend:
```powershell
# Press Ctrl+C to stop
npm start
```

---

#### Symptom: Can't load categories / levels / quiz
```
Error message:
  "Failed to load categories"
  "Failed to load levels"
  "Failed to load questions"
Console error shows: 
  404 Not Found
```
**Root Cause**: API endpoints not working

**Solution**:
1. Check backend Terminal for errors
2. Verify database connected:
   ```
   Should see: "Connected to SQLite database"
   ```
3. If database error, delete and recreate:
```powershell
# In backend folder
Del app.db
npm start
```

---

#### Symptom: Quiz submits but no results show
```
Behavior:
  Submit button clicked but page doesn't update
Console error:
  POST http://localhost:5000/submit-quiz: No response
```
**Root Cause**: Backend crashed or lost connection

**Solution**:
1. Check backend Terminal for error messages
2. Backend may have stopped - restart:
```powershell
npm start
```
3. Refresh browser page and try again

---

#### Symptom: Scores not being saved / Badges not appearing
```
Behavior:
  Complete quiz, get badge notification
  Refresh page - badge is gone
  Dashboard not showing progress
```
**Root Cause**: Database not saving data (permission issue)

**Solution**:
1. Check backend has write access to folder
2. Verify app.db file exists and has size > 0
3. Delete and reset database:
```powershell
cd backend
Del app.db
npm start
```

---

### Problem: Database Issues

#### Symptom: "SQLITE_CANTOPEN: unable to open database file"
```
Error in backend:
  Error: unable to open database file
  sqlite3.Database
```
**Root Cause**: Database file corrupted or path issue

**Solution**:
```powershell
# Delete the corrupted database
cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
Del app.db

# Restart backend
npm start

# Monitor for: "Connected to SQLite database"
```

---

#### Symptom: Database gets created but empty (no categories/questions)
```
Behavior:
  Can login but no categories appear
Console shows no categories
```
**Root Cause**: Seed data didn't insert

**Solution**:
```powershell
cd backend
Del app.db
npm start
# Wait 5 seconds for database setup
# Categories should now appear
```

---

### Problem: CORS Cross-Origin Errors

#### Symptom: "Access to XMLHttpRequest blocked by CORS"
```
Error in console:
  CORS policy: No 'Access-Control-Allow-Origin' header
```
**Root Cause**: Frontend and backend URLs invalid

**Solution**:
1. Ensure backend on: http://localhost:5000
2. Ensure frontend on: http://localhost:8000 (not file://)
3. Update API_URL in HTML files if needed:
```javascript
// In index.html, dashboard.html, levels.html, quiz.html
const API_URL = 'http://localhost:5000'; // Must match backend
```

---

### Problem: Token/Authentication Issues

#### Symptom: "Invalid token" error after login
```
Error message when accessing dashboard:
  "Invalid token"
  401 Unauthorized
```
**Root Cause**: Token expired or localStorage cleared

**Solution**:
1. Clear browser data:
   - Ctrl + Shift + Delete
   - Select "All time"
   - Clear localStorage
2. Login again
3. Don't clear browser cache while logged in

---

#### Symptom: Logged in but can't access protected pages
```
Behavior:
  Can login, redirected to dashboard
  But immediately redirected back to login
```
**Root Cause**: Token not saved properly

**Solution**:
1. Check browser DevTools:
   - F12 → Application → Local Storage
   - Should see: token, userId, userName, ageGroup
2. If missing, try registering new account
3. Try different browser or incognito window

---

## 🔍 Debugging Tips

### 1. Check Browser Console
```javascript
F12 or Right-click → Inspect → Console tab
// Look for red error messages
```

### 2. Check Network Tab
```
F12 → Network tab
// Look at API requests
// Check response status codes (should be 200 for success)
```

### 3. Check Backend Logs
```
Monitor the Terminal 1 window while using the app
Look for error messages or stack traces
```

### 4. Check Database Structure
```powershell
# Optional: Install SQLite viewer
# Then open: C:\Users\hp\OneDrive\Desktop\trial\backend\app.db
# View tables and data
```

### 5. Check File Permissions
```powershell
# Ensure folder has write access
icacls "C:\Users\hp\OneDrive\Desktop\trial\backend"
# Should show: BUILTIN\Users:(F) or similar
```

---

## 🚨 Emergency Reset

If everything is broken and you want to start fresh:

```powershell
# Stop both terminals (Ctrl+C)

# Delete Node modules (optional, to free space)
cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
rmdir /s node_modules
Del package-lock.json

# Delete database
Del app.db

# Reinstall and restart
npm install
npm start
```

---

## 📊 Diagnostic Command

Run this to check your system:

```powershell
echo "=== Node.js Check ==="
node --version
npm --version

echo "=== Backend Folder ==="
cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
dir

echo "=== Port 5000 Check ==="
netstat -ano | findstr :5000

echo "=== Port 8000 Check ==="
netstat -ano | findstr :8000

echo "=== Python Check ==="
python --version

echo "=== Folder Access Check ==="
cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
(New-Item -ItemType File -Path "test.txt") -and (Remove-Item test.txt) 
if ($?) { echo "Write access: OK" } else { echo "Write access: FAILED" }
```

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Node.js installed (`node --version` works)
- [ ] npm updated (`npm install` works)
- [ ] Backend folder has all 3 files (package.json, server.js, database.js)
- [ ] Frontend folder has all 4 HTML files
- [ ] Terminal 1: Backend shows "Server running on port 5000"
- [ ] Terminal 2: Frontend shows "Serving HTTP on... port 8000"
- [ ] Browser shows login page at http://localhost:8000
- [ ] Can register new account
- [ ] Can login with created account
- [ ] Dashboard displays 5 categories

If all above are true, application should work fully!

---

**Still having issues?**
→ Review the step numbers in INSTALLATION.md
→ Try the "Emergency Reset" section above
→ Check all file paths match your system
