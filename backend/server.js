require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { getDatabase } = require('./database');

const app = express();
const db = getDatabase();
const isMySql = db.dialect === 'mysql';
const frontendDir = path.join(__dirname, '..', 'frontend');

// Security: Use environment variable for secret key
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // Token expires in 24 hours
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-change-this-in-production';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // Refresh token expires in 7 days

// Middleware
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:8000,http://localhost:3000,http://localhost:5000,http://127.0.0.1:8000,http://127.0.0.1:3000,http://127.0.0.1:5000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools and local file-based testing.
    if (!origin || origin === 'null') {
      return callback(null, true);
    }

    // Allow local development origins automatically.
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.static(frontendDir));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Security: Rate limiting for auth endpoints (basic implementation)
const authAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Security: Check rate limit
const checkRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const attempts = authAttempts.get(ip) || [];

  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }

  recentAttempts.push(now);
  authAttempts.set(ip, recentAttempts);
  next();
};

// Auth Routes
app.post('/auth/register', checkRateLimit, async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Security: Validate input lengths and formats
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds for better security
    db.run(
      'INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, name],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        const token = jwt.sign({ id: this.lastID }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ id: this.lastID }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        // Store refresh token in database (you'll need to add this table)
        db.run('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [this.lastID, refreshToken]);

        res.json({
          message: 'User registered successfully',
          token,
          refreshToken,
          userId: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/login', checkRateLimit, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    // Store refresh token (replace existing ones for this user)
    db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [user.id]);
    db.run('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken]);

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      userId: user.id,
      name: user.name
    });
  });
});

// Refresh Token Endpoint
app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if refresh token exists in database
    db.get('SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ?', [refreshToken, decoded.id], (err, tokenRecord) => {
      if (err || !tokenRecord) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new tokens
      const newToken = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
      const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

      // Update refresh token in database
      db.run('UPDATE refresh_tokens SET token = ? WHERE user_id = ?', [newRefreshToken, decoded.id]);

      res.json({
        token: newToken,
        refreshToken: newRefreshToken
      });
    });
  });
});

// Logout Endpoint
app.post('/auth/logout', verifyToken, (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Remove refresh token from database
  if (refreshToken) {
    db.run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
  }

  res.json({ message: 'Logged out successfully' });
});

app.get('/auth/user/:id', verifyToken, (req, res) => {
  db.get('SELECT id, name, username, email FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Categories Routes
app.get('/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(categories);
  });
});

// Levels Routes
app.get('/levels/:categoryId', verifyToken, (req, res) => {
  const categoryId = req.params.categoryId;
  console.log(`[GET /levels/:categoryId] categoryId=${categoryId}, userId=${req.userId}`);
  
  db.all(
    `SELECT l.* FROM levels l 
     WHERE l.category_id = ? 
     ORDER BY l.sequence_order`,
    [categoryId],
    (err, levels) => {
      if (err) {
        console.error('DB error fetching levels:', err);
        return res.status(500).json({ error: 'Server error: ' + err.message });
      }

      if (!levels || levels.length === 0) {
        console.log('No levels found for categoryId:', categoryId);
        return res.json([]);
      }

      console.log(`Found ${levels.length} levels for categoryId ${categoryId}`);

      // Get user progress for each level
      db.all(
        `SELECT level_id, status FROM user_progress WHERE user_id = ? AND level_id IN (${levels.map(() => '?').join(',')})`,
        [req.userId, ...levels.map(l => l.id)],
        (err, progress) => {
          if (err) {
            console.error('DB error fetching progress:', err);
            return res.status(500).json({ error: 'Server error: ' + err.message });
          }

          const progressMap = {};
          if (progress) {
            progress.forEach(p => {
              progressMap[p.level_id] = p.status;
            });
          }

          const levelsWithStatus = levels.map((level, index) => ({
            ...level,
            status: progressMap[level.id] || (index === 0 ? 'unlocked' : 'locked')
          }));

          console.log(`Returning ${levelsWithStatus.length} levels with statuses`);
          res.json(levelsWithStatus);
        }
      );
    }
  );
});

