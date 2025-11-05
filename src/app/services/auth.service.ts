import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model'; // Import User
import { AuthCredentials } from '../models/auth.model'; // Import AuthCredentials

// WARNING: This is an insecure authentication implementation for POC purposes only.
// It uses in-memory storage and does not persist data.
// Do NOT use this in a production environment.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In-memory "database" for POC - this would be an actual API call in a real app
  private users: { email: string; password: string }[] = [];

  constructor() { }

  register(credentials: AuthCredentials): Observable<User> { // Use AuthCredentials and User
    // Simulate API call delay
    return of(null).pipe(
      delay(500),
      // Simulate user registration
      () => {
        if (this.users.some(user => user.email === credentials.email)) {
          return throwError(() => new Error('Registration failed: User already exists'));
        }
        if (!credentials.password) {
          return throwError(() => new Error('Password is required for registration'));
        }
        this.users.push({ email: credentials.email, password: credentials.password });
        // In a real app, you would return a user object
        return of({ email: credentials.email });
      }
    );
  }

  login(credentials: AuthCredentials): Observable<User> { // Use AuthCredentials and User
    // Simulate API call delay
    return of(null).pipe(
      delay(500),
      // Simulate user login
      () => {
        const foundUser = this.users.find(user => user.email === credentials.email && user.password === credentials.password);
        if (!foundUser) {
          return throwError(() => new Error('Login failed: Invalid login credentials'));
        }
        const user: User = { email: foundUser.email }; // Simulate a user object
        return of(user);
      }
    );
  }

  // Logout is conceptually handled by the store now,
  // this service just provides the mock "API"
  logout(): Observable<boolean> {
    return of(true).pipe(delay(200)); // Simulate API call delay for logout
  }
}