import { INote } from '../domain/note.entity';

export interface INoteRepository {
  create(note: INote): Promise<INote>;
  findById(id: string): Promise<INote | null>;
  findAllByOwnerId(ownerId: string): Promise<INote[]>;
  update(id: string, note: Partial<INote>): Promise<INote | null>;
  delete(id: string): Promise<boolean>;
}
