import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Note } from './note.model';
import { NoteService } from '../../services/note.service';
import { tap, switchMap, catchError, of } from 'rxjs';

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
};

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, noteService = inject(NoteService)) => ({
    loadNotes() {
      patchState(store, { isLoading: true });
      return noteService.getNotes().pipe(
        tap((notes) => patchState(store, { notes, isLoading: false })),
        catchError((error) => {
          patchState(store, { error: error.message, isLoading: false });
          return of(error);
        })
      );
    },
    addNote(note: Partial<Note>) {
      patchState(store, { isLoading: true });
      return noteService.addNote(note).pipe(
        tap((newNote) =>
          patchState(store, {
            notes: [...store.notes(), newNote],
            isLoading: false,
          })
        ),
        catchError((error) => {
          patchState(store, { error: error.message, isLoading: false });
          return of(error);
        })
      );
    },
    updateNote(id: string, note: Partial<Note>) {
      patchState(store, { isLoading: true });
      return noteService.updateNote(id, note).pipe(
        tap((updatedNote) => {
          const newNotes = store
            .notes()
            .map((n) => (n.id === id ? updatedNote : n));
          patchState(store, { notes: newNotes, isLoading: false });
        }),
        catchError((error) => {
          patchState(store, { error: error.message, isLoading: false });
          return of(error);
        })
      );
    },
    deleteNote(id: string) {
      patchState(store, { isLoading: true });
      return noteService.deleteNote(id).pipe(
        tap(() => {
          const newNotes = store.notes().filter((n) => n.id !== id);
          patchState(store, { notes: newNotes, isLoading: false });
        }),
        catchError((error) => {
          patchState(store, { error: error.message, isLoading: false });
          return of(error);
        })
      );
    },
  }))
);
