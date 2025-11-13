import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeMode } from '../../../store/theme/theme.store';

const DEFAULT_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWcP321vOGDafKGx0-Huw1tA4gzsv3oVnXCJ0gC7cAMcL-qNj5-5hY_NPCngH-yRLa8g_02MxZVm-9U-01ucBxq4gmFA0Bl-NWB4CWcv2BNLxQmPAZ-xHZJQmyzUJfaJ-j6FtQo8HRoCaBa3DVouThIrjWKnkFGttIDZe23F_OCYqLm6Ni1chKu08u_WbAPuwOv8XJf7JtxiFPSjn31bfFnBBbQzH8GJFLo9mc7-GnWfNWdKQjNBd3ALdTiwRhy9cejHTkyr4dAqU';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent {
  @Input() theme: ThemeMode = 'dark';
  @Input() avatarUrl: string = DEFAULT_AVATAR_URL;
  @Input() searchQuery = '';

  @Output() themeToggle = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  get themeToggleLabel(): string {
    return this.theme === 'dark'
      ? 'Switch to light theme'
      : 'Switch to dark theme';
  }
}
