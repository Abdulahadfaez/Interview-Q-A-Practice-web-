const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('app.db');

// Comprehensive question bank: [category][difficulty] = array of questions
const questionBank = {
  'Data Structures': {
    'Easy': [
      { q: 'What is an array?', a: 'A collection of random elements', b: 'A collection of elements of the same data type', c: 'A function', d: 'A loop', ans: 'B' },
      { q: 'Which of the following is a linear data structure?', a: 'Tree', b: 'Graph', c: 'Stack', d: 'None of the above', ans: 'C' },
      { q: 'What is the time complexity of accessing an element in an array?', a: 'O(n)', b: 'O(log n)', c: 'O(1)', d: 'O(n^2)', ans: 'C' },
      { q: 'In a linked list, each node contains', a: 'Data only', b: 'Address only', c: 'Data and address', d: 'Neither', ans: 'C' },
      { q: 'What does LIFO stand for?', a: 'Last In First Out', b: 'Large In First Out', c: 'Last Item For Output', d: 'List In First Out', ans: 'A' },
      { q: 'Which data structure uses FIFO principle?', a: 'Stack', b: 'Queue', c: 'Tree', d: 'Heap', ans: 'B' },
      { q: 'What is the advantage of using a linked list over an array?', a: 'Faster access', b: 'Dynamic memory allocation', c: 'Less memory', d: 'Easier to code', ans: 'B' },
      { q: 'In a binary search tree, the left child is always', a: 'Greater than parent', b: 'Less than parent', c: 'Equal to parent', d: 'Random', ans: 'B' },
      { q: 'What is the height of a balanced binary tree with n nodes?', a: 'O(n)', b: 'O(log n)', c: 'O(1)', d: 'O(n^2)', ans: 'B' },
      { q: 'How many pointers does a node in a doubly linked list have?', a: 'One', b: 'Two', c: 'Three', d: 'Four', ans: 'B' }
    ],
    'Medium': [
      { q: 'What is the time complexity of inserting an element in the middle of an array?', a: 'O(1)', b: 'O(n)', c: 'O(log n)', d: 'O(n log n)', ans: 'B' },
      { q: 'Which of the following is an example of non-linear data structure?', a: 'Array', b: 'Linked list', c: 'Queue', d: 'Tree', ans: 'D' },
      { q: 'In a hash table, collision is resolved by which method?', a: 'Chaining', b: 'Open addressing', c: 'Double hashing', d: 'All of the above', ans: 'D' },
      { q: 'What is the minimum height of a binary tree with n nodes?', a: 'n', b: 'log n', c: 'n/2', d: 'sqrt(n)', ans: 'B' },
      { q: 'Which sorting algorithm has the best worst-case time complexity?', a: 'Bubble sort', b: 'Quick sort', c: 'Merge sort', d: 'Insertion sort', ans: 'C' },
      { q: 'What is the space complexity of a recursion depth of n?', a: 'O(1)', b: 'O(n)', c: 'O(log n)', d: 'O(n^2)', ans: 'B' },
      { q: 'In graph representation, adjacency list is better than adjacency matrix when', a: 'Graph is dense', b: 'Graph is sparse', c: 'Both are equal', d: 'Never', ans: 'B' },
      { q: 'What is the time complexity of searching in a balanced BST?', a: 'O(n)', b: 'O(log n)', c: 'O(1)', d: 'O(n^2)', ans: 'B' },
      { q: 'Which data structure is used to implement priority queue?', a: 'Array', b: 'Heap', c: 'Stack', d: 'Queue', ans: 'B' },
      { q: 'In a complete binary tree with n nodes, the number of internal nodes is', a: 'n/2', b: 'n-1', c: 'floor(n/2)', d: 'ceil(n/2)', ans: 'C' }
    ],
    'Hard': [
      { q: 'What is the optimal solution to the problem of finding LCA in a BST?', a: 'O(n) time', b: 'O(log n) time', c: 'O(n log n) time', d: 'O(n^2) time', ans: 'B' },
      { q: 'Which sorting algorithm is used in practical applications like STL sort?', a: 'Merge sort', b: 'Introsort (hybrid)', c: 'Heap sort', d: 'Quick sort', ans: 'B' },
      { q: 'What is the amortized time complexity of dynamic array insertion?', a: 'O(n)', b: 'O(1)', c: 'O(log n)', d: 'O(n log n)', ans: 'B' },
      { q: 'In a B-tree of order m, the maximum number of keys is', a: 'm-1', b: 'm', c: '2m-1', d: 'Depends on implementation', ans: 'C' },
      { q: 'What is the recurrence relation for merge sort?', a: 'T(n)=2T(n/2)+O(1)', b: 'T(n)=2T(n/2)+O(n)', c: 'T(n)=T(n-1)+O(1)', d: 'T(n)=T(n/2)+O(n)', ans: 'B' },
      { q: 'Which data structure is used for implementing Dijkstras algorithm efficiently?', a: 'Array', b: 'Linked list', c: 'Min-heap/Priority queue', d: 'Stack', ans: 'C' },
      { q: 'What is the time complexity of finding union and intersection of two sets?', a: 'O(m+n)', b: 'O(m*n)', c: 'O(m log n)', d: 'Depends on implementation', ans: 'A' },
      { q: 'In red-black trees, what is the maximum height for n elements?', a: '2 log(n+1)', b: 'log(n+1)', c: 'n', d: 'sqrt(n)', ans: 'A' },
      { q: 'Which technique is used to solve the 0/1 knapsack problem optimally?', a: 'Greedy', b: 'Dynamic programming', c: 'Divide and conquer', d: 'Brute force', ans: 'B' },
      { q: 'What is the space-time tradeoff in hashing called?', a: 'Load factor', b: 'Collision rate', c: 'Hash function', d: 'Probe sequence', ans: 'A' }
    ]
  },
  'Aptitude': {
    'Easy': [
      { q: 'If 3x + 5 = 20, what is x?', a: '5', b: '10', c: '15', d: '3', ans: 'A' },
      { q: 'What is 15% of 240?', a: '30', b: '36', c: '42', d: '48', ans: 'B' },
      { q: 'A train travels 120 km in 2 hours. What is its average speed?', a: '50 km/hr', b: '60 km/hr', c: '70 km/hr', d: '80 km/hr', ans: 'B' },
      { q: 'What is the simple interest on $1000 at 5% per annum for 2 years?', a: '$50', b: '$100', c: '$150', d: '$200', ans: 'B' },
      { q: 'If 2^x = 16, what is x?', a: '2', b: '3', c: '4', d: '5', ans: 'C' },
      { q: 'What is the ratio of 20:30 in simplest form?', a: '2:3', b: '1:2', c: '3:4', d: '1:3', ans: 'A' },
      { q: 'A store reduces prices by 20%. If the original price is $100, what is the new price?', a: '$80', b: '$70', c: '$60', d: '$50', ans: 'A' },
      { q: 'What is the area of a rectangle with length 8 and width 5?', a: '13', b: '26', c: '40', d: '64', ans: 'C' },
      { q: 'How many sides does a hexagon have?', a: '5', b: '6', c: '7', d: '8', ans: 'B' },
      { q: 'If the average of 5 numbers is 20, what is their sum?', a: '80', b: '100', c: '120', d: '140', ans: 'B' }
    ],
    'Medium': [
      { q: 'A store sells 100 pounds of apples. If 20% are sold on Monday and 30% of the remaining on Tuesday, how many pounds are left?', a: '56', b: '50', c: '48', d: '44', ans: 'A' },
      { q: 'Solve: (8 × 3 - 2) / (10 - 4)', a: '3', b: '3.67', c: '2', d: '4.5', ans: 'B' },
      { q: 'What is the LCM of 12 and 18?', a: '24', b: '36', c: '48', d: '60', ans: 'B' },
      { q: 'What is the GCD of 48 and 64?', a: '8', b: '12', c: '16', d: '24', ans: 'C' },
      { q: 'If A can complete a work in 10 days and B in 15 days, how long will they take together?', a: '5 days', b: '6 days', c: '7.5 days', d: '8 days', ans: 'B' },
      { q: 'What is the median of 2, 5, 8, 11, 14?', a: '8', b: '5', c: '11', d: '7', ans: 'A' },
      { q: 'If a:b = 3:4 and b:c = 4:5, then a:b:c = ?', a: '3:4:5', b: '1:2:3', c: '2:3:4', d: '12:16:20', ans: 'A' },
      { q: 'What is 20% of 250?', a: '40', b: '45', c: '50', d: '55', ans: 'C' },
      { q: 'A number is 25% more than 80. What is the number?', a: '100', b: '105', c: '110', d: '120', ans: 'A' },
      { q: 'If the cost price is $80 and profit is 25%, what is the selling price?', a: '$100', b: '$105', c: '$110', d: '$120', ans: 'A' }
    ],
    'Hard': [
      { q: 'A sum of money amounts to $1210 in 2 years at 10% p.a. compound interest. What is the principal?', a: '$1000', b: '$1100', c: '$1050', d: '$950', ans: 'A' },
      { q: 'If x^2 + y^2 = 25 and xy = 12, then x + y = ?', a: '5', b: '7', c: '9', d: '11', ans: 'B' },
      { q: 'What is the 10th term of the AP: 2, 5, 8, 11, ...?', a: '27', b: '28', c: '29', d: '30', ans: 'C' },
      { q: 'In how many ways can 5 different books be arranged on a shelf?', a: '60', b: '80', c: '100', d: '120', ans: 'D' },
      { q: 'What is the probability of getting a sum of 7 when rolling two dice?', a: '1/6', b: '1/12', c: '1/8', d: '1/9', ans: 'A' },
      { q: 'If log₁₀(x) = 2, what is x?', a: '10', b: '20', c: '100', d: '1000', ans: 'C' },
      { q: 'Find the derivative of 3x^2 + 2x + 1 at x = 2', a: '12', b: '14', c: '16', d: '18', ans: 'B' },
      { q: 'What is the sum of the infinite series 1 + 1/2 + 1/4 + 1/8 + ...?', a: '1', b: '1.5', c: '2', d: '3', ans: 'C' },
      { q: 'If the roots of x^2 - 5x + 6 = 0 are α and β, then α + β = ?', a: '3', b: '4', c: '5', d: '6', ans: 'C' },
      { q: 'What is the value of C(10,5)?', a: '252', b: '210', c: '220', d: '240', ans: 'A' }
    ]
  },
  'C Programming': {
    'Easy': [
      { q: 'What will be the output of: printf("%d", 5 + 3 * 2);', a: '16', b: '11', c: '13', d: '21', ans: 'B' },
      { q: 'Which header file is required to use printf() function?', a: '<stdlib.h>', b: '<stdio.h>', c: '<string.h>', d: '<math.h>', ans: 'B' },
      { q: 'What is the correct syntax to declare a variable in C?', a: 'var x;', b: 'int x;', c: 'declare x;', d: 'x int;', ans: 'B' },
      { q: 'What is the size of int in C (typically)?', a: '2 bytes', b: '4 bytes', c: '8 bytes', d: '1 byte', ans: 'B' },
      { q: 'Which of the following is a valid identifier in C?', a: '2var', b: 'var-2', c: 'var_2', d: 'var 2', ans: 'C' },
      { q: 'What is the output of: printf("%c", 65);', a: '65', b: 'A', c: 'a', d: 'Error', ans: 'B' },
      { q: 'Which operator has the highest precedence in C?', a: '+', b: '*', c: '()', d: '=', ans: 'C' },
      { q: 'What keyword is used to store the largest value in a variable?', a: 'int', b: 'long', c: 'double', d: 'float', ans: 'B' },
      { q: 'In C, arrays are passed to functions by', a: 'Value', b: 'Reference', c: 'Pointer', d: 'Copy', ans: 'C' },
      { q: 'What is the purpose of the break statement?', a: 'Exit the program', b: 'Skip the current iteration', c: 'Exit the loop', d: 'Pause execution', ans: 'C' }
    ],
    'Medium': [
      { q: 'What is a pointer in C?', a: 'Variable that stores memory address', b: 'Variable that stores data', c: 'Function pointer', d: 'Array of integers', ans: 'A' },
      { q: 'Which of the following is the correct way to allocate memory dynamically?', a: 'malloc()', b: 'calloc()', c: 'realloc()', d: 'All of the above', ans: 'D' },
      { q: 'What is the output of: int *p; if(p) printf("Valid");', a: 'Valid', b: 'Error', c: 'Undefined behavior', d: 'No output', ans: 'C' },
      { q: 'Which function is used to free dynamically allocated memory?', a: 'delete()', b: 'free()', c: 'remove()', d: 'clear()', ans: 'B' },
      { q: 'What is the purpose of the volatile keyword?', a: 'Optimize code', b: 'Prevent optimization', c: 'Make variable constant', d: 'None', ans: 'B' },
      { q: 'In C, a string is actually', a: 'An array of integers', b: 'An array of characters', c: 'A pointer to char', d: 'Both B and C', ans: 'D' },
      { q: 'What is the output of: printf("%d", sizeof(char));', a: '1', b: '2', c: '4', d: '8', ans: 'A' },
      { q: 'Which of the following is NOT a valid storage class in C?', a: 'auto', b: 'static', c: 'extern', d: 'class', ans: 'D' },
      { q: 'What is function recursion?', a: 'Function calling another function', b: 'Function calling itself', c: 'Loop inside function', d: 'Multiple functions', ans: 'B' },
      { q: 'What is the maximum size of array in C?', a: 'Limited by RAM', b: 'Limited by compiler', c: '1000 elements', d: 'Unlimited', ans: 'A' }
    ],
    'Hard': [
      { q: 'What is the output of: int x = 5; printf("%d", x++ + ++x);', a: '10', b: '11', c: '12', d: 'Undefined', ans: 'D' },
      { q: 'Which is the correct way to declare a function pointer?', a: 'int *func();', b: 'int (*func)();', c: 'int func*();', d: 'int &func();', ans: 'B' },
      { q: 'What is the difference between const and volatile?', a: 'Same thing', b: 'Opposite in purpose', c: 'No difference', d: 'Neither exists', ans: 'B' },
      { q: 'What does the offset_of macro do?', a: 'Get offset of member in struct', b: 'Get size of struct', c: 'Get address', d: 'Get pointer value', ans: 'A' },
      { q: 'What is the output of: printf("%d", 5/2);', a: '2.5', b: '2', c: '3', d: '2.0', ans: 'B' },
      { q: 'In C, what does the restrict qualifier mean?', a: 'Restrict variable access', b: 'Promise no aliasing', c: 'Optimize pointer usage', d: 'B and C', ans: 'D' },
      { q: 'What is the difference between struct and typedef struct?', a: 'typedef does not require struct keyword', b: 'Same thing', c: 'struct is faster', d: 'No difference', ans: 'A' },
      { q: 'What is the output of: printf("%s", "hello" "world");', a: 'hello world', b: 'helloworld', c: 'Error', d: 'hello', ans: 'B' },
      { q: 'Which operator has right-to-left associativity?', a: '+', b: '*', c: '=', d: '&&', ans: 'C' },
      { q: 'What is a dangling pointer?', a: 'Pointer to freed memory', b: 'NULL pointer', c: 'Invalid pointer', d: 'All of the above', ans: 'A' }
    ]
  },
  'Technical MCQs': {
    'Easy': [
      { q: 'What does CPU stand for?', a: 'Central Processing Unit', b: 'Central Program Utility', c: 'Computer Processing Unit', d: 'Central Processor Unit', ans: 'A' },
      { q: 'How many bits are in a byte?', a: '4', b: '8', c: '16', d: '32', ans: 'B' },
      { q: 'Which is the primary function of the operating system?', a: 'Manage hardware and software', b: 'Run programs', c: 'Manage files', d: 'All of the above', ans: 'D' },
      { q: 'What is RAM?', a: 'Read-Only Memory', b: 'Random Access Memory', c: 'Rapid Access Module', d: 'None', ans: 'B' },
      { q: 'What is the full form of URL?', a: 'Uniform Resource Locator', b: 'Universal Resource Locator', c: 'Unified Resource Locator', d: 'Unique Resource Locator', ans: 'A' },
      { q: 'Which is the fastest storage device?', a: 'RAM', b: 'Hard Drive', c: 'SSD', d: 'Cache', ans: 'D' },
      { q: 'What is the purpose of a database?', a: 'Store data', b: 'Retrieve data', c: 'Manage data', d: 'All of the above', ans: 'D' },
      { q: 'What does HTTP stand for?', a: 'HyperText Transfer Protocol', b: 'Home Transfer Text Protocol', c: 'High Text Transaction Protocol', d: 'Hyperlink Text Transfer Protocol', ans: 'A' },
      { q: 'Which is not a programming language?', a: 'Python', b: 'HTML', c: 'Java', d: 'C++', ans: 'B' },
      { q: 'What is the purpose of encryption?', a: 'Speed up data', b: 'Reduce data size', c: 'Protect data', d: 'Compress data', ans: 'C' }
    ],
    'Medium': [
      { q: 'What is the difference between compilation and interpretation?', a: 'No difference', b: 'Compiled code is faster', c: 'Interpreted is faster', d: 'Compiled is portable', ans: 'B' },
      { q: 'What is the purpose of a cache?', a: 'Store temporary data', b: 'Speed up access', c: 'Reduce memory usage', d: 'Both A and B', ans: 'D' },
      { q: 'Which protocol is used for secure communication?', a: 'HTTP', b: 'HTTPS', c: 'FTP', d: 'SMTP', ans: 'B' },
      { q: 'What is the purpose of a firewall?', a: 'Block viruses', b: 'Control network traffic', c: 'Encrypt data', d: 'Manage permissions', ans: 'B' },
      { q: 'What is machine learning?', a: 'Teaching computers to learn', b: 'Writing code', c: 'Data analysis', d: 'Algorithm design', ans: 'A' },
      { q: 'What is cloud computing?', a: 'Computing on the internet', b: 'Data in the sky', c: 'Weather prediction', d: 'Local storage', ans: 'A' },
      { q: 'What is the OSI model?', a: 'A framework for network communication', b: 'Operating System Interface', c: 'Open Source Initiative', d: 'Optimized System Interface', ans: 'A' },
      { q: 'Which layer of OSI is responsible for routing?', a: 'Layer 1', b: 'Layer 3', c: 'Layer 5', d: 'Layer 7', ans: 'B' },
      { q: 'What is the purpose of DNS?', a: 'Convert IP to domain names', b: 'Convert domain to IP', c: 'Both A and B', d: 'Encrypt data', ans: 'C' },
      { q: 'What is virtualization?', a: 'Running multiple OS on one machine', b: 'Virtual reality', c: 'Cloud storage', d: 'Network security', ans: 'A' }
    ],
    'Hard': [
      { q: 'What is the purpose of a load balancer?', a: 'Distribute traffic', b: 'Increase security', c: 'Reduce costs', d: 'Improve UI', ans: 'A' },
      { q: 'What is blockchain technology?', a: 'Chain of blocks containing data', b: 'A type of database', c: 'Cryptocurrency only', d: 'A and B', ans: 'D' },
      { q: 'What is the difference between latency and throughput?', a: 'Same thing', b: 'Latency is delay, throughput is data rate', c: 'Throughput is delay, latency is rate', d: 'No difference', ans: 'B' },
      { q: 'What is the purpose of API rate limiting?', a: 'Prevent abuse', b: 'Improve performance', c: 'Secure servers', d: 'All of the above', ans: 'D' },
      { q: 'What is containerization?', a: 'Running applications in isolated containers', b: 'Storing data', c: 'Cloud storage', d: 'Network protocol', ans: 'A' },
      { q: 'What is microservices architecture?', a: 'Breaking app into small services', b: 'Monolithic architecture', c: 'Database design', d: 'UI framework', ans: 'A' },
      { q: 'What is the CAP theorem?', a: 'Impossibility of consistency, availability, partition tolerance', b: 'Database design principle', c: 'Network protocol', d: 'A and B', ans: 'D' },
      { q: 'What is zero-knowledge proof?', a: 'Proving knowledge without revealing data', b: 'Cryptographic protocol', c: 'Authentication method', d: 'All of the above', ans: 'D' },
      { q: 'What is the difference between OAuth and OpenID?', a: 'OAuth for authorization, OpenID for authentication', b: 'Same thing', c: 'OpenID is newer', d: 'Different companies', ans: 'A' },
      { q: 'What is the purpose of a CDN?', a: 'Deliver content faster', b: 'Reduce server load', c: 'Improve availability', d: 'All of the above', ans: 'D' }
    ]
  },
  'Web Development': {
    'Easy': [
      { q: 'What does HTML stand for?', a: 'Hyper Text Markup Language', b: 'High Tech Modern Language', c: 'Home Tool Markup Language', d: 'Hyperlinks Text Marketing Language', ans: 'A' },
      { q: 'Which tag is used for paragraph in HTML?', a: '<p>', b: '<paragraph>', c: '<par>', d: '<text>', ans: 'A' },
      { q: 'What does CSS stand for?', a: 'Cascading Style Sheets', b: 'Colorful Style Syntax', c: 'Computer Style Sheets', d: 'Creative Style Sheets', ans: 'A' },
      { q: 'Which is the correct syntax for CSS selector?', a: 'element.class', b: 'element#id', c: 'element:class', d: 'element-class', ans: 'B' },
      { q: 'What does JavaScript do?', a: 'Styles the webpage', b: 'Adds interactivity', c: 'Creates structure', d: 'Stores data', ans: 'B' },
      { q: 'Which tag creates a hyperlink in HTML?', a: '<link>', b: '<url>', c: '<a>', d: '<href>', ans: 'C' },
      { q: 'What is the use of <meta> tag?', a: 'Define metadata', b: 'Create links', c: 'Add styles', d: 'Add scripts', ans: 'A' },
      { q: 'Which property sets the background color in CSS?', a: 'bg-color', b: 'background-color', c: 'color', d: 'bColor', ans: 'B' },
      { q: 'What is the box model in CSS?', a: 'Margin, border, padding, content', b: 'Width and height', c: 'Color and style', d: 'Position and alignment', ans: 'A' },
      { q: 'Which tag is used to create a table in HTML?', a: '<table>', b: '<grid>', c: '<matrix>', d: '<array>', ans: 'A' }
    ],
    'Medium': [
      { q: 'What is the difference between id and class in HTML?', a: 'id is unique, class can be multiple', b: 'Same thing', c: 'class is unique, id can be multiple', d: 'No difference', ans: 'A' },
      { q: 'What is responsive design?', a: 'Design that adapts to different screen sizes', b: 'Design that is interactive', c: 'Design that is colorful', d: 'Design that loads fast', ans: 'A' },
      { q: 'What does AJAX stand for?', a: 'Asynchronous JavaScript and XML', b: 'Asynchronous Java and XML', c: 'Application JavaScript and XML', d: 'Asynchronous JavaScript Exchange', ans: 'A' },
      { q: 'What is JSON?', a: 'JavaScript Object Notation', b: 'JavaScript Online Notation', c: 'Java Standard Object Notation', d: 'Java Serialized Object Notation', ans: 'A' },
      { q: 'What is the purpose of local storage?', a: 'Store data on browser', b: 'Store data on server', c: 'Cache data', d: 'Encrypt data', ans: 'A' },
      { q: 'What is the difference between GET and POST?', a: 'GET is visible in URL, POST is hidden', b: 'GET is faster, POST is slower', c: 'Same thing', d: 'GET for search, POST for updates', ans: 'A' },
      { q: 'What is a cookie in web development?', a: 'Small data stored on browser', b: 'A type of file', c: 'Server response', d: 'HTML element', ans: 'A' },
      { q: 'What is the purpose of DOCTYPE?', a: 'Define HTML version', b: 'Create a document', c: 'Set encoding', d: 'Add metadata', ans: 'A' },
      { q: 'What is the difference between block and inline elements?', a: 'Block takes full width, inline takes needed width', b: 'Same thing', c: 'Inline is faster', d: 'Block is styled', ans: 'A' },
      { q: 'What is flexbox?', a: 'CSS layout module', b: 'JavaScript framework', c: 'HTML element', d: 'HTTP protocol', ans: 'A' }
    ],
    'Hard': [
      { q: 'What is CORS?', a: 'Cross-Origin Resource Sharing', b: 'Cross-Origin Request System', c: 'Content Origin Resource Service', d: 'Core Origin Request Security', ans: 'A' },
      { q: 'What is OWASP Top 10?', a: 'List of security vulnerabilities', b: 'Web development framework', c: 'CSS framework', d: 'JavaScript library', ans: 'A' },
      { q: 'What is the purpose of a web worker?', a: 'Run JavaScript in background', b: 'Create HTML elements', c: 'Style webpage', d: 'Send requests', ans: 'A' },
      { q: 'What is the difference between let and var in JavaScript?', a: 'let is block-scoped, var is function-scoped', b: 'Same thing', c: 'var is newer', d: 'let is older', ans: 'A' },
      { q: 'What is event bubbling?', a: 'Event propagates from child to parent', b: 'Event propagates from parent to child', c: 'Event is repeated', d: 'Event is cancelled', ans: 'A' },
      { q: 'What is the purpose of service worker?', a: 'Handle offline functionality', b: 'Style webpage', c: 'Create elements', d: 'Send requests onl', ans: 'A' },
      { q: 'What is the difference between async and await?', a: 'async declares function, await waits for promise', b: 'Same thing', c: 'await is faster', d: 'async is newer', ans: 'A' },
      { q: 'What is React?', a: 'JavaScript library for UI', b: 'CSS framework', c: 'HTML template', d: 'HTTP protocol', ans: 'A' },
      { q: 'What is the virtual DOM?', a: 'JavaScript representation of actual DOM', b: 'Fake HTML', c: 'Server-side rendering', d: 'Browser cache', ans: 'A' },
      { q: 'What is GraphQL?', a: 'Query language for APIs', b: 'Database', c: 'CSS preprocessor', d: 'JavaScript framework', ans: 'A' }
    ]
  }
};

