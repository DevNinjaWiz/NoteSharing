import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Friend } from './friend.model';
import { FriendService } from '../../services';
import { withLogger } from '../../shared/utils';

interface FriendState {
  friends: Friend[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FriendState = {
  friends: [],
  isLoading: false,
  error: null,
};

export const FriendStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLogger('FriendStore'),
  withComputed((store) => ({
    friends: computed(() => store.friends()),
    isLoading: computed(() => store.isLoading()),
    error: computed(() => store.error()),
    hasFriends: computed(() => store.friends().length > 0),
  })),
  withMethods((store, friendService = inject(FriendService)) => ({
    loadFriends() {
      patchState(store, { isLoading: true, error: null });
      friendService.getFriends().subscribe({
        next: (friends) => patchState(store, { friends, isLoading: false }),
        error: (error) =>
          patchState(store, {
            error: error?.message ?? 'Unable to load friends',
            isLoading: false,
          }),
      });
    },
  }))
);
