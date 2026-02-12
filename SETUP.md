# 🚀 Quick Start Guide - Interview Q&A Practice

Follow these simple steps to get the application running on your computer.

## Step 1: Install Node.js

If you haven't installed Node.js yet:

1. Visit: https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Install it (use default settings)
4. Verify installation by opening PowerShell and typing:
   ```
   node --version
   npm --version
   ```

## Step 2: Navigate to Backend Directory

Open PowerShell and navigate to the backend folder:

```powershell
cd "C:\Users\hp\OneDrive\Desktop\trial\backend"
```

## Step 3: Install Backend Dependencies

Install required packages:

```powershell
npm install
```

Wait for the installation to complete. You should see something like:
```
added X packages in Xs
```

## Step 4: Start the Backend Server

Run the server:

```powershell
npm start
```

You should see output like:
```
Connected to SQLite database
Server running on port 5000
```

**IMPORTANT**: Keep this PowerShell window open. The server must be running for the app to work.

## Step 5: Open the Application in Browser

Open another PowerShell window (don't close the first one!) and navigate to frontend:

```powershell
cd "C:\Users\hp\OneDrive\Desktop\trial\frontend"
python -m http.server 8000
```

Or if you have Python 2:
```powershell
python -m SimpleHTTPServer 8000
```

If you don't have Python, you can directly open the HTML file:
- Open File Explorer
- Navigate to: `C:\Users\hp\OneDrive\Desktop\trial\frontend`
- Right-click on `index.html`
- Select "Open with" → Your browser

## Step 6: Access the Application

Once the server is running, open your browser and go to:

**Option 1** (Recommended):
```
http://localhost:8000
```

**Option 2** (Direct file access):
```
file:///C:/Users/hp/OneDrive/Desktop/trial/frontend/index.html
```

## Step 7: Create an Account & Login

1. Click on "Register" tab
2. Fill in your details:
   - Full Name: Your name
   - Username: Choose a username
   - Email: Your email
   - Password: Create a password
3. Click "Register"
4. You'll be automatically logged in and taken to the dashboard

## Step 8: Start Learning!

1. Click on any category (e.g., "Aptitude")
2. Select Level 1 (other levels are locked until you complete previous ones)
3. Answer all questions (you need 60% to pass)
4. Complete the level to earn a badge and unlock the next level!

## ✅ Verification Checklist

- [ ] Node.js is installed (`node --version` works)
- [ ] Backend server is running (shows "Server running on port 5000")
- [ ] Can access the application in browser (http://localhost:8000)
- [ ] Can register a new account
- [ ] Can see dashboard after login
- [ ] Can select a category
- [ ] Can see quiz levels
- [ ] Can answer quiz questions
- [ ] Can see results after submitting

## 🛑 If Something Goes Wrong

### Backend won't start
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Port 5000 is already in use. Close other Node.js processes or kill the process:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Can't access the application
- Make sure both PowerShell windows are running (backend AND frontend)
- Check browser URL is correct: `http://localhost:8000`
- Try opening in a different browser

### Database errors
- Delete the `app.db` file in the backend folder
- Restart the backend server

### CORS errors
- Make sure backend is running on `http://localhost:5000`
- Try accessing from `http://localhost:8000` (not `file://`)

## 📚 What to Test

1. **Login System**
   - Register with different usernames
   - Login with correct/incorrect credentials
   - Check error messages

2. **Categories**
   - Can see 5 categories on dashboard
   - Can click and navigate to each category

3. **Levels**
   - First level (Easy) is unlocked by default
   - Other levels show as locked
   - Levels are properly displayed

4. **Quiz**
   - Can answer questions with radio buttons
   - Can navigate between questions
   - Answer selected options are remembered
   - Can see progress bar moving forward

5. **Results**
   - Correct score calculation
   - Pass/fail logic (60% threshold)
   - Badge awarded on pass
   - Next level unlocked on pass

6. **Dashboard**
   - Statistics update after completing levels
   - Badges display correctly
   - Progress bars show correct percentage

## 🎯 Tips for Better Experience

- Use Chrome or Firefox for best compatibility
- Keep both backend and frontend running
- Test with the provided sample accounts first
- Clear browser cache if you see old data
- Use private/incognito window if having login issues

## 📞 Need Help?

Refer to the main README.md file for more detailed information about:
- Project structure
- API endpoints
- Database schema
- Features and usage

---

**Enjoy your learning journey! 🌟**
