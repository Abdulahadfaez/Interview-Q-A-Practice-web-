const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('app.db');

db.all("SELECT l.id as level_id, l.difficulty, c.name as category_name FROM levels l JOIN categories c ON l.category_id = c.id", (err, rows) => {
  if (err) { console.error(err); process.exit(1); }
  rows.forEach(row => {
    db.get('SELECT COUNT(*) as count FROM questions WHERE level_id = ?', [row.level_id], (err, r) => {
      const existing = (r && r.count) ? r.count : 0;
      if (existing >= 10) { console.log('level', row.level_id, 'already', existing); return; }
      const needed = 10 - existing;
      for (let i = 0; i < needed; i++) {
        const qText = 'Auto Q ' + (existing + i + 1) + ' for ' + row.category_name + ' (' + row.difficulty + ')';
        db.run('INSERT INTO questions (level_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES (?,?,?,?,?,?,?,?)',
          [row.level_id, qText, 'A', 'B', 'C', 'D', 'A', '']);
      }
      console.log('Inserted', needed, 'for level', row.level_id);
    });
  });
  db.close(()=>console.log('Populate done'));
});
