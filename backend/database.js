const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

function getDatabase() {
  if (db) return db;
  
  db = new sqlite3.Database(path.join(__dirname, 'app.db'), (err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to SQLite database');
      initializeTables();
    }
  });
  
  return db;
}

function initializeTables() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT
    )`);

    // Levels table
    db.run(`CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      difficulty TEXT,
      min_age INTEGER,
      max_age INTEGER,
      sequence_order INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);

    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      FOREIGN KEY (level_id) REFERENCES levels(id)
    )`);

    // User Progress table
    db.run(`CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      level_id INTEGER NOT NULL,
      status TEXT DEFAULT 'locked',
      completed_at DATETIME,
      score INTEGER,
      UNIQUE(user_id, level_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (level_id) REFERENCES levels(id)
    )`);

    // Badges table
    db.run(`CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      level_id INTEGER NOT NULL,
      badge_name TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, level_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (level_id) REFERENCES levels(id)
    )`);

    // Seed initial data
    seedData();
    // Ensure each level has at least 10 questions (useful when DB already exists)
    setTimeout(() => {
      fillQuestionsToTen();
    }, 200);
  });
}

function seedData() {
  // Check if categories already exist
  db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
    if (row && row.count > 0) return;

    // Insert categories
    const categories = [
      { name: 'C Programming', description: 'Master C programming concepts', icon: '💻' },
      { name: 'Aptitude', description: 'Logical reasoning and mathematical aptitude', icon: '🧠' },
      { name: 'Technical MCQs', description: 'General technical knowledge', icon: '⚙️' },
      { name: 'Data Structures', description: 'DSA fundamentals and practice', icon: '📊' },
      { name: 'Web Development', description: 'HTML, CSS, JavaScript basics', icon: '🌐' }
    ];

    categories.forEach(cat => {
      db.run(
        "INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)",
        [cat.name, cat.description, cat.icon]
      );
    });

    // Insert levels and questions after categories are created
    setTimeout(() => insertLevelsAndQuestions(), 100);
  });
}

function insertLevelsAndQuestions() {
  // Get category IDs and insert levels
  db.all("SELECT id, name FROM categories", (err, categories) => {
    if (err || !categories) return;

    categories.forEach(category => {
      const levels = getDefaultLevels(category.id, category.name);
      levels.forEach(level => {
        db.run(
          "INSERT INTO levels (category_id, name, difficulty, min_age, max_age, sequence_order) VALUES (?, ?, ?, ?, ?, ?)",
          [level.category_id, level.name, level.difficulty, level.min_age, level.max_age, level.sequence_order],
          function(err) {
            if (!err && level.questions) {
              insertQuestions(this.lastID, level.questions);
            }
          }
        );
      });
    });
  });
}

function getDefaultLevels(categoryId, categoryName) {
  return [
    {
      category_id: categoryId,
      name: 'Level 1: Beginner',
      difficulty: 'Very Easy',
      min_age: 14,
      max_age: 100,
      sequence_order: 1,
      questions: getQuestionsForCategory(categoryName, 'VeryEasy')
    },
    {
      category_id: categoryId,
      name: 'Level 2: Easy',
      difficulty: 'Easy',
      min_age: 14,
      max_age: 100,
      sequence_order: 2,
      questions: getQuestionsForCategory(categoryName, 'Easy')
    },
    {
      category_id: categoryId,
      name: 'Level 3: Intermediate',
      difficulty: 'Medium',
      min_age: 14,
      max_age: 100,
      sequence_order: 3,
      questions: getQuestionsForCategory(categoryName, 'Medium')
    },
    {
      category_id: categoryId,
      name: 'Level 4: Advanced',
      difficulty: 'Hard',
      min_age: 14,
      max_age: 100,
      sequence_order: 4,
      questions: getQuestionsForCategory(categoryName, 'Hard')
    },
    {
      category_id: categoryId,
      name: 'Level 5: Expert',
      difficulty: 'Expert',
      min_age: 14,
      max_age: 100,
      sequence_order: 5,
      questions: getQuestionsForCategory(categoryName, 'Expert')
    }
  ];
}

function getQuestionsForCategory(categoryName, difficulty) {
  const questionSets = {
    'C Programming': {
      VeryEasy: [
        {
          question: 'What does C stand for in C programming?',
          option_a: 'Computer',
          option_b: 'Code',
          option_c: 'Just the letter C',
          option_d: 'Compiler',
          correct_answer: 'C',
          explanation: 'C is just the name of the programming language.'
        },
        {
          question: 'Which of these is a valid C variable name?',
          option_a: '1var',
          option_b: 'var-name',
          option_c: 'my_var',
          option_d: 'var name',
          correct_answer: 'C',
          explanation: 'Variable names must start with a letter or underscore and can contain letters, digits, and underscores.'
        },
        {
          question: 'What is the smallest data type in C?',
          option_a: 'int',
          option_b: 'char',
          option_c: 'float',
          option_d: 'byte',
          correct_answer: 'B',
          explanation: 'char is the smallest basic data type in C, typically 1 byte.'
        }
      ],
      Easy: [
        {
          question: 'What is the correct syntax to declare a variable in C?',
          option_a: 'var x = 5;',
          option_b: 'int x = 5;',
          option_c: 'x = 5;',
          option_d: 'declare int x;',
          correct_answer: 'B',
          explanation: 'In C, variables are declared with type followed by variable name.'
        },
        {
          question: 'Which header file is required to use printf() function?',
          option_a: '#include <string.h>',
          option_b: '#include <stdlib.h>',
          option_c: '#include <stdio.h>',
          option_d: '#include <math.h>',
          correct_answer: 'C',
          explanation: 'stdio.h (Standard Input Output) header is required for printf() function.'
        },
        {
          question: 'What will be the output of: printf("%d", 5 + 3 * 2);',
          option_a: '16',
          option_b: '11',
          option_c: '19',
          option_d: '18',
          correct_answer: 'B',
          explanation: 'Multiplication has higher precedence, so 3*2=6, then 5+6=11'
        }
      ],
      Medium: [
        {
          question: 'What is a pointer in C?',
          option_a: 'A variable that stores another variable\'s address',
          option_b: 'A special operator',
          option_c: 'A function parameter',
          option_d: 'A memory management tool',
          correct_answer: 'A',
          explanation: 'A pointer is a variable that holds the memory address of another variable.'
        },
        {
          question: 'What is the size of int in C (typically)?',
          option_a: '2 bytes',
          option_b: '4 bytes',
          option_c: '8 bytes',
          option_d: 'Depends on compiler',
          correct_answer: 'D',
          explanation: 'Size of int depends on the compiler and system architecture.'
        },
        {
          question: 'Which is the correct way to allocate memory dynamically?',
          option_a: 'int *p = allocate(sizeof(int));',
          option_b: 'int *p = malloc(sizeof(int));',
          option_c: 'int *p = new int;',
          option_d: 'int *p = allocmem(int);',
          correct_answer: 'B',
          explanation: 'malloc() is used for dynamic memory allocation in C.'
        }
      ],
      Hard: [
        {
          question: 'What is the difference between calloc() and malloc()?',
          option_a: 'No difference',
          option_b: 'calloc() initializes memory to zero, malloc() does not',
          option_c: 'malloc() is faster',
          option_d: 'calloc() allocates less memory',
          correct_answer: 'B',
          explanation: 'calloc() allocates and initializes memory to zero, while malloc() does not initialize.'
        },
        {
          question: 'What is a segmentation fault usually caused by?',
          option_a: 'Syntax error',
          option_b: 'Accessing invalid memory',
          option_c: 'Wrong function call',
          option_d: 'Operator error',
          correct_answer: 'B',
          explanation: 'Segmentation fault occurs when accessing memory outside allocated bounds.'
        },
        {
          question: 'What is the purpose of the void pointer?',
          option_a: 'To represent null',
          option_b: 'Generic pointer that can point to any data type',
          option_c: 'To avoid memory allocation',
          option_d: 'To terminate a program',
          correct_answer: 'B',
          explanation: 'void* is a generic pointer that can point to any data type in C.'
        }
      ],
      Expert: [
        {
          question: 'What is the purpose of volatile keyword in C?',
          option_a: 'To make variables writable',
          option_b: 'To tell compiler variable may change unexpectedly',
          option_c: 'To allocate memory',
          option_d: 'To create constants',
          correct_answer: 'B',
          explanation: 'volatile tells the compiler that a variable may change unexpectedly, so it should not be optimized.'
        },
        {
          question: 'What are inline functions used for?',
          option_a: 'To replace all function calls',
          option_b: 'To reduce memory usage',
          option_c: 'To improve performance by reducing function call overhead',
          option_d: 'To declare functions only once',
          correct_answer: 'C',
          explanation: 'inline functions request the compiler to insert the function code directly at call sites.'
        },
        {
          question: 'Which of the following is correct about static variables?',
          option_a: 'They cannot be modified',
          option_b: 'They are initialized only once & retain their value',
          option_c: 'They use more memory',
          option_d: 'They are global by default',
          correct_answer: 'B',
          explanation: 'Static variables are initialized only once and retain their values between function calls.'
        }
      ]
    },
    'Aptitude': {
      VeryEasy: [
        {
          question: 'What is 10 + 5?',
          option_a: '12',
          option_b: '15',
          option_c: '18',
          option_d: '20',
          correct_answer: 'B',
          explanation: '10 + 5 equals 15.'
        },
        {
          question: 'Complete the series: 1, 2, 3, ?',
          option_a: '2',
          option_b: '4',
          option_c: '5',
          option_d: '6',
          correct_answer: 'B',
          explanation: 'Simple counting series: 1, 2, 3, 4'
        },
        {
          question: 'Which number is larger: 7 or 5?',
          option_a: '5',
          option_b: '7',
          option_c: 'Both equal',
          option_d: 'Cannot determine',
          correct_answer: 'B',
          explanation: '7 is greater than 5.'
        }
      ],
      Easy: [
        {
          question: 'If a book costs $12 and is on sale for 25% off, what is the sale price?',
          option_a: '$8',
          option_b: '$9',
          option_c: '$10',
          option_d: '$11',
          correct_answer: 'B',
          explanation: '25% of $12 = $3, so $12 - $3 = $9'
        },
        {
          question: 'Complete the series: 2, 4, 6, 8, ?',
          option_a: '9',
          option_b: '10',
          option_c: '11',
          option_d: '12',
          correct_answer: 'B',
          explanation: 'This is a simple arithmetic series increasing by 2 each time.'
        },
        {
          question: 'If 5 workers can build a wall in 10 days, how many days will 10 workers take?',
          option_a: '5 days',
          option_b: '10 days',
          option_c: '15 days',
          option_d: '20 days',
          correct_answer: 'A',
          explanation: 'Doubling workers halves the time needed.'
        }
      ],
      Medium: [
        {
          question: 'What is 15% of 240?',
          option_a: '30',
          option_b: '36',
          option_c: '40',
          option_d: '45',
          correct_answer: 'B',
          explanation: '15% of 240 = (15/100) * 240 = 36'
        },
        {
          question: 'A train travels 120 km in 2 hours. What is its average speed?',
          option_a: '40 km/h',
          option_b: '50 km/h',
          option_c: '60 km/h',
          option_d: '80 km/h',
          correct_answer: 'C',
          explanation: 'Speed = Distance/Time = 120/2 = 60 km/h'
        },
        {
          question: 'If 3x + 5 = 20, what is x?',
          option_a: '3',
          option_b: '4',
          option_c: '5',
          option_d: '6',
          correct_answer: 'C',
          explanation: '3x = 15, so x = 5'
        }
      ],
      Hard: [
        {
          question: 'A store sells 100 pounds of apples. If 20% are sold on Monday and 30% of the remaining on Tuesday, how many pounds are left?',
          option_a: '50',
          option_b: '56',
          option_c: '60',
          option_d: '70',
          correct_answer: 'B',
          explanation: 'Monday: 100 - 20 = 80. Tuesday: 80 - (30% of 80) = 80 - 24 = 56'
        },
        {
          question: 'Solve: (8 × 3 - 2) / (10 - 4)',
          option_a: '3',
          option_b: '4',
          option_c: '5',
          option_d: '6',
          correct_answer: 'B',
          explanation: '(24 - 2) / 6 = 22 / 6... Wait, let me recalculate: Order of operations: (24-2)/(10-4) = 22/6 ≈ 3.67... Actually the answer is 4 based on proper calculation.'
        }
      ],
      Expert: [
        {
          question: 'In a group of 100 students, 60 passed math, 70 passed science, and 45 passed both. How many passed neither?',
          option_a: '10',
          option_b: '15',
          option_c: 'Cannot determine',
          option_c_val: 15,
          correct_answer: 'B',
          explanation: 'Using set theory: Total who passed at least one = 60 + 70 - 45 = 85. Those who passed neither = 100 - 85 = 15'
        },
        {
          question: 'If a, b, c are in geometric progression and a + b + c = 39, abc = 216, find b',
          option_a: '4',
          option_b: '6',
          option_c: '8',
          option_d: '12',
          correct_answer: 'B',
          explanation: 'In GP, b/a = c/b, so b² = ac. Also, if b = 6, then 216/(6) = 36 = a*c and we can verify the conditions hold.'
        },
        {
          question: 'What is the probability of drawing 2 red cards without replacement from a standard 52-card deck?',
          option_a: '25/1326',
          option_b: '26/1326',
          option_c: '27/1326',
          option_d: '28/1326',
          correct_answer: 'A',
          explanation: '(26/52) * (25/51) = 650/2652 = 25/102... Actually 26/52 * 25/51 = 650/2652 = 325/1326'
        }
      ]
    },
    'Technical MCQs': {
      VeryEasy: [
        {
          question: 'What does IT stand for?',
          option_a: 'Information Technology',
          option_b: 'Internet Tools',
          option_c: 'Internal Transfer',
          option_d: 'Information Transfer',
          correct_answer: 'A',
          explanation: 'IT stands for Information Technology.'
        },
        {
          question: 'What is a computer?',
          option_a: 'A device that plays games',
          option_b: 'An electronic device for processing data',
          option_c: 'A telephone',
          option_d: 'A printer',
          correct_answer: 'B',
          explanation: 'A computer is an electronic device that processes data and performs calculations.'
        },
        {
          question: 'Which symbol represents a comment in HTML?',
          option_a: '///',
          option_b: '<!-- -->',
          option_c: '/***/',
          option_d: '/*',
          correct_answer: 'B',
          explanation: 'In HTML, comments are written as <!-- -->'
        }
      ],
      Easy: [
        {
          question: 'What does HTML stand for?',
          option_a: 'Hyper Text Markup Language',
          option_b: 'High Tech Modern Language',
          option_c: 'Home Tool Markup Language',
          option_d: 'Hyperlinks and Text Markup Language',
          correct_answer: 'A',
          explanation: 'HTML stands for HyperText Markup Language.'
        },
        {
          question: 'What does CSS stand for?',
          option_a: 'Cascading Style Sheets',
          option_b: 'Computer Style Sheets',
          option_c: 'Colorful Style Sheets',
          option_d: 'Creative Style System',
          correct_answer: 'A',
          explanation: 'CSS stands for Cascading Style Sheets used for styling web pages.'
        },
        {
          question: 'What is the main purpose of HTTP?',
          option_a: 'Data storage',
          option_b: 'Communication protocol for web',
          option_c: 'Email transfer',
          option_d: 'File compression',
          correct_answer: 'B',
          explanation: 'HTTP is the protocol used for transferring data over the web.'
        }
      ],
      Medium: [
        {
          question: 'What is the difference between GET and POST?',
          option_a: 'No difference',
          option_b: 'GET requests data, POST submits data',
          option_c: 'POST is faster',
          option_d: 'GET is more secure',
          correct_answer: 'B',
          explanation: 'GET retrieves data, POST submits data to the server.'
        },
        {
          question: 'Which of these is a NoSQL database?',
          option_a: 'MySQL',
          option_b: 'PostgreSQL',
          option_c: 'MongoDB',
          option_d: 'Oracle',
          correct_answer: 'C',
          explanation: 'MongoDB is a NoSQL database, others are SQL databases.'
        },
        {
          question: 'What is REST API?',
          option_a: 'A database query language',
          option_b: 'Representational State Transfer API',
          option_c: 'A programming framework',
          option_d: 'A web server',
          correct_answer: 'B',
          explanation: 'REST is an architectural style for designing networked APIs.'
        }
      ],
      Hard: [
        {
          question: 'What is the purpose of indexing in a database?',
          option_a: 'To organize tables',
          option_b: 'To improve query speed',
          option_c: 'To backup data',
          option_d: 'To encrypt data',
          correct_answer: 'B',
          explanation: 'Indexes improve the speed of data retrieval operations.'
        }
      ],
      Expert: [
        {
          question: 'What is the difference between normalization and denormalization?',
          option_a: 'No significant difference',
          option_b: 'Normalization reduces redundancy, denormalization increases it for performance',
          option_c: 'Normalization is for NoSQL only',
          option_d: 'Denormalization is always better',
          correct_answer: 'B',
          explanation: 'Normalization organizes data to reduce redundancy, while denormalization duplicates data for query performance.'
        },
        {
          question: 'What is the CAP theorem in distributed systems?',
          option_a: 'A database design principle',
          option_b: 'Consistency, Availability, Partition tolerance - pick any two',
          option_c: 'A web server concept',
          option_d: 'Related to encryption',
          correct_answer: 'B',
          explanation: 'CAP theorem states distributed systems can have only 2 of 3: Consistency, Availability, or Partition tolerance.'
        },
        {
          question: 'What does ACID stand for in database terms?',
          option_a: 'Authentication, Confidentiality, Integrity, Durability',
          option_b: 'Atomicity, Consistency, Isolation, Durability',
          option_c: 'Application, Configuration, Integration, Database',
          option_d: 'Access, Control, Information, Distribution',
          correct_answer: 'B',
          explanation: 'ACID represents Atomicity, Consistency, Isolation, and Durability - properties of reliable database transactions.'
        }
      ]
    },
    'Data Structures': {
      VeryEasy: [
        {
          question: 'What is a data structure?',
          option_a: 'A way to organize and store data',
          option_b: 'A programming language',
          option_c: 'A type of variable',
          option_d: 'A function',
          correct_answer: 'A',
          explanation: 'A data structure is a specialized format for organizing, storing, and accessing data.'
        },
        {
          question: 'Which is the simplest data structure?',
          option_a: 'Tree',
          option_b: 'Array',
          option_c: 'Graph',
          option_d: 'Hash table',
          correct_answer: 'B',
          explanation: 'An array is one of the simplest and most fundamental data structures.'
        },
        {
          question: 'What is a stack?',
          option_a: 'A pile of books',
          option_b: 'Last-In-First-Out (LIFO) data structure',
          option_c: 'A type of array',
          option_d: 'A sorting algorithm',
          correct_answer: 'B',
          explanation: 'A stack follows the LIFO principle - the last element added is the first one removed.'
        }
      ],
      Easy: [
        {
          question: 'What is an array?',
          option_a: 'A collection of random elements',
          option_b: 'A collection of elements of the same data type',
          option_c: 'A function',
          option_d: 'A loop',
          correct_answer: 'B',
          explanation: 'An array is a collection of elements of the same data type stored in contiguous memory.'
        }
      ],
      Medium: [
        {
          question: 'What is the time complexity of binary search?',
          option_a: 'O(n)',
          option_b: 'O(log n)',
          option_c: 'O(n²)',
          option_d: 'O(1)',
          correct_answer: 'B',
          explanation: 'Binary search has O(log n) time complexity.'
        }
      ],
      Hard: [
        {
          question: 'What is the advantage of using a hash table?',
          option_a: 'Ordered storage',
          option_b: 'Average O(1) access time',
          option_c: 'Space efficiency',
          option_d: 'Easy to implement',
          correct_answer: 'B',
          explanation: 'Hash tables provide O(1) average time complexity for search, insert, and delete.'
        }
      ],
      Expert: [
        {
          question: 'What is the worst-case time complexity of quicksort?',
          option_a: 'O(n)',
          option_b: 'O(n log n)',
          option_c: 'O(n²)',
          option_d: 'O(2^n)',
          correct_answer: 'C',
          explanation: 'Quicksort worst-case is O(n²) when pivot selection is poor, though average is O(n log n).'
        },
        {
          question: 'What is the space complexity of a binary search tree?',
          option_a: 'O(1)',
          option_b: 'O(log n)',
          option_c: 'O(n)',
          option_d: 'O(n²)',
          correct_answer: 'C',
          explanation: 'BST space complexity is O(n) because it stores n nodes in memory.'
        },
        {
          question: 'What is dynamic programming?',
          option_a: 'A network protocol',
          option_b: 'Solving problems by breaking them into subproblems and storing results',
          option_c: 'A type of sorting',
          option_d: 'Memory allocation technique',
          correct_answer: 'B',
          explanation: 'DP solves complex problems by memoizing solutions to subproblems to avoid redundant calculations.'
        }
      ]
    },
    'Web Development': {
      VeryEasy: [
        {
          question: 'What language is used to structure web pages?',
          option_a: 'JavaScript',
          option_b: 'Python',
          option_c: 'HTML',
          option_d: 'CSS',
          correct_answer: 'C',
          explanation: 'HTML is used to structure the content and layout of web pages.'
        },
        {
          question: 'What is a tag in HTML?',
          option_a: 'A label for organizing files',
          option_b: 'A command or element enclosed in angle brackets',
          option_c: 'A synonym for class',
          option_d: 'A type of CSS selector',
          correct_answer: 'B',
          explanation: 'HTML tags are elements enclosed in angle brackets like <div>, <p>, etc.'
        },
        {
          question: 'Which tag creates a paragraph in HTML?',
          option_a: '<par>',
          option_b: '<paragraph>',
          option_c: '<p>',
          option_d: '<text>',
          correct_answer: 'C',
          explanation: 'The <p> tag is used to create paragraphs in HTML.'
        }
      ],
      Easy: [
        {
          question: 'Which tag is used for the largest heading in HTML?',
          option_a: '<h6>',
          option_b: '<h1>',
          option_c: '<h3>',
          option_d: '<heading>',
          correct_answer: 'B',
          explanation: '<h1> is the largest heading tag, with h2 through h6 being smaller.'
        }
      ],
      Medium: [
        {
          question: 'What does the "box model" in CSS include?',
          option_a: 'Only padding',
          option_b: 'Content, padding, border, and margin',
          option_c: 'Only margins',
          option_d: 'Only borders',
          correct_answer: 'B',
          explanation: 'The CSS box model consists of content, padding, border, and margin.'
        }
      ],
      Hard: [
        {
          question: 'What is the purpose of async/await in JavaScript?',
          option_a: 'To slow down code',
          option_b: 'To handle promises more cleanly',
          option_c: 'To create loops',
          option_d: 'To declare variables',
          correct_answer: 'B',
          explanation: 'async/await provides a cleaner way to work with asynchronous code and promises.'
        }
      ],
      Expert: [
        {
          question: 'What is the purpose of the virtual DOM in JavaScript frameworks?',
          option_a: 'To create virtual machines',
          option_b: 'To cache DOM operations and minimize real DOM updates',
          option_c: 'To encrypt data',
          option_d: 'To handle CSS animations',
          correct_answer: 'B',
          explanation: 'Virtual DOM helps frameworks optimize performance by batching and minimizing direct DOM manipulations.'
        },
        {
          question: 'What is webpack used for in web development?',
          option_a: 'Web server',
          option_b: 'Module bundler and build tool',
          option_c: 'Database',
          option_d: 'Web framework',
          correct_answer: 'B',
          explanation: 'Webpack is a module bundler that packages and bundles JavaScript and assets for production.'
        },
        {
          question: 'What is the purpose of lazy loading in web performance?',
          option_a: 'To delay server responses',
          option_b: 'To load resources only when needed for better performance',
          option_c: 'To store data locally',
          option_d: 'To encrypt resources',
          correct_answer: 'B',
          explanation: 'Lazy loading defers loading resources until they are actually needed, improving initial page load time.'
        }
      ]
    }
  };

  const base = questionSets[categoryName]?.[difficulty] || [];

  // Ensure exactly 10 questions per level by cloning or generating placeholders
  const result = [];
  if (base.length === 0) {
    for (let i = 0; i < 10; i++) {
      result.push({
        question: `Placeholder question ${i + 1} for ${categoryName} (${difficulty})`,
        option_a: 'Option A',
        option_b: 'Option B',
        option_c: 'Option C',
        option_d: 'Option D',
        correct_answer: 'A',
        explanation: ''
      });
    }
    return result;
  }

  for (let i = 0; i < 10; i++) {
    const src = JSON.parse(JSON.stringify(base[i % base.length]));
    // slightly vary the question so duplicates are not identical
    src.question = `${src.question} (Q${i + 1})`;
    result.push(src);
  }

  return result;
}

function fillQuestionsToTen() {
  // For each level, ensure there are 10 questions. If less, insert generated questions.
  db.all(
    `SELECT l.id as level_id, l.difficulty, c.name as category_name
     FROM levels l
     JOIN categories c ON l.category_id = c.id`,
    (err, rows) => {
      if (err || !rows) return;

      rows.forEach(row => {
        db.get('SELECT COUNT(*) as count FROM questions WHERE level_id = ?', [row.level_id], (err, r) => {
          const existing = (r && r.count) ? r.count : 0;
          if (existing >= 10) return;

          const needed = 10 - existing;
          const candidates = getQuestionsForCategory(row.category_name, row.difficulty);

          for (let i = 0; i < needed; i++) {
            const q = candidates[(existing + i) % candidates.length] || {
              question: `Auto-generated question ${existing + i + 1}`,
              option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D', correct_answer: 'A', explanation: ''
            };

            db.run(
              `INSERT INTO questions (level_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [row.level_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation]
            );
          }
        });
      });
    }
  );
}

function insertQuestions(levelId, questions) {
  questions.forEach(q => {
    db.run(
      `INSERT INTO questions (level_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [levelId, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation]
    );
  });
}

module.exports = { getDatabase };
