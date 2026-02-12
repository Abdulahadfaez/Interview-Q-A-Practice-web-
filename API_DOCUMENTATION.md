# 🔌 API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication

Most endpoints require a JWT token. Include it in the Authorization header:

```
Authorization: Bearer <token>
```

### Token Example
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjq3NTkwODU0fQ.7vNNfQ...
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "MySecurePass123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1
}
```

**Error Response (400):**
```json
{
  "error": "Username or email already exists"
}
```

**Required Fields:**
- `username` (string) - Must be unique
- `email` (string) - Must be valid email format and unique
- `password` (string) - Min 6 characters recommended
- `name` (string) - User's full name

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "MySecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid username or password"
}
```

**Usage:**
1. Save the returned `token` in localStorage
2. Include token in Authorization header for all protected requests

---

### 3. Get User Details

**Endpoint:** `GET /auth/user/:id`

**Description:** Get authenticated user's profile information

**Parameters:**
- `id` (integer) - User ID (path parameter)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid token"
}
```

---

## 📚 Category Endpoints

### 4. Get All Categories

**Endpoint:** `GET /categories`

**Description:** Get list of all available learning categories

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "C Programming",
    "description": "Master C programming concepts",
    "icon": "💻"
  },
  {
    "id": 2,
    "name": "Aptitude",
    "description": "Logical reasoning and mathematical aptitude",
    "icon": "🧠"
  },
  {
    "id": 3,
    "name": "Technical MCQs",
    "description": "General technical knowledge",
    "icon": "⚙️"
  }
]
```

**Notes:**
- Returns 5 categories by default
- Endpoint doesn't require authentication

---

## 🏆 Level Endpoints

### 5. Get Levels for Category

**Endpoint:** `GET /levels/:categoryId`

**Description:** Get all levels for a specific category with user progress status

**Parameters:**
- `categoryId` (integer) - Category ID (path parameter)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Level 1: Beginner",
    "difficulty": "Very Easy",
    "sequence_order": 1,
    "status": "unlocked"
  },
  {
    "id": 2,
    "category_id": 1,
    "name": "Level 2: Easy",
    "difficulty": "Easy",
    "sequence_order": 2,
    "status": "locked"
  },
  {
    "id": 3,
    "category_id": 1,
    "name": "Level 3: Intermediate",
    "difficulty": "Medium",
    "sequence_order": 3,
    "status": "locked"
  },
  {
    "id": 4,
    "category_id": 1,
    "name": "Level 4: Advanced",
    "difficulty": "Hard",
    "sequence_order": 4,
    "status": "locked"
  },
  {
    "id": 5,
    "category_id": 1,
    "name": "Level 5: Expert",
    "difficulty": "Expert",
    "sequence_order": 5,
    "status": "locked"
  }
]
```

**Status Values:**
- `unlocked` - Available to play
- `locked` - Cannot play (previous level not completed)
- `completed` - Already finished with passing score
- `attempted` - Started but not passed yet

---

## ❓ Question Endpoints

### 6. Get Questions for Level

**Endpoint:** `GET /questions/:levelId`

**Description:** Get all questions for a specific level (answers not included)

**Parameters:**
- `levelId` (integer) - Level ID (path parameter)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "question": "What is the correct syntax to declare a variable in C?",
    "option_a": "var x = 5;",
    "option_b": "int x = 5;",
    "option_c": "x = 5;",
    "option_d": "declare int x;"
  },
  {
    "id": 2,
    "question": "Which header file is required for printf()?",
    "option_a": "#include <string.h>",
    "option_b": "#include <stdlib.h>",
    "option_c": "#include <stdio.h>",
    "option_d": "#include <math.h>"
  }
]
```

**Notes:**
- `correct_answer` is NOT returned (security)
- `explanation` is NOT returned until after submission
- Questions are randomized per session

---

## ✅ Quiz Submission Endpoints

### 7. Submit Quiz Answers

**Endpoint:** `POST /submit-quiz`

**Description:** Submit quiz answers and get results

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "levelId": 1,
  "answers": {
    "1": "B",
    "2": "C",
    "3": "A"
  }
}
```

**Success Response (200):**
```json
{
  "score": 2,
  "total": 3,
  "percentage": 66.7,
  "passed": true,
  "message": "Congratulations! You passed this level!"
}
```

**Failure Response (200):**
```json
{
  "score": 1,
  "total": 3,
  "percentage": 33.3,
  "passed": false,
  "message": "Keep practicing!"
}
```

**Answer Format:**
- Keys are question IDs (as integers: "1", "2", "3")
- Values are answer options ("A", "B", "C", or "D")

**Behavior on Pass:**
- Score is saved to database
- Badge is created
- Next level is unlocked
- User progress status changes to "completed"

**Behavior on Fail:**
- Score is saved to database
- Progress status changes to "attempted"
- Level remains available for retry
- Next level remains locked

---

## 🏆 Badge Endpoints

### 8. Get User Badges

**Endpoint:** `GET /badges/:userId`

**Description:** Get all badges earned by a user

**Parameters:**
- `userId` (integer) - User ID (path parameter)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "badge_name": "Level 1 Master",
    "earned_at": "2024-02-10 14:30:45",
    "level_name": "Level 1: Beginner"
  },
  {
    "badge_name": "Level 2 Master",
    "earned_at": "2024-02-11 10:15:20",
    "level_name": "Level 2: Intermediate"
  }
]
```

