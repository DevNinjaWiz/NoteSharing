import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { firestore } from '@notes-sharing/shared';
import { FirebaseNoteRepository } from './infrastructure';
import { CreateNoteUseCase, GetAllNotesUseCase } from './service';
import { NotesController } from './api';

const app = express();
app.use(express.json()); // Enable JSON body parsing

// Dependency Injection
const noteRepository = new FirebaseNoteRepository(firestore);
const createNoteUseCase = new CreateNoteUseCase(noteRepository);
const getAllNotesUseCase = new GetAllNotesUseCase(noteRepository);
const notesController = new NotesController(createNoteUseCase, getAllNotesUseCase);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.post('/api/notes', (req, res) => notesController.createNote(req, res));
app.get('/api/notes', (req, res) => notesController.getNotes(req, res));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to notes-service!!' });
});

const start = async () => {
  try {
    const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
