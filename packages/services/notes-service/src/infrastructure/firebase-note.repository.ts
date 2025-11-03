
import { INote } from '../domain/note.entity';
import { INoteRepository } from '../repository/note.repository';
import { Firestore } from 'firebase-admin/firestore';

export class FirebaseNoteRepository implements INoteRepository {
  private readonly firestore: Firestore;
  private readonly collectionName = 'notes';

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async create(note: INote): Promise<INote> {
    const docRef = await this.firestore.collection(this.collectionName).add({
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const createdNote = await this.findById(docRef.id);
    return createdNote!;
  }

  async findById(id: string): Promise<INote | null> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as INote;
    } else {
      return null;
    }
  }

  async findAllByOwnerId(ownerId: string): Promise<INote[]> {
    const snapshot = await this.firestore.collection(this.collectionName).where('ownerId', '==', ownerId).get();
    const notes: INote[] = [];
    snapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as INote);
    });
    return notes;
  }

  async update(id: string, note: Partial<INote>): Promise<INote | null> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    await docRef.update({ ...note, updatedAt: new Date() });
    const updatedNote = await this.findById(id);
    return updatedNote;
  }

  async delete(id: string): Promise<boolean> {
    await this.firestore.collection(this.collectionName).doc(id).delete();
    return true;
  }
}
