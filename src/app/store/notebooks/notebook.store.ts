import { computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  Dispatcher,
  Events,
  eventGroup,
  withEffects,
} from '@ngrx/signals/events';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { concatMap, tap } from 'rxjs';
import { Notebook } from './notebook.model';
import { NotebookService } from '../../services';
import { errorLog, withLogger } from '../../shared/utils';

interface NotebookState {
  isLoadNotebooks: boolean;
}

const initialState: NotebookState = {
  isLoadNotebooks: false,
};

const notebookEvents = eventGroup({
  source: 'NotebookStore',
  events: {
    load: type<void>(),
    create: type<{ name: string }>(),
    delete: type<{ id: string }>(),
  },
});

export const NotebookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store) => {
    const notebookService = inject(NotebookService);
    const notebooksResource = httpResource<Notebook[]>(
      () => (store.isLoadNotebooks() ? notebookService.apiUrl : undefined),
      { defaultValue: [] }
    );

    return {
      notebookService,
      notebooksResource,
    };
  }),
  withLogger('NotebookStore', [
    (store) => ({
      label: 'notebooksResource',
      source: () => store.notebooksResource.value(),
    }),
  ]),
  withComputed((store) => ({
    notebooks: computed(() => store.notebooksResource.value()),
    isLoading: computed(() => store.notebooksResource.isLoading()),
    error: computed(() => store.notebooksResource.error()?.message ?? null),
    hasNotebooks: computed(() => store.notebooksResource.value().length > 0),
  })),
  withEffects((store, events = inject(Events)) => ({
    loadNotebooks$: events.on(notebookEvents.load).pipe(
      tap(() => {
        if (!store.isLoadNotebooks()) {
          patchState(store, { isLoadNotebooks: true });
        } else {
          store.notebooksResource.reload();
        }
      })
    ),
    createNotebook$: events.on(notebookEvents.create).pipe(
      concatMap(({ payload }) =>
        store.notebookService.createNotebook(payload.name).pipe(
          tap((newNotebook) => {
            store.notebooksResource.update((notebooks) => [
              ...notebooks,
              newNotebook,
            ]);
          }),
          errorLog('Unable to create notebook')
        )
      )
    ),
    deleteNotebook$: events.on(notebookEvents.delete).pipe(
      concatMap(({ payload }) =>
        store.notebookService.deleteNotebook(payload.id).pipe(
          tap(() => {
            store.notebooksResource.update((notebooks) =>
              notebooks.filter((notebook) => notebook.id !== payload.id)
            );
          }),
          errorLog('Unable to delete notebook')
        )
      )
    ),
  })),
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    loadNotebooks() {
      dispatcher.dispatch(notebookEvents.load());
    },
    addNotebook(name: string) {
      const trimmed = name.trim();
      if (!trimmed) {
        return;
      }

      dispatcher.dispatch(
        notebookEvents.create({
          name: trimmed,
        })
      );
    },
    removeNotebook(id: string) {
      dispatcher.dispatch(
        notebookEvents.delete({
          id,
        })
      );
    },
  }))
);
