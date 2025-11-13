import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthStore } from '../../store';
import { AuthCredentials } from '../../models/auth.model';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  readonly store = inject(AuthStore);
  private router = inject(Router); // Inject Router

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    effect(() => {
      if (this.store.isLoggedIn()) {
        this.router.navigate(['/']);
      }
    });
  }

  register() {
    if (this.registerForm.valid) {
      const credentials: AuthCredentials = this.registerForm.value;
      this.store.register(credentials);
    }
  }
}
