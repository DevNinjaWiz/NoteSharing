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
import { NoteService } from '../../services';
import { concatMap, tap } from 'rxjs';
import { withLogger, errorLog } from '../../shared/utils';

export interface NotesState {
  isLoadNotes: boolean;
  selectedNotebookId: string | null;
}

const initialState: NotesState = {
  isLoadNotes: false,
  selectedNotebookId: null,
};

const notesEvents = eventGroup({
  source: 'Notes Store',
  events: {
    load: type<void>(),
    add: type<Partial<Note>>(),
    update: type<{ id: string; changes: Partial<Note> }>(),
    delete: type<{ id: string }>(),
    restore: type<{ id: string }>(),
    deleteForever: type<{ id: string }>(),
    favorite: type<{ id: string; isFavorite: boolean }>(),
  },
});

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store) => {
    const noteService = inject(NoteService);
    const notesResource = httpResource<Note[]>(
      () =>
        store.isLoadNotes()
          ? noteService.notesUrl(store.selectedNotebookId())
          : undefined,
      { defaultValue: [] }
    );

    return {
      noteService,
      notesResource,
    };
  }),
  withLogger('NotesStore', [
    (store) => ({
      label: 'notesResource',
      source: () => store.notesResource.value(),
    }),
  ]),
  withComputed((store) => ({
    notes: computed(() => store.notesResource.value()),
    activeNotes: computed(() =>
      store.notesResource
        .value()
        .filter((note) => !(note.isDeleted ?? false))
    ),
    trashedNotes: computed(() =>
      store.notesResource.value().filter((note) => note.isDeleted ?? false)
    ),
    isLoading: computed(() => store.notesResource.isLoading()),
    error: computed(() => store.notesResource.error()?.message ?? null),
    selectedNotebookIdSignal: computed(() => store.selectedNotebookId()),
  })),
  withEffects((store, events = inject(Events)) => {
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
            errorLog('Unable to add note')
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
            errorLog('Unable to update note')
          )
        )
      ),
      deleteNote$: events.on(notesEvents.delete).pipe(
        concatMap(({ payload }) =>
          store.noteService.deleteNote(payload.id).pipe(
            tap((updatedNote) => {
              store.notesResource.update((notes) =>
                notes.map((existing) =>
                  existing.id === payload.id ? updatedNote : existing
                )
              );
            }),
            errorLog('Unable to delete note')
          )
        )
      ),
      restoreNote$: events.on(notesEvents.restore).pipe(
        concatMap(({ payload }) =>
          store.noteService.restoreNote(payload.id).pipe(
            tap((updatedNote) => {
              store.notesResource.update((notes) =>
                notes.map((existing) =>
                  existing.id === payload.id ? updatedNote : existing
                )
              );
            }),
            errorLog('Unable to restore note')
          )
        )
      ),
      deleteForever$: events.on(notesEvents.deleteForever).pipe(
        concatMap(({ payload }) =>
          store.noteService.permanentlyDeleteNote(payload.id).pipe(
            tap(() => {
              store.notesResource.update((notes) =>
                notes.filter((existing) => existing.id !== payload.id)
              );
            }),
            errorLog('Unable to delete note permanently')
          )
        )
      ),
      toggleFavorite$: events.on(notesEvents.favorite).pipe(
        concatMap(({ payload }) =>
          store.noteService
            .toggleFavorite(payload.id, payload.isFavorite)
            .pipe(
              tap((updatedNote) => {
                const previousNote = store.notesResource
                  .value()
                  .find((item) => item.id === payload.id);
                const noteToStore = previousNote
                  ? { ...updatedNote, updatedAt: previousNote.updatedAt }
                  : updatedNote;
                store.notesResource.update((notes) =>
                  notes.map((existing) =>
                    existing.id === payload.id ? noteToStore : existing
                  )
                );
              }),
              errorLog('Unable to update favorite state')
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
    restoreNote(id: string) {
      dispatcher.dispatch(notesEvents.restore({ id }));
    },
    deleteNoteForever(id: string) {
      dispatcher.dispatch(notesEvents.deleteForever({ id }));
    },
    toggleFavorite(id: string, isFavorite: boolean) {
      dispatcher.dispatch(notesEvents.favorite({ id, isFavorite }));
    },
    filterByNotebook(notebookId: string | null) {
      const normalized = notebookId ?? null;
      const hasChanged = store.selectedNotebookId() !== normalized;
      patchState(store, { selectedNotebookId: normalized });

      if (!store.isLoadNotes()) {
        dispatcher.dispatch(notesEvents.load());
        return;
      }

      if (hasChanged) {
        store.notesResource.reload();
      }
    },
  }))
);
