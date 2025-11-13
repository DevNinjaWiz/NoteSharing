import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withLogger } from '../../shared/utils';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: 'dark',
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLogger('ThemeStore'),
  withComputed((store) => ({
    theme: computed(() => store.mode()),
    isLight: computed(() => store.mode() === 'light'),
    isDark: computed(() => store.mode() === 'dark'),
  })),
  withMethods((store) => ({
    setTheme(mode: ThemeMode) {
      patchState(store, { mode });
    },
    toggleTheme() {
      patchState(store, {
        mode: store.mode() === 'dark' ? 'light' : 'dark',
      });
    },
  }))
);
