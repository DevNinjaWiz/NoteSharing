import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Friend } from '../../../store/friends/friend.model';
import { Notebook } from '../../../store/notebooks/notebook.model';
import { NavItem, NavKey } from '../../../components/dashboard/dashboard.models';

@Component({
  selector: 'app-dashboard-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
})
export class DashboardMenuComponent {
  readonly isCreatingNotebook = signal(false);
  readonly notebookDraft = signal('');

  @Input({ required: true }) sideNavLinks: ReadonlyArray<NavItem> = [];
  @Input({ required: true }) selectedNav!: NavKey;
  @Input() notebooks: ReadonlyArray<Notebook> = [];
  @Input() notebooksExpanded = false;
  @Input() notebooksLoading = false;
  @Input() notebooksError: string | null = null;
  @Input() selectedNotebookId: string | null = null;
  @Input() friends: ReadonlyArray<Friend> = [];
  @Input() friendsExpanded = false;
  @Input() friendsLoading = false;
  @Input() friendsError: string | null = null;

  @Output() navSelected = new EventEmitter<NavKey>();
  @Output() notebooksToggle = new EventEmitter<void>();
  @Output() notebookSelected = new EventEmitter<string | null>();
  @Output() friendsToggle = new EventEmitter<void>();
  @Output() notebookCreate = new EventEmitter<string>();
  @Output() notebookDelete = new EventEmitter<string>();

  toggleNotebookForm(): void {
    if (this.isCreatingNotebook()) {
      this.resetNotebookForm();
      return;
    }

    this.isCreatingNotebook.set(true);
  }

  setNotebookDraft(value: string): void {
    this.notebookDraft.set(value);
  }

  submitNotebook(): void {
    const trimmed = this.notebookDraft().trim();
    if (trimmed) {
      this.notebookCreate.emit(trimmed);
    }
    this.resetNotebookForm();
  }

  cancelNotebook(): void {
    this.resetNotebookForm();
  }

  requestDelete(event: MouseEvent, id: string | null, name?: string): void {
    event.stopPropagation();

    if (!id) {
      return;
    }

    if (
      !confirm(
        `Delete notebook "${name ?? 'Notebook'}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    this.notebookDelete.emit(id);
  }

  private resetNotebookForm(): void {
    this.isCreatingNotebook.set(false);
    this.notebookDraft.set('');
  }
}
