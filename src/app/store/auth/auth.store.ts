import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AuthService } from '../../services';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthCredentials } from '../../models/auth.model';
import { Observable } from 'rxjs'; // Import Observable
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

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLogger('AuthStore'),
  withMethods((store, authService = inject(AuthService)) => ({
    register(credentials: AuthCredentials): Observable<User> {
      patchState(store, { isLoading: true, error: null });
      return authService.register(credentials).pipe(
        tap({
          next: (user) => {
            patchState(store, { currentUser: user, isLoading: false });
          },
          error: (error) => {
            patchState(store, { error: error.message, isLoading: false });
          },
        })
      );
    },
    login(credentials: AuthCredentials): Observable<User> {
      patchState(store, { isLoading: true, error: null });
      return authService.login(credentials).pipe(
        tap({
          next: (user) => {
            patchState(store, { currentUser: user, isLoading: false });
          },
          error: (error) => {
            patchState(store, { error: error.message, isLoading: false });
          },
        })
      );
    },
    logout(): Observable<boolean> {
      return authService.logout().pipe(
        tap({
          next: () => {
            patchState(store, { currentUser: null });
          },
          error: (error) => {
            patchState(store, { error: error.message });
          },
        })
      );
    },
  })),

  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.currentUser()),
  }))
);
