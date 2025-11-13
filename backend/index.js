
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// Ensure db.json exists and has a users array
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ notes: [], users: [], friends: [] })
  );
} else {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!db.users) {
    db.users = [];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
  if (!db.friends) {
    db.friends = [];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
}

// Authentication routes
app.post('/api/register', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    const { email, password } = req.body;

    if (db.users.some(user => user.email === email)) {
      return res.status(409).send('Registration failed: User already exists');
    }
    if (!password) {
      return res.status(400).send('Password is required for registration');
    }

    const newUser = { email, password }; // In a real app, hash the password!
    db.users.push(newUser);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file.');
      }
      res.status(201).json({ email: newUser.email }); // Return a simplified user object
    });
  });
});

app.post('/api/login', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    const { email, password } = req.body;

    const foundUser = db.users.find(user => user.email === email && user.password === password);

    if (!foundUser) {
      return res.status(401).send('Login failed: Invalid login credentials');
    }

    res.status(200).json({ email: foundUser.email }); // Return a simplified user object
  });
});

app.post('/api/logout', (req, res) => {
  // For this simple in-memory backend, just return success
  res.status(200).json({ success: true });
});

app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    res.json(JSON.parse(data).notes);
  });
});

app.get('/api/friends', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    res.json(db.friends ?? []);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    const newNote = {
      id: Date.now().toString(), // Simple unique ID
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file.');
      }
      res.status(201).json(newNote);
    });
  });
});

app.put('/api/notes/:id', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    const noteIndex = db.notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).send('Note not found.');
    }
    const updatedNote = {
      ...db.notes[noteIndex],
      ...req.body,
      updatedAt: new Date(),
    };
    db.notes[noteIndex] = updatedNote;
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file.');
      }
      res.status(200).json(updatedNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    const newNotes = db.notes.filter((note) => note.id !== req.params.id);
    if (db.notes.length === newNotes.length) {
      return res.status(404).send('Note not found.');
    }
    db.notes = newNotes;
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file.');
      }
      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
