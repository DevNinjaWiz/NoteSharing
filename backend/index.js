
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// Ensure db.json exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ notes: [] }));
}

app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    res.json(JSON.parse(data).notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    const newNote = req.body;
    db.notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file.');
      }
      res.status(201).json(newNote);
    });
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
