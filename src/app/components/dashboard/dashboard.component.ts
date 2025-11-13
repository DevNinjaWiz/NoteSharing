import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  Friend,
  FriendStore,
  Note,
  NotesStore,
  ThemeStore,
} from '../../store';

type IconName =
  | 'description'
  | 'star'
  | 'history'
  | 'delete'
  | 'book'
  | 'logout'
  | 'expand_more'
  | 'expand_less'
  | 'person'
  | 'person_add';

interface NavItem {
  readonly label: string;
  readonly icon: IconName;
  readonly isPrimary?: boolean;
}

type ViewMode = 'grid' | 'list';

interface SidebarEntity {
  readonly name: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly notesStore = inject(NotesStore);
  private readonly friendStore = inject(FriendStore);
  private readonly themeStore = inject(ThemeStore);
  readonly theme = this.themeStore.theme;

  readonly sideNavLinks: readonly NavItem[] = [
    { label: 'All Notes', icon: 'description', isPrimary: true },
    { label: 'Favorites', icon: 'star' },
    { label: 'Recents', icon: 'history' },
    { label: 'Trash', icon: 'delete' },
  ];

  readonly notebooks: readonly SidebarEntity[] = [
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
  ];

  readonly notebooksExpanded = signal(false);
  readonly friendsExpanded = signal(false);
  readonly viewMode = signal<ViewMode>('grid');
  readonly friends = this.friendStore.friends;
  readonly friendsLoading = this.friendStore.isLoading;
  readonly friendsError = this.friendStore.error;

  readonly notes = this.notesStore.notes;
  readonly isLoading = this.notesStore.isLoading;
  readonly error = this.notesStore.error;
  readonly totalNotes = computed(() => this.notes().length);

  ngOnInit(): void {
    this.notesStore.loadNotes();
    this.friendStore.loadFriends();
  }

  trackNote(_: number, note: Note): string {
    return note.id;
  }

  notePreview(note: Note): string {
    const content = note?.content ?? '';
    const normalized = content.replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return 'No content yet.';
    }

    return normalized.length > 130
      ? `${normalized.slice(0, 127)}...`
      : normalized;
  }

  backgroundForNote(note: Note, index: number): string {
    const image = note.photoUrl;
    return `url('${image}')`;
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

  trackFriend(_: number, friend: Friend): string {
    return friend.id;
  }
}
