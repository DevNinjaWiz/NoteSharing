import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { AuthStore } from './store/auth.store'; // Import AuthStore
import { NotesStore } from './store/notes/note.store'; // Import NotesStore

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    AuthStore, // Provide the AuthStore
    NotesStore, // Provide the NotesStore
  ],
};
