import { computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  type,
  signalStore,
  withMethods,
  withProps,
  withComputed,
  withState,
  patchState,
} from '@ngrx/signals';
import {
  Dispatcher,
  Events,
  eventGroup,
  withEffects,
} from '@ngrx/signals/events';
import { Note } from './note.model';
import { NoteService } from '../../services/note.service';
import { EMPTY, catchError, concatMap, tap } from 'rxjs';

export interface NotesState {
  isLoadNotes: boolean;
}

const initialState: NotesState = {
  isLoadNotes: false,
};

const notesEvents = eventGroup({
  source: 'Notes Store',
  events: {
    load: type<void>(),
    add: type<Partial<Note>>(),
    update: type<{ id: string; changes: Partial<Note> }>(),
    delete: type<{ id: string }>(),
  },
});

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
  withEffects((store, events = inject(Events)) => {
    const onError = (message: string) =>
      catchError((error) => {
        console.error(message, error);
        return EMPTY;
      });

    return {
      loadNotes$: events.on(notesEvents.load).pipe(
        tap(() => {
          if (!store.isLoadNotes()) {
            patchState(store, { isLoadNotes: true });
          } else {
            store.notesResource.reload();
          }
        })
      ),
      addNote$: events.on(notesEvents.add).pipe(
        concatMap(({ payload }) =>
          store.noteService.addNote(payload).pipe(
            tap((newNote) => {
              store.notesResource.update((notes) => [...notes, newNote]);
            }),
            onError('Unable to add note')
          )
        )
      ),
      updateNote$: events.on(notesEvents.update).pipe(
        concatMap(({ payload }) =>
          store.noteService.updateNote(payload.id, payload.changes).pipe(
            tap((updatedNote) => {
              const targetId = updatedNote?.id ?? payload.id;
              store.notesResource.update((notes) =>
                notes.map((existing) =>
                  existing.id === targetId ? updatedNote : existing
                )
              );
            }),
            onError('Unable to update note')
          )
        )
      ),
      deleteNote$: events.on(notesEvents.delete).pipe(
        concatMap(({ payload }) =>
          store.noteService.deleteNote(payload.id).pipe(
            tap(() => {
              store.notesResource.update((notes) =>
                notes.filter((existing) => existing.id !== payload.id)
              );
            }),
            onError('Unable to delete note')
          )
        )
      ),
    };
  }),
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    loadNotes() {
      dispatcher.dispatch(notesEvents.load());
    },
    addNote(note: Partial<Note>) {
      dispatcher.dispatch(notesEvents.add(note));
    },
    updateNote(id: string, note: Partial<Note>) {
      dispatcher.dispatch(notesEvents.update({ id, changes: note }));
    },
    deleteNote(id: string) {
      dispatcher.dispatch(notesEvents.delete({ id }));
    },
  }))
);
