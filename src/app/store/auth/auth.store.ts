import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Dispatcher,
  Events,
  eventGroup,
  withEffects,
} from '@ngrx/signals/events';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services';
import { User } from '../../models/user.model';
import { AuthCredentials } from '../../models/auth.model';
import { withLogger } from '../../shared/utils';

export interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const authEvents = eventGroup({
  source: 'AuthStore',
  events: {
    register: type<AuthCredentials>(),
    login: type<AuthCredentials>(),
    logout: type<void>(),
  },
});

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLogger('AuthStore'),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.currentUser()),
    currentUser: computed(() => store.currentUser()),
    error: computed(() => store.error()),
  })),
  withEffects(
    (store, events = inject(Events), authService = inject(AuthService)) => ({
      register$: events.on(authEvents.register).pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ payload }) =>
          authService.register(payload).pipe(
            tap((user) =>
              patchState(store, { currentUser: user, isLoading: false })
            ),
            catchError((error) => {
              patchState(store, {
                error: error?.message ?? 'Unable to register',
                isLoading: false,
              });
              return EMPTY;
            })
          )
        )
      ),
      login$: events.on(authEvents.login).pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ payload }) =>
          authService.login(payload).pipe(
            tap((user) =>
              patchState(store, { currentUser: user, isLoading: false })
            ),
            catchError((error) => {
              patchState(store, {
                error: error?.message ?? 'Unable to login',
                isLoading: false,
              });
              return EMPTY;
            })
          )
        )
      ),
      logout$: events.on(authEvents.logout).pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          authService.logout().pipe(
            tap(() =>
              patchState(store, { currentUser: null, isLoading: false })
            ),
            catchError((error) => {
              patchState(store, {
                error: error?.message ?? 'Unable to logout',
                isLoading: false,
              });
              return EMPTY;
            })
          )
        )
      ),
    })
  ),
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    register(credentials: AuthCredentials) {
      dispatcher.dispatch(authEvents.register(credentials));
    },
    login(credentials: AuthCredentials) {
      dispatcher.dispatch(authEvents.login(credentials));
    },
    logout() {
      dispatcher.dispatch(authEvents.logout());
    },
  }))
);
