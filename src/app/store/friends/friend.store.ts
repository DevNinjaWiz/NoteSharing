import { computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
  type,
} from '@ngrx/signals';
import {
  Dispatcher,
  Events,
  eventGroup,
  withEffects,
} from '@ngrx/signals/events';
import { tap } from 'rxjs';
import { Friend } from './friend.model';
import { FriendService } from '../../services';
import { withLogger } from '../../shared/utils';

interface FriendState {
  isLoadFriends: boolean;
}

const initialState: FriendState = {
  isLoadFriends: false,
};

const friendEvents = eventGroup({
  source: 'FriendStore',
  events: {
    load: type<void>(),
  },
});

export const FriendStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store) => {
    const friendService = inject(FriendService);
    const friendsResource = httpResource<Friend[]>(
      () => (store.isLoadFriends() ? friendService.apiUrl : undefined),
      { defaultValue: [] }
    );

    return {
      friendService,
      friendsResource,
    };
  }),
  withLogger('FriendStore', [
    (store) => ({
      label: 'friendsResource',
      source: () => store.friendsResource.value(),
    }),
  ]),
  withComputed((store) => ({
    friends: computed(() => store.friendsResource.value()),
    isLoading: computed(() => store.friendsResource.isLoading()),
    error: computed(() => store.friendsResource.error()?.message ?? null),
    hasFriends: computed(() => store.friendsResource.value().length > 0),
  })),
  withEffects((store, events = inject(Events)) => {
    return {
      loadFriends$: events.on(friendEvents.load).pipe(
        tap(() => {
          if (!store.isLoadFriends()) {
            patchState(store, { isLoadFriends: true });
          } else {
            store.friendsResource.reload();
          }
        })
      ),
    };
  }),
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    loadFriends() {
      dispatcher.dispatch(friendEvents.load());
    },
  }))
);
