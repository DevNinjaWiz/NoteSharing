import {
  Component,
  HostBinding,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Note, NotesStore } from '../../store';

type IconName =
  | 'description'
  | 'star'
  | 'history'
  | 'delete'
  | 'book';

interface NavItem {
  readonly label: string;
  readonly icon: IconName;
  readonly isPrimary?: boolean;
}

interface NotebookLink {
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
  readonly theme = signal<'dark' | 'light'>('dark');

  readonly sideNavLinks: readonly NavItem[] = [
    { label: 'All Notes', icon: 'description', isPrimary: true },
    { label: 'Favorites', icon: 'star' },
    { label: 'Recents', icon: 'history' },
    { label: 'Trash', icon: 'delete' },
  ];

  readonly notebooks: readonly NotebookLink[] = [
    { name: 'Project Phoenix', icon: 'book' },
    { name: 'Marketing Q3', icon: 'book' },
    { name: 'Personal', icon: 'book' },
  ];

  readonly notes = this.notesStore.notes;
  readonly isLoading = this.notesStore.isLoading;
  readonly error = this.notesStore.error;
  readonly totalNotes = computed(() => this.notes().length);

  private readonly noteBackdrops = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuACZYP0EPvtYYLazKpcwkQTq-5GCGOS_1oK2zG5vA8RXTt3gaXZIu_F-7Gyv0zPsK9Ct2sl74KLqY7KsXxYJpy7iK0hVRAriL7K-rLFFQwvKqtNqChlZWcMZxHeKhy-HvXcCJNzMLHJfhoyjh2M2JqIvSWUkLIx_AP48ptnPBI3U7cIdbEv5QIjEKN3kXYm85M5TcSBqhvTPKDe-ab2psOmXRYINATNe0JtZclZv3WmiuhW063hxuhwABWFmax03Hx_PesEcZU8kdo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDuvhziX5fMn8Nfb6ZPRJSd1Q2Bncxl0Y6GduSaiqx-sGEmqT9gsutnPfAACQfVP-3jeb9X74maXGDLdbUvMeTwSHtU0oBKuiZFJLi07ErEblBgXL7elwCyF7vlb9w6kVX4mkrFpWX6r-H_1vfMZiEM0cHMM-hAT44m_hqMiI_Pe-bk6PzUvpzuIn-UJ23-DTwQPIhrH7k_cgPNjj3ve4rF_eKc6kLK3zbMlIrrZMdpoKrqF7EMfKv8MXwtnUSQk_TiUXwIAaD5tng',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBu7NQ7ox0sHaM9mK1B2pH73j8cif74jx9krfOPzcICgJnm-5VEBt79duTi66jKygqG64iHPhBPOefzRQGy7SbPup8op9-9TGKdwNjNykBO9GSict9GkMFi0hnQ_H822amvB71PnYVBGTWgBgHPASt3cctc52CYGF0RdZKCS1eFfupGEV3dWOqqg2IKiRlxD070GkiDnjD5WMRK7Jy4IbUrkY79kKdp3dzTS17cnzf8RmEqSFFEcwoRLpiDyo4KibRtXpPx5Xgxonw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSc9O8hXvZdi_RaTJmR7Dvrvq2YHY6N_ph3tWtkStW219g6ebGL4BB7yjEVAksK16rEgTYBA0tcl5BkhMnXXmgh-1ELUHzPhwmMrmfV8aCh5eyTHQVQ1JNRBSZn8bvgxrFb8X6hUkCsRQAjNjS9uZdUeFvzLsE48KWKTwiTOJOBAmKVuCv7pmdr2_weAUfa3XdWzUjknxgaIQ9opdgRMryglWGdW48pBMMpjO0nJSEUR18sT3QQ8c47Eo5zfRluCuNnWyzFtyZJgY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA3BUQwLRFJo_0zu-eQMOHjQ6m5Kv_e1qTUHjrNE3oFpJPP7bkGKY3f_W4Cni8dMM94nUbwDV-JJ14-uL5aGjMmtyWKbIQmKpwWyYGxmPe8f0-JnQwTpPqqAMJ6NktRw6NSIcrgj46FcgjR5Hjt7ziP1OjJzz9n_uXR1Vvw07Rjo7wWQvXt8yU-8ies4f6t2CzTkTrvnH_QeVJ1ExODHL1eydEizO0yI2hv91lHRyFRAg8VjXH91vUReDfxQ2NV-d9T9oZYTDID-XI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAE0YrfE7DudS2E0Owi_5wtZJpuvC-2SR7RbFsXiLpl6ljy2hmCD5eKBOBcp3JEFKsfRcBv0CI3BFRyequk_u2vmpwkaI-APm8MIA2l-BKeoYa-hEah2tV2YdZaGm6sXU9tEOYQyRpp4Cqdw8i5XCCnQPoRxB6iFiDOsO_Xw5ThGWp0IJqoqqVOzURF94G1jRkUcYiKjbPp08hxQCYW13o1QgueuK8bhuTxyIK5JiIWQNUETDcICd7-SvPykM5SUJnUg-2MK78gXqI',
  ];

  ngOnInit(): void {
    this.notesStore.loadNotes();
  }

  @HostBinding('class.theme-light')
  protected get isLightTheme(): boolean {
    return this.theme() === 'light';
  }

  @HostBinding('class.theme-dark')
  protected get isDarkTheme(): boolean {
    return this.theme() === 'dark';
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

  backgroundForNote(index: number): string {
    const image =
      this.noteBackdrops[index % this.noteBackdrops.length];
    return `url('${image}')`;
  }

  formatUpdatedAt(note: Note): string {
    const rawDate = note.updatedAt ?? note.createdAt;

    if (!rawDate) {
      return 'just now';
    }

    const parsed =
      rawDate instanceof Date ? rawDate : new Date(rawDate);
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
      year: parsed.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  }

  createNewNote(): void {
    this.router.navigate(['/']);
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
