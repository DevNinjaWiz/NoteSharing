import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthStore } from '../../store/auth.store';
import { AuthCredentials } from '../../models/auth.model';
import { Router } from '@angular/router'; // Import Router
import { take, tap } from 'rxjs';
import { NotesStore } from '../../store/notes/note.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  readonly store = inject(AuthStore);
  private readonly notesStore = inject(NotesStore);
  private router = inject(Router); // Inject Router

  $errorMessage = computed(() => this.store.error());

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    // this.notesStore.loadNotes();

    const credentials = this.loginForm.getRawValue() as AuthCredentials;

    this.store
      .login(credentials)
      .pipe(
        tap(() => {
          console.log('Login successful');
          this.notesStore.loadNotes();
          this.router.navigate(['/']);
        }),
        take(1)
      )
      .subscribe({
        error: (error) => console.error('Login failed', error),
      });
  }
}