// Questions Routes
app.get('/questions/:levelId', verifyToken, (req, res) => {
  const levelId = req.params.levelId;

  db.all(
    'SELECT id, question, option_a, option_b, option_c, option_d, correct_answer FROM questions WHERE level_id = ?',
    [levelId],
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(questions);
    }
  );
});

// Submit Quiz Answers
app.post('/submit-quiz', verifyToken, (req, res) => {
  const { levelId, answers } = req.body;
  const userId = req.userId;

  if (!levelId || !answers) {
    return res.status(400).json({ error: 'Missing levelId or answers' });
  }

  // Get correct answers
  db.all(
    'SELECT id, correct_answer FROM questions WHERE level_id = ?',
    [levelId],
    (err, questions) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      let score = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          score++;
        }
      });

      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= 60;

      // Update user progress
      const progressQuery = isMySql
        ? `INSERT INTO user_progress (user_id, level_id, status, score, completed_at)
           VALUES (?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE status = VALUES(status), score = VALUES(score), completed_at = VALUES(completed_at)`
        : `INSERT INTO user_progress (user_id, level_id, status, score, completed_at)
           VALUES (?, ?, ?, ?, datetime('now'))
           ON CONFLICT(user_id, level_id) DO UPDATE SET
           status = excluded.status, score = excluded.score, completed_at = excluded.completed_at`;

      db.run(
        progressQuery,
        [userId, levelId, passed ? 'completed' : 'attempted', score],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Server error updating progress' });
          }

          // If passed, award badge and unlock next level
          if (passed) {
            const badgeName = `Level ${levelId} Master`;
            db.run(
              isMySql
                ? `INSERT IGNORE INTO badges (user_id, level_id, badge_name)
                   VALUES (?, ?, ?)`
                : `INSERT OR IGNORE INTO badges (user_id, level_id, badge_name)
                   VALUES (?, ?, ?)`,
              [userId, levelId, badgeName]
            );

            // Unlock next level
            db.get(
              `SELECT next.id
               FROM levels current
               JOIN levels next
                 ON next.category_id = current.category_id
                AND next.sequence_order = current.sequence_order + 1
               WHERE current.id = ?`,
              [levelId],
              (err, nextLevel) => {
                if (nextLevel) {
                  db.run(
                    isMySql
                      ? `INSERT IGNORE INTO user_progress (user_id, level_id, status)
                         VALUES (?, ?, 'unlocked')`
                      : `INSERT OR IGNORE INTO user_progress (user_id, level_id, status)
                         VALUES (?, ?, 'unlocked')`,
                    [userId, nextLevel.id]
                  );
                }
              }
            );
          }

          res.json({
            score,
            total: questions.length,
            percentage,
            passed,
            message: passed ? 'Congratulations! You passed this level!' : 'Keep practicing!'
          });
        }
      );
    }
  );
});

// Get User Badges
app.get('/badges/:userId', verifyToken, (req, res) => {
  db.all(
    `SELECT b.badge_name, b.earned_at, l.name as level_name
     FROM badges b
     JOIN levels l ON b.level_id = l.id
     WHERE b.user_id = ?
     ORDER BY b.earned_at DESC`,
    [req.params.userId],
    (err, badges) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(badges);
    }
  );
});

// Get User Progress Summary
app.get('/progress/:userId', verifyToken, (req, res) => {
  db.all(
    `SELECT 
       c.id as categoryId,
       c.name as categoryName,
       COUNT(DISTINCT l.id) as totalLevels,
       COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN l.id END) as completedLevels,
       COUNT(DISTINCT CASE WHEN up.status = 'unlocked' THEN l.id END) as unlockedLevels
     FROM categories c
     LEFT JOIN levels l ON c.id = l.category_id
     LEFT JOIN user_progress up ON l.id = up.level_id AND up.user_id = ?
     GROUP BY c.id`,
    [req.params.userId],
    (err, summary) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(summary);
    }
  );
});

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get(/^(?!\/(auth|categories|levels|questions|submit-quiz|badges|progress|health)\b).*/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

function startServer(port = process.env.PORT || 5000) {
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`\n  ➜  Local: http://localhost:${port}/\n`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