// Clear old questions and repopulate
db.serialize(() => {
  console.log('Clearing old questions...');
  db.run('DELETE FROM questions', (err) => {
    if (err) {
      console.error('Error clearing questions:', err);
      return;
    }
    console.log('✓ Questions cleared');

    // Get all levels to map category name and difficulty
    db.all(`
      SELECT l.id, l.category_id, l.difficulty, c.name as category_name
      FROM levels l
      JOIN categories c ON l.category_id = c.id
      ORDER BY l.id
    `, (err, levels) => {
      if (err) {
        console.error('Error fetching levels:', err);
        return;
      }

      let totalInserted = 0;

      levels.forEach(level => {
        const categoryName = level.category_name;
        const difficulty = level.difficulty;
        const levelId = level.id;

        const questions = questionBank[categoryName]?.[difficulty] || [];

        if (questions.length === 0) {
          console.warn(`No questions found for ${categoryName} - ${difficulty}`);
          return;
        }

        questions.forEach(q => {
          db.run(
            `INSERT INTO questions (level_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              levelId,
              q.q,
              q.a,
              q.b,
              q.c,
              q.d,
              q.ans,
              ''
            ],
            (err) => {
              if (err) {
                console.error(`Error inserting question for level ${levelId}:`, err);
              } else {
                totalInserted++;
              }
            }
          );
        });
      });

      // Close DB after a short delay to allow all inserts
      setTimeout(() => {
        db.get('SELECT COUNT(*) as count FROM questions', (err, result) => {
          console.log(`\n✓ Total questions inserted: ${result.count}`);
          db.all('SELECT level_id, COUNT(*) as count FROM questions GROUP BY level_id ORDER BY level_id', (err, rows) => {
            console.log('\nQuestions per level:');
            rows.forEach(r => console.log(`  Level ${r.level_id}: ${r.count}`));
            db.close(() => {
              console.log('\n✓ Database updated successfully');
              process.exit(0);
            });
          });
        });
      }, 2000);
    });
  });
});
