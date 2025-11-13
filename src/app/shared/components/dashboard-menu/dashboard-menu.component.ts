import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
}
