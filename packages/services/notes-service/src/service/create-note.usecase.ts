import { INote } from '../domain';
import { INoteRepository } from '../repository/note.repository';

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(note: INote): Promise<INote> {
    // Add any business logic or validation here before creating the note
    // For example, check if the user has reached their note limit
    return this.noteRepository.create(note);
  }
}
