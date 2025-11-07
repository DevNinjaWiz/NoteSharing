import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthCredentials } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your backend API URL

  constructor(private http: HttpClient) {}

  register(credentials: AuthCredentials) {
    return this.http.post<User>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: AuthCredentials) {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials);
  }

  logout() {
    return this.http.post<boolean>(`${this.apiUrl}/logout`, {});
  }
}
