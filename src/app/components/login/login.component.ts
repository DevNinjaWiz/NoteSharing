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
import { catchError, tap } from 'rxjs';

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
  private router = inject(Router); // Inject Router

  $errorMessage = computed(() => this.store.error());

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const credentials: AuthCredentials = this.loginForm.value;
      this.store
        .login(credentials)
        .pipe(
          tap(() => {
            this.router.navigate(['/']);
          }),
          catchError((error) => {
            throw 'error in source. Details: ' + error;
          })
        )
        .subscribe({
          // // Subscribe to the Observable
          // next: () => {
          //   this.router.navigate(['/']); // Navigate on success
          // },
          // error: (err) => {
          //   console.error(err); // Handle error
          // },
        });
    }
  }
}
