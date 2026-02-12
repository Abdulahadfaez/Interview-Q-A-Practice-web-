# ⚡ Quick Reference Card

## 📋 Before You Start

```
☐ Node.js installed (node --version shows version)
☐ Internet connection available
☐ Admin access to install packages
```

## 🚀 Launch Sequence (In Order)

### Terminal 1: Backend
```powershell
cd C:\Users\hp\OneDrive\Desktop\trial\backend
npm install          # First time only
npm start            # Every time
# Keep this open!
```

### Terminal 2: Frontend
```powershell
cd C:\Users\hp\OneDrive\Desktop\trial\frontend
python -m http.server 8000
# Keep this open!
```

### Browser
```
http://localhost:8000
```

## 📊 Status Indicators

| What You Should See | Status |
|---|---|
| "Server running on port 5000" in Terminal 1 | ✅ Backend OK |
| "Serving HTTP on... port 8000" in Terminal 2 | ✅ Frontend OK |
| Login page loads in browser | ✅ Everything OK |

## 🧪 Test the Application

1. **Register** → Create account
2. **Login** → Use your credentials
3. **Select Category** → Click any category
4. **Choose Level** → Click Level 1
5. **Answer Quiz** → Select all options
6. **Submit** → See your score
7. **Check Badges** → On dashboard

## 🎯 User Account Template

```
Full Name: Your Name
Username: yourname123
Email: yourname@email.com
Password: YourPassword123
```

## 🔧 Fix Common Issues

| Problem | Solution |
|---|---|
| npm: command not found | Install Node.js, restart computer |
| Port 5000 in use | `netstat -ano \| findstr :5000` then kill process |
| Can't access localhost:8000 | Check Terminal 2 is running |
| Database error | Delete `app.db`, restart backend |
| CORS error | Backend must run on :5000, Frontend on :8000 |
| Python not found | Install Python or use direct file access |

## 📁 Important File Paths

```
Backend Package:     C:\Users\hp\OneDrive\Desktop\trial\backend\package.json
Database File:       C:\Users\hp\OneDrive\Desktop\trial\backend\app.db
Login Page:          C:\Users\hp\OneDrive\Desktop\trial\frontend\index.html
Backend Server:      C:\Users\hp\OneDrive\Desktop\trial\backend\server.js
API URL:             http://localhost:5000
Frontend URL:        http://localhost:8000
```

## 🎓 Quiz Requirements

| Item | Requirement |
|---|---|
| Pass Score | 60% or higher |
| Questions per Level | 3 questions |
| Levels per Category | 5 levels (Very Easy, Easy, Medium, Hard, Expert) |
| Badge Reward | Automatically awarded on pass |
| Next Level Unlock | Automatic on level pass |

## 💡 Features Overview

```
✨ 5 Categories
   ├─ C Programming
   ├─ Aptitude
   ├─ Technical MCQs
   ├─ Data Structures
   └─ Web Development

📊 5 Levels per Category
   ├─ Level 1: Easy (14-18, 19-30, 31+ years)
   ├─ Level 2: Medium (Unlocked after Level 1)
   └─ Level 3: Hard (Unlocked after Level 2)

🏆 Badge System
   └─ 1 Badge per completed level

📈 Progress Tracking
   ├─ Overall completion %
   ├─ Levels completed
   ├─ Levels unlocked
   └─ Badge collection
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Secure API endpoints
- ✅ Protected routes
- ✅ Session management

## 📞 When Something Breaks

1. Check both terminals are running
2. Look for error messages
3. Refer to INSTALLATION.md for detailed solutions
4. Check README.md for API/database info
5. Try restarting both servers

## ✅ Success Checklist

After completing setup:

- [ ] Both terminals showing "running/serving" messages
- [ ] Can see login page in browser
- [ ] Can create new account
- [ ] Can login successfully
- [ ] Can see 5 categories on dashboard
- [ ] Can click and view levels
- [ ] Can answer quiz questions
- [ ] Can submit quiz and see score
- [ ] Can see badges earned
- [ ] Progress shows on dashboard

## 🎯 Default Test Flow

```
1. Browser: http://localhost:8000
2. Click: Register tab
3. Fill: Test account details
4. Click: Register button
5. Automatically logged in
6. Dashboard page loads
7. Click: Aptitude category
8. Click: Level 1 (Easy)
9. Answer: 3 questions
10. Click: Submit Quiz
11. See: Your score and badge
```

## 📚 Documentation Files

- `README.md` - Full project documentation
- `SETUP.md` - Step-by-step setup guide
- `INSTALLATION.md` - Full installation guide
- `QUICK_REFERENCE.md` - This file!

---

**Need More Help?** 
→ Read the complete INSTALLATION.md file for detailed instructions.

**Want Full Details?** 
→ Check README.md for technical information.
