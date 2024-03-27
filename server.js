const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('/tasks.db');

// Middleware to enable CORS
app.use(cors());

// Create tasks table if it doesn't exist
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, task TEXT)'
  );
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to add a new task
app.post('/tasks', (req, res) => {
  const task = req.body.task;
  db.run('INSERT INTO tasks (task) VALUES (?)', [task], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, task: task });
  });
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.sendStatus(200);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
