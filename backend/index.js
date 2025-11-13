
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

const readDb = (res, cb) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data file.');
      return;
    }
    cb(JSON.parse(data));
  });
};

const writeDb = (res, db, status = 200, payload) => {
  fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
    if (err) {
      res.status(500).send('Error writing data file.');
      return;
    }
    if (payload === undefined) {
      res.sendStatus(status);
    } else {
      res.status(status).json(payload);
    }
  });
};

const validateNotebookId = (res, db, notebookId) => {
  const normalizedId =
    typeof notebookId === 'string' ? notebookId.trim() : '';

  if (!normalizedId) {
    res.status(400).send('A notebookId is required for notes.');
    return null;
  }

  const hasNotebook = (db.notebooks ?? []).some(
    (notebook) => notebook.id === normalizedId
  );

  if (!hasNotebook) {
    res
      .status(400)
      .send('Notebook not found. Please select a valid notebook.');
    return null;
  }

  return normalizedId;
};

// Ensure db.json exists and has required collections
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ notes: [], users: [], friends: [], notebooks: [] })
  );
} else {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!db.users) {
    db.users = [];
  }
  if (!db.friends) {
    db.friends = [];
  }
  if (!db.notebooks) {
    db.notebooks = [];
  }
  if (!db.notes) {
    db.notes = [];
  }

  if ((db.notes?.length ?? 0) > 0 && (db.notebooks?.length ?? 0) > 0) {
    const fallbackNotebookId = db.notebooks[0]?.id ?? null;
    db.notes = db.notes.map((note) => {
      if (note?.notebookId) {
        return note;
      }
      return {
        ...note,
        notebookId: fallbackNotebookId,
      };
    });
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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
  const rawNotebookId = typeof req.query?.notebookId === 'string'
    ? req.query.notebookId.trim()
    : '';

  readDb(res, (db) => {
    let notes = db.notes ?? [];
    if (rawNotebookId && rawNotebookId !== 'all') {
      notes = notes.filter((note) => note.notebookId === rawNotebookId);
    }
    res.json(notes);
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

app.get('/api/notebooks', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file.');
    }
    const db = JSON.parse(data);
    res.json(db.notebooks ?? []);
  });
});

app.post('/api/notes', (req, res) => {
  readDb(res, (db) => {
    const {
      notebookId: rawNotebookId,
      title = '',
      content = '',
      ...rest
    } = req.body ?? {};
    const notebookId = validateNotebookId(res, db, rawNotebookId);
    if (!notebookId) {
      return;
    }

    const now = new Date();
    const newNote = {
      id: Date.now().toString(), // Simple unique ID
      title,
      content,
      ...rest,
      notebookId,
      isFavorite: !!req.body?.isFavorite,
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    db.notes ??= [];
    db.notes.push(newNote);
    writeDb(res, db, 201, newNote);
  });
});

app.put('/api/notes/:id', (req, res) => {
  readDb(res, (db) => {
    const noteIndex = db.notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      res.status(404).send('Note not found.');
      return;
    }
    const existing = db.notes[noteIndex];
    const { notebookId: incomingNotebookId, ...rest } = req.body ?? {};
    const notebookId = validateNotebookId(
      res,
      db,
      incomingNotebookId ?? existing.notebookId
    );
    if (!notebookId) {
      return;
    }
    const updatedNote = {
      ...existing,
      ...rest,
      notebookId,
      isFavorite:
        typeof req.body?.isFavorite === 'boolean'
          ? req.body.isFavorite
          : existing.isFavorite ?? false,
      isDeleted:
        typeof req.body?.isDeleted === 'boolean'
          ? req.body.isDeleted
          : existing.isDeleted ?? false,
      deletedAt:
        req.body?.isDeleted === false ? null : existing.deletedAt ?? null,
      updatedAt: new Date(),
    };
    db.notes[noteIndex] = updatedNote;
    writeDb(res, db, 200, updatedNote);
  });
});

app.patch('/api/notes/:id/favorite', (req, res) => {
  readDb(res, (db) => {
    const noteIndex = db.notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      res.status(404).send('Note not found.');
      return;
    }

    const { isFavorite } = req.body ?? {};
    if (typeof isFavorite !== 'boolean') {
      res.status(400).send('isFavorite flag is required.');
      return;
    }

    const updatedNote = {
      ...db.notes[noteIndex],
      isFavorite,
      updatedAt: new Date(),
    };
    db.notes[noteIndex] = updatedNote;

    writeDb(res, db, 200, updatedNote);
  });
});

app.delete('/api/notes/:id', (req, res) => {
  readDb(res, (db) => {
    const noteIndex = db.notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      res.status(404).send('Note not found.');
      return;
    }

    const updatedNote = {
      ...db.notes[noteIndex],
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    };
    db.notes[noteIndex] = updatedNote;
    writeDb(res, db, 200, updatedNote);
  });
});

app.patch('/api/notes/:id/restore', (req, res) => {
  readDb(res, (db) => {
    const noteIndex = db.notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      res.status(404).send('Note not found.');
      return;
    }

    const note = db.notes[noteIndex];
    if (!note.isDeleted) {
      res.status(400).send('Note is not in trash.');
      return;
    }

    const updatedNote = {
      ...note,
      isDeleted: false,
      deletedAt: null,
      updatedAt: new Date(),
    };
    db.notes[noteIndex] = updatedNote;
    writeDb(res, db, 200, updatedNote);
  });
});

app.delete('/api/notes/:id/permanent', (req, res) => {
  readDb(res, (db) => {
    const noteIndex = db.notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      res.status(404).send('Note not found.');
      return;
    }

    db.notes.splice(noteIndex, 1);
    writeDb(res, db, 204);
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
