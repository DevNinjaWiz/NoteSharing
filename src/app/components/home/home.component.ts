import { Component, inject } from '@angular/core';
import { AuthStore } from '../../store/auth.store';
import { Router } from '@angular/router'; // Import Router
import { NotesStore } from 'src/app/store/notes/note.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent {
  readonly store = inject(AuthStore);
  private router = inject(Router); // Inject Router
  private readonly notesStore = inject(NotesStore);

  constructor() {}

  test(){
    this.notesStore.loadNotes()
  }

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
