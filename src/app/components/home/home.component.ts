import { Component, inject } from '@angular/core';
import { AuthStore } from '../../store/auth.store';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent {
  readonly store = inject(AuthStore);
  private router = inject(Router); // Inject Router

  constructor() {}

  logout() {
    this.store.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // Navigate on success
      },
      error: (err) => {
        console.error(err); // Handle error
      },
    });
  }
}
