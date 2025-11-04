import { NoteRepository } from '../repository';
import { INote } from '../domain';

export class GetAllNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(ownerId: string): Promise<INote[]> {
    return this.noteRepository.findAllByOwnerId(ownerId);
  }
}
