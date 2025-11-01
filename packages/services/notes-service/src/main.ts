import express from 'express';
import * as path from 'path';
import { connectToDatabase } from '@notes-sharing/shared';
import { MongoNoteRepository } from './infrastructure/mongo-note.repository';
import { CreateNoteUseCase } from './service/create-note.usecase';
import { NotesController } from './api/notes.controller';

const app = express();
app.use(express.json()); // Enable JSON body parsing

// Connect to MongoDB
const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/notes-db';
connectToDatabase(DATABASE_URL);

// Dependency Injection
const noteRepository = new MongoNoteRepository();
const createNoteUseCase = new CreateNoteUseCase(noteRepository);
const notesController = new NotesController(createNoteUseCase);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.post('/api/notes', (req, res) => notesController.createNote(req, res));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to notes-service!!' });
});

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
