import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DashboardHeaderComponent,
  DashboardMenuComponent,
  NoteCardComponent,
  UiSelectComponent,
  UiSelectOption,
} from '../../shared/components';
import {
  FriendStore,
  Note,
  NotebookStore,
  NotesStore,
  ThemeStore,
} from '../../store';
import {
  NavItem,
  NavKey,
  SortMode,
  ViewMode,
} from './dashboard.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    UiSelectComponent,
    DashboardMenuComponent,
    DashboardHeaderComponent,
    NoteCardComponent,
  ],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly notesStore = inject(NotesStore);
  private readonly friendStore = inject(FriendStore);
  private readonly notebookStore = inject(NotebookStore);
  private readonly themeStore = inject(ThemeStore);
  readonly theme = this.themeStore.theme;

  readonly sideNavLinks: readonly NavItem[] = [
    { key: 'all', label: 'All Notes', icon: 'description', isPrimary: true },
    { key: 'favorites', label: 'Favorites', icon: 'star' },
    { key: 'recents', label: 'Recents', icon: 'history' },
    { key: 'trash', label: 'Trash', icon: 'delete' },
  ];

  readonly notebooksExpanded = signal(false);
  readonly friendsExpanded = signal(false);
  readonly viewMode = signal<ViewMode>('grid');
  readonly sortMode = signal<SortMode>('date');
  readonly searchQuery = signal('');
  readonly sortOptions: readonly UiSelectOption<SortMode>[] = [
    { label: 'Date', value: 'date' },
    { label: 'Creator', value: 'creator' },
    { label: 'Favorite', value: 'favorite' },
  ];
  readonly selectedNav = signal<NavKey>('all');
  readonly friends = this.friendStore.friends;
  readonly friendsLoading = this.friendStore.isLoading;
  readonly friendsError = this.friendStore.error;
  readonly notebooks = this.notebookStore.notebooks;
  readonly notebooksLoading = this.notebookStore.isLoading;
  readonly notebooksError = this.notebookStore.error;

  readonly notes = this.notesStore.notes;
  readonly selectedNotebookId = this.notesStore.selectedNotebookIdSignal;
  readonly activeNotes = this.notesStore.activeNotes;
  readonly trashedNotes = this.notesStore.trashedNotes;
  readonly isLoading = this.notesStore.isLoading;
  readonly error = this.notesStore.error;
  readonly isTrashView = computed(() => this.selectedNav() === 'trash');
  readonly isFavoritesView = computed(() => this.selectedNav() === 'favorites');
  readonly totalNotes = computed(() => this.activeNotes().length);
  readonly filteredNotes = computed(() => {
    const nav = this.selectedNav();
    const mode = this.sortMode();
    const source = nav === 'trash' ? this.trashedNotes() : this.activeNotes();
    let notes = [...source];

    if (nav === 'favorites') {
      notes = notes.filter((note) => !!note.isFavorite);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      notes = notes.filter((note) => {
        const title = (note.title ?? '').toLowerCase();
        const content = (note.content ?? '').toLowerCase();
        return title.includes(query) || content.includes(query);
      });
    }

    const notesWithIndex = notes.map((note, index) => ({ note, index }));

    if (mode === 'favorite') {
      return notesWithIndex
        .sort((a, b) => {
          const diff = Number(b.note.isFavorite) - Number(a.note.isFavorite);
          if (diff !== 0) {
            return diff;
          }
          return a.index - b.index;
        })
        .map(({ note }) => note);
    }

    if (mode === 'creator') {
      return notesWithIndex
        .sort((a, b) => {
          const userDiff = (a.note.userId ?? '').localeCompare(b.note.userId ?? '');
          if (userDiff !== 0) {
            return userDiff;
          }
          return a.index - b.index;
        })
        .map(({ note }) => note);
    }

    return notesWithIndex
      .sort((a, b) => {
        const aDate = new Date(a.note.updatedAt ?? a.note.createdAt ?? 0).getTime();
        const bDate = new Date(b.note.updatedAt ?? b.note.createdAt ?? 0).getTime();
        const diff = bDate - aDate;
        if (diff !== 0) {
          return diff;
        }
        return a.index - b.index;
      })
      .map(({ note }) => note);
  });
  readonly currentViewTitle = computed(
    () =>
      this.sideNavLinks.find((link) => link.key === this.selectedNav())?.label ??
      'All Notes'
  );
  readonly currentCount = computed(() => this.filteredNotes().length);

  ngOnInit(): void {
    this.notesStore.loadNotes();
    this.friendStore.loadFriends();
    this.notebookStore.loadNotebooks();
  }

  formatUpdatedAt(note: Note): string {
    const rawDate = note.updatedAt ?? note.createdAt;

    if (!rawDate) {
      return 'just now';
    }

    const parsed = rawDate instanceof Date ? rawDate : new Date(rawDate);
    const now = Date.now();
    const diffMs = now - parsed.getTime();

    if (diffMs < 60_000) {
      return 'just now';
    }

    const minutes = Math.round(diffMs / 60_000);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.round(hours / 24);
    if (days < 30) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year:
        parsed.getFullYear() !== new Date().getFullYear()
          ? 'numeric'
          : undefined,
    });
  }

  formatDeletedAt(note: Note): string {
    const rawDate = note.deletedAt ?? note.updatedAt ?? note.createdAt;

    if (!rawDate) {
      return 'just now';
    }

    const parsed = rawDate instanceof Date ? rawDate : new Date(rawDate);

    return parsed.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeStore.toggleTheme();
  }

  toggleNotebooks(): void {
    this.notebooksExpanded.update((expanded) => !expanded);
  }

  toggleFriends(): void {
    this.friendsExpanded.update((expanded) => !expanded);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  setSortMode(mode: SortMode): void {
    this.sortMode.set(mode);
  }

  selectNav(key: NavKey): void {
    this.selectedNav.set(key);
  }

  selectNotebook(notebookId: string | null): void {
    this.notesStore.filterByNotebook(notebookId);
  }

  isNotebookSelected(notebookId: string | null): boolean {
    return (this.selectedNotebookId() ?? null) === (notebookId ?? null);
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  toggleFavorite(note: Note): void {
    this.notesStore.toggleFavorite(note.id, !note.isFavorite);
  }

  deleteNote(note: Note): void {
    this.notesStore.deleteNote(note.id);
  }

  restoreNote(note: Note): void {
    this.notesStore.restoreNote(note.id);
  }

  deleteNoteForever(note: Note): void {
    this.notesStore.deleteNoteForever(note.id);
  }

  notebookPath(note: Note): string {
    const notebook =
      this.notebooks().find((item) => item.id === note.notebookId) ?? null;
    const notebookName = notebook?.name ?? 'Unfiled';
    const noteTitle = note.title?.trim() || 'Untitled note';
    return `${notebookName} > ${noteTitle}`;
  }
}