**Empty Response:**
```json
[]
```

**Notes:**
- Returned in reverse chronological order (most recent first)
- Badge name follows pattern: "Level X Master"

---

## 📊 Progress Endpoints

### 9. Get User Progress Summary

**Endpoint:** `GET /progress/:userId`

**Description:** Get progress statistics across all categories

**Parameters:**
- `userId` (integer) - User ID (path parameter)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "categoryId": 1,
    "categoryName": "C Programming",
    "totalLevels": 5,
    "completedLevels": 1,
    "unlockedLevels": 2
  },
  {
    "categoryId": 2,
    "categoryName": "Aptitude",
    "totalLevels": 5,
    "completedLevels": 0,
    "unlockedLevels": 1
  },
  {
    "categoryId": 3,
    "categoryName": "Technical MCQs",
    "totalLevels": 5,
    "completedLevels": 2,
    "unlockedLevels": 3
  }
]
```

**Statistics Calculation:**
- `totalLevels` - 5 per category (Very Easy, Easy, Medium, Hard, Expert)
- `completedLevels` - Count where status = "completed"
- `unlockedLevels` - Count where status = "unlocked" or "completed"

---

## 🔄 Request/Response Examples

### Complete Quiz Flow Example

**Step 1: Register**
```bash
POST http://localhost:5000/auth/register
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secure123",
  "name": "Alice Wonder"
}
```

Response includes token: `abc123xyz...`

**Step 2: Get Categories**
```bash
GET http://localhost:5000/categories
Headers:
  Authorization: Bearer abc123xyz...
```

Returns 5 categories

**Step 3: Get Levels**
```bash
GET http://localhost:5000/levels/2
Headers:
  Authorization: Bearer abc123xyz...
```

Returns 5 levels (1 unlocked, 4 locked)

**Step 4: Get Questions**
```bash
GET http://localhost:5000/questions/5
Headers:
  Authorization: Bearer abc123xyz...
```

Returns 3 questions

**Step 5: Submit Answers**
```bash
POST http://localhost:5000/submit-quiz
Headers:
  Authorization: Bearer abc123xyz...
  Content-Type: application/json
{
  "levelId": 5,
  "answers": {"1": "B", "2": "C", "3": "A"}
}
```

Returns score and pass/fail status

**Step 6: Check Badges**
```bash
GET http://localhost:5000/badges/1
Headers:
  Authorization: Bearer abc123xyz...
```

Returns earned badges

---

## ⚠️ Error Responses

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | User registered |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid token or credentials |
| 404 | Not Found | User/category not found |
| 500 | Server Error | Database error |

### Error Response Format
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Errors

**Missing Token:**
```json
{
  "error": "No token provided"
}
```

**Invalid Token:**
```json
{
  "error": "Invalid token"
}
```

**Missing Fields:**
```json
{
  "error": "Missing required fields"
}
```

**Duplicate User:**
```json
{
  "error": "Username or email already exists"
}
```

---

## 🔐 Security Notes

### Token Storage & Usage
- Tokens valid for session length
- Store in localStorage on client
- Include on all protected endpoints
- Never expose in URLs

### Password Security
- Minimum recommended: 6 characters
- Should contain mix of characters
- Hashed before storage (bcrypt)
- Never returned in responses

### Data Privacy
- Correct answers not shown until after submission
- User passwords never exposed
- Email only shown to account owner
- Explanations only shown after submitting quiz

---

## 🧪 API Testing with cURL

### Test Registration
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"test123",
    "name":"Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"test123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Implementation Notes

### For Frontend Developers
- Always include token in Authorization header
- Parse JSON responses properly
- Handle error responses with try/catch
- Store token in localStorage via `localStorage.setItem('token', token)`
- Check token exists before making protected requests

### For Backend Developers
- Verify JWT token on protected routes
- Validate input data before processing
- Return consistent JSON format
- Log errors for debugging
- Test endpoints with postman or curl

---

## 🔗 Related Documentation

- [README.md](README.md) - Full project overview
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Error solutions

---

**Last Updated:** February 2024
**API Version:** 1.0
