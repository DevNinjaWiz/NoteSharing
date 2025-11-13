import { Component, computed, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthStore } from '../../store';
import { AuthCredentials } from '../../models/auth.model';
import { Router } from '@angular/router'; // Import Router
import { UiInputComponent } from '../../shared/components/input/ui-input.component';
import { UiButtonComponent } from '../../shared/components/button/ui-button.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent, UiButtonComponent],
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

    effect(() => {
      if (this.store.isLoggedIn()) {
        this.router.navigate(['/']);
      }
    });
  }

  login() {
    const credentials = this.loginForm.getRawValue() as AuthCredentials;
    this.store.login(credentials);
  }

  get emailStatus(): 'error' | null {
    const control = this.loginForm.get('email');
    return control && control.invalid && (control.dirty || control.touched)
      ? 'error'
      : null;
  }

  get emailHelperText(): string | undefined {
    const control = this.loginForm.get('email');

    if (!control || !(control.dirty || control.touched)) {
      return undefined;
    }

    if (control.hasError('required')) {
      return 'Email is required.';
    }

    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }

    return undefined;
  }

  get passwordStatus(): 'error' | null {
    const control = this.loginForm.get('password');
    return control && control.invalid && (control.dirty || control.touched)
      ? 'error'
      : null;
  }

  get passwordHelperText(): string | undefined {
    const control = this.loginForm.get('password');

    if (!control || !(control.dirty || control.touched)) {
      return undefined;
    }

    if (control.hasError('required')) {
      return 'Password is required.';
    }

    return undefined;
  }
}
