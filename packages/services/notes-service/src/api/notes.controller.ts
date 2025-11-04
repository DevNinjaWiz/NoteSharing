import { Request, Response } from 'express';
import { CreateNoteUseCase } from '../service';
import { INote } from '../domain';

export class NotesController {
  constructor(private readonly createNoteUseCase: CreateNoteUseCase) {}

  async createNote(req: Request, res: Response): Promise<void> {
    try {
      // In a real application, you would get the ownerId from the authenticated user
      // For now, let's assume it's passed in the request body or a placeholder
      const ownerId = req.body.ownerId || 'placeholder-owner-id';
      const { title, content } = req.body;

      if (!title || !content) {
        res.status(400).json({ message: 'Title and content are required.' });
        return;
      }

      const newNote: INote = { ownerId, title, content };
      const createdNote = await this.createNoteUseCase.execute(newNote);
      res.status(201).json(createdNote);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}
