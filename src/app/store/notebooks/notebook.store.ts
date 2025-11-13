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
import { tap } from 'rxjs';
import { Notebook } from './notebook.model';
import { NotebookService } from '../../services';
import { withLogger } from '../../shared/utils';

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
  })),
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    loadNotebooks() {
      dispatcher.dispatch(notebookEvents.load());
    },
  }))
);
