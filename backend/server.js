const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('./database');

const app = express();
const db = getDatabase();

const SECRET_KEY = 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

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

// Auth Routes
app.post('/auth/register', async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, name],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        const token = jwt.sign({ id: this.lastID }, SECRET_KEY);
        res.json({ message: 'User registered successfully', token, userId: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/login', (req, res) => {
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

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ 
      message: 'Login successful', 
      token, 
      userId: user.id,
      name: user.name
    });
  });
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
      db.run(
        `INSERT INTO user_progress (user_id, level_id, status, score, completed_at)
         VALUES (?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id, level_id) DO UPDATE SET
         status = excluded.status, score = excluded.score, completed_at = excluded.completed_at`,
        [userId, levelId, passed ? 'completed' : 'attempted', score],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Server error updating progress' });
          }

          // If passed, award badge and unlock next level
          if (passed) {
            const badgeName = `Level ${levelId} Master`;
            db.run(
              `INSERT OR IGNORE INTO badges (user_id, level_id, badge_name)
               VALUES (?, ?, ?)`,
              [userId, levelId, badgeName]
            );

            // Unlock next level
            db.get(
              'SELECT id FROM levels WHERE sequence_order = (SELECT sequence_order + 1 FROM levels WHERE id = ?)',
              [levelId],
              (err, nextLevel) => {
                if (nextLevel) {
                  db.run(
                    `INSERT OR IGNORE INTO user_progress (user_id, level_id, status)
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
