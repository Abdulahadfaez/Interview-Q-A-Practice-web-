# Interview Q&A Practice Web Application

A comprehensive web application for practicing interview questions and MCQs across multiple categories with a progressive level system, progress tracking, and badge rewards.

## 🌟 Features

- **User Authentication**: Secure login and registration system
- **Multiple Categories**: 5 learning categories (C Programming, Aptitude, Technical MCQs, Data Structures, Web Development)
- **Progressive Learning**: 5 difficulty levels per category (Very Easy, Easy, Medium, Hard, Expert)
- **Level Unlocking**: Sequential level progression - complete one level to unlock the next
- **Badge System**: Earn badges upon completing levels
- **Progress Tracking**: Dashboard showing overall progress and completion statistics
- **Quiz Interface**: Clean, interactive quiz experience with immediate feedback
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
interview-qa-practice/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── database.js
└── frontend/
    ├── index.html (Login/Register)
    ├── dashboard.html (Category Selection)
    ├── levels.html (Level Selection)
    └── quiz.html (Quiz Interface)
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** for database
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **HTML5**
- **CSS3** with modern animations
- **Vanilla JavaScript**

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm
- Any modern web browser

## 🚀 Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
# From the project root
.\start-backend.cmd

# Or from the backend folder
cd backend
npm start
```

The server will start on `http://localhost:5000`

Do not run `server.js`, `server node.js`, or `server.node.js` directly in PowerShell. Use `.\start-backend.cmd`, `npm start`, `node server.js`, or `.\server` instead.

**Output:**
```
Connected to SQLite database
Server running on port 5000
```

## Render Deployment

This project is ready to deploy to Render as a single Node web service.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. Render will read [`render.yaml`](c:/Users/hp/OneDrive/Desktop/trial/render.yaml) and create:
   - one Node web service
   - one persistent disk for SQLite at `/var/data`
4. After the first deploy, set `FRONTEND_URLS` to your Render app URL:
   - example: `https://your-app-name.onrender.com`
5. Open your Render URL. The backend and frontend are served from the same service.

Important: SQLite needs persistent storage on Render. This setup uses `DB_PATH=/var/data/app.db` so your data survives redeploys.

### 3. Access Frontend

Open your browser and navigate to:
```
file:///path/to/frontend/index.html
```

Or use a local server (recommended for better experience):

```bash
# Using Python 3
cd frontend
python -m http.server 8000

# Then navigate to: http://localhost:8000
```

## 🔐 Default Test Account

You can create a new account or use test credentials:

- **Username**: testuser
- **Password**: test123
- **Name**: Test User

## 📖 How to Use

### 1. Login/Register
- Create a new account or login with existing credentials
- Provide your full name for personalized experience

### 2. Select Category
- Choose from 5 available categories on the dashboard
- View your progress for each category

### 3. Select Difficulty Level
- Choose from 5 difficulty levels
- Level 1 (Very Easy) is unlocked by default
- Complete Level 1 to unlock Level 2, and so on

### 4. Take Quiz
- Answer all questions in the level
- You need 60% or higher to pass
- Get immediate feedback on your performance

### 5. View Badges
- Earn badges for completing levels
- Track your achievements on the dashboard

### 6. Track Progress
- Dashboard shows overall statistics
- View completed levels and unlocked levels for each category

## 🎯 Scoring System

- **Pass Score**: 60% or higher
- **On Pass**: Badge awarded, next level unlocked
- **On Fail**: Attempt again to improve score

## 📊 Database Schema

### Users Table
- id, username, email, password, name, created_at

### Categories Table
- id, name, description, icon

### Levels Table
- id, category_id, name, difficulty, min_age, max_age, sequence_order

### Questions Table
- id, level_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation

### User Progress Table
- id, user_id, level_id, status, completed_at, score

### Badges Table
- id, user_id, level_id, badge_name, earned_at

## 🔄 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/user/:id` - Get user details

### Categories & Levels
- `GET /categories` - Get all categories
- `GET /levels/:categoryId` - Get levels for category

### Questions & Quiz
- `GET /questions/:levelId` - Get questions for a level
- `POST /submit-quiz` - Submit quiz answers

### Progress & Badges
- `GET /badges/:userId` - Get user badges
- `GET /progress/:userId` - Get user progress summary

## 🎨 UI/UX Features

- **Clean Interface**: Minimalist design for easy navigation
- **Smooth Animations**: Fade-in, slide-up effects for better UX
- **Gradient Backgrounds**: Modern purple gradient theme
- **Progress Indicators**: Visual progress bars and status indicators
- **Responsive Layout**: Mobile-friendly design
- **Loading States**: Spinner during API calls
- **Error Handling**: User-friendly error messages

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Secure authorization checks on all protected routes
- Protected API endpoints with middleware

## 📝 Content

### Categories Included
1. **C Programming** - 9 questions (3 per level)
2. **Aptitude** - 9 questions (3 per level)
3. **Technical MCQs** - 9 questions (3 per level)
4. **Data Structures** - 3 questions (1 per level)
5. **Web Development** - 3 questions (1 per level)

Each level (Easy, Medium, Hard) has progressively difficulty questions.

## 🎯 Sample Quiz Questions

The database comes pre-populated with sample questions across all categories and difficulty levels. Questions cover:
- C programming fundamentals
- Mathematical aptitude and reasoning
- Technical concepts
- Data structures basics
- Web development standards

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Ensure Node.js is installed properly
- Delete `app.db` and restart to reset database

### CORS Errors
- Backend must be running on `http://localhost:5000`
- Frontend must be accessed from `http://localhost:8000` or `file://` protocol 

### Database Not Initializing
- Close the backend server
- Delete `app.db` from the backend directory
- Restart the backend server

## 🚀 Future Enhancements

- User profiles with avatars
- Leaderboards and rankings
- Discussion forum for questions
- Video explanations for answers
- Timed quizzes with countdown
- Mobile app version
- Detailed analytics and performance reports
- Social sharing of achievements
- Difficulty ratings by users
- Question suggestions

## 📄 License

This project is open source and free to use for educational purposes.

## 👨‍💻 Author

Created as a comprehensive learning platform for interview preparation.

## 📧 Support

For issues or improvements, please refer to the setup instructions above.

---

**Happy Learning! 📚✨**
