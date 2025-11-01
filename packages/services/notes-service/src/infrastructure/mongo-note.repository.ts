import { Schema, model, Document } from 'mongoose';
import { INote } from '../domain/note.entity';
import { INoteRepository } from '../repository/note.repository';

type INoteDocument = INote & Document;

const NoteSchema = new Schema<INoteDocument>({
  ownerId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const NoteModel = model<INoteDocument>('Note', NoteSchema);

export class MongoNoteRepository implements INoteRepository {
  async create(note: INote): Promise<INote> {
    const newNote = new NoteModel(note);
    const savedNote = await newNote.save();
    return savedNote.toObject();
  }

  async findById(id: string): Promise<INote | null> {
    const note = await NoteModel.findById(id);
    return note ? note.toObject() : null;
  }

  async findAllByOwnerId(ownerId: string): Promise<INote[]> {
    const notes = await NoteModel.find({ ownerId });
    return notes.map(note => note.toObject());
  }

  async update(id: string, note: Partial<INote>): Promise<INote | null> {
    const updatedNote = await NoteModel.findByIdAndUpdate(id, { ...note, updatedAt: new Date() }, { new: true });
    return updatedNote ? updatedNote.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await NoteModel.findByIdAndDelete(id);
    return result !== null;
  }
}