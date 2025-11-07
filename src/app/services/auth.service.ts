import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model'; // Import User
import { AuthCredentials } from '../models/auth.model'; // Import AuthCredentials
import { HttpClient } from '@angular/common/http';

// WARNING: This is an insecure authentication implementation for POC purposes only.
// It uses in-memory storage and does not persist data.
// Do NOT use this in a production environment.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend API URL

  constructor(private http: HttpClient) { }

  register(credentials: AuthCredentials): Observable<User> { // Use AuthCredentials and User
    return this.http.post<User>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: AuthCredentials): Observable<User> { // Use AuthCredentials and User
    return this.http.post<User>(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/logout`, {});
  }
}