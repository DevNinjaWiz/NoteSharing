import { computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  signalStore,
  withMethods,
  withProps,
  withComputed,
  withState,
  patchState,
} from '@ngrx/signals';
import { Note } from './note.model';
import { NoteService } from '../../services/note.service';
import { tap } from 'rxjs';

export interface NotesState {
  isLoadNotes: boolean;
}

const initialState: NotesState = {
  isLoadNotes: false,
};

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store) => {
    const noteService = inject(NoteService);
    const notesResource = httpResource<Note[]>(
      () => (store.isLoadNotes() ? noteService.apiUrl : undefined),
      { defaultValue: [] }
    );

    return {
      noteService,
      notesResource,
    };
  }),
  withComputed((store) => ({
    notes: computed(() => store.notesResource.value()),
    isLoading: computed(() => store.notesResource.isLoading()),
    error: computed(() => store.notesResource.error()?.message ?? null),
  })),
  withMethods((store) => ({
    loadNotes() {
      if (!store.isLoadNotes()) {
        patchState(store, { isLoadNotes: true });
        return true;
      }
      return store.notesResource.reload();
    },
    addNote(note: Partial<Note>) {
      return store.noteService.addNote(note).pipe(
        tap((newNote) => {
          store.notesResource.update((notes) => [...notes, newNote]);
        })
      );
    },
    updateNote(id: string, note: Partial<Note>) {
      return store.noteService.updateNote(id, note).pipe(
        tap((updatedNote) => {
          const targetId = updatedNote?.id ?? id;
          store.notesResource.update((notes) =>
            notes.map((existing) =>
              existing.id === targetId ? updatedNote : existing
            )
          );
        })
      );
    },
    deleteNote(id: string) {
      return store.noteService.deleteNote(id).pipe(
        tap(() => {
          store.notesResource.update((notes) =>
            notes.filter((existing) => existing.id !== id)
          );
        })
      );
    },
  }))
);
