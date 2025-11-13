import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Friend } from '../store';

@Injectable({ providedIn: 'root' })
export class FriendService {
  private readonly apiUrl = 'http://localhost:3000/api/friends';

  constructor(private readonly http: HttpClient) {}

  getFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(this.apiUrl);
  }
}
