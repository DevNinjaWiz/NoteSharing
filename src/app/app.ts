import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ThemeStore } from './store';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'my-angular-app';
  private readonly themeStore = inject(ThemeStore);
  private readonly documentRef = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const mode = this.themeStore.theme();
      const nextClass = mode === 'light' ? 'theme-light' : 'theme-dark';
      const targets = [
        this.documentRef?.documentElement,
        this.documentRef?.body,
      ].filter((target): target is HTMLElement => !!target);

      targets.forEach((target) => {
        target.classList.remove('theme-light', 'theme-dark');
        target.classList.add(nextClass);
      });
    });
  }
}
